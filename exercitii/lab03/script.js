// ===== Partea 1: DOM și evenimente =====

// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset');
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

  // Exercițiul 2: un mesaj diferit pentru fiecare problemă
  if (nume.length === 0) {
    eroareNume.textContent = 'Vă rugăm să completați numele.';
    inputNume.focus();
    return;
  }
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
  previzualizare.textContent = '...';
});

// ===== Partea 2: date de la un API cu fetch =====

const URL_VREME = 'https://api.open-meteo.com/v1/forecast'
  + '?latitude=46.57&longitude=26.91&current=temperature_2m,wind_speed_10m';
const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

function adaugaRand(text) {
  const li = document.createElement('li');
  li.textContent = text;
  listaVreme.append(li);
}

// Exercițiul 3: un cuvânt care descrie temperatura
function descrieTemperatura(grade) {
  if (grade < 10) return 'rece';
  if (grade <= 25) return 'plăcut';
  return 'cald';
}

async function incarcaVremea() {
  stare.textContent = 'Se încarcă…';
  listaVreme.innerHTML = '';
  btnVreme.disabled = true;
  try {
    const raspuns = await fetch(URL_VREME);
    if (!raspuns.ok) {
      throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
    }
    const date = await raspuns.json();
    const acum = date.current;
    const u = date.current_units;
    const descriere = descrieTemperatura(acum.temperature_2m);
    adaugaRand(`Temperatura: ${acum.temperature_2m} ${u.temperature_2m} (${descriere})`);
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

// Exercițiul 1: Resetează readuce titlul și golește lista vremii
btnReset.addEventListener('click', () => {
  titlu.textContent = 'Laboratorul 03';
  listaVreme.innerHTML = '';
  stare.textContent = '';
});
