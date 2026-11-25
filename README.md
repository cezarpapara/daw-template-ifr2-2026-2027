# TaskFlow – Aplicație web pentru gestionarea sarcinilor

## Descriere

TaskFlow este o aplicație web pentru organizarea și gestionarea sarcinilor personale. Utilizatorul poate adăuga sarcini noi, poate vizualiza lista acestora, le poate modifica și șterge.

Fiecare sarcină conține un titlu, o descriere, un nivel de prioritate, un status și o dată limită opțională.

Aplicația include și un Dashboard care afișează statistici despre sarcini și progresul celor finalizate.

## Tehnologii utilizate

- **Backend:** PHP și Symfony
- **Frontend:** React și JavaScript
- **Baza de date:** PostgreSQL
- **ORM:** Doctrine
- **Documentație API:** Swagger
- **Rulare:** Docker și Docker Compose
- **Versionare:** Git și GitHub

## Funcționalități

- Adăugarea unei sarcini noi.
- Afișarea tuturor sarcinilor.
- Modificarea informațiilor unei sarcini.
- Ștergerea unei sarcini.
- Stabilirea priorității: Low, Medium sau High.
- Stabilirea statusului: To Do, In Progress sau Completed.
- Setarea unei date limită opționale.
- Dashboard cu statistici și progresul sarcinilor.

## Structura aplicației

Proiectul este împărțit în două componente principale:

- `backend/` – conține entitățile, repository-urile, controllerele și API-ul Symfony.
- `frontend/` – conține interfața React, paginile și funcțiile pentru comunicarea cu API-ul.

## Pornirea aplicației

Aplicația rulează folosind Docker Desktop.

Din folderul principal al proiectului, se pornesc containerele:

```bash
docker compose -f backend/compose.yaml up -d
docker compose -f frontend/compose.yaml up -d
```

Interfața aplicației este disponibilă la:

http://localhost:5173

Documentația API este disponibilă la:

http://localhost:8080/api/doc

## Autor

Proiect individual realizat pentru disciplina Dezvoltarea Aplicațiilor Web, anul universitar 2026–2027.