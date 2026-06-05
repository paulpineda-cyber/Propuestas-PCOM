// ══════════════════════════════════════════════
//  APP LOGIC — Generador de Propuestas
// ══════════════════════════════════════════════

// ── State ─────────────────────────────────────
let state = {
  plan: '',          // 'elite-300', 'simples-10', etc.
  ciudad: 'CDMX',
  planDesc: 0,
  periodo: 'anual',  // 'anual' | 'semestral' | 'ambos'
  destacados: false,
  destQty: 5,
  destDesc: 0,
  prime: false,
  primeQty: 5,
  primeDesc: 0,
  cliente: '',
  inventario: '',
  ciudadDisplay: '',
  fecha: '',
  vigencia: ''
};

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Set today as default date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('inp-fecha').value = today;
  state.fecha = today;

  // Set vigencia default +9 days
  const v = new Date(); v.setDate(v.getDate() + 9);
  const vStr = v.toISOString().split('T')[0];
  document.getElementById('inp-vigencia').value = vStr;
  state.vigencia = vStr;

  bindEvents();
  render();
});

// ── Event bindings ────────────────────────────
function bindEvents() {
  // Plan
  document.getElementById('sel-plan').addEventListener('change', e => { state.plan = e.target.value; render(); });
  document.getElementById('sel-ciudad').addEventListener('change', e => { state.ciudad = e.target.value; render(); });
  document.getElementById('inp-plan-desc').addEventListener('input', e => { state.planDesc = parseFloat(e.target.value) || 0; render(); });

  // Period buttons
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.periodo = btn.dataset.period;
      render();
    });
  });

  // Toggles
  document.getElementById('tog-destacados').addEventListener('change', e => {
    state.destacados = e.target.checked;
    if (state.prime && state.destacados) { state.prime = false; document.getElementById('tog-prime').checked = false; document.getElementById('fields-prime').classList.remove('visible'); }
    document.getElementById('fields-destacados').classList.toggle('visible', state.destacados);
    render();
  });
  document.getElementById('tog-prime').addEventListener('change', e => {
    state.prime = e.target.checked;
    if (state.destacados && state.prime) { state.destacados = false; document.getElementById('tog-destacados').checked = false; document.getElementById('fields-destacados').classList.remove('visible'); }
    document.getElementById('fields-prime').classList.toggle('visible', state.prime);
    render();
  });

  // Complement fields
  document.getElementById('inp-dest-qty').addEventListener('input', e => { state.destQty = parseInt(e.target.value) || 5; render(); });
  document.getElementById('inp-dest-desc').addEventListener('input', e => { state.destDesc = parseFloat(e.target.value) || 0; render(); });
  document.getElementById('inp-prime-qty').addEventListener('input', e => { state.primeQty = parseInt(e.target.value) || 5; render(); });
  document.getElementById('inp-prime-desc').addEventListener('input', e => { state.primeDesc = parseFloat(e.target.value) || 0; render(); });

  // Client fields
  document.getElementById('inp-cliente').addEventListener('input', e => { state.cliente = e.target.value; render(); });
  document.getElementById('inp-inventario').addEventListener('input', e => { state.inventario = e.target.value; render(); });
  document.getElementById('inp-ciudad-display').addEventListener('input', e => { state.ciudadDisplay = e.target.value; render(); });
  document.getElementById('inp-fecha').addEventListener('change', e => { state.fecha = e.target.value; render(); });
  document.getElementById('inp-vigencia').addEventListener('change', e => { state.vigencia = e.target.value; render(); });
}

// ── Price computation ─────────────────────────
function computePrices(periodo) {
  if (!state.plan) return null;

  const isElite = state.plan.startsWith('elite');
  let planBase;

  if (isElite) {
    const inv = state.plan === 'elite-300' ? 300 : state.plan === 'elite-500' ? 500 : 501;
    planBase = getPrecioElite(state.ciudad, inv, periodo);
  } else {
    const niveles = { 'simples-10':10, 'simples-40':40, 'simples-80':80, 'simples-140':140, 'simples-300':300, 'simples-500plus':500 };
    const nivel = niveles[state.plan] || 300;
    planBase = getPrecioSimples(nivel, periodo);
  }

  const plan = applyDiscount(planBase, state.planDesc);

  let comp = null;
  if (state.destacados) {
    const base = getPrecioDestacados(state.destQty, periodo);
    comp = { type: 'destacados', qty: state.destQty, ...applyDiscount(base, state.destDesc) };
  } else if (state.prime) {
    const base = getPrecioPrime(state.primeQty, periodo);
    comp = { type: 'prime', qty: state.primeQty, ...applyDiscount(base, state.primeDesc) };
  }

  const total = plan.final + (comp ? comp.final : 0);
  return { plan, comp, total };
}

// ── Build plan card HTML ──────────────────────
function planCardHTML(prices, periodo, isMain) {
  const isElite = state.plan.startsWith('elite');
  const planName = isElite ? 'Plan Elite' : 'Plan Simples';
  const planDesc = isElite
    ? 'Publicaciones con etiqueta Exclusivo · Primeros resultados de búsqueda'
    : 'Publicaciones en los primeros resultados de búsqueda';
  const niveles = { 'elite-300':300, 'elite-500':500, 'elite-500plus':'+500', 'simples-10':10, 'simples-40':40, 'simples-80':80, 'simples-140':140, 'simples-300':300, 'simples-500plus':'+300' };
  const inv = state.plan ? niveles[state.plan] : '—';
  const p = prices.plan;
  const hasBothCols = prices.comp !== null;
  const cardClass = isElite ? 'elite' : 'simples';

  const featuresElite = `
    <li><span class="feature-icon green">${checkSVG()}</span>Etiqueta <strong>"Exclusivo"</strong> en todas tus publicaciones</li>
    <li><span class="feature-icon green">${checkSVG()}</span>Posicionamiento <strong>prioritario</strong> sobre publicaciones simples</li>
    <li><span class="feature-icon green">${checkSVG()}</span>Visibilidad en <strong>+2 millones</strong> de visitas mensuales</li>`;

  const featuresSimples = `
    <li><span class="feature-icon green">${checkSVG()}</span>Posicionamiento <strong>prioritario</strong> sobre publicaciones simples</li>
    <li><span class="feature-icon green">${checkSVG()}</span>Visibilidad en <strong>+2 millones</strong> de visitas mensuales</li>`;

  return `
  <div class="plan-card ${isElite ? 'elite-card' : 'elite-card'}">
    <div class="plan-card-header ${cardClass}">
      <div class="plan-card-header-left">
        <span class="plan-card-icon">⭐</span>
        <div>
          <div class="plan-card-name">${planName}</div>
          <div class="plan-card-desc">${planDesc}</div>
        </div>
      </div>
      <span class="plan-card-badge badge-recomendado">RECOMENDADO</span>
    </div>
    <div class="plan-card-body">
      ${priceBlockHTML(p)}
      <div class="inventory-label">Inventario Cubierto</div>
      <div class="inventory-value">${inv}</div>
      <ul class="features-list">${isElite ? featuresElite : featuresSimples}</ul>
    </div>
  </div>`;
}

function compCardHTML(comp) {
  if (!comp) return '';
  const isD = comp.type === 'destacados';
  const headerClass = isD ? 'destacados' : 'prime';
  const name = isD ? 'Destacados' : 'Avisos Prime';
  const icon = isD ? '🏆' : '💎';
  const desc = isD
    ? 'Posiciona tus mejores propiedades al tope de los resultados'
    : 'Posiciona tus mejores propiedades al tope de los resultados';
  const featuresD = `
    <li><span class="feature-icon gold">${checkSVG()}</span>Aparecen <strong>por encima</strong> de las publicaciones Elite</li>
    <li><span class="feature-icon gold">${checkSVG()}</span>Se muestran en los <strong>primeros</strong> resultados</li>
    <li><span class="feature-icon gold">${checkSVG()}</span>Etiqueta <strong>"Destacado"</strong> de alta visibilidad</li>`;
  const featuresP = `
    <li><span class="feature-icon blue">${checkSVG()}</span>Aparecen <strong>por encima</strong> de los destacados</li>
    <li><span class="feature-icon blue">${checkSVG()}</span>Se mantienen <strong>fijos</strong> en los resultados de búsqueda</li>
    <li><span class="feature-icon blue">${checkSVG()}</span>Etiqueta <strong>"Prime"</strong> de alta visibilidad</li>`;
  const avisosClass = isD ? '' : 'prime-color';

  return `
  <div class="plan-card ${isElite ? 'elite-card' : 'elite-card'}">
    <div class="plan-card-header ${headerClass}">
      <div class="plan-card-header-left">
        <span class="plan-card-icon">${icon}</span>
        <div>
          <div class="plan-card-name">${name}</div>
          <div class="plan-card-desc">${desc}</div>
        </div>
      </div>
      <span class="plan-card-badge ${isD ? 'badge-complemento-destacados' : 'badge-complemento-prime'}">COMPLEMENTO</span>
    </div>
    <div class="plan-card-body">
      ${priceBlockHTML(comp)}
      <div class="avisos-label">Avisos ${name}</div>
      <div class="avisos-value ${avisosClass}">${comp.qty}</div>
      <ul class="features-list">${isD ? featuresD : featuresP}</ul>
    </div>
  </div>`;
}

function priceBlockHTML(p) {
  if (p.original) {
    return `
      <div class="price-block">
        <div><span class="price-original">${fmt(p.original)}</span> <span class="price-discount-pct">| ${p.pct}% de Descuento</span></div>
        <div class="price-row"><span class="price-main">${fmt(p.final)}</span><span class="price-iva">+IVA</span></div>
      </div>`;
  }
  return `
    <div class="price-block price-no-discount">
      <div class="price-row"><span class="price-main">${fmt(p.final)}</span><span class="price-iva">+IVA</span></div>
    </div>`;
}

function checkSVG() {
  return `<svg viewBox="0 0 10 10" fill="white"><path d="M2 5l2.5 2.5L8 3" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function totalBoxHTML(prices, periodo) {
  const isElite = state.plan.startsWith('elite');
  const planName = isElite ? 'Plan Elite' : 'Plan Simples';
  const months = periodo === 'anual' ? 12 : 6;
  const periodLabel = periodo === 'anual' ? 'ANUAL' : 'SEMESTRAL';
  let desc = `${planName} por ${months} meses`;
  if (prices.comp) {
    const compName = prices.comp.type === 'destacados' ? 'avisos Destacados' : 'avisos Prime';
    desc += ` + ${prices.comp.qty} ${compName} por ${months} meses`;
  }
  return `
  <div class="total-box">
    <div class="total-box-left">
      <div class="total-period">INVERSIÓN TOTAL ${periodLabel}</div>
      <div class="total-desc">${desc}</div>
    </div>
    <div class="total-box-right">
      <div class="total-amount">${fmt(prices.total)}</div>
      <div class="total-iva">+IVA</div>
    </div>
  </div>`;
}

function disclaimerHTML(prices, periodo) {
  let promoText = '';
  const vig = state.vigencia ? fmtDate(state.vigencia) : '—';
  if (prices && prices.comp) {
    const pct = prices.comp.pct || 0;
    const compName = prices.comp.type === 'destacados' ? 'Complemento Destacado' : 'Complemento Prime';
    if (pct > 0) {
      promoText = ` La promo del <strong>${pct}% de descuento en ${compName}</strong> vence el <strong>${vig}</strong>. Se recomienda confirmar antes de esa fecha para asegurar las condiciones.`;
    }
  }
  return `<div class="disclaimer"><strong>Vigencia de esta propuesta</strong>: Los precios y condiciones aquí presentados están sujetos a cambios.${promoText}</div>`;
}

// ── Main render ───────────────────────────────
function render() {
  const doc = document.getElementById('proposal-doc');

  const cliente = state.cliente || 'Cliente';
  const invNiveles = { 'elite-300':300, 'elite-500':500, 'elite-500plus':'+500', 'simples-10':10, 'simples-40':40, 'simples-80':80, 'simples-140':140, 'simples-300':300, 'simples-500plus':'+300' };
  const inventario = state.plan ? invNiveles[state.plan] : '—';
  const ciudadDisp = state.ciudadDisplay || state.ciudad;
  const fechaStr = state.fecha ? fmtDate(state.fecha) : '—';
  const vigenciaStr = state.vigencia ? fmtDate(state.vigencia) : '—';

  const isElite = state.plan.startsWith('elite');
  const planType = isElite ? 'Elite' : 'Simples';
  const compType = state.destacados ? ' + Destacados' : state.prime ? ' + Prime' : '';

  let periodoLabel = '';
  if (state.periodo === 'anual') periodoLabel = 'Anual';
  else if (state.periodo === 'semestral') periodoLabel = 'Semestral';
  else periodoLabel = 'Semestral y Anual';

  const mainPeriodo = state.periodo === 'ambos' ? 'semestral' : state.periodo;
  const prices = state.plan ? computePrices(mainPeriodo) : null;
  const pricesAnual = (state.periodo === 'ambos' && state.plan) ? computePrices('anual') : null;

  const planTitle = state.plan
    ? `Plan ${planType} ${state.periodo === 'ambos' ? 'Semestral' : periodoLabel}${compType}`
    : 'Plan Recomendado';

  const hasBoth = state.periodo === 'ambos';

  // Cards layout
  let mainSection = '';
  if (prices) {
    const gridClass = prices.comp ? 'two-cards' : 'one-card';
    mainSection = `
      <div class="cards-grid ${gridClass}">
        ${planCardHTML(prices, mainPeriodo, true)}
        ${compCardHTML(prices.comp)}
      </div>
      ${totalBoxHTML(prices, mainPeriodo)}`;
  } else {
    mainSection = `<div style="padding:40px;text-align:center;color:#9ca3af;font-size:14px;">Selecciona un plan en el panel izquierdo para ver la propuesta.</div>`;
  }

  // Second section (if "Ambos")
  let secondSection = '';
  if (hasBoth && pricesAnual) {
    const gridClass = pricesAnual.comp ? 'two-cards' : 'one-card';
    secondSection = `
      <hr class="section-sep">
      <div class="opcion-adicional-label">OPCIÓN ADICIONAL</div>
      <div class="doc-plan-label">Plan Recomendado</div>
      <div class="doc-plan-title">Plan ${planType} Anual${compType}</div>
      <div class="cards-grid ${gridClass}">
        ${planCardHTML(pricesAnual, 'anual', false)}
        ${compCardHTML(pricesAnual.comp)}
      </div>
      ${totalBoxHTML(pricesAnual, 'anual')}`;
  }

  doc.innerHTML = `
    <!-- HEADER -->
    <div class="doc-header">
      ${logoSVG()}
    </div>

    <!-- META -->
    <div class="doc-meta">
      <div class="doc-meta-item">
        <div class="label">Cliente</div>
        <div class="value">${cliente}</div>
      </div>
      <div class="doc-meta-item">
        <div class="label">Inventario</div>
        <div class="value">${inventario} propiedades · ${ciudadDisp}</div>
      </div>
      <div class="doc-meta-item">
        <div class="label">Fecha</div>
        <div class="value">${fechaStr}</div>
      </div>
    </div>

    <!-- PLAN TITLE -->
    <div class="doc-plan-label">Plan Recomendado</div>
    <div class="doc-plan-title">${planTitle}</div>

    <!-- MAIN CARDS -->
    ${mainSection}

    ${secondSection}

    <!-- VIGENCIA -->
    ${prices ? `
    <div class="vigencia-box" style="margin-top:16px;">
      <span class="vigencia-icon">📅</span>
      <span class="vigencia-text"><span>Vigencia de la Propuesta</span>:  ${vigenciaStr}</span>
    </div>` : ''}

    <!-- PAYMENT -->
    <div class="payment-section">
      <div class="payment-title">Formas de Pago</div>
      <div class="payment-subtitle">Opciones de pago disponibles</div>
      <div class="payment-options">
        <div class="payment-option">
          <div class="payment-icon blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          </div>
          <div>
            <div class="payment-option-name">Meses sin intereses (MSI) vía PayPal</div>
            <div class="payment-option-desc">Disponible con cualquier tarjeta de crédito. El cobro total se aplica en tu tarjeta.</div>
          </div>
        </div>
        <div class="payment-option">
          <div class="payment-icon green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div>
            <div class="payment-option-name">Transferencia bancaria</div>
            <div class="payment-option-desc">Pago único directo. Te compartimos los datos bancarios al momento de confirmar.</div>
          </div>
        </div>
      </div>

      ${disclaimerHTML(prices, mainPeriodo)}
    </div>

    <!-- FOOTER -->
    <div class="doc-footer">
      <div class="doc-footer-left">
        <div class="footer-site">propiedades.com</div>
        <div class="footer-desc">El portal inmobiliario con mayor tráfico orgánico de México.</div>
      </div>
      <button class="footer-cta">¡Quiero mi plan!</button>
    </div>
  `;
}

// ── Logo SVG ──────────────────────────────────
function exportPDF() {
  const element = document.getElementById('proposal-doc');
  const cliente = (state.cliente || 'propuesta').replace(/\s+/g, '_').toLowerCase();
  const filename = `propuesta_${cliente}_${state.fecha || 'hoy'}.pdf`;

  const clone = element.cloneNode(true);
  clone.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 794px !important;
    padding: 48px 56px 56px !important;
    background: white;
    transform: none !important;
    margin: 0 !important;
    font-family: 'Inter', sans-serif;
    visibility: visible;
  `;

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: -9999px;
    width: 794px;
    overflow: visible;
    z-index: -1000;
  `;
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  setTimeout(() => {
    html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        unit: 'px',
        format: [794, canvas.height / 2],
        orientation: 'portrait'
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, 794, canvas.height / 2);
      pdf.save(filename);
      document.body.removeChild(wrapper);
    });
  }, 500);
}
