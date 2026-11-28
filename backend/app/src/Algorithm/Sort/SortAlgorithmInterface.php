<?php

namespace App\Algorithm\Sort;

use App\Algorithm\AlgorithmInfo;
use App\Algorithm\OperationCounter;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;

/**
 * Contractul comun al tuturor algoritmilor de sortare.
 *
 * Ca sa adaugati o metoda noua de sortare este suficient sa creati, in acest folder,
 * o clasa care implementeaza interfata. Symfony o gaseste singur (eticheta de mai jos),
 * iar metoda apare automat in GET /api/algorithms/sort/methods si in interfata React.
 */
#[AutoconfigureTag('app.sort_algorithm')]
interface SortAlgorithmInterface
{
    /** Datele teoretice ale algoritmului (nume, complexitati, stabilitate). */
    public function info(): AlgorithmInfo;

    /**
     * Sorteaza crescator si intoarce vectorul sortat.
     *
     * @param list<int|float> $values
     *
     * @return list<int|float>
     *
     * @throws \InvalidArgumentException daca datele nu respecta cerintele algoritmului
     *                                   (de exemplu, numere negative la Counting Sort)
     */
    public function sort(array $values, OperationCounter $counter): array;
}
