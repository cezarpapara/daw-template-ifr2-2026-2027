<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HelloController extends AbstractController
{
    // GET /api/hello/Ana -> {"message": "Salut, Ana!"}
    // Exercitiul 2: requirements accepta doar litere in {name}; /api/hello/123 nu se potriveste -> 404
    #[Route('/api/hello/{name}', name: 'api_hello', methods: ['GET'], requirements: ['name' => '[A-Za-z]+'])]
    public function hello(string $name): JsonResponse
    {
        return $this->json(['message' => "Salut, $name!"]);
    }

    // GET /api/time -> data, ora si fusul orar al serverului
    #[Route('/api/time', name: 'api_time', methods: ['GET'])]
    public function time(): JsonResponse
    {
        $now = new \DateTimeImmutable();

        return $this->json([
            'date' => $now->format('Y-m-d'),
            'time' => $now->format('H:i:s'),
            'timezone' => $now->getTimezone()->getName(),
        ]);
    }

    // GET /api/numbers?n=10 -> numerele pare de la 1 la n, suma si patratele lor
    #[Route('/api/numbers', name: 'api_numbers', methods: ['GET'])]
    public function numbers(Request $request): JsonResponse
    {
        // ?n=5 ; daca lipseste, folosim 5
        $n = filter_var($request->query->get('n', 5), FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => 100],
        ]);

        if ($n === false) {
            return $this->json(
                ['error' => 'n trebuie să fie un număr întreg între 1 și 100.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Exercitiul 3: doar numerele pare.
        // array_filter pastreaza cheile vechi (1, 3, 5...), array_values le renumeroteaza 0, 1, 2...
        $numbers = array_values(array_filter(range(1, $n), fn (int $x) => $x % 2 === 0));

        return $this->json([
            'n' => $n,
            'numbers' => $numbers,
            'sum' => array_sum($numbers),
            'squares' => array_map(fn (int $x) => $x * $x, $numbers),
        ]);
    }

    // Exercitiul 1: GET /api/sum?a=3&b=4 -> {"a": 3, "b": 4, "sum": 7}
    #[Route('/api/sum', name: 'api_sum', methods: ['GET'])]
    public function sum(Request $request): JsonResponse
    {
        // Daca a sau b lipseste, get() intoarce null, iar filter_var(null, ...) intoarce false
        $a = filter_var($request->query->get('a'), FILTER_VALIDATE_INT);
        $b = filter_var($request->query->get('b'), FILTER_VALIDATE_INT);

        if ($a === false || $b === false) {
            return $this->json(
                ['error' => 'a și b sunt obligatorii și trebuie să fie numere întregi.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $this->json(['a' => $a, 'b' => $b, 'sum' => $a + $b]);
    }

    // Exercitiul 4 (optional): GET /api/factorial/5 -> {"n": 5, "factorial": 120}
    #[Route('/api/factorial/{n}', name: 'api_factorial', methods: ['GET'])]
    public function factorial(string $n): JsonResponse
    {
        // 20! este cel mai mare factorial care incape intr-un intreg PHP pe 64 de biti
        $n = filter_var($n, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 0, 'max_range' => 20],
        ]);

        if ($n === false) {
            return $this->json(
                ['error' => 'n trebuie să fie un număr întreg între 0 și 20.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $result = 1;
        for ($i = 2; $i <= $n; $i++) {
            $result *= $i;
        }

        return $this->json(['n' => $n, 'factorial' => $result]);
    }
}
