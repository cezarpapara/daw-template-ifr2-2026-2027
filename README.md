# Template de proiect – Dezvoltarea Aplicațiilor Web (IFR)

Proiect de pornire pentru laboratorul disciplinei **Dezvoltarea Aplicațiilor Web**, Informatică, frecvență redusă (IFR), anul II, Facultatea de Științe, Universitatea „Vasile Alecsandri” din Bacău, anul universitar 2026–2027.

Cadru didactic (curs, laborator, examen): Asist. univ. drd. asoc. Cezar-Marian Papară

Proiectul este format din două aplicații separate, care comunică prin API:

- **backend** – PHP Symfony, cu bază de date PostgreSQL;
- **frontend** – React.

Totul rulează în containere Docker; nu este nevoie să instalați PHP, Node.js sau PostgreSQL pe calculator.

## Pornire rapidă

```bash
git clone https://github.com/cezarpapara/daw-template-ifr2-2026-2027.git
cd daw-template-ifr2-2026-2027
git checkout -b nume.prenume
git push -u origin nume.prenume
```

Pașii pentru prima pornire a containerelor, modul de lucru cu Git și structura proiectului sunt descriși în documentul **Metodologie de lucru și template de proiect** și în îndrumarele de laborator, disponibile pe grupul Microsoft Teams al disciplinei.

## Modulul Algoritmi – Proiectarea algoritmilor

Același proiect este folosit și la laboratorul disciplinei **Proiectarea algoritmilor** (Informatică IFR, anul II). Modulul de algoritmi nu folosește baza de date și se află în:

- `backend/app/src/Algorithm/` – algoritmii (sortare, căutare), contorul de operații și generatorul de date;
- `backend/app/src/Controller/SortController.php`, `SearchController.php` – API-ul (`/api/algorithms/...`, documentat în Swagger);
- `frontend/app/src/pages/` – paginile **Sortare**, **Căutare** și **Complexitate**.

O metodă nouă de sortare se adaugă creând în `backend/app/src/Algorithm/Sort/` o clasă care implementează `SortAlgorithmInterface`; ea apare automat în API și în interfață. Toți algoritmii se verifică cu:

```bash
docker exec -it daw-php php bin/console app:algoritmi:verifica
```

Detaliile sunt în îndrumarul de laborator al disciplinei, disponibil pe grupul Microsoft Teams.
