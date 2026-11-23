<?php

namespace App\Algorithm\Search;

use App\Algorithm\AlgorithmInfo;
use App\Algorithm\OperationCounter;

/**
 * Cautarea secventiala (liniara) - EXEMPLU COMPLET.
 * Luam elementele pe rand, de la stanga la dreapta, pana gasim valoarea sau terminam vectorul.
 * Functioneaza pe orice vector, sortat sau nu.
 */
final class LinearSearch implements SearchAlgorithmInterface
{
    public function info(): AlgorithmInfo
    {
        return new AlgorithmInfo(
            key: 'linear',
            name: 'Cautare secventiala (liniara)',
            category: 'cautare',
            best: 'O(1)',
            average: 'O(n)',
            worst: 'O(n)',
            memory: 'O(1)',
            description: 'Verifica elementele pe rand, de la primul la ultimul.',
        );
    }

    public function requiresSorted(): bool
    {
        return false;
    }

    public function search(array $values, int|float $target, OperationCounter $counter): ?int
    {
        $a = array_values($values);

        foreach ($a as $i => $value) {
            $counter->step($a, ['compare' => [$i]], "Comparam a[$i] = $value cu $target");

            if ($counter->compare($value, $target) === 0) {
                $counter->step($a, ['found' => [$i]], "Gasit pe pozitia $i");

                return $i;
            }
        }

        $counter->step($a, [], "$target nu apare in vector");

        return null;
    }
}
