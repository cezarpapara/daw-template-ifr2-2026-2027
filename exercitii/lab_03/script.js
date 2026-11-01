// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

// 2. Click: punem sau scoatem clasa „intunecat”
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});

// 3. Tastare: afișăm în timp real ce scrie utilizatorul
inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
});

// 4. Trimitere: validăm înainte de a folosi datele
formular.addEventListener('submit', (event) => {
    event.preventDefault(); // oprim reîncărcarea paginii
    const nume = inputNume.value.trim();

    // Verificarea originala daca numele este sub 3 caractere lungime
    if (nume.length < 3) {
        eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }

    // Verificare daca numele contine cifre
    if (/[0-9]/.test(nume)) {
        eroareNume.textContent = 'Numele nu poate contine cifre.';
        inputNume.focus();
        return;
    }

    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;
    formular.reset();
});

// 5. Utilizarea Open-Meteo API (public) pentru obtinere detalii vreme + selectie dinamica
//const URL_VREME = 'https://api.open-meteo.com/v1/forecast'
//+ '?latitude=47.16&longitude=27.57&current=temperature_2m,wind_speed_10m';
const selectOras = document.querySelector('#oras');
const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

// Etichetarea temperaturii (eg. rece, placut, cald)
function obtineEtichetaTemperatura(valoare) {
    if (valoare < 10) {
        return 'rece';
    } else if (valoare <= 25) {
        return 'plăcut';
    } else {
        return 'cald';
    }
}

async function incarcaVremea() {
    stare.textContent = 'Se încarcă…';
    listaVreme.innerHTML = '';
    btnVreme.disabled = true;

    // Preluam valoarea selectata si o impartim in lat si lon
    const [lat, lon] = selectOras.value.split(',');
    // Construim URL-ul dinamic utilizand coordonatele orasului
    const urlDinamic = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;

    try {
        const raspuns = await fetch(urlDinamic);
        if (!raspuns.ok) {
            throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
        }
        const date = await raspuns.json();
        const acum = date.current;
        const u = date.current_units;

        //Adaugare eticheta pe baza valorii temperaturii
        const valoareTemp = acum.temperature_2m;
        const eticheta = obtineEtichetaTemperatura(valoareTemp);

        //Adaugare eticheta
        adaugaRand(`Temperatura: ${valoareTemp} ${u.temperature_2m} (${eticheta})`);
        //adaugaRand(`Temperatura: ${acum.temperature_2m} ${u.temperature_2m}`);
        adaugaRand(`Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
        adaugaRand(`Ora măsurătorii (GMT): ${acum.time}`);
        stare.textContent = '';
    } catch (eroare) {
        console.error(eroare);
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    } finally {
        btnVreme.disabled = false;
    }
}
btnVreme.addEventListener('click', incarcaVremea);

// 6. Adaugare buton de "Reseteaza"
const btnReset = document.querySelector('#btn-reset');

btnReset.addEventListener('click', () => {
    // 1. Resetăm formularul (șterge inputurile)
    formular.reset();

    // 2. Resetăm previzualizarea la textul implicit
    previzualizare.textContent = '...';

    // 3. Ștergem eventualele mesaje de eroare
    eroareNume.textContent = '';

    // 4. Readucem titlul la starea inițială
    titlu.textContent = 'Aplicația Mea'; // Înlocuiește cu titlul tău inițial

    // 5. Opțional: Scoatem tema întunecată dacă era activată
    document.body.classList.remove('intunecat');

    // 6. Opțional: Ștergem datele despre vreme și starea de încărcare
    listaVreme.innerHTML = '';
    stare.textContent = '';
});