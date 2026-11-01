
// Selectăm elementele din pagină
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');
const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

// Schimbăm tema
btnTema.addEventListener('click', () => {
  document.body.classList.toggle('intunecat');
});

// Afișăm numele în timp real
inputNume.addEventListener('input', () => {
  previzualizare.textContent = inputNume.value || '...';
});

// Validăm formularul
formular.addEventListener('submit', (event) => {
  event.preventDefault();

  const nume = inputNume.value.trim();

  if (nume.length < 3) {
    eroareNume.textContent =
      'Numele trebuie să aibă cel puțin 3 caractere.';
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
  previzualizare.textContent = '...';
});

// Adresa API-ului pentru vremea din Bacău
const URL_VREME = 'https://api.open-meteo.com/v1/forecast'
  + '?latitude=46.57&longitude=26.91'
  + '&current=temperature_2m,wind_speed_10m';

// Adăugăm un rând în lista vremii
function adaugaRand(text) {
  const li = document.createElement('li');
  li.textContent = text;
  listaVreme.append(li);
}

// Încărcăm vremea
async function incarcaVremea() {
  stare.textContent = 'Se încarcă…';
  listaVreme.innerHTML = '';
  btnVreme.disabled = true;
  btnReset.disabled = true;

  try {
    const raspuns = await fetch(URL_VREME);

    if (!raspuns.ok) {
      throw new Error(
        'Serverul a răspuns cu codul ' + raspuns.status
      );
    }

    const date = await raspuns.json();
    const acum = date.current;
    const unitati = date.current_units;
    const temperatura = acum.temperature_2m;

    let descriere;

    if (temperatura < 10) {
      descriere = 'rece';
    } else if (temperatura <= 25) {
      descriere = 'plăcut';
    } else {
      descriere = 'cald';
    }

    adaugaRand(
      `Temperatura: ${temperatura} ${unitati.temperature_2m} — ${descriere}`
    );
    adaugaRand(
      `Vântul: ${acum.wind_speed_10m} ${unitati.wind_speed_10m}`
    );
    adaugaRand(`Ora măsurătorii (GMT): ${acum.time}`);

    stare.textContent = '';
  } catch (eroare) {
    console.error(eroare);
    stare.textContent =
      'Nu am putut încărca vremea. Încercați din nou.';
  } finally {
    btnVreme.disabled = false;
    btnReset.disabled = false;
  }
}

btnVreme.addEventListener('click', incarcaVremea);

// Resetăm titlul, formularul și lista vremii
btnReset.addEventListener('click', () => {
  titlu.textContent = 'Laboratorul 03';
  formular.reset();
  previzualizare.textContent = '...';
  eroareNume.textContent = '';
  listaVreme.innerHTML = '';
  stare.textContent = '';
});
