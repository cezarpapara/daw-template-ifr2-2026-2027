<?php

namespace App\Algorithm;

/**
 * Genereaza date de test pentru algoritmi.
 * Cu aceeasi "samanta" (seed) se obtin mereu aceleasi numere, deci toti algoritmii
 * dintr-un benchmark primesc exact acelasi vector.
 */
final class DataGenerator
{
    public const ORDERS = ['random', 'sorted', 'reversed', 'nearly', 'few-unique'];

    /** @return list<int> */
    public function generate(int $n, string $order = 'random', ?int $maxValue = null, int $seed = 2026): array
    {
        $maxValue ??= max(10, 10 * $n);
        $random = new \Random\Randomizer(new \Random\Engine\Mt19937($seed));

        $values = [];
        for ($i = 0; $i < $n; ++$i) {
            $values[] = $order === 'few-unique'
                ? $random->getInt(0, 9)              // doar 10 valori distincte, multe duplicate
                : $random->getInt(0, $maxValue);
        }

        switch ($order) {
            case 'sorted':
                sort($values);
                break;
            case 'reversed':
                rsort($values);
                break;
            case 'nearly':
                // sortat, apoi ~5% din perechi interschimbate la intamplare
                sort($values);
                $swaps = max(1, intdiv($n, 20));
                for ($k = 0; $k < $swaps && $n > 1; ++$k) {
                    $i = $random->getInt(0, $n - 1);
                    $j = $random->getInt(0, $n - 1);
                    [$values[$i], $values[$j]] = [$values[$j], $values[$i]];
                }
                break;
        }

        return $values;
    }
}
