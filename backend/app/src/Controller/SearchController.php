<?php

namespace App\Controller;

use App\Algorithm\InputValidator;
use App\Algorithm\OperationCounter;
use App\Algorithm\Search\SearchAlgorithmInterface;
use App\Algorithm\Search\SearchRegistry;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Toate rutele din acest controller incep cu /api/algorithms/search
#[Route('/api/algorithms/search')]
#[OA\Tag(name: 'Algoritmi - cautare')]
class SearchController extends AbstractController
{
    private const MAX_VALUES = 100000;
    private const MAX_STEPS_SIZE = 60;

    public function __construct(private readonly SearchRegistry $registry)
    {
    }

    // GET /api/algorithms/search/methods -> metodele de cautare disponibile
    #[Route('/methods', name: 'search_methods', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Lista metodelor de cautare')]
    public function methods(): JsonResponse
    {
        return $this->json(array_values(array_map(
            fn (SearchAlgorithmInterface $algorithm) => $algorithm->info()->toArray() + ['requiresSorted' => $algorithm->requiresSorted()],
            $this->registry->all(),
        )));
    }

    // POST /api/algorithms/search -> cauta o valoare intr-un vector
    #[Route('', name: 'search_run', methods: ['POST'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['method', 'values', 'target'],
            properties: [
                new OA\Property(property: 'method', type: 'string', example: 'binary'),
                new OA\Property(property: 'values', type: 'array', items: new OA\Items(type: 'number'), example: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]),
                new OA\Property(property: 'target', type: 'number', example: 23),
                new OA\Property(property: 'steps', type: 'boolean', example: true),
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Pozitia gasita (sau null), numarul de comparatii si pasii')]
    #[OA\Response(response: 400, description: 'Date invalide')]
    public function run(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $algorithm = $this->registry->get((string) ($data['method'] ?? ''));
        if ($algorithm === null) {
            return $this->json(['error' => 'Metoda de cautare nu exista. Vedeti GET /api/algorithms/search/methods.'], Response::HTTP_BAD_REQUEST);
        }

        $target = $data['target'] ?? null;
        if (!\is_int($target) && !\is_float($target)) {
            return $this->json(['error' => 'Campul "target" (valoarea cautata) trebuie sa fie un numar.'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $values = InputValidator::numbers($data['values'] ?? null, self::MAX_VALUES);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        if ($algorithm->requiresSorted() && !self::isSorted($values)) {
            return $this->json(['error' => $algorithm->info()->name.' functioneaza doar pe un vector sortat crescator.'], Response::HTTP_BAD_REQUEST);
        }

        $withSteps = ($data['steps'] ?? false) === true && \count($values) <= self::MAX_STEPS_SIZE;
        $counter = new OperationCounter($withSteps);

        $start = hrtime(true);
        $index = $algorithm->search($values, $target, $counter);
        $timeMs = (hrtime(true) - $start) / 1e6;

        return $this->json([
            'method' => $algorithm->info()->toArray(),
            'n' => \count($values),
            'target' => $target,
            'index' => $index,
            'found' => $index !== null,
            // verificare: pozitia intoarsa contine intr-adevar valoarea cautata?
            'correct' => $index === null ? !\in_array($target, $values) : $values[$index] == $target,
            'counters' => $counter->toArray(),
            'timeMs' => round($timeMs, 4),
            'steps' => $counter->steps(),
            'stepsTruncated' => $counter->stepsTruncated(),
        ]);
    }

    private static function isSorted(array $values): bool
    {
        for ($i = 1, $n = \count($values); $i < $n; ++$i) {
            if ($values[$i - 1] > $values[$i]) {
                return false;
            }
        }

        return true;
    }
}
