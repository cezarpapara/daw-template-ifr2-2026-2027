<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'members')]
class Member
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nume = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 50)]
    private ?string $telefon = null;

    #[ORM\Column(length: 50)]
    private ?string $tipAbonament = 'Standard';

    #[ORM\Column(length: 50)]
    private ?string $status = 'Activ';

    public function getId(): ?int { return $this->id; }

    public function getNume(): ?string { return $this->nume; }
    public function setNume(string $nume): self { $this->nume = $nume; return $this; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): self { $this->email = $email; return $this; }

    public function getTelefon(): ?string { return $this->telefon; }
    public function setTelefon(string $telefon): self { $this->telefon = $telefon; return $this; }

    public function getTipAbonament(): ?string { return $this->tipAbonament; }
    public function setTipAbonament(string $tipAbonament): self { $this->tipAbonament = $tipAbonament; return $this; }

    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }
}