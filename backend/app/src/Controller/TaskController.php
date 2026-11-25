<?php

namespace App\Controller;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/tasks')]
#[OA\Tag(name: 'Sarcini')]
class TaskController extends AbstractController
{
    // GET /api/tasks -> afiseaza toate sarcinile
    #[Route('', name: 'task_list', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Lista sarcinilor')]
    public function list(TaskRepository $taskRepository): JsonResponse
    {
        $tasks = $taskRepository->findAll();

        return $this->json(
            array_map(fn (Task $task) => $task->toArray(), $tasks)
        );
    }

    // GET /api/tasks/5 -> afiseaza o sarcina dupa ID
    #[Route('/{id}', name: 'task_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    #[OA\Response(response: 200, description: 'Sarcina solicitata')]
    #[OA\Response(response: 404, description: 'Sarcina nu exista')]
    public function show(int $id, TaskRepository $taskRepository): JsonResponse
    {
        $task = $taskRepository->find($id);

        if ($task === null) {
            return $this->json(
                ['error' => 'Sarcina nu exista.'],
                Response::HTTP_NOT_FOUND
            );
        }

        return $this->json($task->toArray());
    }

    // POST /api/tasks -> adauga o sarcina noua
    #[Route('', name: 'task_create', methods: ['POST'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['title'],
            properties: [
                new OA\Property(property: 'title', type: 'string', example: 'Realizare proiect DAW'),
                new OA\Property(property: 'description', type: 'string', example: 'Finalizarea aplicatiei TaskFlow'),
                new OA\Property(property: 'priority', type: 'string', example: 'High'),
                new OA\Property(property: 'status', type: 'string', example: 'To Do'),
                new OA\Property(property: 'dueDate', type: 'string', format: 'date', example: '2026-12-10'),
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Sarcina a fost creata')]
    #[OA\Response(response: 400, description: 'Date invalide')]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['error' => 'Date JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $title = trim($data['title'] ?? '');
        $priority = $data['priority'] ?? 'Medium';
        $status = $data['status'] ?? 'To Do';

        if ($title === '') {
            return $this->json(['error' => 'Titlul sarcinii este obligatoriu.'], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($priority, ['Low', 'Medium', 'High'], true)) {
            return $this->json(['error' => 'Prioritatea nu este valida.'], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($status, ['To Do', 'In Progress', 'Completed'], true)) {
            return $this->json(['error' => 'Statusul nu este valid.'], Response::HTTP_BAD_REQUEST);
        }

        $task = new Task();
        $task->setTitle($title);
        $task->setDescription(trim($data['description'] ?? '') ?: null);
        $task->setPriority($priority);
        $task->setStatus($status);

        if (!empty($data['dueDate'])) {
            try {
                $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $data['dueDate']);

                if (!$date || $date->format('Y-m-d') !== $data['dueDate']) {
                    throw new \Exception();
                }

                $task->setDueDate($date);
            } catch (\Throwable) {
                return $this->json(['error' => 'Data limita trebuie sa fie in formatul YYYY-MM-DD.'], Response::HTTP_BAD_REQUEST);
            }
        }

        $entityManager->persist($task);
        $entityManager->flush();

        return $this->json($task->toArray(), Response::HTTP_CREATED);
    }

    // PUT /api/tasks/5 -> modifica o sarcina
    #[Route('/{id}', name: 'task_update', methods: ['PUT'], requirements: ['id' => '\d+'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['title'],
            properties: [
                new OA\Property(property: 'title', type: 'string', example: 'Prima sarcina modificata'),
                new OA\Property(property: 'description', type: 'string', example: 'Descriere actualizata'),
                new OA\Property(property: 'priority', type: 'string', example: 'Medium'),
                new OA\Property(property: 'status', type: 'string', example: 'In Progress'),
                new OA\Property(property: 'dueDate', type: 'string', format: 'date', example: '2026-12-15'),
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Sarcina a fost modificata')]
    #[OA\Response(response: 404, description: 'Sarcina nu exista')]
    #[OA\Response(response: 400, description: 'Date invalide')]
    public function update(
        int $id,
        Request $request,
        TaskRepository $taskRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $task = $taskRepository->find($id);

        if ($task === null) {
            return $this->json(['error' => 'Sarcina nu exista.'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['error' => 'Date JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $title = trim($data['title'] ?? '');
        $priority = $data['priority'] ?? 'Medium';
        $status = $data['status'] ?? 'To Do';

        if ($title === '') {
            return $this->json(['error' => 'Titlul sarcinii este obligatoriu.'], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($priority, ['Low', 'Medium', 'High'], true)) {
            return $this->json(['error' => 'Prioritatea nu este valida.'], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($status, ['To Do', 'In Progress', 'Completed'], true)) {
            return $this->json(['error' => 'Statusul nu este valid.'], Response::HTTP_BAD_REQUEST);
        }

        $task->setTitle($title);
        $task->setDescription(trim($data['description'] ?? '') ?: null);
        $task->setPriority($priority);
        $task->setStatus($status);

        if (!empty($data['dueDate'])) {
            try {
                $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $data['dueDate']);

                if (!$date || $date->format('Y-m-d') !== $data['dueDate']) {
                    throw new \Exception();
                }

                $task->setDueDate($date);
            } catch (\Throwable) {
                return $this->json(['error' => 'Data limita trebuie sa fie in formatul YYYY-MM-DD.'], Response::HTTP_BAD_REQUEST);
            }
        } else {
            $task->setDueDate(null);
        }

        $entityManager->flush();

        return $this->json($task->toArray());
    }

    // DELETE /api/tasks/5 -> sterge o sarcina
    #[Route('/{id}', name: 'task_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    #[OA\Response(response: 204, description: 'Sarcina a fost stearsa')]
    #[OA\Response(response: 404, description: 'Sarcina nu exista')]
    public function delete(
        int $id,
        TaskRepository $taskRepository,
        EntityManagerInterface $entityManager,
    ): Response {
        $task = $taskRepository->find($id);

        if ($task === null) {
            return $this->json(['error' => 'Sarcina nu exista.'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($task);
        $entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
