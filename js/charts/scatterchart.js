/* ===================================================
   scatterchart.js  — v3 (morph + clean tabs)

   Perbaikan bug:
   ① Tidak ada lagi tab ganda — hanya satu set tab
      #sc-stunting-tabs yang dikelola di sini
   ② Tab muncul HANYA saat mode = 'stunting'
   ③ Morph D3 pakai key join provinsi → titik bergerak
      mulus dari posisi RLS ke posisi Stunting (dan
      antar jenjang SD/SMP/SMA)
   ④ age-toggle HTML (bawaan index.html) tidak disentuh
      — sudah di-hidden permanen oleh main.js
=================================================== */

/* ── KONSTANTA ───────────────────────────────── */
const SC_MARGIN = { top: 56, right: 44, bottom: 66, left: 72 };
const SC_W = 860, SC_H = 460;

const DUR_ENTER = 600;   // animasi masuk pertama kali
const DUR_MORPH = 680;   // morph antar posisi
const EASE_MORPH = d3.easeCubicInOut;

/* ── STATE MODUL ─────────────────────────────── */
let _svg          = null;
let _xScale       = null;
let _yScale       = null;
let _mode         = null;   // 'rls' | 'stunting'
let _level        = 'Stunting 5-12';
let _cachedData   = null;

/* ── WARNA PER LEVEL ─────────────────────────── */
const LEVEL_CFG = {
  'Stunting 5-12':  { dot: '#60A5FA', line: '#3B82F6', label: 'SD (5–12)',   btnColor: '#3B82F6' },
  'Stunting 13-15': { dot: '#A78BFA', line: '#7C3AED', label: 'SMP (13–15)', btnColor: '#7C3AED' },
  'Stunting 16-18': { dot: '#F59E0B', line: '#D97706', label: 'SMA (16–18)', btnColor: '#F59E0B' },
};

/* ── STATISTIK ───────────────────────────────── */
function _pearson(xs, ys) {
  const mX = d3.mean(xs), mY = d3.mean(ys);
  const num = d3.sum(xs.map((x, i) => (x - mX) * (ys[i] - mY)));
  const den = Math.sqrt(
    d3.sum(xs.map(x => (x - mX) ** 2)) *
    d3.sum(ys.map(y => (y - mY) ** 2))
  );
  return den === 0 ? 0 : num / den;
}

function _ols(xs, ys) {
  const mX = d3.mean(xs), mY = d3.mean(ys);
  const b = d3.sum(xs.map((x, i) => (x - mX) * (ys[i] - mY))) /
            d3.sum(xs.map(x => (x - mX) ** 2));
  return { a: mY - b * mX, b };
}

function _interpretR(r) {
  const a = Math.abs(r), dir = r > 0 ? 'positif' : 'negatif';
  if (a >= 0.7) return `korelasi ${dir} kuat`;
  if (a >= 0.5) return `korelasi ${dir} sedang`;
  if (a >= 0.3) return `korelasi ${dir} lemah`;
  return 'korelasi sangat lemah';
}

/* ── HELPERS ─────────────────────────────────── */
function _buildPoints(data, yKey) {
  return data
    .map(d => ({ prov: d.Provinsi, x: +d['Protein (gr)'], y: +d[yKey] }))
    .filter(d => isFinite(d.x) && isFinite(d.y));
}

function _sharedXDomain(data) {
  const xs = data.map(d => +d['Protein (gr)']).filter(isFinite);
  return [d3.min(xs) - 1, d3.max(xs) + 1];
}

function _makeScales(points, xDomain) {
  const ys   = points.map(d => d.y);
  const yPad = (d3.max(ys) - d3.min(ys)) * 0.13;
  return {
    x: d3.scaleLinear().domain(xDomain).range([SC_MARGIN.left, SC_W - SC_MARGIN.right]),
    y: d3.scaleLinear()
         .domain([d3.min(ys) - yPad, d3.max(ys) + yPad])
         .range([SC_H - SC_MARGIN.bottom, SC_MARGIN.top]),
  };
}

/* ── INIT SVG (sekali, fresh) ────────────────── */
function _initSVG() {
  const container = d3.select('#d3-visual-target');
  container.html('');

  const svg = container.append('svg')
    .attr('viewBox', `0 0 ${SC_W} ${SC_H}`)
    .style('width',  '100%')
    .style('height', '100%');

  // Layer groups — URUTAN PENTING (z-order bawah → atas)
  svg.append('g').attr('class', 'sc-grid-y');
  svg.append('g').attr('class', 'sc-axis-x').attr('transform', `translate(0,${SC_H - SC_MARGIN.bottom})`);
  svg.append('g').attr('class', 'sc-axis-y').attr('transform', `translate(${SC_MARGIN.left},0)`);
  svg.append('text').attr('class', 'sc-xlabel chart-sublabel').attr('x', SC_W / 2).attr('y', SC_H - 10).attr('text-anchor', 'middle');
  svg.append('text').attr('class', 'sc-ylabel chart-sublabel').attr('transform', 'rotate(-90)').attr('x', -(SC_H / 2)).attr('y', 16).attr('text-anchor', 'middle');
  svg.append('line').attr('class', 'sc-regline').attr('stroke-width', 1.5).attr('stroke-dasharray', '5,3').attr('opacity', 0.7);
  svg.append('text').attr('class', 'sc-rtag chart-sublabel').attr('x', SC_W - SC_MARGIN.right - 8).attr('y', SC_MARGIN.top - 8).attr('text-anchor', 'end');
  svg.append('text').attr('class', 'sc-title chart-label').attr('x', SC_W / 2).attr('y', 22).attr('text-anchor', 'middle').style('font-size', '14px').style('fill', '#8B95A8');
  svg.append('g').attr('class', 'sc-dots');

  _svg = svg;
  return svg;
}

/* ── UPDATE AXES ─────────────────────────────── */
function _updateAxes(xS, yS, dur) {
  _svg.select('.sc-axis-x')
    .transition().duration(dur).ease(EASE_MORPH)
    .call(d3.axisBottom(xS).ticks(6))
    .call(g => g.select('.domain').remove());

  _svg.select('.sc-axis-y')
    .transition().duration(dur).ease(EASE_MORPH)
    .call(d3.axisLeft(yS).ticks(6))
    .call(g => g.select('.domain').remove());

  _svg.select('.sc-grid-y')
    .attr('transform', `translate(${SC_MARGIN.left},0)`)
    .transition().duration(dur).ease(EASE_MORPH)
    .call(
      d3.axisLeft(yS).ticks(6)
        .tickSize(-(SC_W - SC_MARGIN.left - SC_MARGIN.right))
        .tickFormat('')
    )
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', 'rgba(245,240,232,0.05)'));
}

/* ── UPDATE REGRESSION LINE ──────────────────── */
function _updateRegLine(points, xS, yS, color, dur) {
  const xs       = points.map(d => d.x);
  const ys       = points.map(d => d.y);
  const { a, b } = _ols(xs, ys);
  const x1 = d3.min(xs), x2 = d3.max(xs);

  _svg.select('.sc-regline')
    .attr('stroke', color)
    .transition().duration(dur).ease(EASE_MORPH)
    .attr('x1', xS(x1)).attr('y1', yS(a + b * x1))
    .attr('x2', xS(x2)).attr('y2', yS(a + b * x2));
}

/* ── UPDATE DOTS (KEY JOIN → MORPH) ─────────── */
function _updateDots(points, xS, yS, dotColor, dur, isFirstRender) {
  const tooltip = d3.select('#tooltip');
  const dotsG   = _svg.select('.sc-dots');

  // Key join dengan nama provinsi → titik BERGERAK bukan ganti
  const circles = dotsG.selectAll('circle')
    .data(points, d => d.prov);

  // ENTER: titik baru (hanya saat pertama kali)
  const entered = circles.enter().append('circle')
    .attr('cx', d => xS(d.x))
    .attr('cy', d => yS(d.y))
    .attr('r', 0)
    .attr('fill', dotColor)
    .attr('fill-opacity', 0)
    .attr('stroke', 'rgba(245,240,232,0.18)')
    .attr('stroke-width', 1)
    .on('mousemove', function (event, d) {
      d3.select(this).raise().attr('r', 8).attr('fill-opacity', 1);
      tooltip.style('opacity', 1)
        .style('left',  `${event.offsetX + 14}px`)
        .style('top',   `${event.offsetY - 10}px`)
        .html(`<strong>${d.prov}</strong><br/>Protein: ${d.x} gr<br/>Nilai: ${d.y}`);
    })
    .on('mouseleave', function () {
      d3.select(this).attr('r', 5).attr('fill-opacity', 0.72);
      tooltip.style('opacity', 0);
    });

  entered.transition()
    .duration(isFirstRender ? DUR_ENTER : dur)
    .delay((_, i) => isFirstRender ? i * 16 : 0)
    .ease(isFirstRender ? d3.easeCubicOut : EASE_MORPH)
    .attr('r', 5)
    .attr('fill-opacity', 0.72);

  // UPDATE: titik sudah ada → MORPH ke posisi + warna baru
  circles.transition()
    .duration(dur)
    .ease(EASE_MORPH)
    .attr('cx', d => xS(d.x))   // X tidak berubah (protein sama)
    .attr('cy', d => yS(d.y))   // Y BERGERAK ← animasi utama
    .attr('fill', dotColor)
    .attr('fill-opacity', 0.72)
    .attr('r', 5);

  // EXIT: seharusnya tidak ada (38 prov sama)
  circles.exit()
    .transition().duration(250)
    .attr('r', 0).attr('fill-opacity', 0)
    .remove();
}

/* ── UPDATE LABELS ───────────────────────────── */
function _updateLabels(points, title, xLabel, yLabel, lineColor) {
  const r = _pearson(points.map(d => d.x), points.map(d => d.y));

  _svg.select('.sc-xlabel').text(xLabel);
  _svg.select('.sc-ylabel').text(yLabel);
  _svg.select('.sc-title').text(title);

  // r-tag: flash untuk menunjukkan ada perubahan
  _svg.select('.sc-rtag')
    .style('fill', lineColor)
    .transition().duration(200).style('opacity', 0)
    .transition().duration(300).style('opacity', 1)
    .text(`r = ${r.toFixed(3)}  (${_interpretR(r)})`);
}

/* ── TABS STUNTING ───────────────────────────── */
function _showStuntingTabs(data) {
  let tabBar = document.getElementById('sc-stunting-tabs');

  if (!tabBar) {
    tabBar = document.createElement('div');
    tabBar.id = 'sc-stunting-tabs';
    tabBar.style.cssText = [
      'display:flex',
      'justify-content:center',
      'gap:0.6rem',
      'position:absolute',
      'bottom:1.5rem',
      'left:50%',
      'transform:translateX(-50%)',
      'z-index:20',
      'transition:opacity 0.3s ease',
    ].join(';');
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) chartContainer.appendChild(tabBar);
  }

  // Rebuild tombol tiap kali (supaya active state selalu sinkron)
  tabBar.innerHTML = '';
  Object.entries(LEVEL_CFG).forEach(([key, cfg]) => {
    const isActive = key === _level;
    const btn = document.createElement('button');
    btn.textContent = cfg.label;
    btn.dataset.level = key;
    btn.style.cssText = [
      'padding:0.4rem 1.1rem',
      `font-family:var(--font-mono,'JetBrains Mono',monospace)`,
      'font-size:0.73rem',
      'letter-spacing:0.05em',
      'border-radius:4px',
      'cursor:pointer',
      'transition:all 0.22s ease',
      `border:1px solid ${isActive ? cfg.btnColor : 'rgba(245,240,232,0.18)'}`,
      `background:${isActive ? cfg.btnColor : 'transparent'}`,
      `color:${isActive ? '#0a0e1a' : 'rgba(245,240,232,0.55)'}`,
      `font-weight:${isActive ? '700' : '400'}`,
    ].join(';');

    btn.addEventListener('click', () => {
      if (key === _level) return;
      _level = key;
      _morphStunting(data, key, false);
      _showStuntingTabs(data);   // re-render untuk update active
    });

    btn.addEventListener('mouseenter', () => {
      if (key !== _level) {
        btn.style.borderColor = cfg.btnColor;
        btn.style.color = cfg.btnColor;
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (key !== _level) {
        btn.style.borderColor = 'rgba(245,240,232,0.18)';
        btn.style.color = 'rgba(245,240,232,0.55)';
      }
    });

    tabBar.appendChild(btn);
  });

  // Tampilkan
  tabBar.style.opacity = '1';
  tabBar.style.pointerEvents = 'auto';
}

function _hideStuntingTabs() {
  const t = document.getElementById('sc-stunting-tabs');
  if (t) { t.style.opacity = '0'; t.style.pointerEvents = 'none'; }
}

/* ── MORPH STUNTING (per level / pertama kali) ── */
function _morphStunting(data, levelKey, isFirstTime) {
  const cfg    = LEVEL_CFG[levelKey] || LEVEL_CFG['Stunting 5-12'];
  const points = _buildPoints(data, levelKey);
  const xDom   = _sharedXDomain(data);
  const { x: xS, y: yS } = _makeScales(points, xDom);

  _updateAxes(xS, yS, DUR_MORPH);
  _updateRegLine(points, xS, yS, cfg.line, DUR_MORPH);
  _updateDots(points, xS, yS, cfg.dot, DUR_MORPH, isFirstTime);
  _updateLabels(
    points,
    `Korelasi: Protein vs Stunting ${levelKey.replace('Stunting ', '')}`,
    'Konsumsi Protein (gr/kapita/hari)',
    `Prevalensi Stunting ${levelKey.replace('Stunting ', '')} (%)`,
    cfg.line
  );

  _xScale = xS; _yScale = yS;
  _mode   = 'stunting';
}

/* ══════════════════════════════════════════════
   API PUBLIK
══════════════════════════════════════════════ */

/**
 * Step korelasi-protein-rls
 * Selalu render fresh dengan animasi stagger
 */
function drawScatterProteinRLS(data) {
  _cachedData = data;
  _mode       = 'rls';
  _hideStuntingTabs();

  _initSVG();

  const points = _buildPoints(data, 'RLS');
  const xDom   = _sharedXDomain(data);
  const { x: xS, y: yS } = _makeScales(points, xDom);
  _xScale = xS; _yScale = yS;

  // Axis langsung (chart baru)
  _svg.select('.sc-axis-x')
    .call(d3.axisBottom(xS).ticks(6))
    .call(g => g.select('.domain').remove());
  _svg.select('.sc-axis-y')
    .call(d3.axisLeft(yS).ticks(6))
    .call(g => g.select('.domain').remove());
  _svg.select('.sc-grid-y')
    .attr('transform', `translate(${SC_MARGIN.left},0)`)
    .call(d3.axisLeft(yS).ticks(6).tickSize(-(SC_W - SC_MARGIN.left - SC_MARGIN.right)).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', 'rgba(245,240,232,0.05)'));

  // Regresi: tumbuh dari kiri
  const xs = points.map(d => d.x), ys = points.map(d => d.y);
  const { a, b } = _ols(xs, ys);
  const x1 = d3.min(xs), x2 = d3.max(xs);
  _svg.select('.sc-regline')
    .attr('stroke', '#F4623A')
    .attr('x1', xS(x1)).attr('y1', yS(a + b * x1))
    .attr('x2', xS(x1)).attr('y2', yS(a + b * x1))
    .transition().duration(900).ease(d3.easeCubicOut)
    .attr('x2', xS(x2)).attr('y2', yS(a + b * x2));

  // Dots stagger masuk
  _updateDots(points, xS, yS, '#F59E0B', DUR_ENTER, true);

  _updateLabels(points, 'Korelasi: Protein vs RLS',
    'Konsumsi Protein (gr/kapita/hari)',
    'Rata-rata Lama Sekolah (thn)', '#F4623A');
}

/**
 * Step korelasi-protein-stunting
 * Jika dari RLS → morph titik (tidak redraw)
 * Jika fresh → init dulu baru morph
 */
function drawScatterProteinStunting(data) {
  _cachedData = data;
  _level      = 'Stunting 5-12'; // reset ke SD

  if (_mode === 'rls' && _svg) {
    // Titik masih ada dari RLS → morph langsung
    _morphStunting(data, _level, false);
    setTimeout(() => _showStuntingTabs(data), 180);
  } else {
    // SVG belum ada / dari step lain → init RLS dulu (instant), lalu morph
    _initSVG();

    // Gambar RLS instant (tanpa animasi) sebagai starting state
    const pointsRLS = _buildPoints(data, 'RLS');
    const xDom      = _sharedXDomain(data);
    const { x: xS, y: yS } = _makeScales(pointsRLS, xDom);
    _xScale = xS; _yScale = yS;

    _svg.select('.sc-axis-x').call(d3.axisBottom(xS).ticks(6)).call(g => g.select('.domain').remove());
    _svg.select('.sc-axis-y').call(d3.axisLeft(yS).ticks(6)).call(g => g.select('.domain').remove());
    _svg.select('.sc-grid-y')
      .attr('transform', `translate(${SC_MARGIN.left},0)`)
      .call(d3.axisLeft(yS).ticks(6).tickSize(-(SC_W - SC_MARGIN.left - SC_MARGIN.right)).tickFormat(''))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('line').style('stroke', 'rgba(245,240,232,0.05)'));

    // Gambar titik RLS langsung (tanpa animasi), lalu morph
    _updateDots(pointsRLS, xS, yS, '#F59E0B', 0, false);

    // Tunggu sebentar lalu morph ke Stunting
    setTimeout(() => {
      _mode = 'rls'; // set dulu agar _morphStunting berjalan benar
      _morphStunting(data, _level, false);
      setTimeout(() => _showStuntingTabs(data), 200);
    }, 150);
  }
}

/* updateStuntingChart — dipanggil dari main.js bila perlu (fallback) */
function updateStuntingChart(data, key) {
  if (!_svg || !_cachedData) return;
  _level = key;
  _morphStunting(_cachedData, key, false);
  _showStuntingTabs(_cachedData);
}