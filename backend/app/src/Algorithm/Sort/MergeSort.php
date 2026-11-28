<?php

namespace App\Algorithm\Sort;

use App\Algorithm\AlgorithmInfo;
use App\Algorithm\OperationCounter;

/**
 * Merge Sort (sortarea prin interclasare) - EXEMPLU COMPLET, metoda Divide et Impera.
 *
 * 1. Imparte: injumatatim vectorul pana raman bucati de cate un element (deja sortate).
 * 2. Stapaneste: sortam recursiv fiecare jumatate.
 * 3. Combina: interclasam (merge) doua jumatati sortate intr-una singura, sortata.
 *
 * Recurenta T(n) = 2T(n/2) + O(n) are solutia T(n) = O(n log n), in orice caz.
 */
final class MergeSort implements SortAlgorithmInterface
{
    public function info(): AlgorithmInfo
    {
        return new AlgorithmInfo(
            key: 'merge',
            name: 'Merge Sort (sortare prin interclasare)',
            category: 'comparatie',
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
            memory: 'O(n)',
            stable: true,
            inPlace: false,
            description: 'Imparte vectorul in doua jumatati, le sorteaza recursiv si le interclaseaza.',
        );
    }

    public function sort(array $values, OperationCounter $counter): array
    {
        $a = array_values($values);
        $n = \count($a);
        $counter->step($a, [], 'Vectorul initial');

        if ($n > 1) {
            $this->mergeSort($a, 0, $n - 1, $counter);
        }

        $counter->step($a, ['sorted' => $n > 0 ? range(0, $n - 1) : []], 'Vectorul este sortat');

        return $a;
    }

    /** Sorteaza secventa a[lo..hi] (capete incluse). */
    private function mergeSort(array &$a, int $lo, int $hi, OperationCounter $counter): void
    {
        if ($lo >= $hi) {
            return; // un singur element: este deja sortat (cazul de baza al recursivitatii)
        }

        $mid = intdiv($lo + $hi, 2);
        $this->mergeSort($a, $lo, $mid, $counter);      // jumatatea stanga
        $this->mergeSort($a, $mid + 1, $hi, $counter);  // jumatatea dreapta
        $this->merge($a, $lo, $mid, $hi, $counter);     // le interclasam
    }

    /** Interclaseaza a[lo..mid] si a[mid+1..hi], ambele deja sortate. */
    private function merge(array &$a, int $lo, int $mid, int $hi, OperationCounter $counter): void
    {
        $left = \array_slice($a, $lo, $mid - $lo + 1);
        $right = \array_slice($a, $mid + 1, $hi - $mid);
        $counter->assign(\count($left) + \count($right)); // copierea in vectorii auxiliari

        $i = 0;
        $j = 0;
        $k = $lo;

        // cat timp ambele jumatati mai au elemente, il luam pe cel mai mic dintre "capete"
        while ($i < \count($left) && $j < \count($right)) {
            // "<=" (si nu "<") pastreaza ordinea elementelor egale: sortarea este stabila
            if ($counter->compare($left[$i], $right[$j]) <= 0) {
                $a[$k++] = $left[$i++];
            } else {
                $a[$k++] = $right[$j++];
            }
            $counter->assign();
        }

        // copiem ce a mai ramas (doar una dintre bucle se executa efectiv)
        while ($i < \count($left)) {
            $a[$k++] = $left[$i++];
            $counter->assign();
        }
        while ($j < \count($right)) {
            $a[$k++] = $right[$j++];
            $counter->assign();
        }

        $counter->step($a, ['range' => range($lo, $hi)], "Am interclasat a[$lo..$mid] cu a[".($mid + 1)."..$hi]");
    }
}
