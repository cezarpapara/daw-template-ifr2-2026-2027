<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

// Doar pentru demonstratie la laborator. Nu il pastrati in proiectul final.
final class PasswordDemoController extends AbstractController
{
    #[Route('/api/demo/parola', methods: ['POST'])]
    public function hash(Request $request): JsonResponse
    {
        $password = (string) ($request->toArray()['password'] ?? '');

        // password_hash genereaza automat o sare aleatoare; hash-ul include algoritmul (bcrypt $2y$)
        $hash = password_hash($password, PASSWORD_DEFAULT);

        return $this->json([
            'hash' => $hash,
            'parolaCorecta' => password_verify($password, $hash),
            'parolaGresita' => password_verify($password . 'x', $hash),
        ]);
    }
}
