<?php

namespace App\Controller;

use App\Algorithm\DataGenerator;
use App\Algorithm\InputValidator;
use App\Algorithm\OperationCounter;
use App\Algorithm\Sort\SortAlgorithmInterface;
use App\Algorithm\Sort\SortRegistry;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Toate rutele din acest controller incep cu /api/algorithms/sort
#[Route('/api/algorithms/sort')]
#[OA\Tag(name: 'Algoritmi - sortare')]
class SortController extends AbstractController
{
    private const MAX_VALUES = 10000;     // cel mult atatea elemente la o sortare
    private const MAX_STEPS_SIZE = 40;    // pasii (animatia) se retin doar pentru vectori mici
    private const MAX_BENCHMARK_SIZE = 20000;
    private const TIME_BUDGET_MS = 4000;  // daca o rulare depaseste 4 s, nu mai incercam dimensiuni mai mari

    public function __construct(private readonly SortRegistry $registry)
    {
    }

    // GET /api/algorithms/sort/methods -> metodele de sortare disponibile si complexitatile lor
    #[Route('/methods', name: 'sort_methods', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Lista metodelor de sortare')]
    public function methods(): JsonResponse
    {
        return $this->json(array_values(array_map(
            fn (SortAlgorithmInterface $algorithm) => $algorithm->info()->toArray(),
            $this->registry->all(),
        )));
    }

    // POST /api/algorithms/sort -> sorteaza un vector cu metoda aleasa
    #[Route('', name: 'sort_run', methods: ['POST'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['method', 'values'],
            properties: [
                new OA\Property(property: 'method', type: 'string', example: 'bubble'),
                new OA\Property(property: 'values', type: 'array', items: new OA\Items(type: 'number'), example: [5, 1, 4, 2, 8]),
                new OA\Property(property: 'steps', type: 'boolean', example: true),
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Vectorul sortat, numarul de operatii, timpul si pasii')]
    #[OA\Response(response: 400, description: 'Date invalide')]
    public function run(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $algorithm = $this->registry->get((string) ($data['method'] ?? ''));
        if ($algorithm === null) {
            return $this->json(['error' => 'Metoda de sortare nu exista. Vedeti GET /api/algorithms/sort/methods.'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $values = InputValidator::numbers($data['values'] ?? null, self::MAX_VALUES);

            $withSteps = ($data['steps'] ?? false) === true && \count($values) <= self::MAX_STEPS_SIZE;
            $counter = new OperationCounter($withSteps);

            $start = hrtime(true);
            $sorted = $algorithm->sort($values, $counter);
            $timeMs = (hrtime(true) - $start) / 1e6;
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        // Verificam rezultatul cu functia sort() din PHP: un algoritm gresit se vede imediat
        $expected = $values;
        sort($expected);

        return $this->json([
            'method' => $algorithm->info()->toArray(),
            'n' => \count($values),
            'input' => $values,
            'output' => $sorted,
            'correct' => $sorted == $expected,
            'counters' => $counter->toArray(),
            'timeMs' => round($timeMs, 3),
            'steps' => $counter->steps(),
            'stepsTruncated' => $counter->stepsTruncated(),
        ]);
    }

    // POST /api/algorithms/sort/benchmark -> masoara metodele alese pe vectori din ce in ce mai mari
    #[Route('/benchmark', name: 'sort_benchmark', methods: ['POST'])]
    #[OA\RequestBody(
        required: false,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'methods', type: 'array', items: new OA\Items(type: 'string'), example: ['bubble', 'merge']),
                new OA\Property(property: 'sizes', type: 'array', items: new OA\Items(type: 'integer'), example: [250, 500, 1000, 2000, 4000]),
                new OA\Property(property: 'order', type: 'string', enum: DataGenerator::ORDERS, example: 'random'),
                new OA\Property(property: 'repeat', type: 'integer', example: 3),
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Pentru fiecare metoda si fiecare n: comparatii, atribuiri, timp')]
    #[OA\Response(response: 400, description: 'Date invalide')]
    public function benchmark(Request $request, DataGenerator $generator): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $keys = $data['methods'] ?? array_keys($this->registry->all());
        $sizes = $data['sizes'] ?? [250, 500, 1000, 2000, 4000];
        $order = $data['order'] ?? 'random';
        $repeat = (int) ($data['repeat'] ?? 3);

        if (!\is_array($keys) || $keys === []) {
            return $this->json(['error' => 'Alegeti cel putin o metoda.'], Response::HTTP_BAD_REQUEST);
        }
        if (!\is_array($sizes) || $sizes === [] || \count($sizes) > 10) {
            return $this->json(['error' => 'Campul "sizes" trebuie sa contina intre 1 si 10 dimensiuni.'], Response::HTTP_BAD_REQUEST);
        }
        foreach ($sizes as $n) {
            if (!\is_int($n) || $n < 1 || $n > self::MAX_BENCHMARK_SIZE) {
                return $this->json(['error' => 'Fiecare dimensiune trebuie sa fie un intreg intre 1 si '.self::MAX_BENCHMARK_SIZE.'.'], Response::HTTP_BAD_REQUEST);
            }
        }
        if (!\in_array($order, DataGenerator::ORDERS, true)) {
            return $this->json(['error' => 'Ordinea datelor trebuie sa fie una dintre: '.implode(', ', DataGenerator::ORDERS).'.'], Response::HTTP_BAD_REQUEST);
        }
        $repeat = max(1, min(5, $repeat));
        sort($sizes);
        set_time_limit(180);

        $results = [];
        foreach ($keys as $key) {
            $algorithm = $this->registry->get((string) $key);
            if ($algorithm === null) {
                return $this->json(['error' => "Metoda \"$key\" nu exista."], Response::HTTP_BAD_REQUEST);
            }

            $points = [];
            $tooSlow = false;
            foreach ($sizes as $n) {
                if ($tooSlow) {
                    $points[] = ['n' => $n, 'skipped' => true];
                    continue;
                }

                // acelasi vector (aceeasi samanta) pentru toate metodele
                $values = $generator->generate($n, $order);

                try {
                    $times = [];
                    $counter = null;
                    for ($r = 0; $r < $repeat; ++$r) {
                        $counter = new OperationCounter();
                        $start = hrtime(true);
                        $algorithm->sort($values, $counter);
                        $times[] = (hrtime(true) - $start) / 1e6;
                    }
                } catch (\InvalidArgumentException $e) {
                    return $this->json(['error' => $algorithm->info()->name.': '.$e->getMessage()], Response::HTTP_BAD_REQUEST);
                }

                sort($times);
                $median = $times[intdiv(\count($times), 2)]; // mediana: nu e influentata de o rulare "ghinionista"

                $points[] = ['n' => $n, 'skipped' => false, 'timeMs' => round($median, 3)] + $counter->toArray();
                $tooSlow = $median > self::TIME_BUDGET_MS;
            }

            $results[] = [
                'method' => $algorithm->info()->key,
                'name' => $algorithm->info()->name,
                'complexity' => $algorithm->info()->toArray()['complexity'],
                'points' => $points,
            ];
        }

        return $this->json([
            'order' => $order,
            'sizes' => $sizes,
            'repeat' => $repeat,
            'results' => $results,
        ]);
    }
}
