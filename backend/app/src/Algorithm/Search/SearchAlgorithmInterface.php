<?php

namespace App\Algorithm\Search;

use App\Algorithm\AlgorithmInfo;
use App\Algorithm\OperationCounter;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;

/**
 * Contractul comun al algoritmilor de cautare a unei valori intr-un vector.
 * O clasa noua care implementeaza interfata apare automat in API si in interfata React.
 */
#[AutoconfigureTag('app.search_algorithm')]
interface SearchAlgorithmInterface
{
    public function info(): AlgorithmInfo;

    /** true daca algoritmul functioneaza corect numai pe un vector sortat crescator. */
    public function requiresSorted(): bool;

    /**
     * Cauta $target in $values.
     *
     * @param list<int|float> $values
     *
     * @return int|null pozitia (indexul) unei aparitii a lui $target sau null daca nu exista
     */
    public function search(array $values, int|float $target, OperationCounter $counter): ?int;
}
