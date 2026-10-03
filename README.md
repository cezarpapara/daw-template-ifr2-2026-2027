# DAW – Template de proiect: Symfony (backend) + React (frontend) pe Docker

Repository: https://github.com/cezarpapara/daw-template-ifr2-2026-2027

Proiectul conține **două aplicații separate, care comunică între ele**, exact cum se lucrează în industrie:

- **Backend** (partea de server): un API scris în **PHP Symfony**, care lucrează cu o bază de date **PostgreSQL**.
- **Frontend** (interfața din browser): o aplicație **React**, care cere date de la backend și le afișează.

Ghidul de mai jos este scris pas cu pas. Parcurgeți secțiunile **în ordine**, iar la comenzi uitați-vă întotdeauna la rândul **📁 Folder**, care spune de unde se rulează.

## Cuprins

- [1. Tehnologii folosite](#1-tehnologii-folosite)
- [2. Contul de GitHub](#2-contul-de-github)
- [3. Programele de instalat](#3-programele-de-instalat)
- [4. Terminalul: cum îl folosiți fără greșeli](#4-terminalul-cum-îl-folosiți-fără-greșeli)
- [5. Configurarea Git (o singură dată pe laptop)](#5-configurarea-git-o-singură-dată-pe-laptop)
- [6. Clonarea proiectului](#6-clonarea-proiectului)
- [7. Branch-ul vostru](#7-branch-ul-vostru)
- [8. Prima pornire a backend-ului](#8-prima-pornire-a-backend-ului)
- [9. Prima pornire a frontend-ului](#9-prima-pornire-a-frontend-ului)
- [10. Cum lucrați de fiecare dată](#10-cum-lucrați-de-fiecare-dată)
- [11. Aducerea actualizărilor de pe main](#11-aducerea-actualizărilor-de-pe-main)
- [12. Conflicte: ce sunt și cum le rezolvați](#12-conflicte-ce-sunt-și-cum-le-rezolvați)
- [13. Baza de date](#13-baza-de-date)
- [14. Fișierele .env și .env.local](#14-fișierele-env-și-envlocal)
- [15. API-ul: cererile de exemplu](#15-api-ul-cererile-de-exemplu)
- [16. Structura proiectului](#16-structura-proiectului)
- [17. Comenzi utile și probleme frecvente](#17-comenzi-utile-și-probleme-frecvente)
- [18. Opțional: un proiect nou, de la zero](#18-opțional-un-proiect-nou-de-la-zero)
- [19. Documentație și tutoriale](#19-documentație-și-tutoriale)

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

Cum comunică părțile între ele:

```
Browser ──► Frontend React          ──► Backend Symfony (prin Nginx) ──► Baza de date PostgreSQL
            http://localhost:5173       http://localhost:8080             localhost:5432
            container: daw-react        containere: daw-nginx, daw-php    container: daw-postgres
```

Totul rulează în **containere Docker**, deci **nu** instalați PHP, Composer, Node.js sau PostgreSQL pe calculator.

---

## 2. Contul de GitHub

Codul îl ținem pe **GitHub**. Faceți-vă un cont: https://github.com/signup

- **Username** cu numele vostru, de forma `prenume-nume` (de exemplu `ion-popescu`) sau `prenumenume`. GitHub nu acceptă punct în username, așa că folosiți cratimă.
- În profil (**Settings → Public profile → Name**) treceți **numele complet**.
- Folosiți o adresă de e-mail pe care o verificați: pe ea primiți invitația în proiect (vezi secțiunea 7.4).

---

## 3. Programele de instalat

> Instalați programele **în ordinea de mai jos**.

### 3.1 Docker Desktop (obligatoriu)

**Ce este:** programul care pornește **containerele**. Un container este un „mini-calculator” Linux, izolat, în care rulează o singură aplicație (Nginx, PHP, PostgreSQL sau React). Datorită lui, proiectul merge la fel pe orice calculator.

- **Descărcare (ultima versiune):** https://www.docker.com/products/docker-desktop/
- **Tutorial scurt:** https://www.youtube.com/watch?v=pTFZFxd4hOI (Programming with Mosh)
- **Curs complet:** https://www.youtube.com/watch?v=3c-iBn73dDE (TechWorld with Nana)

#### Pe Windows: Hyper-V sau WSL 2?

Docker Desktop are nevoie de o mașină virtuală Linux și o poate porni în două feluri:

| | **Hyper-V** | **WSL 2** |
|---|---|---|
| Pe ce Windows merge | doar **Pro, Enterprise, Education** | toate, **inclusiv Home** |
| Când îl alegeți | **dacă aveți Windows Pro / Education / Enterprise** (varianta recomandată, cea mai stabilă în practică) | **dacă aveți Windows Home** |

Ce Windows aveți: **Settings → System → About → Windows specifications → Edition**.

**Pasul comun (pentru ambele variante): virtualizarea trebuie să fie activată**

1. Deschideți **Task Manager** (Ctrl + Shift + Esc) → **Performance** → **CPU**.
2. În dreapta jos trebuie să scrie **Virtualization: Enabled**.
3. Dacă scrie **Disabled**, activați-o din **BIOS/UEFI**: reporniți calculatorul, intrați în BIOS (de obicei tasta F2, F10, Del sau Esc la pornire, depinde de laptop) și activați **Intel Virtualization Technology (VT-x)** sau, la procesoarele AMD, **SVM Mode / AMD-V**. Salvați și reporniți.

**Varianta A – Hyper-V (Windows Pro / Enterprise / Education)**

1. Apăsați tasta Windows și căutați **„Turn Windows features on or off”** (în română: **„Activare sau dezactivare caracteristici Windows”**).
2. Bifați **Hyper-V** (cu toate sub-opțiunile) și **Containers**, apoi **OK** și reporniți calculatorul.
3. Rulați installer-ul Docker Desktop. La ecranul **Configuration**, **DEBIFAȚI** opțiunea **„Use WSL 2 instead of Hyper-V (recommended)”**.
4. Terminați instalarea și reporniți dacă vi se cere.

**Varianta B – WSL 2 (orice Windows, inclusiv Home)**

1. Deschideți **PowerShell ca administrator**: click dreapta pe butonul Start → **Terminal (Admin)**.
2. Scrieți comanda de mai jos și apăsați Enter. Ea activează WSL (Windows Subsystem for Linux) și instalează **Ubuntu**:

   ```powershell
   wsl --install
   ```

3. **Reporniți** calculatorul. La repornire se deschide Ubuntu și vă cere un **username** și o **parolă** pentru Linux (le alegeți voi; la parolă nu se văd caracterele când scrieți, e normal).
4. Verificați, tot în PowerShell:

   ```powershell
   wsl --version     # versiunea WSL (minim 2.1.5)
   wsl -l -v         # trebuie sa apara Ubuntu, cu VERSION 2
   wsl --update      # actualizeaza WSL, daca e nevoie
   ```

5. Rulați installer-ul Docker Desktop. La ecranul **Configuration**, **LĂSAȚI BIFAT** **„Use WSL 2 instead of Hyper-V (recommended)”**.

**Pe macOS:** descărcați varianta potrivită procesorului (**Apple Silicon** sau **Intel**; vedeți în  → About This Mac) și instalați normal.

**Verificare:** deschideți Docker Desktop și așteptați să scrie **„Engine running”**. Apoi, într-un terminal:

```bash
docker --version
docker compose version
```

Fiecare comandă trebuie să afișeze o versiune. Dacă apare `command not found`, Docker Desktop nu e instalat sau nu e pornit.

### 3.2 Git și Git Bash (obligatoriu)

**Ce este:** Git păstrează istoricul codului (fiecare salvare se numește *commit*) și îl trimite pe GitHub. Pe Windows vine împreună cu **Git Bash**, terminalul în care rulăm comenzile din acest ghid.

- **Descărcare:** https://git-scm.com/downloads (la instalare puteți lăsa toate opțiunile implicite)
- **Tutorial:** https://www.youtube.com/watch?v=8JJ101D3knE (Programming with Mosh)
- **Tutorial în română:** https://www.youtube.com/watch?v=iVpuVkVeBcw (Marius Ciurea)

### 3.3 Editorul de cod (obligatoriu)

**Ce este:** programul în care scriem codul. Alegeți una dintre variante:

- **Visual Studio Code** (gratuit): https://code.visualstudio.com/download. La prima deschidere a proiectului vă propune câteva extensii utile (Docker, PHP Intelephense, DotENV); apăsați **Install**.
- **JetBrains** (plătite, dar **gratuite pentru studenți**): **PhpStorm** pentru backend (PHP/Symfony) și **WebStorm** pentru frontend (JavaScript/React). Licența de student se activează de aici: https://www.jetbrains.com/academy/student-pack/

### 3.4 DBeaver Community (obligatoriu)

**Ce este:** un program cu care vedeți și modificați baza de date: tabelele, datele din ele, interogările SQL.

- **Descărcare (ultima versiune):** https://dbeaver.io/download/ (alegeți **DBeaver Community**)
- **Tutorial (conectare la PostgreSQL și interogări):** https://www.youtube.com/watch?v=GgODmMBVUD4
- **Playlist oficial DBeaver (SQL):** https://www.youtube.com/playlist?list=PLkh7-EMxQiV2DAiruEWgh-i4jreuyX1rP

Cum vă conectați la baza proiectului: secțiunea 13.

### 3.5 Postman (recomandat)

**Ce este:** un program cu care trimiteți cereri către API (GET, POST, DELETE…) și vedeți răspunsul, fără să scrieți cod de frontend.

- **Descărcare:** https://www.postman.com/downloads/
- **Tutorial:** https://www.youtube.com/watch?v=VywxIQ2ZXw4 (freeCodeCamp)

În proiect aveți deja cererile de exemplu: în Postman → **Import** → fișierul `postman/DAW-API.postman_collection.json` din proiect.

---

## 4. Terminalul: cum îl folosiți fără greșeli

Aproape toate problemele de la început vin din faptul că o comandă e rulată **în alt folder** decât trebuie. Citiți secțiunea aceasta cu atenție.

### 4.1 Ce terminal folosiți

- **Windows:** **Git Bash** (instalat la pasul 3.2). Nu folosiți Command Prompt (cmd) pentru comenzile din acest ghid.
- **macOS:** aplicația **Terminal**.
- **Din editor:** terminalul din VS Code (**Terminal → New Terminal**; pe Windows alegeți **Git Bash** din săgeata de lângă **+**) sau tab-ul **Terminal** din PhpStorm / WebStorm.

### 4.2 Cum citiți rândul de comandă

În Git Bash, înainte de locul unde scrieți, apare ceva de forma:

```
ion@LAPTOP-ION MINGW64 /c/proiecte/daw-template-ifr2-2026-2027 (popescu.ion)
$
```

- `/c/proiecte/daw-template-ifr2-2026-2027` = **folderul în care sunteți acum** (adică `C:\proiecte\daw-template-ifr2-2026-2027`);
- `(popescu.ion)` = **branch-ul Git** pe care sunteți (apare doar în folderul proiectului);
- `$` = aici scrieți comanda. **Nu copiați** semnul `$` când copiați comenzi.

Pe macOS rândul arată de obicei ca `ion@MacBook daw-template-ifr2-2026-2027 %`.

### 4.3 Comenzile de orientare

```bash
pwd          # arata folderul in care sunteti
ls           # arata ce fisiere si foldere sunt aici
cd nume      # intrati in folderul "nume"
cd ..        # urcati un folder mai sus
```

### 4.4 Regula de aur

> **Toate comenzile din acest ghid (git, docker) se rulează din folderul principal al proiectului: `daw-template-ifr2-2026-2027`.**
> Singura excepție este `git clone` (secțiunea 6), care se rulează din folderul în care vreți să apară proiectul.

Cum verificați că sunteți unde trebuie:

```bash
pwd
```

trebuie să se termine cu `/daw-template-ifr2-2026-2027`, iar

```bash
ls
```

trebuie să arate: `README.md  backend  frontend  postman`.

Dacă `pwd` se termină cu `/backend` sau `/frontend`, scrieți `cd ..` ca să reveniți în folderul principal.

În acest ghid, înaintea fiecărui grup de comenzi scrie **📁 Folder:** și locul de unde se rulează.

### 4.5 Unde țineți proiectul

- **Windows:** într-un folder simplu, de exemplu `C:\proiecte`. **Nu** pe Desktop, **nu** în OneDrive și **nu** în foldere cu spații sau diacritice în nume (pot da erori la Docker).
- **macOS:** de exemplu `~/proiecte` (adică `/Users/numele-vostru/proiecte`).

---

## 5. Configurarea Git (o singură dată pe laptop)

Înainte de primul commit, Git trebuie să știe **cine sunteți** (numele și e-mailul apar la fiecare commit). Dacă sărim acest pas, primul `git commit` dă eroarea `Please tell me who you are`.

📁 **Folder:** oricare (setările sunt pentru tot laptopul). Deschideți **Git Bash** (pe Windows: Start → Git Bash; pe Mac: Terminal) și scrieți, pe rând, cu datele voastre:

```bash
git config --global user.name "Prenume Nume"
git config --global user.email "emailul-contului-de-github@exemplu.com"
git config --global pull.rebase false
```

- `user.name` – numele vostru complet, între ghilimele (de exemplu `"Ion Popescu"`);
- `user.email` – **același e-mail ca la contul de GitHub**;
- `pull.rebase false` – spune lui Git cum să combine modificările la `git pull` (ca să nu vă întrebe de fiecare dată);
- `--global` – setarea e valabilă pentru tot laptopul, deci o faceți **o singură dată**.

**Verificare:**

```bash
git config --global user.name     # trebuie sa afiseze numele vostru
git config --global user.email    # trebuie sa afiseze e-mailul vostru
git config --global --list        # toate setarile
```

Dacă ați greșit ceva, rulați din nou comanda respectivă cu valoarea corectă.

---

## 6. Clonarea proiectului

„A clona” înseamnă a descărca proiectul de pe GitHub pe calculator, împreună cu tot istoricul lui. Se face **o singură dată**.

**Pasul 1 – Creați folderul pentru proiecte și intrați în el.** Deschideți Git Bash (pe Mac: Terminal) și scrieți:

- Windows:

  ```bash
  mkdir -p /c/proiecte
  cd /c/proiecte
  ```

- macOS:

  ```bash
  mkdir -p ~/proiecte
  cd ~/proiecte
  ```

`mkdir -p` creează folderul (dacă există deja, nu se întâmplă nimic), iar `cd` vă mută în el.

**Pasul 2 – Clonați proiectul.**

📁 **Folder:** `proiecte` (NU într-un alt proiect existent).

```bash
git clone https://github.com/cezarpapara/daw-template-ifr2-2026-2027.git
```

Se creează folderul `daw-template-ifr2-2026-2027`.

**Pasul 3 – Intrați în folderul proiectului și verificați.**

```bash
cd daw-template-ifr2-2026-2027
pwd
ls
```

`pwd` trebuie să se termine cu `/proiecte/daw-template-ifr2-2026-2027`, iar `ls` trebuie să arate `README.md  backend  frontend  postman`.

**Pasul 4 – Deschideți proiectul în editor.** Deschideți **exact folderul `daw-template-ifr2-2026-2027`** (nu folderul `proiecte`, nu `backend`, nu `frontend`):

- **VS Code:** File → Open Folder → `C:\proiecte\daw-template-ifr2-2026-2027`;
- **PhpStorm / WebStorm:** File → Open → același folder.

**Pasul 5 – Deschideți terminalul din editor** (VS Code: **Terminal → New Terminal** și alegeți **Git Bash** din săgeata de lângă **+**; JetBrains: tab-ul **Terminal**). Terminalul pornește direct în folderul principal. Verificați cu `pwd`.

---

## 7. Branch-ul vostru

### 7.1 Ce este un branch și de ce îl folosim

Un **branch** (ramură) este o **copie separată a codului**, în care lucrați fără să afectați codul celorlalți. Gândiți-vă la el ca la un caiet propriu, copiat după caietul principal.

- **`main`** este branch-ul principal: aici este template-ul și aici aduce actualizări **doar administratorul proiectului**. **Nimeni altcineva nu lucrează pe `main`.**
- **Fiecare are branch-ul lui**, cu numele `nume.prenume` (de exemplu `popescu.ion`). Acolo lucrați și acolo urcați codul.

**De ce?** Toți lucrăm în același repository. Dacă toată lumea ar scrie pe `main`, modificările s-ar suprascrie una pe alta și nimeni n-ar mai avea un proiect funcțional. Cu un branch pentru fiecare, codul vostru rămâne separat, iar actualizările de pe `main` le aduceți la voi când sunt anunțate (secțiunea 11). Exact așa se lucrează și în firmele de software.

```
main            ●───●───────────●          ← doar administratorul proiectului
                     \           \
popescu.ion           ●───●───●───●───●    ← lucrul vostru (+ actualizările din main)
```

### 7.2 Creați branch-ul (o singură dată)

📁 **Folder:** `daw-template-ifr2-2026-2027`

```bash
git switch -c popescu.ion
```

**Înlocuiți `popescu.ion` cu `numele.prenumele` vostru**, cu litere mici, fără diacritice și fără spații (de exemplu `ionescu.maria`). Folosiți același nume peste tot unde în ghid apare `popescu.ion`.

`-c` = *create*: creează branch-ul nou și vă mută pe el. Verificați:

```bash
git branch --show-current
```

trebuie să afișeze numele branch-ului vostru. În Git Bash îl vedeți și în paranteză, la finalul rândului de comandă.

### 7.3 Urcați branch-ul pe GitHub (prima dată)

📁 **Folder:** `daw-template-ifr2-2026-2027`

```bash
git push -u origin popescu.ion
```

- `origin` = repository-ul de pe GitHub de unde ați clonat;
- `-u` leagă branch-ul vostru local de cel de pe GitHub; de acum înainte e suficient să scrieți doar `git push`.

La primul push, Git vă cere să vă autentificați în GitHub (se deschide o fereastră de browser). Autentificați-vă cu contul vostru.

### 7.4 Eroarea `403 Forbidden` la push

Dacă primiți ceva de forma:

```
remote: Permission to cezarpapara/daw-template-ifr2-2026-2027.git denied to ...
fatal: unable to access '...': The requested URL returned error: 403
```

înseamnă că **nu aveți încă drept de scriere** în proiect. Trimiteți administratorului proiectului **username-ul** sau **e-mailul contului de GitHub**, ca să vă adauge. Veți primi o **invitație pe e-mail** (sau în notificările GitHub, clopoțelul din dreapta sus): **trebuie să o acceptați**. Apoi rulați din nou:

```bash
git push -u origin popescu.ion
```

---

## 8. Prima pornire a backend-ului

> Acești pași se fac **o singură dată** (sau când clonați proiectul pe alt calculator). **Docker Desktop trebuie să fie pornit** („Engine running”).

**Pasul 1 – Porniți containerele backend-ului.**

📁 **Folder:** `daw-template-ifr2-2026-2027`

```bash
docker compose -f backend/compose.yaml up -d --build
```

- `-f backend/compose.yaml` = folosește fișierul de configurare al backend-ului;
- `up` = pornește containerele, `-d` = în fundal, `--build` = construiește imaginea de PHP.

Prima dată durează câteva minute (se descarcă imaginile). Verificați că rulează:

```bash
docker compose -f backend/compose.yaml ps
```

Trebuie să apară **daw-nginx**, **daw-php** și **daw-postgres**, cu starea `Up` (la postgres și `healthy`). Le vedeți și în Docker Desktop → **Containers** → grupul **daw-backend**.

**Pasul 2 – Instalați dependențele PHP** (pachetele din `composer.json`, în folderul `backend/app/vendor`):

```bash
docker exec -it daw-php composer install
```

`docker exec -it daw-php ...` înseamnă „rulează comanda **în containerul daw-php**”, acolo unde sunt instalate PHP și Composer. **Nu** rulați `composer` sau `php` direct, fără `docker exec`: pe calculatorul vostru nu sunt instalate.

**Pasul 3 – Creați baza de date** (dacă nu există deja):

```bash
docker exec -it daw-php php bin/console doctrine:database:create --if-not-exists
```

**Pasul 4 – Rulați migrările.** Creează tabelele `category` și `product` și pune câteva date de exemplu. La întrebare scrieți `yes` și apăsați Enter:

```bash
docker exec -it daw-php php bin/console doctrine:migrations:migrate
```

**Verificare (în browser):**

- http://localhost:8080/api/health → trebuie să vedeți `"message": "Salut din Symfony!"` și `"database": "conectata"`
- http://localhost:8080/api/doc → documentația API (Swagger): aici vedeți toate cererile și le puteți încerca din **Try it out**
- http://localhost:8080/api/products → lista de produse, în format JSON

---

## 9. Prima pornire a frontend-ului

📁 **Folder:** `daw-template-ifr2-2026-2027`

```bash
docker compose -f frontend/compose.yaml up -d --build
```

Prima pornire durează 1–2 minute (se instalează pachetele npm). Ca să vedeți când e gata:

```bash
docker compose -f frontend/compose.yaml logs -f
```

Când apare `VITE ... ready` și `Local: http://localhost:5173/`, apăsați **Ctrl + C** ca să ieșiți din afișarea mesajelor (containerul rămâne pornit).

**Verificare:** deschideți http://localhost:5173

- **Acasă** – caseta verde arată că frontend-ul comunică cu backend-ul (dacă e roșie, backend-ul nu e pornit);
- **Categorii** – lista categoriilor + formular de adăugare;
- **Produse** – lista produselor, adăugare, ștergere și pagina de detalii a unui produs.

---

## 10. Cum lucrați de fiecare dată

**Pasul 1 – Porniți Docker Desktop** și așteptați „Engine running”.

**Pasul 2 – Deschideți proiectul în editor** (folderul `daw-template-ifr2-2026-2027`) și terminalul din editor. Verificați cu `pwd`.

**Pasul 3 – Verificați că sunteți pe branch-ul vostru:**

📁 **Folder:** `daw-template-ifr2-2026-2027`

```bash
git branch --show-current
```

Dacă afișează `main`, mutați-vă pe branch-ul vostru: `git switch popescu.ion`.

**Pasul 4 – Porniți aplicațiile** (fără `--build`):

```bash
docker compose -f backend/compose.yaml up -d
docker compose -f frontend/compose.yaml up -d
```

**Pasul 5 – Scrieți cod.** Aplicațiile sunt în **modul de dezvoltare (dev)**, deci **nu trebuie refăcut build-ul** când modificați codul:

- **backend** (fișierele din `backend/app/`): salvați fișierul și reîncărcați pagina sau cererea;
- **frontend** (fișierele din `frontend/app/src/`): salvați fișierul și browserul se actualizează singur.

`--build` e necesar doar dacă se modifică fișierele din folderele `backend/docker/` sau `frontend/docker/`.

**Pasul 6 – Salvați modificările în Git (commit) și urcați-le pe GitHub (push).**

📁 **Folder:** `daw-template-ifr2-2026-2027`

```bash
git status
```

Vă arată pe ce branch sunteți (trebuie să scrie `On branch popescu.ion`) și ce fișiere ați modificat (cu roșu). Apoi:

```bash
git add .
git commit -m "Adaug pagina de contact"
git push
```

- `git add .` – pregătește **toate** fișierele modificate pentru commit (punctul înseamnă „tot din folderul curent”, de aceea contează să fiți în folderul principal);
- `git commit -m "..."` – salvează o versiune, cu un mesaj scurt care spune **ce ați făcut**;
- `git push` – urcă commit-urile pe GitHub, pe branch-ul vostru.

Faceți commit des, după fiecare lucru terminat (o pagină, un endpoint, o entitate).

**Pasul 7 – La final, opriți containerele** (datele rămân):

```bash
docker compose -f backend/compose.yaml stop
docker compose -f frontend/compose.yaml stop
```

**Ați adăugat un pachet nou?**

- backend: `docker exec -it daw-php composer require nume/pachet`
- frontend: `docker exec -it daw-react npm install nume-pachet`

---

## 11. Aducerea actualizărilor de pe main

Când administratorul proiectului anunță că a urcat ceva nou pe `main`, aduceți modificările pe branch-ul vostru așa. Toți pașii se rulează din același loc:

📁 **Folder:** `daw-template-ifr2-2026-2027`

**Pasul 1 – Salvați sau anulați ce aveți nesalvat.**

```bash
git status
```

Dacă apar fișiere modificate, aveți două variante:

- **le păstrați (recomandat)** – faceți commit:

  ```bash
  git add .
  git commit -m "Ce am lucrat pana acum"
  git push
  ```

- **le anulați** (modificările nesalvate se pierd!):

  ```bash
  git reset --hard
  ```

  `git reset --hard` readuce fișierele existente la ultimul commit. Fișierele **noi** create de voi rămân; dacă vreți să le ștergeți și pe ele, rulați `git clean -fd` (atenție, le șterge definitiv).

Rulați din nou `git status`: trebuie să afișeze `nothing to commit, working tree clean`.

**Pasul 2 – Mergeți pe `main` și aduceți codul nou:**

```bash
git switch main
git pull origin main
```

**Pasul 3 – Reveniți pe branch-ul vostru și combinați (merge) `main` în el:**

```bash
git switch popescu.ion
git merge main --no-edit
```

`--no-edit` folosește mesajul automat pentru commit-ul de merge (altfel se deschide un editor de text în terminal). Dacă apar conflicte, mergeți la secțiunea 12.

**Pasul 4 – Urcați rezultatul:**

```bash
git push
```

**Pasul 5 – Dacă s-au schimbat dependențele sau baza de date**, rulați și:

```bash
docker exec -it daw-php composer install
docker exec -it daw-php php bin/console doctrine:migrations:migrate
docker compose -f frontend/compose.yaml restart
```

---

## 12. Conflicte: ce sunt și cum le rezolvați

Un **conflict** apare când Git nu poate combina singur două versiuni: de obicei când **aceeași linie** din același fișier a fost modificată și pe `main`, și pe branch-ul vostru. Git nu știe care variantă e cea bună, așa că vă întreabă pe voi.

**Nu vă speriați:** nu se pierde nimic. Dacă vreți să renunțați la merge și să reveniți la cum era înainte:

📁 **Folder:** `daw-template-ifr2-2026-2027` (pentru toate comenzile din această secțiune)

```bash
git merge --abort
```

### Scenariul 1: aceeași linie modificată în ambele părți (cel mai des)

La `git merge main` primiți:

```
CONFLICT (content): Merge conflict in frontend/app/src/pages/HomePage.jsx
Automatic merge failed; fix conflicts and then commit the result.
```

În fișier, Git a marcat zona cu probleme:

```
<<<<<<< HEAD
      <h1>Magazinul lui Ion</h1>
=======
      <h1>Aplicatie DAW - versiunea 2</h1>
>>>>>>> main
```

- între `<<<<<<< HEAD` și `=======` este **varianta voastră** (de pe branch-ul vostru);
- între `=======` și `>>>>>>> main` este **varianta de pe main**.

**Rezolvare:**

1. Deschideți fișierul în editor. VS Code și JetBrains vă arată butoane: **Accept Current Change** (a voastră), **Accept Incoming Change** (de pe main), **Accept Both Changes** (ambele). Sau editați manual.
2. Lăsați codul corect și **ștergeți toate liniile cu `<<<<<<<`, `=======`, `>>>>>>>`**.
3. Salvați fișierul, apoi:

   ```bash
   git add .
   git commit --no-edit
   git push
   ```

`git status` vă arată oricând ce fișiere mai au conflicte (apar ca `both modified`).

### Scenariul 2: „Your local changes would be overwritten”

La `git switch main` sau `git merge main` primiți:

```
error: Your local changes to the following files would be overwritten by checkout:
        backend/app/src/Controller/ProductController.php
Please commit your changes or stash them before you switch branches.
```

**Cauza:** aveți modificări nesalvate. **Rezolvare:** faceți commit (sau anulați-le cu `git reset --hard`), exact ca la Pasul 1 din secțiunea 11, apoi reluați comanda.

### Scenariul 3: conflict în `package-lock.json` sau `composer.lock`

Aceste fișiere sunt generate automat de npm și Composer, deci **nu le rezolvați de mână**. Păstrați versiunea de pe `main` și reinstalați:

- frontend:

  ```bash
  git checkout --theirs frontend/app/package-lock.json
  git add .
  git commit --no-edit
  docker compose -f frontend/compose.yaml restart
  ```

- backend:

  ```bash
  git checkout --theirs backend/app/composer.lock
  git add .
  git commit --no-edit
  docker exec -it daw-php composer install
  ```

(în timpul unui `git merge main`, `--theirs` înseamnă versiunea de pe `main`)

### Scenariul 4: fișier șters într-o parte și modificat în cealaltă

```
CONFLICT (modify/delete): ... deleted in main and modified in HEAD.
```

Decideți dacă fișierul rămâne sau nu:

- **îl păstrați:** `git add calea/catre/fisier`
- **îl ștergeți:** `git rm calea/catre/fisier`

apoi `git commit --no-edit` și `git push`. Calea fișierului o copiați exact din mesajul de eroare.

### Scenariul 5: ați lucrat din greșeală pe `main`

Dacă `git status` arată `On branch main`:

- **dacă NU ați făcut commit** (doar ați modificat fișiere): mutați-vă pe branch-ul vostru cu tot cu modificări, apoi faceți commit acolo:

  ```bash
  git switch popescu.ion
  ```

- **dacă ați făcut deja commit pe `main`**: mutați munca pe branch-ul vostru și readuceți `main` la versiunea de pe GitHub:

  ```bash
  git switch -c popescu.ion-salvare
  git switch main
  git reset --hard origin/main
  git switch popescu.ion
  git merge popescu.ion-salvare --no-edit
  git push
  ```

### Scenariul 6: s-a deschis un editor ciudat în terminal

Dacă ați uitat `--no-edit`, Git poate deschide editorul **Vim** pentru mesajul de commit. Ca să ieșiți și să păstrați mesajul automat, tastați `:wq` și apăsați **Enter**.

---

## 13. Baza de date

### 13.1 Unde se păstrează datele

Datele PostgreSQL se salvează în folderul **`backend/docker/postgres/data`** (un *volum* Docker montat în proiect).

- Datele **rămân** și după ce opriți (`stop`) sau ștergeți (`down`) containerele.
- Folderul este în **`.gitignore`**, deci nu se urcă pe GitHub: fiecare are baza lui de date.

**Ca să o luați de la zero** (șterge toate datele!):

📁 **Folder:** `daw-template-ifr2-2026-2027`

```bash
docker compose -f backend/compose.yaml down
rm -rf backend/docker/postgres/data
docker compose -f backend/compose.yaml up -d
docker exec -it daw-php php bin/console doctrine:database:create --if-not-exists
docker exec -it daw-php php bin/console doctrine:migrations:migrate
```

(`rm -rf` șterge definitiv folderul; puteți să-l ștergeți și din Explorer / Finder)

### 13.2 Conectarea din DBeaver

**Database → New Database Connection → PostgreSQL → Next**, cu datele:

| Câmp | Valoare |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `daw` |
| Username | `daw` |
| Password | `daw` |

La prima conectare, DBeaver vă cere să descărcați driverul PostgreSQL; acceptați. Tabelele sunt în **daw → Schemas → public → Tables**. Backend-ul trebuie să fie pornit.

### 13.3 Entități și migrări (cum adăugați o tabelă nouă)

O **entitate** este o clasă PHP care corespunde unei **tabele** (exemple: `backend/app/src/Entity/Category.php` și `Product.php`). O **migrare** este un fișier cu comenzile SQL care aduc baza de date la zi (exemple în `backend/app/migrations/`).

📁 **Folder:** `daw-template-ifr2-2026-2027`

```bash
# 1. creati entitatea (raspundeti la intrebari: numele, campurile, tipul lor)
docker exec -it daw-php php bin/console make:entity

# 2. generati migrarea (compara entitatile cu baza de date si scrie SQL-ul in migrations/)
docker exec -it daw-php php bin/console doctrine:migrations:diff

# 3. aplicati migrarea in baza de date
docker exec -it daw-php php bin/console doctrine:migrations:migrate
```

Comenzi utile:

```bash
docker exec -it daw-php php bin/console doctrine:migrations:status   # ce migrari au fost rulate
docker exec -it daw-php php bin/console debug:router                 # toate rutele (URL-urile) aplicatiei
```

**Opțional – lucrul direct în container.** Dacă aveți de rulat multe comenzi, puteți intra în container o dată, cu `docker exec -it daw-php bash`. Rândul de comandă devine `root@...:/var/www/app#` și puteți scrie direct `php bin/console ...`. Ieșiți cu `exit`. **Atenție:** comenzile `git` nu se rulează în container, ci după `exit`, în folderul principal.

---

## 14. Fișierele .env și .env.local

Ambele aplicații au un fișier **`.env`** cu setările lor (variabile de mediu):

- **`backend/app/.env`** – modul aplicației (`APP_ENV=dev`), conexiunea la baza de date (`DATABASE_URL`), ce adrese au voie să apeleze API-ul (`CORS_ALLOW_ORIGIN`);
- **`frontend/app/.env`** – adresa backend-ului (`VITE_API_URL=http://localhost:8080`).

| Fișier | Ce conține | Ajunge pe GitHub? |
|---|---|---|
| `.env` | valorile **implicite**, comune pentru toți | **da**, de aceea nu punem în el parole sau chei reale |
| `.env.local` | valorile **voastre personale** (o parolă proprie, o cheie de API, alt port) | **nu**, este în `.gitignore` |

Valorile din `.env.local` le **înlocuiesc** pe cele din `.env`. De exemplu, dacă aveți PostgreSQL pe alt port, creați fișierul `backend/app/.env.local` cu o singură linie `DATABASE_URL=...`, fără să modificați `.env`. Fișierul `.env.local` este în `.gitignore` ca să nu publicați din greșeală pe GitHub date secrete sau setări care merg doar pe calculatorul vostru.

---

## 15. API-ul: cererile de exemplu

| Metodă | Adresă | Ce face |
|---|---|---|
| GET | `/api/health` | starea backend-ului și a bazei de date |
| GET | `/api/categories` | lista categoriilor |
| POST | `/api/categories` | adaugă o categorie – corp JSON: `{"name": "Jucarii"}` |
| GET | `/api/products` | lista produselor |
| GET | `/api/products/{id}` | un produs, după id |
| POST | `/api/products` | adaugă un produs – `{"name": "Mouse", "description": "...", "price": "59.90", "categoryId": 1}` |
| DELETE | `/api/products/{id}` | șterge un produs |

Toate adresele încep cu `http://localhost:8080` (de exemplu http://localhost:8080/api/products). Le puteți încerca în trei feluri:

1. **Swagger** (în browser): http://localhost:8080/api/doc → alegeți o cerere → **Try it out** → **Execute**.
2. **Postman**: importați `postman/DAW-API.postman_collection.json`.
3. **React**: paginile din frontend folosesc exact aceste cereri (vezi `frontend/app/src/api.js`).

---

## 16. Structura proiectului

```
daw-template-ifr2-2026-2027/      ← FOLDERUL PRINCIPAL (de aici rulați comenzile)
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

## 17. Comenzi utile și probleme frecvente

📁 **Folder:** `daw-template-ifr2-2026-2027`

**Docker:**

```bash
docker compose -f backend/compose.yaml ps        # ce containere de backend ruleaza
docker compose -f backend/compose.yaml logs -f   # mesajele backend-ului (Ctrl + C pentru iesire)
docker compose -f frontend/compose.yaml logs -f  # mesajele frontend-ului (Ctrl + C pentru iesire)
docker compose -f backend/compose.yaml stop      # opreste backend-ul
docker compose -f backend/compose.yaml down      # opreste si sterge containerele (datele raman)
```

**Git:**

```bash
git status                  # ce s-a modificat si pe ce branch sunteti
git branch --show-current   # branch-ul curent
git log --oneline -10       # ultimele 10 commit-uri
git switch popescu.ion      # mutare pe branch-ul vostru
```

| Problemă | Cauza și soluția |
|---|---|
| `fatal: not a git repository` | Nu sunteți în folderul proiectului. Verificați cu `pwd` și mergeți în `daw-template-ifr2-2026-2027` (secțiunea 4.4). |
| `no configuration file provided: not found` sau `open backend/compose.yaml: no such file` | Comanda `docker compose` nu e rulată din folderul principal. Verificați cu `pwd` și `ls`. |
| `bash: cd: backend: No such file or directory` | Sunteți deja în alt folder (de exemplu deja în `backend`). Verificați cu `pwd`. |
| `bash: composer: command not found` sau `php: command not found` | Ați rulat comanda direct pe calculator. Folosiți `docker exec -it daw-php composer ...` / `docker exec -it daw-php php ...`. |
| `the input device is not a TTY` (Git Bash pe Windows) | Rulați comenzile din terminalul VS Code / JetBrains sau puneți `winpty` în față: `winpty docker exec -it daw-php ...`. |
| `Cannot connect to the Docker daemon` | Docker Desktop nu este pornit. Porniți-l și așteptați „Engine running”. |
| `Error response from daemon: No such container: daw-php` | Backend-ul nu e pornit. Rulați `docker compose -f backend/compose.yaml up -d`. |
| `port is already allocated` | Portul 8080, 5173 sau 5432 este ocupat de alt program (de exemplu un PostgreSQL instalat local). Opriți programul sau schimbați portul din stânga în `compose.yaml` (de ex. `"5433:5432"`). |
| `Dependencies are missing. Try running "composer install"` | Nu ați rulat `composer install` (secțiunea 8, pasul 2). |
| `relation "product" does not exist` | Nu ați rulat migrările (secțiunea 8, pasul 4). |
| Pagina React arată „Backend-ul nu răspunde” | Porniți backend-ul și verificați http://localhost:8080/api/health. |
| `daw-postgres` se oprește imediat, cu o eroare de permisiuni | Se poate întâmpla pe Windows cu WSL 2. În `backend/compose.yaml` urmați instrucțiunile din comentariu: folosiți volumul Docker `daw_postgres_data` în loc de folderul din proiect. |
| Docker Desktop nu pornește pe Windows | Verificați virtualizarea (secțiunea 3.1) și, pentru WSL 2, rulați `wsl --update`. |
| `Please tell me who you are` la commit | Nu ați configurat Git (secțiunea 5). |
| `403` la `git push` | Nu aveți încă acces în proiect (secțiunea 7.4). |
| `fatal: destination path 'daw-template-ifr2-2026-2027' already exists` | Ați clonat deja proiectul în acest folder. Intrați în el cu `cd daw-template-ifr2-2026-2027`, nu îl clonați din nou. |
| `error: src refspec popescu.ion does not match any` | Branch-ul nu există sau ați scris alt nume. Verificați cu `git branch` și creați-l cu `git switch -c popescu.ion`. |

---

## 18. Opțional: un proiect nou, de la zero

Pentru cine vrea să creeze un proiect Symfony sau React direct pe calculator (fără template), mai trebuie instalate:

**Pentru Symfony (Windows):**

1. **PHP 8.5**: https://windows.php.net/download/ → la **PHP 8.5** alegeți **VS17 x64 Non Thread Safe → Zip**. Dezarhivați în `C:\php` (acolo veți găsi `php.exe`).
2. **Composer** (managerul de pachete PHP): https://getcomposer.org/download/ → rulați `Composer-Setup.exe`; când vă cere PHP, alegeți `C:\php\php.exe` și lăsați bifată adăugarea în **PATH**. Tutorial: https://www.youtube.com/watch?v=ZZ3vFgs810o
3. **Scoop** (instalator de programe din linia de comandă): https://scoop.sh/ (pașii sunt pe prima pagină, în PowerShell). Tutorial: https://www.youtube.com/watch?v=NbsjCSOHEYQ
4. **Symfony CLI**: https://symfony.com/download – pe Windows, după Scoop:

   ```bash
   scoop install symfony-cli
   ```

Apoi, într-un terminal deschis în folderul `proiecte`:

```bash
symfony check:requirements      # verifica daca aveti tot ce trebuie
symfony new numele_proiectului  # creeaza un proiect Symfony nou (ultima versiune)
```

**Pentru React:**

1. **Node.js 24 (LTS)**: https://nodejs.org/en/download
2. Într-un terminal deschis în folderul `proiecte`:

   ```bash
   npm create vite@latest numele_proiectului -- --template react
   cd numele_proiectului
   npm install
   npm run dev
   ```

---

## 19. Documentație și tutoriale

**Tutoriale YouTube**

| Subiect | Tutorial |
|---|---|
| Symfony – curs complet (freeCodeCamp; Symfony 5, dar conceptele sunt aceleași) | https://www.youtube.com/watch?v=Bo0guUbL5uo |
| Symfony 7 – instalare și primii pași (Coding with TD) | https://www.youtube.com/watch?v=plGR_OPZwuQ |
| React – curs complet pentru începători (Dave Gray) | https://www.youtube.com/watch?v=RVFAyFWO4go |
| React – curs pentru începători (freeCodeCamp) | https://www.youtube.com/watch?v=bMknfKXIFA8 |
| React în limba română (playlist) | https://www.youtube.com/playlist?list=PLZuysB_DjFARX5kWZGu8hvBbmw-3VWd8w |
| Docker pentru începători (Programming with Mosh) | https://www.youtube.com/watch?v=pTFZFxd4hOI |
| Docker – curs complet (TechWorld with Nana) | https://www.youtube.com/watch?v=3c-iBn73dDE |
| Docker Compose (TechWorld with Nana) | https://www.youtube.com/watch?v=SXwC9fSwct8 |
| Git pentru începători (Programming with Mosh) | https://www.youtube.com/watch?v=8JJ101D3knE |
| Git & GitHub – curs 2026 (freeCodeCamp) | https://www.youtube.com/watch?v=mAFoROnOfHs |
| Git în limba română (Marius Ciurea) | https://www.youtube.com/watch?v=iVpuVkVeBcw |
| Pull Request-uri pe GitHub, pentru începători (ExamPro) | https://www.youtube.com/watch?v=gBIPCZ0abQY |
| DBeaver – conectare la PostgreSQL și interogări | https://www.youtube.com/watch?v=GgODmMBVUD4 |
| DBeaver – playlist oficial (SQL) | https://www.youtube.com/playlist?list=PLkh7-EMxQiV2DAiruEWgh-i4jreuyX1rP |
| Postman pentru începători (freeCodeCamp) | https://www.youtube.com/watch?v=VywxIQ2ZXw4 |

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
- Git: https://git-scm.com/docs
- GitHub – branch-uri: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches
- GitHub – clonarea unui repository: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
- CORS (explicație): https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
