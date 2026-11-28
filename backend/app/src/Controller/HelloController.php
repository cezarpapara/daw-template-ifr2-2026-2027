<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HelloController extends AbstractController
{
    // GET /api/hello/Ana -> {"message":"Salut, Ana!"}
    // Exercitiul 2: requirements limiteaza {name} la litere. La /api/hello/123
    // ruta nu se potriveste deloc, deci Symfony raspunde 404 (nu exista alta ruta).
    #[Route('/api/hello/{name}', name: 'api_hello', requirements: ['name' => '[A-Za-z]+'], methods: ['GET'])]
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

    // GET /api/numbers?n=5 -> exercitiul 3: doar numerele PARE de la 1 la n
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

        // array_filter pastreaza cheile originale, de aceea apelam array_values
        $numbers = array_values(array_filter(range(1, $n), fn (int $x) => $x % 2 === 0));

        return $this->json([
            'n' => $n,
            'numbers' => $numbers,
            'sum' => array_sum($numbers),
            'squares' => array_map(fn (int $x) => $x * $x, $numbers),
        ]);
    }

    // GET /api/sum?a=3&b=4 -> exercitiul 1: {"a":3,"b":4,"sum":7}
    #[Route('/api/sum', name: 'api_sum', methods: ['GET'])]
    public function sum(Request $request): JsonResponse
    {
        // Fara parametri nu exista valoare: filter_var(null, ...) ar da false
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

    // GET /api/factorial/5 -> exercitiul 4 (optional): n! pentru n intre 0 si 20
    #[Route('/api/factorial/{n}', name: 'api_factorial', requirements: ['n' => '-?\d+'], methods: ['GET'])]
    public function factorial(int $n): JsonResponse
    {
        if ($n < 0 || $n > 20) {
            return $this->json(
                ['error' => 'n trebuie să fie între 0 și 20.'],
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
