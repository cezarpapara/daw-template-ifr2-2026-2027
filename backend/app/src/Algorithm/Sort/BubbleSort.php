<?php

namespace App\Algorithm\Sort;

use App\Algorithm\AlgorithmInfo;
use App\Algorithm\OperationCounter;

/**
 * Bubble Sort (metoda bulelor) - EXEMPLU COMPLET.
 *
 * Ideea: parcurgem vectorul si comparam vecinii a[j] si a[j+1]; daca sunt in ordine gresita,
 * ii interschimbam. Dupa prima trecere, cel mai mare element a "urcat" (ca o bula) pe ultima
 * pozitie; dupa a doua trecere, al doilea cel mai mare e pe penultima pozitie s.a.m.d.
 * Daca intr-o trecere nu facem nicio interschimbare, vectorul este deja sortat si ne oprim.
 */
final class BubbleSort implements SortAlgorithmInterface
{
    public function info(): AlgorithmInfo
    {
        return new AlgorithmInfo(
            key: 'bubble',
            name: 'Bubble Sort (metoda bulelor)',
            category: 'comparatie',
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)',
            memory: 'O(1)',
            stable: true,
            inPlace: true,
            description: 'Compara vecinii si ii interschimba cand sunt in ordine gresita; se opreste cand o trecere nu mai face nicio interschimbare.',
        );
    }

    public function sort(array $values, OperationCounter $counter): array
    {
        $a = array_values($values);
        $n = \count($a);
        $counter->step($a, [], 'Vectorul initial');

        for ($pass = 0; $pass < $n - 1; ++$pass) {
            $swapped = false;

            // ultimele $pass elemente sunt deja la locul lor, nu le mai parcurgem
            for ($j = 0; $j < $n - 1 - $pass; ++$j) {
                $counter->step($a, [
                    'compare' => [$j, $j + 1],
                    'sorted' => self::lastPositions($n, $pass),
                ], "Comparam a[$j] = {$a[$j]} cu a[".($j + 1).'] = '.$a[$j + 1]);

                if ($counter->compare($a[$j], $a[$j + 1]) > 0) {
                    $counter->swap($a, $j, $j + 1);
                    $swapped = true;

                    $counter->step($a, [
                        'swap' => [$j, $j + 1],
                        'sorted' => self::lastPositions($n, $pass),
                    ], 'Erau in ordine gresita: le interschimbam');
                }
            }

            if (!$swapped) {
                // nicio interschimbare in toata trecerea => vectorul este sortat
                $counter->step($a, ['sorted' => range(0, $n - 1)], 'Nicio interschimbare in aceasta trecere: vectorul este sortat');

                return $a;
            }
        }

        $counter->step($a, ['sorted' => $n > 0 ? range(0, $n - 1) : []], 'Vectorul este sortat');

        return $a;
    }

    /** Pozitiile ultimelor $count elemente (deja fixate la final). */
    private static function lastPositions(int $n, int $count): array
    {
        return $count > 0 ? range($n - $count, $n - 1) : [];
    }
}
