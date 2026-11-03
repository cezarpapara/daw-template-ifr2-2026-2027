# Documentație Proiect: Gestiunea și Exportul Membrilor (Club / Asociație)

## 1. Descrierea generală a aplicației
Aplicația reprezintă o platformă web completă dedicată evidenței, gestionării și exportului bazei de date cu membrii unei organizații (asociație, club sportiv sau ONG). Sistemul este structurat pe trei niveluri distincte:
- **Bază de date relațională:** PostgreSQL (gestionată prin Doctrine ORM).
- **Backend & API:** PHP Symfony (oferă o arhitectură de tip REST API).
- **Frontend:** React (interfață modernă, interactivă, conectată prin apeluri asincrone `fetch`).
- **Mediu de rulare:** Containere Docker (orchestare automată a serviciilor fără dependențe locale).

---

## 2. Modelul de Date (Entitatea `Member`)

Entitatea gestionată este **`Member`**, mapată în PostgreSQL în tabelul `members` cu următoarele coloane și tipuri de date:

| Câmp | Tip de date (PostgreSQL / PHP) | Constrângeri | Descriere |
| :--- | :--- | :--- | :--- |
| **`id`** | `INTEGER` | Cheie primară, autoincrement | Identificatorul unic al membrului |
| **`nume`** | `VARCHAR(150)` | `NOT NULL` | Numele complet al persoanei |
| **`email`** | `VARCHAR(150)` | `NOT NULL` | Adresa de contact electronic |
| **`telefon`** | `VARCHAR(30)` | `NOT NULL` | Numărul de telefon |
| **`tipAbonament`** | `VARCHAR(50)` | `NOT NULL` | Categoria de membru (`Standard`, `Premium`, `VIP`) |
| **`status`** | `VARCHAR(30)` | `NOT NULL` | Starea curentă a contului (`Activ`, `Inactiv`, `Suspendat`) |

---

## 3. Arhitectura Backend-ului și API-ul REST

Backend-ul a fost dezvoltat în **PHP Symfony** utilizând controller-ul `MemberController` rutat la prefixul `/api/members`. Acesta expune următoarele endpoint-uri:

- **`GET /api/members` (Afișare / Read):**
  - Interoghează baza de date folosind `EntityManagerInterface` și metoda `findAll()`.
  - Transformă fiecare instanță `Member` într-un array asociativ prin metoda `$member->toArray()` și răspunde cu un JSON cu status HTTP `200 OK`.
- **`POST /api/members` (Adăugare / Create):**
  - Preia corpul cererii JSON (`json_decode($request->getContent(), true)`).
  - Efectuează validarea pe server: verifică dacă parametrii obligatorii (`nume`, `email`, `telefon`) sunt prezenți și ne-goi. În caz contrar, returnează un răspuns de eroare cu cod `400 Bad Request`.
  - Persistă noul obiect în PostgreSQL prin `$em->persist($member)` și `$em->flush()`, întorcând entitatea creată cu cod `201 Created`.
- **`PUT /api/members/{id}` (Modificare / Update):**
  - Caută înregistrarea după identificator (`find($id)`). Dacă nu există, întoarce `404 Not Found`.
  - Actualizează proprietățile cu noile valori transmise și salvează modificările prin `$em->flush()`.
- **`DELETE /api/members/{id}` (Ștergere / Delete):**
  - Verifică existența membrului, îl elimină prin `$em->remove($member)` și persistă ștergerea în baza de date cu `$em->flush()`.
- **`GET /api/members/export/csv` (Funcționalitatea de Export):**
  - Extrage toți membrii din tabel și construiește un fișier CSV separat prin virgulă.
  - Returnează un răspuns HTTP cu headerele specifice de descărcare (`Content-Type: text/csv`, `Content-Disposition: attachment; filename="membri_asociatie.csv"`), ceea ce declanșează descărcarea automată în browser.

---

## 4. Implementarea Interfeței cu Utilizatorul (Frontend React)

Frontend-ul este realizat sub formă de componentă React (`MembersPage.jsx`):

- **Gestionarea Stării (State Management):**
  - `members`: lista membrilor preluată prin API.
  - `formData`: valorile din formular folosite atât la creare, cât și la editare.
  - `mesaj`: notificările vizuale de confirmare (verde) sau de eroare (roșu).
- **Comunicarea cu Serverul:** Toate apelurile către API sunt efectuate asincron prin funcția standard `fetch()`.
- **Validări și Notificări:** Interfața previne transmiterea câmpurilor goale afișând avertismente clare și confirmă succesul fiecărei operațiuni.

---

## 5. Tehnologii și Unelte Folosite
- **IDE:** Visual Studio Code.
- **Controlul versiunilor:** Git & GitHub (branch personal dedicat).
- **Infrastructură:** Docker Desktop & Docker Compose (containere pentru backend, frontend și baza de date PostgreSQL).
- **Bază de date:** PostgreSQL și DBeaver pentru inspectarea tabelelor.