// ══════════════════════════════════════════════
//  TABLA DE PRECIOS — Propiedades.com
// ══════════════════════════════════════════════

// Plan Elite: precio mensual por ciudad e inventario
const ELITE_PRECIOS = {
  "CDMX":           { 300: 8500,  500: 11050, "+500": 14365 },
  "EDOMEX":         { 300: 8500,  500: 11050, "+500": 14365 },
  "Jalisco":        { 300: 4750,  500: 6413,  "+500": 8337  },
  "Nuevo León":     { 300: 4750,  500: 6413,  "+500": 8337  },
  "Querétaro":      { 300: 3500,  500: 4725,  "+500": 6143  },
  "Toluca":         { 300: 3500,  500: 4725,  "+500": 6143  },
  "Resto del país": { 300: 3000,  500: 4050,  "+500": 5265  }
};

// Plan Simples: precio mensual fijo por nivel de inventario
const SIMPLES_PRECIOS = {
  10:   599,
  40:   1999,
  80:   2999,
  140:  4995,
  300:  7999,
  500:  9199,
  1000: 10579
};

// Destacados: precio semestral y anual por cantidad de avisos
const DESTACADOS_PRECIOS = [
  {qty:1,  sem:2070,  anual:3600},
  {qty:2,  sem:3312,  anual:5310},
  {qty:3,  sem:4016,  anual:6885},
  {qty:4,  sem:5161,  anual:8400},
  {qty:5,  sem:5762,  anual:9000},
  {qty:6,  sem:6665,  anual:10350},
  {qty:7,  sem:7487,  anual:11655},
  {qty:8,  sem:8390,  anual:12840},
  {qty:9,  sem:9191,  anual:14040},
  {qty:10, sem:9999,  anual:15000},
  {qty:11, sem:11006, anual:16170},
  {qty:12, sem:11923, anual:17280},
  {qty:13, sem:12737, anual:18330},
  {qty:14, sem:13621, anual:19320},
  {qty:15, sem:14490, anual:20250},
  {qty:16, sem:15346, anual:21360},
  {qty:17, sem:16070, anual:22185},
  {qty:18, sem:16891, anual:23220},
  {qty:19, sem:17699, anual:24225},
  {qty:20, sem:18354, anual:24900},
  {qty:21, sem:19127, anual:25830},
  {qty:22, sem:19886, anual:26400},
  {qty:23, sem:20472, anual:27600},
  {qty:24, sem:21197, anual:28800},
  {qty:25, sem:21908, anual:30000},
  {qty:26, sem:22604, anual:31200},
  {qty:27, sem:23101, anual:32400},
  {qty:28, sem:23764, anual:33600},
  {qty:29, sem:24412, anual:34800},
  {qty:30, sem:25047, anual:36000},
  {qty:31, sem:25668, anual:37200},
  {qty:32, sem:26054, anual:38400},
  {qty:33, sem:26641, anual:39600},
  {qty:34, sem:27214, anual:40800},
  {qty:35, sem:27773, anual:42000},
  {qty:36, sem:28318, anual:43200},
  {qty:37, sem:28849, anual:44400},
  {qty:38, sem:29366, anual:45600},
  {qty:39, sem:29870, anual:46800},
  {qty:40, sem:30360, anual:48000},
  {qty:41, sem:30836, anual:49200},
  {qty:42, sem:31298, anual:50400},
  {qty:43, sem:31747, anual:51600},
  {qty:44, sem:32182, anual:52800},
  {qty:45, sem:32603, anual:54000},
  {qty:46, sem:33010, anual:55200},
  {qty:47, sem:33079, anual:56400},
  {qty:48, sem:33782, anual:57600},
  {qty:49, sem:34148, anual:58800},
  {qty:50, sem:34500, anual:60000},
  {qty:60, sem:40158, anual:72000},
  {qty:70, sem:45402, anual:84000},
  {qty:80, sem:50784, anual:96000},
  {qty:90, sem:55269, anual:108000},
  {qty:100,sem:60000, anual:120000},
];

// Prime: precio semestral y anual por cantidad de avisos
const PRIME_PRECIOS = [
  {qty:1,  sem:3594,   anual:7188},
  {qty:2,  sem:7188,   anual:14376},
  {qty:3,  sem:10782,  anual:21564},
  {qty:4,  sem:14376,  anual:28752},
  {qty:5,  sem:17970,  anual:35940},
  {qty:6,  sem:21564,  anual:43128},
  {qty:7,  sem:25158,  anual:50316},
  {qty:8,  sem:28752,  anual:57504},
  {qty:9,  sem:32346,  anual:64692},
  {qty:10, sem:35940,  anual:71880},
  {qty:11, sem:39534,  anual:79068},
  {qty:12, sem:43128,  anual:86256},
  {qty:13, sem:46722,  anual:93444},
  {qty:14, sem:50316,  anual:100632},
  {qty:15, sem:53910,  anual:107820},
  {qty:16, sem:57504,  anual:115008},
  {qty:17, sem:61098,  anual:122196},
  {qty:18, sem:64692,  anual:129384},
  {qty:19, sem:68286,  anual:136572},
  {qty:20, sem:71880,  anual:143760},
  {qty:25, sem:89850,  anual:179700},
  {qty:30, sem:107820, anual:215640},
  {qty:40, sem:143760, anual:287520},
  {qty:50, sem:179700, anual:359400},
  {qty:60, sem:215640, anual:431280},
  {qty:70, sem:251580, anual:503160},
  {qty:80, sem:287520, anual:575040},
  {qty:90, sem:323460, anual:646920},
  {qty:100,sem:359400, anual:718800},
];

// ── Helpers ──────────────────────────────────

function getPrecioDestacados(qty, periodo) {
  // exact match first, then interpolate linearly
  const exact = DESTACADOS_PRECIOS.find(r => r.qty === qty);
  if (exact) return periodo === 'anual' ? exact.anual : exact.sem;
  // linear interpolation between nearest rows
  const sorted = [...DESTACADOS_PRECIOS].sort((a,b)=>a.qty-b.qty);
  const lo = sorted.filter(r=>r.qty<=qty).pop();
  const hi = sorted.find(r=>r.qty>qty);
  if (!lo) return periodo === 'anual' ? hi.anual : hi.sem;
  if (!hi) return periodo === 'anual' ? lo.anual : lo.sem;
  const t = (qty - lo.qty) / (hi.qty - lo.qty);
  const val = periodo === 'anual'
    ? lo.anual + t*(hi.anual - lo.anual)
    : lo.sem + t*(hi.sem - lo.sem);
  return Math.round(val);
}

function getPrecioPrime(qty, periodo) {
  const exact = PRIME_PRECIOS.find(r => r.qty === qty);
  if (exact) return periodo === 'anual' ? exact.anual : exact.sem;
  const sorted = [...PRIME_PRECIOS].sort((a,b)=>a.qty-b.qty);
  const lo = sorted.filter(r=>r.qty<=qty).pop();
  const hi = sorted.find(r=>r.qty>qty);
  if (!lo) return periodo === 'anual' ? hi.anual : hi.sem;
  if (!hi) return periodo === 'anual' ? lo.anual : lo.sem;
  const t = (qty - lo.qty) / (hi.qty - lo.qty);
  const val = periodo === 'anual'
    ? lo.anual + t*(hi.anual - lo.anual)
    : lo.sem + t*(hi.sem - lo.sem);
  return Math.round(val);
}

function getPrecioElite(ciudad, inventario, periodo) {
  const key = inventario <= 300 ? 300 : inventario <= 500 ? 500 : '+500';
  const cityRow = ELITE_PRECIOS[ciudad] || ELITE_PRECIOS["Resto del país"];
  const mensual = cityRow[key];
  return periodo === 'anual' ? mensual * 12 : mensual * 6;
}

function getPrecioSimples(nivel, periodo) {
  // nivel: 10,40,80,140,300,500,1000
  const mensual = SIMPLES_PRECIOS[nivel] || 7999;
  return periodo === 'anual' ? mensual * 12 : mensual * 6;
}

function applyDiscount(precio, pct) {
  if (!pct || pct <= 0) return { final: precio, original: null, pct: 0 };
  const final = Math.round(precio * (1 - pct / 100));
  return { final, original: precio, pct };
}

function fmt(n) {
  return '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(d)} de ${months[parseInt(m)-1]} de ${y}`;
}
