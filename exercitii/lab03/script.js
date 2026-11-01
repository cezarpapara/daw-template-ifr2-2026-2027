
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset'); 
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

const selectOras = document.querySelector('#oras'); 
const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});

inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
});

// 4. Validare și trimitere formular 
formular.addEventListener('submit', (event) => {
    event.preventDefault();
    const nume = inputNume.value.trim();

    if (nume.length < 3) {
        eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }

    if (/[0-9]/.test(nume)) {
        eroareNume.textContent = 'Numele nu poate conține cifre.';
        inputNume.focus();
        return;
    }

    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;
    formular.reset();
});

btnReset.addEventListener('click', () => {
    titlu.textContent = 'Laboratorul 03';
    listaVreme.innerHTML = '';
    stare.textContent = '';
    eroareNume.textContent = '';
    previzualizare.textContent = '...';
    formular.reset();
});

// Funcții ajutătoare pentru vreme
function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

// Calificativ temperatură
function determinaSenzatieTermica(temperatura) {
    if (temperatura < 10) return 'rece';
    if (temperatura <= 25) return 'plăcut';
    return 'cald';
}

// Încărcarea vremii 
async function incarcaVremea() {
    stare.textContent = 'Se încarcă...';
    listaVreme.innerHTML = '';
    btnVreme.disabled = true;

    //  obținem coordonatele din meniul selectat
    const [lat, lon] = selectOras.value.split(',');

    //  adăugăm parametrul &timezone=auto
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&timezone=auto`;

    try {
        const raspuns = await fetch(url);
        if (!raspuns.ok) {
            throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
        }

        const date = await raspuns.json();
        const acum = date.current;
        const u = date.current_units;

        const descriere = determinaSenzatieTermica(acum.temperature_2m);

        adaugaRand(`Temperatura: ${acum.temperature_2m} ${u.temperature_2m} (${descriere})`);
        adaugaRand(`Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
        adaugaRand(`Ora măsurătorii (locală): ${acum.time}`); 

        stare.textContent = '';
    } catch (eroare) {
        console.error(eroare);
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    } finally {
        btnVreme.disabled = false;
    }
}

btnVreme.addEventListener('click', incarcaVremea);