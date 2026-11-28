<?php

namespace App\Algorithm;

/** Validari comune pentru datele primite de endpoint-urile de algoritmi. */
final class InputValidator
{
    /**
     * Verifica faptul ca $raw este o lista nevida de numere, cu cel mult $max elemente.
     *
     * @return list<int|float>
     *
     * @throws \InvalidArgumentException cu un mesaj clar, afisat apoi in interfata
     */
    public static function numbers(mixed $raw, int $max): array
    {
        if (!\is_array($raw) || !array_is_list($raw) || $raw === []) {
            throw new \InvalidArgumentException('Campul "values" trebuie sa fie o lista nevida de numere, de exemplu [5, 2, 9, 1].');
        }
        if (\count($raw) > $max) {
            throw new \InvalidArgumentException("Vectorul poate avea cel mult $max elemente.");
        }

        foreach ($raw as $i => $value) {
            if (!\is_int($value) && !\is_float($value)) {
                throw new \InvalidArgumentException("Elementul de pe pozitia $i nu este un numar.");
            }
        }

        return $raw;
    }
}
