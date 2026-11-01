
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

// Schimbăm tema când apăsăm pe buton
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});

// Afișăm numele pe măsură ce îl scriem
inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
});


formular.addEventListener('submit', (event) => {
    event.preventDefault();

    const nume = inputNume.value.trim();

    if (nume.length < 3) {
        eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
        return;
    }

    if (/[0-9]/.test(nume)) {
        eroareNume.textContent = 'Numele nu poate conține cifre.';
        return;
    }

    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;
});


const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const vreme = document.querySelector('#vreme');

btnVreme.addEventListener('click', async () => {
    stare.textContent = 'Se încarcă vremea...';
    vreme.innerHTML = '';

    try {
        const raspuns = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=46.57&longitude=26.91&current=temperature_2m,relative_humidity_2m,wind_speed_10m'
        );

        if (!raspuns.ok) {
            throw new Error('Nu s-au putut obține datele.');
        }

        const date = await raspuns.json();
        const valori = date.current;

        let descriere;

        if (valori.temperature_2m < 10) {
            descriere = 'rece';
        } else if (valori.temperature_2m < 25) {
            descriere = 'plăcută';
        } else {
            descriere = 'caldă';
        }

        stare.textContent = 'Datele au fost încărcate!';
        vreme.innerHTML = `
      <li>Temperatura: ${valori.temperature_2m} °C</li>
      <li>Vremea este ${descriere}.</li>
      <li>Umiditatea: ${valori.relative_humidity_2m}%</li>
      <li>Viteza vântului: ${valori.wind_speed_10m} km/h</li>
    `;
    } catch (eroare) {
        stare.textContent = 'Eroare la încărcarea vremii.';
        console.error(eroare);
    }
});

const btnReset = document.querySelector('#btn-reset');

btnReset.addEventListener('click', () => {
    document.body.classList.remove('intunecat');
});
