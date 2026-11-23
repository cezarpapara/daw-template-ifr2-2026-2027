<?php

namespace App\Algorithm\Sort;

use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;

/**
 * Lista tuturor algoritmilor de sortare din aplicatie.
 * Symfony injecteaza automat aici toate clasele care implementeaza SortAlgorithmInterface.
 */
final class SortRegistry
{
    /** @var array<string, SortAlgorithmInterface> */
    private array $algorithms = [];

    /** @param iterable<SortAlgorithmInterface> $algorithms */
    public function __construct(
        #[AutowireIterator('app.sort_algorithm')]
        iterable $algorithms,
    ) {
        foreach ($algorithms as $algorithm) {
            $this->algorithms[$algorithm->info()->key] = $algorithm;
        }
        ksort($this->algorithms);
    }

    public function get(string $key): ?SortAlgorithmInterface
    {
        return $this->algorithms[$key] ?? null;
    }

    /** @return array<string, SortAlgorithmInterface> */
    public function all(): array
    {
        return $this->algorithms;
    }
}
