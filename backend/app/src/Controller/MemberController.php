<?php

namespace App\Controller;

use App\Entity\Member;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/members')]
class MemberController extends AbstractController
{
    #[Route('', name: 'api_members_list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $members = $em->getRepository(Member::class)->findAll();
        $data = array_map(fn(Member $m) => [
            'id' => $m->getId(),
            'nume' => $m->getNume(),
            'email' => $m->getEmail(),
            'telefon' => $m->getTelefon(),
            'tipAbonament' => $m->getTipAbonament(),
            'status' => $m->getStatus()
        ], $members);

        return $this->json($data);
    }

    #[Route('', name: 'api_members_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (empty($data['nume']) || empty($data['email'])) {
            return $this->json(['error' => 'Numele si emailul sunt obligatorii'], 400);
        }

        $member = new Member();
        $member->setNume($data['nume']);
        $member->setEmail($data['email']);
        $member->setTelefon($data['telefon'] ?? '');
        $member->setTipAbonament($data['tipAbonament'] ?? 'Standard');
        $member->setStatus($data['status'] ?? 'Activ');

        $em->persist($member);
        $em->flush();

        return $this->json(['message' => 'Membru adaugat cu succes', 'id' => $member->getId()], 201);
    }

    #[Route('/{id}', name: 'api_members_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $member = $em->getRepository(Member::class)->find($id);
        if (!$member) {
            return $this->json(['error' => 'Membrul nu a fost gasit'], 404);
        }

        $em->remove($member);
        $em->flush();

        return $this->json(['message' => 'Membru sters cu succes']);
    }

    #[Route('/export/csv', name: 'api_members_export_csv', methods: ['GET'])]
    public function exportCsv(EntityManagerInterface $em): StreamedResponse
    {
        $members = $em->getRepository(Member::class)->findAll();

        $response = new StreamedResponse(function () use ($members) {
            $handle = fopen('php://output', 'w+');
            fputcsv($handle, ['ID', 'Nume', 'Email', 'Telefon', 'Abonament', 'Status']);

            foreach ($members as $m) {
                fputcsv($handle, [
                    $m->getId(),
                    $m->getNume(),
                    $m->getEmail(),
                    $m->getTelefon(),
                    $m->getTipAbonament(),
                    $m->getStatus()
                ]);
            }
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv; charset=utf-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="export_membri.csv"');

        return $response;
    }
}