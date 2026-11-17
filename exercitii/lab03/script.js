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

//Tot în script.js, tratați trimiterea formularului: 

// 4. Trimitere: validăm înainte de a folosi datele 

formular.addEventListener('submit', (event) => { 

  event.preventDefault(); // oprim reîncărcarea paginii 

  const nume = inputNume.value.trim(); 

  if (nume.length < 3) { 

    eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.'; 

    inputNume.focus(); 

    return; 

  } 

  if (/[0-9]/ .test(nume)){
    eroareNume.textContent = 'Numele nu poate contine cifre'
    inputNume.focus();
    return;
  }

  eroareNume.textContent = ''; 

  titlu.textContent = `Bine ai venit, ${nume}!`; 

  formular.reset(); 

}); 
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
async function incarcaVremea() {
    const selectOras = document.getElementById('oras');
    const [lat, lon] = selectOras.value.split(',');
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,wind_speed_10m&timezone=auto';

    stare.textContent = 'Se încarcă...';
    listaVreme.innerHTML = '';
    btnVreme.disabled = true;

    try {
        const raspuns = await fetch(url);
        if (!raspuns.ok) {
            throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
        }

        const date = await raspuns.json();
        const acum = date.current;
        const u = date.current_units;

        let descriere = 'plăcut';
        if (acum.temperature_2m < 10) {
            descriere = 'rece';
        } else if (acum.temperature_2m > 25) {
            descriere = 'cald';
        }

        adaugaRand('Temperatura: ' + acum.temperature_2m + ' ' + u.temperature_2m + ' (' + descriere + ')');
        adaugaRand('Vântul: ' + acum.wind_speed_10m + ' ' + u.wind_speed_10m);
        adaugaRand('Ora măsurătorii: ' + acum.time);

        stare.textContent = '';
    } catch (eroare) {
        console.error(eroare);
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    } finally {
        btnVreme.disabled = false;
    }
}

  

btnVreme.addEventListener('click', incarcaVremea); 

const btnReseteaza = document.getElementById('btnReseteaza');

btnReseteaza.addEventListener('click', function () {
  titlu.textContent = 'Laboratorul 03';
  listaVreme.innerHTML = '';
  stare.textContent = '';
});