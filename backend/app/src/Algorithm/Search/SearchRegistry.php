<?php

namespace App\Algorithm\Search;

use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;

/** Lista tuturor algoritmilor de cautare (injectata automat de Symfony). */
final class SearchRegistry
{
    /** @var array<string, SearchAlgorithmInterface> */
    private array $algorithms = [];

    /** @param iterable<SearchAlgorithmInterface> $algorithms */
    public function __construct(
        #[AutowireIterator('app.search_algorithm')]
        iterable $algorithms,
    ) {
        foreach ($algorithms as $algorithm) {
            $this->algorithms[$algorithm->info()->key] = $algorithm;
        }
        ksort($this->algorithms);
    }

    public function get(string $key): ?SearchAlgorithmInterface
    {
        return $this->algorithms[$key] ?? null;
    }

    /** @return array<string, SearchAlgorithmInterface> */
    public function all(): array
    {
        return $this->algorithms;
    }
}
