// Functii ajutatoare pentru paginile de algoritmi

// "5, 1, 4 2;8" -> [5, 1, 4, 2, 8]  (accepta virgula, spatiu sau punct si virgula ca separator)
export function parseNumbers(text) {
  const parts = text.split(/[\s,;]+/).filter((part) => part !== '')
  const numbers = parts.map(Number)
  if (numbers.some((value) => Number.isNaN(value))) {
    throw new Error('Scrieti doar numere, separate prin virgula sau spatiu.')
  }
  return numbers
}

// Un vector de n numere intregi aleatoare intre 0 si max
export function randomArray(n, max = 99) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * (max + 1)))
}

// Formateaza numerele mari cu separator de mii: 1234567 -> "1.234.567"
export function formatNumber(value) {
  return new Intl.NumberFormat('ro-RO').format(value)
}

// Culorile folosite pentru fiecare rol al unei pozitii din vector (aceleasi si in indrumar)
export const ROLE_COLORS = {
  compare: '#f0b429', // galben: elementele comparate acum
  swap: '#e12d39',    // rosu: elementele tocmai interschimbate
  write: '#9446ed',   // mov: pozitie scrisa (de exemplu la interclasare)
  pivot: '#d64545',   // rosu inchis: pivotul (Quick Sort)
  range: '#7cc4fa',   // albastru deschis: secventa / intervalul curent
  found: '#3ebd93',   // verde: elementul gasit
  sorted: '#57ae5b',  // verde: elemente aflate deja la locul lor
  default: '#9fb3c8', // gri-albastru: restul elementelor
}

// Ordinea de prioritate: daca o pozitie are mai multe roluri, castiga primul din lista
const ROLE_PRIORITY = ['swap', 'pivot', 'found', 'compare', 'write', 'sorted', 'range']

export function roleOf(index, highlight = {}) {
  for (const role of ROLE_PRIORITY) {
    if ((highlight[role] ?? []).includes(index)) {
      return role
    }
  }
  return 'default'
}
