<?php

namespace App\Algorithm\Search;

use App\Algorithm\AlgorithmInfo;
use App\Algorithm\OperationCounter;

/**
 * Cautarea binara - EXEMPLU COMPLET. Cere un vector SORTAT crescator.
 *
 * Pastram un interval [low, high] in care se poate afla valoarea. Comparam valoarea cautata
 * cu elementul din mijloc: daca e mai mare, cautam doar in dreapta; daca e mai mica, doar in
 * stanga. La fiecare pas intervalul se injumatateste, deci facem cel mult ~log2(n) + 1 pasi.
 */
final class BinarySearch implements SearchAlgorithmInterface
{
    public function info(): AlgorithmInfo
    {
        return new AlgorithmInfo(
            key: 'binary',
            name: 'Cautare binara',
            category: 'cautare',
            best: 'O(1)',
            average: 'O(log n)',
            worst: 'O(log n)',
            memory: 'O(1)',
            description: 'Injumatateste la fiecare pas intervalul in care se poate afla valoarea; cere un vector sortat.',
        );
    }

    public function requiresSorted(): bool
    {
        return true;
    }

    public function search(array $values, int|float $target, OperationCounter $counter): ?int
    {
        $a = array_values($values);
        $low = 0;
        $high = \count($a) - 1;

        while ($low <= $high) {
            // varianta fara depasire: low + (high - low) / 2 (in alte limbaje, (low + high) poate depasi int)
            $mid = $low + intdiv($high - $low, 2);
            $counter->step($a, ['range' => range($low, $high), 'compare' => [$mid]],
                "Intervalul [$low, $high], mijlocul $mid: comparam a[$mid] = {$a[$mid]} cu $target");

            $result = $counter->compare($a[$mid], $target);
            if ($result === 0) {
                $counter->step($a, ['found' => [$mid]], "Gasit pe pozitia $mid");

                return $mid;
            }

            if ($result < 0) {
                $low = $mid + 1;   // a[mid] < target: valoarea poate fi doar in dreapta
            } else {
                $high = $mid - 1;  // a[mid] > target: valoarea poate fi doar in stanga
            }
        }

        $counter->step($a, [], "Intervalul a devenit vid: $target nu apare in vector");

        return null;
    }
}
