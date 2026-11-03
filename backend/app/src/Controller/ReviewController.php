<?php

namespace App\Controller;

use App\Entity\Review;
use App\Repository\ProductRepository;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\JsonException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// API REST pentru recenzii: GET, POST, PUT, PATCH, DELETE
#[OA\Tag(name: 'Reviews')]
final class ReviewController extends AbstractController
{
    // Exemplul de corp JSON afisat in Swagger
    private const EXAMPLE = ['author' => 'Ana Popescu', 'rating' => 5,
        'comment' => 'Recomand!', 'productId' => 1];

    // Dependentele sunt primite automat de la Symfony (injectarea dependentelor)
    public function __construct(
        private EntityManagerInterface $em,
        private ReviewRepository $reviews,
        private ProductRepository $products,
    ) {
    }

    // ===== Citirea =====

    // GET /api/reviews -> toate recenziile, cele mai noi primele
    #[Route('/api/reviews', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $items = $this->reviews->findBy([], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn (Review $r) => $r->toArray(), $items));
    }

    // GET /api/reviews/7 -> o singura recenzie
    #[Route('/api/reviews/{id<\d+>}', methods: ['GET'])] // {id<\d+>}: doar cifre
    public function show(int $id): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        return $this->json($review->toArray());
    }

    // GET /api/products/1/reviews -> recenziile unui produs
    #[Route('/api/products/{id<\d+>}/reviews', methods: ['GET'])]
    public function byProduct(int $id): JsonResponse
    {
        $product = $this->products->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }
        $items = $this->reviews->findBy(['product' => $product], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn (Review $r) => $r->toArray(), $items));
    }

    // Exercitiul 2: GET /api/products/1/rating -> {"productId": 1, "count": 3, "average": 4.33}
    #[Route('/api/products/{id<\d+>}/rating', methods: ['GET'])]
    public function rating(int $id): JsonResponse
    {
        $product = $this->products->find($id);
        if (!$product) {
            return $this->json(['error' => 'Produsul nu există.'], 404);
        }
        $items = $this->reviews->findBy(['product' => $product]);

        // Extragem notele, apoi calculam media in PHP
        $ratings = array_map(fn (Review $r) => $r->getRating(), $items);
        $count = count($ratings);
        // Fara recenzii nu exista medie: intoarcem null, nu impartim la 0
        $average = $count > 0 ? round(array_sum($ratings) / $count, 2) : null;

        return $this->json([
            'productId' => $id,
            'count' => $count,
            'average' => $average,
        ]);
    }

    // ===== Scrierea =====

    // POST /api/reviews -> creeaza o recenzie (201) sau 400 la date gresite
    #[Route('/api/reviews', methods: ['POST'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: self::EXAMPLE))]
    public function create(Request $request): JsonResponse
    {
        $review = new Review();
        $errors = $this->fill($review, $request);
        if ($errors) {
            return $this->json(['errors' => $errors], 400);
        }
        $this->em->persist($review); // obiect nou, de salvat
        $this->em->flush();          // trimite INSERT la PostgreSQL

        return $this->json($review->toArray(), 201);
    }

    // PUT /api/reviews/7 -> inlocuieste TOATE campurile recenziei
    #[Route('/api/reviews/{id<\d+>}', methods: ['PUT'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: self::EXAMPLE))]
    public function update(int $id, Request $request): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }
        $errors = $this->fill($review, $request);
        if ($errors) {
            return $this->json(['errors' => $errors], 400);
        }
        $this->em->flush(); // obiectul e deja urmarit de Doctrine: flush trimite UPDATE

        return $this->json($review->toArray());
    }

    // Exercitiul 3 (optional): PATCH /api/reviews/7 -> modifica DOAR campurile trimise
    #[Route('/api/reviews/{id<\d+>}', methods: ['PATCH'])]
    #[OA\RequestBody(content: new OA\JsonContent(example: ['rating' => 3]))]
    public function patch(int $id, Request $request): JsonResponse
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }

        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return $this->json(['errors' => ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.']], 400);
        }

        // Verificam doar cheile prezente in JSON (array_key_exists), restul raman neschimbate
        $errors = [];
        if (array_key_exists('author', $data)) {
            $author = is_string($data['author']) ? trim($data['author']) : '';
            if ($author === '' || mb_strlen($author) > 100) {
                $errors['author'] = 'Autorul este obligatoriu (cel mult 100 de caractere).';
            }
        }
        if (array_key_exists('rating', $data)) {
            $rating = $data['rating'];
            if (!is_int($rating) || $rating < 1 || $rating > 5) {
                $errors['rating'] = 'Nota trebuie să fie un număr întreg între 1 și 5.';
            }
        }
        if (array_key_exists('productId', $data)) {
            $product = $this->products->find((int) $data['productId']);
            if (!$product) {
                $errors['productId'] = 'Produsul indicat nu există.';
            }
        }
        if ($errors) {
            return $this->json(['errors' => $errors], 400);
        }

        // Aplicam modificarile abia dupa ce toate verificarile au trecut
        if (isset($author)) {
            $review->setAuthor($author);
        }
        if (isset($rating)) {
            $review->setRating($rating);
        }
        if (array_key_exists('comment', $data)) {
            $comment = is_string($data['comment']) ? trim($data['comment']) : '';
            $review->setComment($comment === '' ? null : $comment);
        }
        if (isset($product)) {
            $review->setProduct($product);
        }
        $this->em->flush();

        return $this->json($review->toArray());
    }

    // DELETE /api/reviews/7 -> 204 fara continut
    #[Route('/api/reviews/{id<\d+>}', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $review = $this->reviews->find($id);
        if (!$review) {
            return $this->json(['error' => 'Recenzia nu există.'], 404);
        }
        $this->em->remove($review);
        $this->em->flush();

        return new Response(null, 204);
    }

    // ===== Validarea, comuna pentru POST si PUT =====

    // Verifica JSON-ul si completeaza recenzia; intoarce erorile (camp => mesaj).
    private function fill(Review $review, Request $request): array
    {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            return ['body' => 'Corpul cererii trebuie să fie un obiect JSON valid.'];
        }

        $errors = [];

        $author = is_string($data['author'] ?? null) ? trim($data['author']) : '';
        if ($author === '' || mb_strlen($author) > 100) {
            $errors['author'] = 'Autorul este obligatoriu (cel mult 100 de caractere).';
        }

        $rating = $data['rating'] ?? null;
        if (!is_int($rating) || $rating < 1 || $rating > 5) {
            $errors['rating'] = 'Nota trebuie să fie un număr întreg între 1 și 5.';
        }

        $product = $this->products->find((int) ($data['productId'] ?? 0));
        if (!$product) {
            $errors['productId'] = 'Produsul indicat nu există.';
        }

        if ($errors) {
            return $errors;
        }

        $comment = is_string($data['comment'] ?? null) ? trim($data['comment']) : '';
        $review->setAuthor($author)
            ->setRating($rating)
            ->setComment($comment === '' ? null : $comment)
            ->setProduct($product);

        return [];
    }
}
