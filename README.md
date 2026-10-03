# DAW – Template de laborator: Symfony (backend) + React (frontend) pe Docker

Laboratorul **Dezvoltarea aplicațiilor web** · Informatică IFR, anul 2 · 2026–2027

Acest proiect conține **două aplicații separate, care comunică între ele**, exact cum se lucrează în industrie:

- **Backend** (partea de server): un API scris în **PHP Symfony**, care lucrează cu o bază de date **PostgreSQL**.
- **Frontend** (interfața din browser): o aplicație **React**, care cere date de la backend și le afișează.

Ambele rulează în **containere Docker**, deci nu trebuie să instalați PHP, Node.js sau PostgreSQL pe calculator.

```
Browser ──► Frontend React          ──► Backend Symfony (prin Nginx) ──► Baza de date PostgreSQL
            http://localhost:5173       http://localhost:8080             localhost:5432
            container: daw-react        containere: daw-nginx, daw-php    container: daw-postgres
```

---

## Cuprins

1. [Tehnologii folosite](#1-tehnologii-folosite)
2. [Contul de GitHub](#2-contul-de-github)
3. [Programele de instalat](#3-programele-de-instalat)
4. [Clonarea proiectului](#4-clonarea-proiectului)
5. [Prima pornire a backend-ului](#5-prima-pornire-a-backend-ului)
6. [Prima pornire a frontend-ului](#6-prima-pornire-a-frontend-ului)
7. [Cum lucrați de la o oră la alta](#7-cum-lucrați-de-la-o-oră-la-alta)
8. [Baza de date](#8-baza-de-date)
9. [Fișierele .env și .env.local](#9-fișierele-env-și-envlocal)
10. [API-ul: cererile de exemplu](#10-api-ul-cererile-de-exemplu)
11. [Structura proiectului](#11-structura-proiectului)
12. [Comenzi utile și probleme frecvente](#12-comenzi-utile-și-probleme-frecvente)
13. [Opțional: un proiect nou, de la zero](#13-opțional-un-proiect-nou-de-la-zero)
14. [Documentație și tutoriale](#14-documentație-și-tutoriale)

---

## 1. Tehnologii folosite

| Partea | Tehnologie | Versiune | La ce folosește |
|---|---|---|---|
| Backend | PHP | 8.5 | limbajul în care este scris backend-ul |
| Backend | Symfony | 8.1 | framework-ul PHP (rute, controllere, configurare) |
| Backend | Doctrine ORM + Migrations | 3.6 / 4.0 | lucrul cu baza de date prin clase PHP (entități) |
| Backend | NelmioApiDocBundle (Swagger) | 5 | documentația API, vizibilă în browser |
| Backend | NelmioCorsBundle | 2 | permite frontend-ului să apeleze API-ul |
| Server web | Nginx | 1.30 | primește cererile HTTP și le trimite la PHP |
| Bază de date | PostgreSQL | 18 | păstrează datele (tabele) |
| Frontend | React | 19 | biblioteca pentru interfața din browser |
| Frontend | React Router | 8 | mai multe pagini în aplicația React |
| Frontend | Vite | 8 | serverul de dezvoltare pentru React |
| Frontend | Node.js | 24 (LTS) | rulează Vite și instalează pachetele (npm) |
| Infrastructură | Docker + Docker Compose | – | rulează toate cele de mai sus în containere |
| Versionare | Git + GitHub | – | salvarea și partajarea codului |

---

## 2. Contul de GitHub

Codul îl vom ține pe **GitHub**. Faceți-vă un cont aici: https://github.com/signup

- Folosiți un **username clar, cu numele vostru**, de forma `prenume-nume` (de exemplu `ion-popescu`). GitHub nu acceptă punct în username, așa că folosiți cratimă.
- În profil (**Settings → Public profile → Name**) treceți **numele complet**, ca să știu al cui este proiectul.
- Folosiți o adresă de e-mail pe care o verificați.

---

## 3. Programele de instalat

> Instalați programele **în ordinea de mai jos**. Cu ele puteți rula tot proiectul.

### 3.1 Docker Desktop (obligatoriu)

**Ce este:** programul care pornește **containerele**. Un container este un fel de „mini-calculator” Linux, izolat, în care rulează o singură aplicație (Nginx, PHP, PostgreSQL sau React). Datorită lui, proiectul merge la fel pe orice calculator.

**Descărcare (ultima versiune):** https://www.docker.com/products/docker-desktop/
**Tutorial (ce este Docker):** https://www.youtube.com/watch?v=pTFZFxd4hOI

#### Pe Windows: WSL 2 sau Hyper-V?

Docker Desktop are nevoie de o mașină virtuală Linux și o poate porni în două feluri:

| | **Hyper-V** | **WSL 2** |
|---|---|---|
| Pe ce Windows merge | doar **Pro, Enterprise, Education** | toate, **inclusiv Home** |
| Recomandarea mea | **dacă aveți Windows Pro/Education** (eu așa am lucrat, a mers cel mai stabil) | **dacă aveți Windows Home** |

Cum aflați ce Windows aveți: **Settings → System → About → Windows specifications → Edition**.

**Pasul comun (pentru ambele variante): virtualizarea trebuie să fie activată**

1. Deschideți **Task Manager** (Ctrl + Shift + Esc) → **Performance** → **CPU**.
2. În dreapta jos trebuie să scrie **Virtualization: Enabled**.
3. Dacă scrie **Disabled**, trebuie activată din **BIOS/UEFI**: reporniți calculatorul, intrați în BIOS (de obicei tasta F2, F10, Del sau Esc la pornire, depinde de laptop) și activați opțiunea **Intel Virtualization Technology (VT-x)** sau, la procesoarele AMD, **SVM Mode / AMD-V**. Salvați și reporniți.

**Varianta A – Hyper-V (Windows Pro / Enterprise / Education)**

1. Apăsați tasta Windows și căutați **„Turn Windows features on or off”** (în română: **„Activare sau dezactivare caracteristici Windows”**).
2. Bifați **Hyper-V** (cu toate sub-opțiunile) și **Containers**, apoi **OK** și reporniți calculatorul.
3. Rulați installer-ul Docker Desktop. La ecranul **Configuration**, **DEBIFAȚI** opțiunea **„Use WSL 2 instead of Hyper-V (recommended)”**.
4. Terminați instalarea și reporniți dacă vi se cere.

**Varianta B – WSL 2 (orice Windows, inclusiv Home)**

1. Deschideți **PowerShell ca administrator** (click dreapta pe Start → **Terminal (Admin)**) și scrieți:

   ```powershell
   wsl --install
   ```

   Comanda activează WSL (Windows Subsystem for Linux) și instalează **Ubuntu**.
2. **Reporniți** calculatorul. La repornire se deschide Ubuntu și vă cere un **username** și o **parolă** (pentru Linux, le alegeți voi).
3. Verificați (tot în PowerShell):

   ```powershell
   wsl --version     # trebuie sa afiseze versiunea WSL (minim 2.1.5)
   wsl -l -v         # trebuie sa apara Ubuntu, cu VERSION 2
   wsl --update      # actualizeaza WSL, daca e nevoie
   ```

4. Rulați installer-ul Docker Desktop. La ecranul **Configuration**, **LĂSAȚI BIFAT** **„Use WSL 2 instead of Hyper-V (recommended)”**.
5. După instalare, opțional: Docker Desktop → **Settings → Resources → WSL integration** → activați **Ubuntu**.

**Pe macOS:** descărcați varianta potrivită procesorului (**Apple Silicon** sau **Intel**) și instalați normal.

**Verificare:** deschideți Docker Desktop (să scrie „Engine running”), apoi într-un terminal:

```bash
docker --version
docker compose version
```

### 3.2 Git și Git Bash (obligatoriu)

**Ce este:** Git salvează istoricul codului vostru și îl trimite pe GitHub. Pe Windows vine împreună cu **Git Bash**, un terminal în care merg comenzile din acest ghid.

**Descărcare:** https://git-scm.com/downloads
**Tutorial:** https://www.youtube.com/watch?v=8JJ101D3knE

După instalare, spuneți-i lui Git cine sunteți (o singură dată, în Git Bash):

```bash
git config --global user.name "Prenume Nume"
git config --global user.email "adresa@exemplu.com"
```

### 3.3 Visual Studio Code (obligatoriu)

**Ce este:** editorul în care scriem codul.

**Descărcare:** https://code.visualstudio.com/download

La prima deschidere a proiectului, VS Code vă va propune câteva extensii utile (Docker, PHP Intelephense, DotENV) – apăsați **Install**.

### 3.4 DBeaver Community (obligatoriu)

**Ce este:** un program cu care vedeți și modificați baza de date: tabelele, datele din ele, puteți rula interogări SQL.

**Descărcare (ultima versiune):** https://dbeaver.io/download/ (alegeți **DBeaver Community**, varianta pentru sistemul vostru)

Cum vă conectați la baza de date: vezi [secțiunea 8](#8-baza-de-date).

### 3.5 Postman (recomandat)

**Ce este:** un program cu care trimiteți cereri către API (GET, POST, DELETE…) și vedeți răspunsul, fără să scrieți cod de frontend. Foarte util ca să testați backend-ul.

**Descărcare:** https://www.postman.com/downloads/
**Tutorial:** https://www.youtube.com/watch?v=VywxIQ2ZXw4 (freeCodeCamp – Postman Beginner's Course)

În proiect aveți deja cererile de exemplu: în Postman → **Import** → alegeți fișierul `postman/DAW-API.postman_collection.json`.

---

## 4. Clonarea proiectului

„A clona” înseamnă a descărca proiectul de pe GitHub pe calculatorul vostru, împreună cu istoricul lui.

**Link template: urmează să fie adăugat.**

1. Deschideți linkul, apăsați butonul verde **Code** și copiați adresa de la **HTTPS**.
2. Faceți pe calculator un folder pentru proiecte (de exemplu `C:\proiecte`). Intrați în el, click dreapta → **Open Git Bash here**.
3. Scrieți (înlocuiți cu adresa copiată):

   ```bash
   git clone ADRESA_COPIATA
   ```

4. Deschideți **VS Code → File → Open Folder** și alegeți folderul proiectului.
5. Deschideți terminalul din VS Code: **Terminal → New Terminal**. Pe Windows, din săgeata de lângă **+** alegeți **Git Bash**.

---

## 5. Prima pornire a backend-ului

> Acești pași se fac **o singură dată** (sau când clonați proiectul pe alt calculator). Docker Desktop trebuie să fie **pornit**.

**Pasul 1 – Pornirea containerelor.** În terminalul din VS Code:

```bash
cd backend
docker compose up -d --build
```

- `up` = pornește containerele, `-d` = în fundal, `--build` = construiește imaginea de PHP.
- Prima dată durează câteva minute. La final, în Docker Desktop → **Containers** apare grupul **daw-backend** cu **daw-nginx**, **daw-php**, **daw-postgres**.

**Pasul 2 – Intrați în containerul de PHP** (în „Linux-ul” în care rulează Symfony):

```bash
docker exec -it daw-php bash
```

De acum, comenzile se rulează **în container** (promptul se schimbă în ceva de forma `root@...:/var/www/app#`).

**Pasul 3 – Instalați dependențele** (pachetele din `composer.json`, în folderul `vendor/`):

```bash
composer install
```

**Pasul 4 – Creați baza de date** (dacă nu există deja):

```bash
php bin/console doctrine:database:create --if-not-exists
```

**Pasul 5 – Rulați migrările** (creează tabelele `category` și `product` și pune câteva date de exemplu):

```bash
php bin/console doctrine:migrations:migrate
```

Confirmați cu `yes`. Apoi ieșiți din container:

```bash
exit
```

**Verificare:**

- http://localhost:8080/api/health → trebuie să vedeți `"message": "Salut din Symfony!"` și `"database": "conectata"`
- http://localhost:8080/api/doc → documentația API (Swagger): aici vedeți toate cererile și le puteți încerca din **Try it out**
- http://localhost:8080/api/products → lista de produse, în format JSON

---

## 6. Prima pornire a frontend-ului

Deschideți **un terminal nou** în VS Code (butonul **+**). Din folderul principal al proiectului:

```bash
cd frontend
docker compose up -d --build
```

**Verificare:** deschideți http://localhost:5173

- **Acasă** – caseta verde arată că frontend-ul vorbește cu backend-ul (dacă e roșie, backend-ul nu e pornit).
- **Categorii** – lista categoriilor + formular de adăugare.
- **Produse** – lista produselor, adăugare, ștergere, și pagina de detalii a unui produs.

---

## 7. Cum lucrați de la o oră la alta

1. Porniți **Docker Desktop**.
2. Porniți aplicațiile (fără `--build`):

   ```bash
   cd backend
   docker compose up -d
   cd ../frontend
   docker compose up -d
   ```

3. Scrieți cod în VS Code. Aplicațiile sunt în **modul de dezvoltare (dev)**, deci **nu trebuie refăcut build-ul** când modificați codul:
   - **backend** (`backend/app/...`): salvați fișierul și reîncărcați pagina/cererea;
   - **frontend** (`frontend/app/src/...`): salvați fișierul și browserul se actualizează singur.
4. La final, opriți containerele (datele rămân):

   ```bash
   docker compose stop      # rulat in backend si in frontend
   ```

**Când trebuie totuși `docker compose up -d --build`?** Doar dacă se modifică fișierele din folderele `docker/` (Dockerfile, configurarea Nginx, php.ini).
**Ați adăugat un pachet nou?** Backend: `docker exec -it daw-php composer require nume/pachet`. Frontend: `docker exec -it daw-react npm install nume-pachet`.

---

## 8. Baza de date

### 8.1 Unde se păstrează datele

Datele PostgreSQL se salvează în folderul **`backend/docker/postgres/data`** (un *volum* Docker montat în proiect).

- Datele **rămân** și după ce opriți (`docker compose stop`) sau ștergeți (`docker compose down`) containerele.
- Folderul este în **`.gitignore`**, deci nu se urcă pe GitHub: fiecare are baza lui de date.
- Ca să o luați de la zero: `docker compose down`, ștergeți folderul `backend/docker/postgres/data`, `docker compose up -d`, apoi refaceți pașii 4 și 5 din secțiunea 5.

### 8.2 Conectarea din DBeaver

**Database → New Database Connection → PostgreSQL → Next**, cu datele:

| Câmp | Valoare |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `daw` |
| Username | `daw` |
| Password | `daw` |

La prima conectare, DBeaver vă cere să descărcați driverul PostgreSQL – acceptați. Tabelele sunt în **daw → Schemas → public → Tables**.

### 8.3 Entități și migrări (cum adăugați o tabelă nouă)

O **entitate** este o clasă PHP care corespunde unei **tabele** (exemple: `backend/app/src/Entity/Category.php` și `Product.php`). O **migrare** este un fișier cu comenzile SQL care aduc baza de date la zi (exemple: `backend/app/migrations/`).

Toate comenzile se rulează **în containerul PHP** (`docker exec -it daw-php bash`):

```bash
# 1. creați entitatea (raspundeti la intrebari: numele, campurile, tipul lor)
php bin/console make:entity

# 2. generati migrarea (compara entitatile cu baza de date si scrie SQL-ul in migrations/)
php bin/console doctrine:migrations:diff

# 3. aplicati migrarea in baza de date
php bin/console doctrine:migrations:migrate
```

Comenzi utile:

```bash
php bin/console doctrine:migrations:status   # ce migrari au fost rulate
php bin/console debug:router                 # toate rutele (URL-urile) aplicatiei
```

---

## 9. Fișierele .env și .env.local

Ambele aplicații au un fișier **`.env`** cu setările lor (variabile de mediu):

- **`backend/app/.env`** – modul aplicației (`APP_ENV=dev`), conexiunea la baza de date (`DATABASE_URL`), ce adrese au voie să apeleze API-ul (`CORS_ALLOW_ORIGIN`);
- **`frontend/app/.env`** – adresa backend-ului (`VITE_API_URL=http://localhost:8080`).

| Fișier | Ce conține | Ajunge pe GitHub? |
|---|---|---|
| `.env` | valorile **implicite**, comune pentru toți | **da** – de aceea nu punem în el parole sau chei reale |
| `.env.local` | valorile **voastre personale** (o parolă proprie, o cheie de API, alt port) | **nu** – este în `.gitignore` |

Valorile din `.env.local` le **înlocuiesc** pe cele din `.env`. De exemplu, dacă aveți PostgreSQL pe alt port, creați `backend/app/.env.local` cu o singură linie `DATABASE_URL=...`, fără să modificați `.env`. Fișierul `.env.local` este în `.gitignore` ca să nu publicați din greșeală pe GitHub date secrete sau setări care merg doar pe calculatorul vostru.

---

## 10. API-ul: cererile de exemplu

| Metodă | Adresă | Ce face |
|---|---|---|
| GET | `/api/health` | starea backend-ului și a bazei de date |
| GET | `/api/categories` | lista categoriilor |
| POST | `/api/categories` | adaugă o categorie – corp JSON: `{"name": "Jucarii"}` |
| GET | `/api/products` | lista produselor |
| GET | `/api/products/{id}` | un produs, după id |
| POST | `/api/products` | adaugă un produs – `{"name": "Mouse", "description": "...", "price": "59.90", "categoryId": 1}` |
| DELETE | `/api/products/{id}` | șterge un produs |

Le puteți încerca în trei feluri:

1. **Swagger** (în browser): http://localhost:8080/api/doc → alegeți o cerere → **Try it out** → **Execute**.
2. **Postman**: importați `postman/DAW-API.postman_collection.json`.
3. **React**: paginile din frontend folosesc exact aceste cereri (vezi `frontend/app/src/api.js`).

---

## 11. Structura proiectului

```
daw-template-2026-2027/
├── README.md                     ← acest ghid
├── postman/                      ← cererile de exemplu pentru Postman
├── backend/                      ← APLICAȚIA 1: API Symfony
│   ├── compose.yaml              ← containerele daw-nginx, daw-php, daw-postgres
│   ├── docker/
│   │   ├── nginx/default.conf    ← configurarea serverului web
│   │   ├── php/Dockerfile        ← imaginea PHP 8.5 (extensii, Composer)
│   │   ├── php/php.ini           ← setări PHP pentru dezvoltare
│   │   └── postgres/data/        ← datele bazei de date (apare la prima pornire, nu e pe GitHub)
│   └── app/                      ← codul Symfony
│       ├── .env                  ← setările aplicației
│       ├── config/               ← configurarea framework-ului și a pachetelor
│       ├── migrations/           ← migrările bazei de date
│       └── src/
│           ├── Controller/       ← rutele API (aici scrieți endpoint-uri noi)
│           ├── Entity/           ← entitățile (tabelele)
│           └── Repository/       ← interogările către baza de date
└── frontend/                     ← APLICAȚIA 2: React
    ├── compose.yaml              ← containerul daw-react
    ├── docker/react/Dockerfile   ← imaginea Node.js 24
    └── app/                      ← codul React
        ├── .env                  ← adresa backend-ului
        └── src/
            ├── api.js            ← toate cererile către backend
            ├── App.jsx           ← meniul și rutele (paginile)
            └── pages/            ← paginile aplicației (aici adăugați pagini noi)
```

---

## 12. Comenzi utile și probleme frecvente

Rulate din folderul `backend` sau `frontend`:

```bash
docker compose ps         # ce containere ruleaza
docker compose logs -f    # mesajele containerelor (Ctrl + C pentru iesire)
docker compose stop       # opreste containerele
docker compose down       # opreste si sterge containerele (datele bazei de date raman)
```

| Problemă | Soluție |
|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop nu este pornit. Porniți-l și așteptați „Engine running”. |
| `port is already allocated` | Portul 8080, 5173 sau 5432 este ocupat de alt program (de exemplu un PostgreSQL instalat local). Opriți programul sau schimbați portul din stânga în `compose.yaml` (de ex. `"5433:5432"`). |
| `Dependencies are missing. Try running "composer install"` | Nu ați rulat `composer install` în containerul PHP (secțiunea 5, pasul 3). |
| `relation "product" does not exist` | Nu ați rulat migrările (secțiunea 5, pasul 5). |
| Pagina React arată „Backend-ul nu răspunde” | Porniți backend-ul și verificați http://localhost:8080/api/health. |
| `daw-postgres` se oprește imediat, cu o eroare de permisiuni | Se poate întâmpla pe Windows cu WSL 2. În `backend/compose.yaml` urmați instrucțiunile din comentariu: folosiți volumul Docker `daw_postgres_data` în loc de folderul din proiect. |
| Docker Desktop nu pornește pe Windows | Verificați virtualizarea (secțiunea 3.1) și, pentru WSL 2, rulați `wsl --update`. |

---

## 13. Opțional: un proiect nou, de la zero

La ore vă voi arăta și cum se creează un proiect Symfony sau React direct pe calculator, ca să înțelegeți de unde vine template-ul. Pentru asta mai trebuie instalate:

**Pentru Symfony (Windows):**

1. **PHP 8.5**: https://windows.php.net/download/ → la **PHP 8.5** alegeți **VS17 x64 Non Thread Safe → Zip**. Dezarhivați în `C:\php` (acolo veți găsi `php.exe`).
2. **Composer** (managerul de pachete PHP): https://getcomposer.org/download/ → rulați `Composer-Setup.exe`; când vă cere PHP, alegeți `C:\php\php.exe` și lăsați bifată adăugarea în **PATH**. Tutorial: https://www.youtube.com/watch?v=ZZ3vFgs810o
3. **Scoop** (instalator de programe din linia de comandă): https://scoop.sh/ (pașii sunt pe prima pagină, în PowerShell). Tutorial: https://www.youtube.com/watch?v=NbsjCSOHEYQ
4. **Symfony CLI**: https://symfony.com/download – pe Windows, după Scoop:

   ```bash
   scoop install symfony-cli
   ```

Apoi, într-un terminal deschis în folderul dorit:

```bash
symfony check:requirements      # verifica daca aveti tot ce trebuie
symfony new numele_proiectului  # creeaza un proiect Symfony nou (ultima versiune)
```

**Pentru React:**

1. **Node.js 24 (LTS)**: https://nodejs.org/en/download
2. Într-un terminal:

   ```bash
   npm create vite@latest numele_proiectului -- --template react
   cd numele_proiectului
   npm install
   npm run dev
   ```

---

## 14. Documentație și tutoriale

**Documentație oficială**

- Symfony: https://symfony.com/doc/current/index.html
- Symfony – rute: https://symfony.com/doc/current/routing.html · controllere: https://symfony.com/doc/current/controller.html
- Symfony + Doctrine (baze de date): https://symfony.com/doc/current/doctrine.html
- Migrări Doctrine: https://symfony.com/bundles/DoctrineMigrationsBundle/current/index.html
- NelmioApiDocBundle (Swagger): https://symfony.com/bundles/NelmioApiDocBundle/current/index.html
- NelmioCorsBundle: https://symfony.com/bundles/NelmioCorsBundle/current/index.html
- React: https://react.dev/learn
- React Router: https://reactrouter.com/
- Vite: https://vite.dev/guide/
- Docker: https://docs.docker.com/get-started/ · Docker Compose: https://docs.docker.com/compose/
- Docker Desktop pe Windows: https://docs.docker.com/desktop/setup/install/windows-install/
- WSL: https://learn.microsoft.com/en-us/windows/wsl/install
- PostgreSQL: https://www.postgresql.org/docs/current/
- Git: https://git-scm.com/docs · Clonarea unui repository: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
- CORS (explicație): https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS

**Tutoriale YouTube**

- Docker pentru începători: https://www.youtube.com/watch?v=pTFZFxd4hOI
- Git pentru începători: https://www.youtube.com/watch?v=8JJ101D3knE
- React – curs complet pentru începători (Dave Gray): https://www.youtube.com/watch?v=RVFAyFWO4go
- React – curs pentru începători (freeCodeCamp): https://www.youtube.com/watch?v=bMknfKXIFA8
- React în limba română (playlist): https://www.youtube.com/playlist?list=PLZuysB_DjFARX5kWZGu8hvBbmw-3VWd8w
- Postman pentru începători (freeCodeCamp): https://www.youtube.com/watch?v=VywxIQ2ZXw4
