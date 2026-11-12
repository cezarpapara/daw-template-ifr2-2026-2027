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
    private string $omdbApiKey = '19ac3128'; // OMDb key
    private string $tmdbApiKey = '10159b77ac692bb50e956e3f7240b397'; // TMDB v3 API key


private function fetchMovieDataFromOmdb(string $title, ?int $year): array
    {
        $result = ['poster' => null, 'year' => null, 'genre' => null];

        if (empty($this->omdbApiKey)) {
            return $result;
        }

        $urls = [];
        if ($year !== null) {
            $urls[] = sprintf('https://www.omdbapi.com/?t=%s&y=%d&apikey=%s', urlencode($title), $year, $this->omdbApiKey);
        }
        $urls[] = sprintf('https://www.omdbapi.com/?t=%s&apikey=%s', urlencode($title), $this->omdbApiKey);

        foreach ($urls as $url) {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($ch);
            curl_close($ch);

            if ($response !== false) {
                $data = json_decode($response, true);
                if (isset($data['Response']) && $data['Response'] === 'True') {
                    if (!empty($data['Poster']) && $data['Poster'] !== 'N/A') {
                        $result['poster'] = $data['Poster'];
                    }
                    if (!empty($data['Year'])) {
                        $result['year'] = (int) substr($data['Year'], 0, 4);
                    }
                    if (!empty($data['Genre']) && $data['Genre'] !== 'N/A') {
                        $result['genre'] = $data['Genre'];
                    }
                    return $result;
                }
            }
        }

        return $result;
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

        if (empty($data['title'])) {
            return $this->json(['error' => 'Titlul filmului este obligatoriu!'], 400);
        }

        $title = trim($data['title']);
        $inputGenre = !empty($data['genre']) ? trim($data['genre']) : null;
        $inputYear = !empty($data['releaseYear']) ? (int) $data['releaseYear'] : null;

        // Preluam datele de pe OMDb (poster, an, gen)
        $omdbData = $this->fetchMovieDataFromOmdb($title, $inputYear);

        // Folosim valorile introduse de utilizator sau fallback la datele din OMDb
        $finalGenre = $inputGenre ?? $omdbData['genre'] ?? 'Necunoscut';
        $finalYear = $inputYear ?? $omdbData['year'] ?? (int) date('Y');

        $movie = new Movie();
        $movie->setTitle($title);
        $movie->setGenre($finalGenre);
        $movie->setReleaseYear($finalYear);
        $movie->setIsWatched((bool) ($data['isWatched'] ?? false));
        $movie->setRating(isset($data['rating']) && $data['rating'] !== '' ? (int) $data['rating'] : null);
        $movie->setPosterUrl($omdbData['poster']);

        $em->persist($movie);
        $em->flush();

        return $this->json([
            'message' => 'Film adăugat cu succes!',
            'movie' => $movie->toArray()
        ], 201);
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
            return $this->json(['error' => 'Filmul nu a fost găsit!'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $title = isset($data['title']) ? trim($data['title']) : $movie->getTitle();
        $inputGenre = array_key_exists('genre', $data)
            ? (!empty($data['genre']) ? trim($data['genre']) : null)
            : $movie->getGenre();
        $inputYear = array_key_exists('releaseYear', $data) 
            ? (!empty($data['releaseYear']) ? (int) $data['releaseYear'] : null) 
            : $movie->getReleaseYear();

        $omdbData = $this->fetchMovieDataFromOmdb($title, $inputYear);
        $finalGenre = $inputGenre ?? $omdbData['genre'] ?? $movie->getGenre();
        $finalYear = $inputYear ?? $omdbData['year'] ?? $movie->getReleaseYear();

        $movie->setTitle($title);
        $movie->setGenre($finalGenre);
        $movie->setReleaseYear($finalYear);
        if (isset($data['isWatched'])) $movie->setIsWatched((bool) $data['isWatched']);
        if (array_key_exists('rating', $data)) {
            $movie->setRating($data['rating'] !== '' && $data['rating'] !== null ? (int) $data['rating'] : null);
        }

        if ($omdbData['poster']) {
            $movie->setPosterUrl($omdbData['poster']);
        }

        $em->flush();

        return $this->json([
            'message' => 'Film actualizat cu succes!',
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
    #[Route('/{id}/streaming', name: 'api_movies_streaming', methods: ['GET'])]
    public function getStreamingProviders(int $id, EntityManagerInterface $em): JsonResponse
    {
        $movie = $em->getRepository(Movie::class)->find($id);
        if (!$movie) {
            return $this->json(['error' => 'Filmul nu a fost găsit!'], 404);
        }

        if (empty($this->tmdbApiKey) || $this->tmdbApiKey === 'PUNE_AICI_CHEIA_TA_TMDB') {
            return $this->json(['error' => 'Cheia TMDB API nu este configurată în backend.'], 400);
        }

        $title = $movie->getTitle();
        $year = $movie->getReleaseYear();

        // 1. Cautam filmul pe TMDB dupa titlu (si an, daca exista)
        $searchUrl = sprintf(
            'https://api.themoviedb.org/3/search/movie?api_key=%s&query=%s&year=%d',
            $this->tmdbApiKey,
            urlencode($title),
            $year
        );

        $searchData = $this->makeTmdbRequest($searchUrl);

        // Daca nu gasim cu an, incercam doar dupa titlu
        if (empty($searchData['results'])) {
            $fallbackUrl = sprintf(
                'https://api.themoviedb.org/3/search/movie?api_key=%s&query=%s',
                $this->tmdbApiKey,
                urlencode($title)
            );
            $searchData = $this->makeTmdbRequest($fallbackUrl);
        }

        if (empty($searchData['results'][0]['id'])) {
            return $this->json([
                'providers' => [],
                'link' => null,
                'message' => 'Filmul nu a fost găsit în baza de date TMDB.'
            ]);
        }

        $tmdbId = $searchData['results'][0]['id'];

        // 2. Preluam furnizorii de streaming pentru Romania (RO)
        $providersUrl = sprintf(
            'https://api.themoviedb.org/3/movie/%d/watch/providers?api_key=%s',
            $tmdbId,
            $this->tmdbApiKey
        );

        $providersData = $this->makeTmdbRequest($providersUrl);
        $roData = $providersData['results']['RO'] ?? null;

        if (!$roData) {
            return $this->json([
                'providers' => [],
                'link' => null,
                'message' => 'Momentan indisponibil pe platformele de streaming din România.'
            ]);
        }

        $providers = [];
        $seenIds = [];

        // Combinam flatrate (abonament: Netflix, Max, Disney+), rent si buy
        foreach (['flatrate' => 'Abonament', 'rent' => 'Închiriere', 'buy' => 'Cumpărare'] as $type => $label) {
            if (!empty($roData[$type])) {
                foreach ($roData[$type] as $provider) {
                    if (!in_array($provider['provider_id'], $seenIds, true)) {
                        $seenIds[] = $provider['provider_id'];
                        $providers[] = [
                            'id' => $provider['provider_id'],
                            'name' => $provider['provider_name'],
                            'logo' => 'https://image.tmdb.org/t/p/original' . $provider['logo_path'],
                            'type' => $label
                        ];
                    }
                }
            }
        }

        return $this->json([
            'providers' => $providers,
            'link' => $roData['link'] ?? null,
            'message' => empty($providers) ? 'Nu sunt platforme active listate pentru România.' : null
        ]);
    }

    private function makeTmdbRequest(string $url): ?array
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response !== false ? json_decode($response, true) : null;
    }
}