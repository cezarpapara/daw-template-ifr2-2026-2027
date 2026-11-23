<?php

namespace App\Algorithm;

/**
 * Numara operatiile elementare ale unui algoritm si, la cerere, retine pasii lui.
 *
 * - comparisons: de cate ori am comparat doua valori (a < b, a > b, a == b);
 * - assignments: de cate ori am scris o valoare intr-o pozitie a vectorului;
 * - swaps:       de cate ori am interschimbat doua elemente (un swap = 3 atribuiri).
 *
 * Pasii (steps) sunt "fotografii" ale vectorului, folosite de interfata React
 * ca sa deseneze algoritmul pas cu pas. Se retin doar pentru vectori mici.
 */
final class OperationCounter
{
    public int $comparisons = 0;
    public int $assignments = 0;
    public int $swaps = 0;

    /** @var list<array{values: list<int|float>, highlight: array<string, list<int>>, message: string}> */
    private array $steps = [];
    private bool $truncated = false;

    public function __construct(
        private readonly bool $recordSteps = false,
        private readonly int $maxSteps = 1500,
    ) {
    }

    /**
     * Compara doua valori si numara comparatia.
     * Intoarce -1 daca $a < $b, 0 daca sunt egale, 1 daca $a > $b (operatorul <=>, "spaceship").
     */
    public function compare(int|float $a, int|float $b): int
    {
        ++$this->comparisons;

        return $a <=> $b;
    }

    /** Interschimba elementele de pe pozitiile $i si $j si numara operatia. */
    public function swap(array &$values, int $i, int $j): void
    {
        ++$this->swaps;
        $this->assignments += 3; // aux = a; a = b; b = aux

        [$values[$i], $values[$j]] = [$values[$j], $values[$i]];
    }

    /** Numara $count atribuiri (scrieri in vector). */
    public function assign(int $count = 1): void
    {
        $this->assignments += $count;
    }

    /**
     * Retine un pas, daca pasii sunt ceruti.
     *
     * @param list<int|float>         $values    starea curenta a vectorului
     * @param array<string, list<int>> $highlight pozitii de colorat, de exemplu
     *                                            ['compare' => [3, 4], 'sorted' => [8, 9]]
     */
    public function step(array $values, array $highlight = [], string $message = ''): void
    {
        if (!$this->recordSteps) {
            return;
        }
        if (\count($this->steps) >= $this->maxSteps) {
            $this->truncated = true;

            return;
        }

        $this->steps[] = [
            'values' => array_values($values),
            'highlight' => $highlight,
            'message' => $message,
        ];
    }

    public function isRecording(): bool
    {
        return $this->recordSteps;
    }

    public function steps(): array
    {
        return $this->steps;
    }

    public function stepsTruncated(): bool
    {
        return $this->truncated;
    }

    public function toArray(): array
    {
        return [
            'comparisons' => $this->comparisons,
            'assignments' => $this->assignments,
            'swaps' => $this->swaps,
        ];
    }
}
