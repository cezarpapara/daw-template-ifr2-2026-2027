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

// Județele României: numele județului, reședința și coordonatele reședinței
const JUDETE = [
  { judet: 'Alba', oras: 'Alba Iulia', lat: 46.07, lon: 23.58 },
  { judet: 'Arad', oras: 'Arad', lat: 46.18, lon: 21.31 },
  { judet: 'Argeș', oras: 'Pitești', lat: 44.86, lon: 24.87 },
  { judet: 'Bacău', oras: 'Bacău', lat: 46.57, lon: 26.91 },
  { judet: 'Bihor', oras: 'Oradea', lat: 47.07, lon: 21.92 },
  { judet: 'Bistrița-Năsăud', oras: 'Bistrița', lat: 47.13, lon: 24.49 },
  { judet: 'Botoșani', oras: 'Botoșani', lat: 47.75, lon: 26.67 },
  { judet: 'Brașov', oras: 'Brașov', lat: 45.65, lon: 25.61 },
  { judet: 'Brăila', oras: 'Brăila', lat: 45.27, lon: 27.96 },
  { judet: 'București', oras: 'București', lat: 44.43, lon: 26.10 },
  { judet: 'Buzău', oras: 'Buzău', lat: 45.15, lon: 26.82 },
  { judet: 'Caraș-Severin', oras: 'Reșița', lat: 45.30, lon: 21.89 },
  { judet: 'Călărași', oras: 'Călărași', lat: 44.20, lon: 27.33 },
  { judet: 'Cluj', oras: 'Cluj-Napoca', lat: 46.77, lon: 23.60 },
  { judet: 'Constanța', oras: 'Constanța', lat: 44.18, lon: 28.63 },
  { judet: 'Covasna', oras: 'Sfântu Gheorghe', lat: 45.86, lon: 25.79 },
  { judet: 'Dâmbovița', oras: 'Târgoviște', lat: 44.93, lon: 25.46 },
  { judet: 'Dolj', oras: 'Craiova', lat: 44.32, lon: 23.80 },
  { judet: 'Galați', oras: 'Galați', lat: 45.44, lon: 28.05 },
  { judet: 'Giurgiu', oras: 'Giurgiu', lat: 43.90, lon: 25.97 },
  { judet: 'Gorj', oras: 'Târgu Jiu', lat: 45.04, lon: 23.27 },
  { judet: 'Harghita', oras: 'Miercurea Ciuc', lat: 46.36, lon: 25.80 },
  { judet: 'Hunedoara', oras: 'Deva', lat: 45.88, lon: 22.90 },
  { judet: 'Ialomița', oras: 'Slobozia', lat: 44.56, lon: 27.37 },
  { judet: 'Iași', oras: 'Iași', lat: 47.16, lon: 27.59 },
  { judet: 'Ilfov', oras: 'Buftea', lat: 44.56, lon: 25.95 },
  { judet: 'Maramureș', oras: 'Baia Mare', lat: 47.66, lon: 23.58 },
  { judet: 'Mehedinți', oras: 'Drobeta-Turnu Severin', lat: 44.63, lon: 22.66 },
  { judet: 'Mureș', oras: 'Târgu Mureș', lat: 46.54, lon: 24.56 },
  { judet: 'Neamț', oras: 'Piatra Neamț', lat: 46.93, lon: 26.37 },
  { judet: 'Olt', oras: 'Slatina', lat: 44.43, lon: 24.37 },
  { judet: 'Prahova', oras: 'Ploiești', lat: 44.94, lon: 26.02 },
  { judet: 'Satu Mare', oras: 'Satu Mare', lat: 47.79, lon: 22.89 },
  { judet: 'Sălaj', oras: 'Zalău', lat: 47.19, lon: 23.06 },
  { judet: 'Sibiu', oras: 'Sibiu', lat: 45.79, lon: 24.15 },
  { judet: 'Suceava', oras: 'Suceava', lat: 47.65, lon: 26.26 },
  { judet: 'Teleorman', oras: 'Alexandria', lat: 43.97, lon: 25.33 },
  { judet: 'Timiș', oras: 'Timișoara', lat: 45.75, lon: 21.23 },
  { judet: 'Tulcea', oras: 'Tulcea', lat: 45.18, lon: 28.80 },
  { judet: 'Vaslui', oras: 'Vaslui', lat: 46.64, lon: 27.73 },
  { judet: 'Vâlcea', oras: 'Râmnicu Vâlcea', lat: 45.10, lon: 24.37 },
  { judet: 'Vrancea', oras: 'Focșani', lat: 45.70, lon: 27.18 },
];

// Codurile meteo WMO primite de la API → descriere și iconiță
function descrieCerul(cod) {
  if (cod === 0) return { text: 'Cer senin', icon: '☀️' };
  if (cod === 1) return { text: 'Predominant senin', icon: '🌤️' };
  if (cod === 2) return { text: 'Parțial noros', icon: '⛅' };
  if (cod === 3) return { text: 'Înnorat', icon: '☁️' };
  if (cod === 45 || cod === 48) return { text: 'Ceață', icon: '🌫️' };
  if (cod >= 51 && cod <= 57) return { text: 'Burniță', icon: '🌦️' };
  if (cod >= 61 && cod <= 67) return { text: 'Ploaie', icon: '🌧️' };
  if (cod >= 71 && cod <= 77) return { text: 'Ninsoare', icon: '🌨️' };
  if (cod >= 80 && cod <= 82) return { text: 'Averse de ploaie', icon: '🌦️' };
  if (cod === 85 || cod === 86) return { text: 'Averse de ninsoare', icon: '❄️' };
  if (cod >= 95) return { text: 'Furtună', icon: '⛈️' };
  return { text: 'Necunoscut', icon: '🌡️' };
}

const btnVreme = document.querySelector('#btn-vreme');
const selectOras = document.querySelector('#oras');
const titluVreme = document.querySelector('#titlu-vreme');
const stare = document.querySelector('#stare');
const panou = document.querySelector('#vreme-principal');
const vremeIcon = document.querySelector('#vreme-icon');
const vremeTemp = document.querySelector('#vreme-temp');
const vremeDesc = document.querySelector('#vreme-desc');
const vremeEticheta = document.querySelector('#vreme-eticheta');
const listaVreme = document.querySelector('#vreme');

// Completăm lista de județe din array, cu createElement (fără să le scriem de mână în HTML)
JUDETE.forEach((j) => {
  const option = document.createElement('option');
  option.value = `${j.lat},${j.lon}`;
  option.textContent = j.judet === j.oras ? j.judet : `${j.judet} – ${j.oras}`;
  if (j.judet === 'Bacău') option.selected = true; // implicit: Bacău, ca în laborator
  selectOras.append(option);
});

// Construim adresa API-ului pentru coordonatele alese
// (&timezone=auto = ora în fusul orar local, opționalul 5)
function construiesteUrl(lat, lon) {
  return 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${lat}&longitude=${lon}`
    + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code'
    + '&timezone=auto';
}

// Adaugă în listă un rând cu o etichetă (stânga) și o valoare (dreapta)
function adaugaRand(eticheta, valoare) {
  const li = document.createElement('li');
  const spanEticheta = document.createElement('span');
  spanEticheta.textContent = eticheta;
  const spanValoare = document.createElement('span');
  spanValoare.className = 'valoare';
  spanValoare.textContent = valoare;
  li.append(spanEticheta, spanValoare);
  listaVreme.append(li);
}

// Transformă „2026-11-03T16:15” în „03.11.2026, ora 16:15”
function formateazaOra(text) {
  const [data, ora] = text.split('T');
  const [an, luna, zi] = data.split('-');
  return `${zi}.${luna}.${an}, ora ${ora}`;
}

// Exercițiul 3: un cuvânt care descrie temperatura
function descrieTemperatura(grade) {
  if (grade < 10) return 'rece';
  if (grade <= 25) return 'plăcut';
  return 'cald';
}

// Golește rezultatele afișate
function golesteVremea() {
  panou.hidden = true;
  listaVreme.innerHTML = '';
  stare.textContent = '';
}

async function incarcaVremea() {
  const optiune = selectOras.options[selectOras.selectedIndex];
  const [lat, lon] = selectOras.value.split(',');
  const nume = optiune.textContent.split(' – ').pop(); // numele orașului
  titluVreme.textContent = `Vremea în ${nume}`;

  golesteVremea();
  stare.textContent = 'Se încarcă…';
  btnVreme.disabled = true;
  selectOras.disabled = true;
  try {
    const raspuns = await fetch(construiesteUrl(lat, lon));
    if (!raspuns.ok) {
      throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
    }
    const date = await raspuns.json();
    const acum = date.current;
    const u = date.current_units;
    const cer = descrieCerul(acum.weather_code);
    const descriere = descrieTemperatura(acum.temperature_2m);

    // Panoul principal
    vremeIcon.textContent = cer.icon;
    vremeTemp.textContent = `${Math.round(acum.temperature_2m)}${u.temperature_2m}`;
    vremeDesc.textContent = cer.text;
    vremeEticheta.textContent = descriere;
    vremeEticheta.className = `eticheta eticheta-${descriere}`;
    panou.hidden = false;

    // Detaliile, ca listă
    adaugaRand('Temperatura', `${acum.temperature_2m} ${u.temperature_2m} (${descriere})`);
    adaugaRand('Se resimte ca', `${acum.apparent_temperature} ${u.apparent_temperature}`);
    adaugaRand('Vântul', `${acum.wind_speed_10m} ${u.wind_speed_10m}`);
    adaugaRand('Umiditatea', `${acum.relative_humidity_2m} ${u.relative_humidity_2m}`);
    adaugaRand('Ora măsurătorii (ora locală)', formateazaOra(acum.time));
    stare.textContent = '';
  } catch (eroare) {
    console.error(eroare);
    stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
  } finally {
    btnVreme.disabled = false;
    selectOras.disabled = false;
  }
}

btnVreme.addEventListener('click', incarcaVremea);
// Când alegi alt județ, vremea se încarcă imediat
selectOras.addEventListener('change', incarcaVremea);

// Exercițiul 1: Resetează readuce titlul și golește vremea
btnReset.addEventListener('click', () => {
  titlu.textContent = 'Laboratorul 03';
  golesteVremea();
});
