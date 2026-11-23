<?php

namespace App\Command;

use App\Algorithm\DataGenerator;
use App\Algorithm\OperationCounter;
use App\Algorithm\Search\SearchRegistry;
use App\Algorithm\Sort\SortRegistry;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Verifica automat toti algoritmii de sortare si de cautare din aplicatie.
 *
 * Rulare (din folderul principal al proiectului):
 *   docker exec -it daw-php php bin/console app:algoritmi:verifica
 *   docker exec -it daw-php php bin/console app:algoritmi:verifica quick   (doar o metoda)
 */
#[AsCommand(name: 'app:algoritmi:verifica', description: 'Verifica algoritmii de sortare si cautare pe date de test')]
final class VerifyAlgorithmsCommand extends Command
{
    public function __construct(
        private readonly SortRegistry $sorts,
        private readonly SearchRegistry $searches,
        private readonly DataGenerator $generator,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('method', InputArgument::OPTIONAL, 'Cheia unei singure metode (de exemplu bubble)');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $only = $input->getArgument('method');
        $failures = 0;

        // Cazuri de test: vectori mici "capcana" + vectori generati de toate tipurile
        $cases = [
            'vector cu un element' => [7],
            'doua elemente inversate' => [2, 1],
            'toate egale' => [5, 5, 5, 5],
            'deja sortat' => [1, 2, 3, 4, 5, 6],
            'invers sortat' => [9, 7, 5, 3, 1],
            'cu duplicate' => [4, 7, 3, 4, 3, 3, 4],
        ];
        foreach (DataGenerator::ORDERS as $order) {
            foreach ([10, 101, 1000] as $n) {
                $cases["$order, n = $n"] = $this->generator->generate($n, $order, null, $n);
            }
        }

        $io->section('Sortari');
        foreach ($this->sorts->all() as $key => $algorithm) {
            if ($only !== null && $only !== $key) {
                continue;
            }
            $ok = 0;
            foreach ($cases as $label => $values) {
                $expected = $values;
                sort($expected);
                try {
                    $result = $algorithm->sort($values, new OperationCounter());
                } catch (\Throwable $e) {
                    $io->writeln("  <error>$key: $label -> ".$e->getMessage().'</error>');
                    ++$failures;
                    continue;
                }
                if ($result == $expected) {
                    ++$ok;
                } else {
                    $io->writeln("  <error>$key: $label -> rezultat gresit</error>");
                    ++$failures;
                }
            }
            $io->writeln(sprintf('  %-12s %d / %d teste trecute', $key, $ok, \count($cases)));
        }

        $io->section('Cautari');
        foreach ($this->searches->all() as $key => $algorithm) {
            if ($only !== null && $only !== $key) {
                continue;
            }
            $ok = 0;
            $total = 0;
            foreach ($cases as $values) {
                sort($values); // cautarea binara cere vector sortat
                $targets = [$values[0], $values[\count($values) - 1], $values[intdiv(\count($values), 2)], -1, PHP_INT_MAX];
                foreach ($targets as $target) {
                    ++$total;
                    $index = $algorithm->search($values, $target, new OperationCounter());
                    $correct = $index === null ? !\in_array($target, $values, true) : $values[$index] === $target;
                    $correct ? ++$ok : ++$failures;
                }
            }
            $io->writeln(sprintf('  %-12s %d / %d teste trecute', $key, $ok, $total));
        }

        if ($failures > 0) {
            $io->error("$failures teste au esuat.");

            return Command::FAILURE;
        }
        $io->success('Toate testele au trecut.');

        return Command::SUCCESS;
    }
}
