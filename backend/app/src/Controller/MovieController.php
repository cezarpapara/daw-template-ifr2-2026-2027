<?php

namespace App\Controller;

use App\Entity\Movie;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/movies')]
#[OA\Tag(name: 'Filme')]
class MovieController extends AbstractController
{
    private string $omdbApiKey = '19ac3128'; // Omdb key

    private function fetchPosterFromOmdb(string $title, int $year): ?string
    {
        if ($this->omdbApiKey === 'PUNE_AICI_CHEIA_TA') {
            return null;
        }

        $ctx = stream_context_create([
            'http' => [
                'timeout' => 3,
                'ignore_errors' => true
            ]
        ]);

        // Incercarea 1: cautare dupa titlu + an
        $urls = [
            sprintf('http://www.omdbapi.com/?t=%s&y=%d&apikey=%s', urlencode($title), $year, $this->omdbApiKey),
            sprintf('http://www.omdbapi.com/?t=%s&apikey=%s', urlencode($title), $this->omdbApiKey) // Incercarea 2: doar dupa titlu
        ];

        foreach ($urls as $url) {
            try {
                $response = @file_get_contents($url, false, $ctx);
                if ($response !== false) {
                    $data = json_decode($response, true);
                    if (!empty($data['Poster']) && $data['Poster'] !== 'N/A') {
                        return $data['Poster'];
                    }
                }
            } catch (\Throwable $e) {
                // ignoram si incercam urmatorul URL
            }
        }

        return null;
    }

    #[Route('', name: 'api_movies_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $movies = $em->getRepository(Movie::class)->findBy([], ['id' => 'DESC']);
        $data = [];

        foreach ($movies as $movie) {
            $data[] = $movie->toArray();
        }

        return $this->json($data);
    }

    #[Route('', name: 'api_movies_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || empty($data['title']) || empty($data['genre']) || empty($data['releaseYear'])) {
            return $this->json([
                'error' => 'Titlul, genul și anul lansării sunt obligatorii!'
            ], Response::HTTP_BAD_REQUEST);

                    // Daca utilizatorul a introdus manual un link de afis, il folosim direct:
        if (!empty($data['posterUrl'])) {
            $movie->setPosterUrl(trim($data['posterUrl']));
        } else {
            // Detectarea automata prin OMDb:
            $movie->setPosterUrl($this->fetchPosterFromOmdb($movie->getTitle(), $movie->getReleaseYear()));
        }
        }

        $movie = new Movie();
        $movie->setTitle(trim($data['title']));
        $movie->setGenre($data['genre']);
        $movie->setReleaseYear((int)$data['releaseYear']);
        $movie->setIsWatched($data['isWatched'] ?? false);
        $movie->setRating(isset($data['rating']) && $data['rating'] !== '' ? (int)$data['rating'] : null);

        // Preluam automat afisul oficial de pe IMDb prin OMDb API
        $posterUrl = $this->fetchPosterFromOmdb($movie->getTitle(), $movie->getReleaseYear());
        $movie->setPosterUrl($posterUrl);

        $em->persist($movie);
        $em->flush();

        return $this->json([
            'message' => 'Filmul a fost adăugat cu succes!',
            'movie' => $movie->toArray()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_movies_show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $em): JsonResponse
    {
        $movie = $em->getRepository(Movie::class)->find($id);

        if (!$movie) {
            return $this->json(['error' => 'Filmul nu a fost găsit!'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($movie->toArray());
    }

    #[Route('/{id}', name: 'api_movies_update', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $movie = $em->getRepository(Movie::class)->find($id);

        if (!$movie) {
            return $this->json(['error' => 'Filmul nu a fost găsit!'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Daca utilizatorul a introdus manual un link de afis, il folosim direct:
        if (!empty($data['posterUrl'])) {
            $movie->setPosterUrl(trim($data['posterUrl']));
        } else {
            // Detectarea automata prin OMDb:
            $movie->setPosterUrl($this->fetchPosterFromOmdb($movie->getTitle(), $movie->getReleaseYear()));
        }

        if (!$data || empty($data['title']) || empty($data['genre']) || empty($data['releaseYear'])) {
            return $this->json(['error' => 'Date invalide pentru actualizare!'], Response::HTTP_BAD_REQUEST);
        }

        $previousTitle = $movie->getTitle();
        $previousYear = $movie->getReleaseYear();

        $movie->setTitle(trim($data['title']));
        $movie->setGenre($data['genre']);
        $movie->setReleaseYear((int)$data['releaseYear']);
        $movie->setIsWatched($data['isWatched'] ?? false);
        $movie->setRating(isset($data['rating']) && $data['rating'] !== '' ? (int)$data['rating'] : null);

        // Daca titlul sau anul s-au schimbat, refacem cautarea afisului
        if ($previousTitle !== $movie->getTitle() || $previousYear !== $movie->getReleaseYear()) {
            $movie->setPosterUrl($this->fetchPosterFromOmdb($movie->getTitle(), $movie->getReleaseYear()));
        }

        $em->flush();

        return $this->json([
            'message' => 'Filmul a fost modificat cu succes!',
            'movie' => $movie->toArray()
        ]);
    }

    #[Route('/{id}', name: 'api_movies_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $movie = $em->getRepository(Movie::class)->find($id);

        if (!$movie) {
            return $this->json(['error' => 'Filmul nu există sau a fost deja șters!'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($movie);
        $em->flush();

        return $this->json(['message' => 'Filmul a fost șters din colecție!']);
    }
}