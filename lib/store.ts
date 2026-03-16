// Simple localStorage store for persisting reto data

export interface Comida {
  id: string;
  momento: string;
  nombre: string;
  kcal: number;
  notas?: string;
  fotoUrl?: string;
  hora: string;
}

export interface DiaDatos {
  dia: number;
  fecha: string;
  pasos: number | null;
  gym: boolean | null;
  peso: number | null;
  comidas: Comida[];
  completo: boolean;
}

export interface RetoData {
  inicio: string;
  pesoInicial: number;
  objetivoKcal: number;
  tdee: number;
  dias: DiaDatos[];
}

const KEY = 'reto30_data';

export function getRetoData(): RetoData {
  if (typeof window === 'undefined') return defaultData();
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const d = defaultData();
    saveRetoData(d);
    return d;
  }
  return JSON.parse(raw);
}

export function saveRetoData(data: RetoData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function updateDia(dia: number, updates: Partial<DiaDatos>) {
  const data = getRetoData();
  const idx = data.dias.findIndex(d => d.dia === dia);
  if (idx >= 0) {
    data.dias[idx] = { ...data.dias[idx], ...updates };
    const d = data.dias[idx];
    d.completo = d.pasos !== null && d.pasos >= 10000 && d.gym !== null;
  }
  saveRetoData(data);
  return data;
}

export function addComidaToDia(dia: number, comida: Comida) {
  const data = getRetoData();
  const idx = data.dias.findIndex(d => d.dia === dia);
  if (idx >= 0) {
    data.dias[idx].comidas.push(comida);
    const total = data.dias[idx].comidas.reduce((s, c) => s + c.kcal, 0);
  }
  saveRetoData(data);
  return data;
}

export function getDiaActual(): number {
  const data = getRetoData();
  const inicio = new Date(data.inicio);
  const hoy = new Date();
  const diff = Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diff + 1, 1), 30);
}

function defaultData(): RetoData {
  const dias: DiaDatos[] = [];
  const fechas = [
    'Lun 16 Mar','Mar 17 Mar','Mié 18 Mar','Jue 19 Mar','Vie 20 Mar','Sáb 21 Mar','Dom 22 Mar',
    'Lun 23 Mar','Mar 24 Mar','Mié 25 Mar','Jue 26 Mar','Vie 27 Mar','Sáb 28 Mar','Dom 29 Mar',
    'Lun 30 Mar','Mar 31 Mar','Mié 1 Abr','Jue 2 Abr','Vie 3 Abr','Sáb 4 Abr','Dom 5 Abr',
    'Lun 6 Abr','Mar 7 Abr','Mié 8 Abr','Jue 9 Abr','Vie 10 Abr','Sáb 11 Abr','Dom 12 Abr',
    'Lun 13 Abr','Mar 14 Abr'
  ];
  for (let i = 1; i <= 30; i++) {
    dias.push({ dia: i, fecha: fechas[i-1], pasos: null, gym: null, peso: i === 1 ? 95 : null, comidas: i === 1 ? [{ id: '1', momento: 'Desayuno', nombre: 'Tostada con tomate, jamón y café', kcal: 500, hora: '08:30' }, { id: '2', momento: 'Comida', nombre: 'Pasta boloñesa con queso', kcal: 800, notas: '130gr pasta seca, boloñesa, 40gr queso', hora: '14:22' }] : [], completo: i === 1 ? true : false });
  }
  dias[0].pasos = 10000;
  dias[0].gym = true;
  return { inicio: '2026-03-16', pesoInicial: 95, objetivoKcal: 2260, tdee: 2820, dias };
}
