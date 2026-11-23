<?php

namespace App\Algorithm;

/**
 * "Fisa" unui algoritm: ce stim despre el din teorie.
 * Interfata o afiseaza langa rezultate, ca sa comparati teoria cu ce se masoara.
 */
final class AlgorithmInfo
{
    public function __construct(
        public readonly string $key,          // identificatorul din URL / JSON, de exemplu "bubble"
        public readonly string $name,         // numele afisat, de exemplu "Bubble Sort (metoda bulelor)"
        public readonly string $category,     // "comparatie", "distributie", "cautare" ...
        public readonly string $best,         // complexitatea in cazul cel mai favorabil
        public readonly string $average,      // complexitatea in cazul mediu
        public readonly string $worst,        // complexitatea in cazul cel mai nefavorabil
        public readonly string $memory,       // memoria suplimentara
        public readonly ?bool $stable = null, // pastreaza ordinea elementelor egale? (null = nu se aplica)
        public readonly ?bool $inPlace = null, // lucreaza "pe loc", cu memorie suplimentara O(1)?
        public readonly string $description = '',
    ) {
    }

    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'name' => $this->name,
            'category' => $this->category,
            'complexity' => [
                'best' => $this->best,
                'average' => $this->average,
                'worst' => $this->worst,
                'memory' => $this->memory,
            ],
            'stable' => $this->stable,
            'inPlace' => $this->inPlace,
            'description' => $this->description,
        ];
    }
}
