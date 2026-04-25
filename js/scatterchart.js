

/**
 * chart.js — Section 04
 * Scatter Plot: Biaya SMA vs APS 16-18
 * Library: Chart.js v4
 * Mount ke: <canvas id="scatterChart">
 */

// ==============================
// SECTION 04 — Korelasi Biaya vs Partisipasi Sekolah
// Canvas: #scatterChart
// ==============================

const DATA_KORELASI = [
  { provinsi: "Aceh",                 biayaSD: 4.99,  biayaSMP: 6.04,  biayaSMA: 8.08,  aps712: 99.38, aps1315: 97.65, aps1618: 80.94 },
  { provinsi: "Sumatera Utara",       biayaSD: 4.08,  biayaSMP: 4.95,  biayaSMA: 7.54,  aps712: 99.54, aps1315: 97.67, aps1618: 77.51 },
  { provinsi: "Sumatera Barat",       biayaSD: 3.65,  biayaSMP: 6.36,  biayaSMA: 8.75,  aps712: 99.63, aps1315: 97.00, aps1618: 85.04 },
  { provinsi: "Riau",                 biayaSD: 4.84,  biayaSMP: 7.07,  biayaSMA: 8.12,  aps712: 99.74, aps1315: 95.47, aps1618: 77.42 },
  { provinsi: "Jambi",                biayaSD: 3.55,  biayaSMP: 5.63,  biayaSMA: 7.25,  aps712: 99.45, aps1315: 95.59, aps1618: 74.39 },
  { provinsi: "Sumatera Selatan",     biayaSD: 3.94,  biayaSMP: 6.54,  biayaSMA: 14.60, aps712: 99.50, aps1315: 95.68, aps1618: 73.78 },
  { provinsi: "Bengkulu",             biayaSD: 5.32,  biayaSMP: 6.68,  biayaSMA: 12.27, aps712: 99.29, aps1315: 97.01, aps1618: 80.48 },
  { provinsi: "Lampung",              biayaSD: 3.35,  biayaSMP: 4.96,  biayaSMA: 8.21,  aps712: 99.62, aps1315: 95.72, aps1618: 75.35 },
  { provinsi: "Kep. Bangka Belitung", biayaSD: 3.63,  biayaSMP: 5.80,  biayaSMA: 7.88,  aps712: 99.49, aps1315: 92.90, aps1618: 76.03 },
  { provinsi: "Kepulauan Riau",       biayaSD: 9.49,  biayaSMP: 11.73, biayaSMA: 8.83,  aps712: 99.71, aps1315: 98.60, aps1618: 88.24 },
  { provinsi: "DKI Jakarta",          biayaSD: 8.77,  biayaSMP: 8.73,  biayaSMA: 14.41, aps712: 99.32, aps1315: 98.74, aps1618: 88.22 },
  { provinsi: "Jawa Barat",           biayaSD: 4.62,  biayaSMP: 8.64,  biayaSMA: 11.49, aps712: 99.50, aps1315: 96.58, aps1618: 75.80 },
  { provinsi: "Jawa Tengah",          biayaSD: 4.25,  biayaSMP: 7.45,  biayaSMA: 9.67,  aps712: 99.54, aps1315: 97.05, aps1618: 77.97 },
  { provinsi: "D I Yogyakarta",       biayaSD: 5.78,  biayaSMP: 7.07,  biayaSMA: 13.96, aps712: 99.61, aps1315: 99.60, aps1618: 93.03 },
  { provinsi: "Jawa Timur",           biayaSD: 4.15,  biayaSMP: 6.80,  biayaSMA: 10.35, aps712: 99.31, aps1315: 96.54, aps1618: 76.74 },
  { provinsi: "Banten",               biayaSD: 5.10,  biayaSMP: 9.60,  biayaSMA: 11.10, aps712: 99.22, aps1315: 95.86, aps1618: 73.53 },
  { provinsi: "Bali",                 biayaSD: 5.50,  biayaSMP: 7.20,  biayaSMA: 11.20, aps712: 99.54, aps1315: 97.82, aps1618: 83.27 },
  { provinsi: "NTB",                  biayaSD: 3.80,  biayaSMP: 5.90,  biayaSMA: 7.95,  aps712: 99.18, aps1315: 96.85, aps1618: 79.52 },
  { provinsi: "NTT",                  biayaSD: 3.20,  biayaSMP: 4.50,  biayaSMA: 6.45,  aps712: 98.30, aps1315: 94.82, aps1618: 72.41 },
  { provinsi: "Kalimantan Barat",     biayaSD: 4.10,  biayaSMP: 6.20,  biayaSMA: 8.50,  aps712: 98.87, aps1315: 94.02, aps1618: 70.35 },
  { provinsi: "Kalimantan Tengah",    biayaSD: 4.50,  biayaSMP: 6.80,  biayaSMA: 9.20,  aps712: 98.93, aps1315: 93.88, aps1618: 71.66 },
  { provinsi: "Kalimantan Selatan",   biayaSD: 4.30,  biayaSMP: 7.10,  biayaSMA: 9.80,  aps712: 99.07, aps1315: 94.57, aps1618: 69.57 },
  { provinsi: "Kalimantan Timur",     biayaSD: 5.80,  biayaSMP: 8.40,  biayaSMA: 11.50, aps712: 99.41, aps1315: 96.57, aps1618: 79.97 },
  { provinsi: "Kalimantan Utara",     biayaSD: 5.20,  biayaSMP: 7.60,  biayaSMA: 10.40, aps712: 99.16, aps1315: 95.84, aps1618: 76.27 },
  { provinsi: "Sulawesi Utara",       biayaSD: 4.36,  biayaSMP: 7.62,  biayaSMA: 11.75, aps712: 99.28, aps1315: 96.11, aps1618: 71.45 },
  { provinsi: "Sulawesi Tengah",      biayaSD: 3.81,  biayaSMP: 7.31,  biayaSMA: 7.86,  aps712: 98.56, aps1315: 94.58, aps1618: 75.36 },
  { provinsi: "Sulawesi Selatan",     biayaSD: 4.34,  biayaSMP: 7.33,  biayaSMA: 10.01, aps712: 99.21, aps1315: 94.22, aps1618: 75.94 },
  { provinsi: "Sulawesi Tenggara",    biayaSD: 2.52,  biayaSMP: 3.81,  biayaSMA: 6.75,  aps712: 99.05, aps1315: 96.53, aps1618: 79.58 },
  { provinsi: "Gorontalo",            biayaSD: 3.96,  biayaSMP: 6.34,  biayaSMA: 7.66,  aps712: 98.85, aps1315: 92.35, aps1618: 72.00 },
  { provinsi: "Sulawesi Barat",       biayaSD: 2.93,  biayaSMP: 3.42,  biayaSMA: 6.18,  aps712: 98.56, aps1315: 92.30, aps1618: 73.22 },
  { provinsi: "Maluku",               biayaSD: 2.05,  biayaSMP: 3.18,  biayaSMA: 4.99,  aps712: 99.56, aps1315: 97.75, aps1618: 77.28 },
  { provinsi: "Maluku Utara",         biayaSD: 3.15,  biayaSMP: 6.93,  biayaSMA: 8.05,  aps712: 99.04, aps1315: 97.08, aps1618: 79.62 },
  { provinsi: "Papua Barat",          biayaSD: 4.45,  biayaSMP: 7.08,  biayaSMA: 14.11, aps712: 97.59, aps1315: 96.22, aps1618: 77.53 },
  { provinsi: "Papua Barat Daya",     biayaSD: 3.27,  biayaSMP: 8.73,  biayaSMA: 8.81,  aps712: 98.67, aps1315: 96.38, aps1618: 81.70 },
  { provinsi: "Papua",                biayaSD: 5.49,  biayaSMP: 9.05,  biayaSMA: 17.91, aps712: 97.51, aps1315: 97.32, aps1618: 81.78 },
  { provinsi: "Papua Selatan",        biayaSD: 4.79,  biayaSMP: 6.69,  biayaSMA: 8.08,  aps712: 91.65, aps1315: 89.29, aps1618: 66.97 },
  { provinsi: "Papua Tengah",         biayaSD: 4.62,  biayaSMP: 4.68,  biayaSMA: 6.52,  aps712: 80.13, aps1315: 67.86, aps1618: 44.61 },
  { provinsi: "Papua Pegunungan",     biayaSD: 1.60,  biayaSMP: null,  biayaSMA: 3.43,  aps712: 82.24, aps1315: 71.08, aps1618: 50.79 },
];

// ── Utilitas statistik ──────────────────────────────────────────────────────

function pearson(pairs) {
  const n  = pairs.length;
  const mx = pairs.reduce((s, p) => s + p.x, 0) / n;
  const my = pairs.reduce((s, p) => s + p.y, 0) / n;
  const num = pairs.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
  const dx  = Math.sqrt(pairs.reduce((s, p) => s + (p.x - mx) ** 2, 0));
  const dy  = Math.sqrt(pairs.reduce((s, p) => s + (p.y - my) ** 2, 0));
  return num / (dx * dy);
}

function regressionLine(pairs) {
  const n  = pairs.length;
  const mx = pairs.reduce((s, p) => s + p.x, 0) / n;
  const my = pairs.reduce((s, p) => s + p.y, 0) / n;
  const b  = pairs.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) /
             pairs.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  const a  = my - b * mx;
  return { a, b }; // y = a + b*x
}

function rLabel(r) {
  const abs = Math.abs(r);
  const dir = r < 0 ? "Negatif" : "Positif";
  const str = abs >= 0.7 ? "Kuat" : abs >= 0.4 ? "Sedang" : "Lemah";
  return `${dir} – ${str}`;
}

// ── Konfigurasi per mode ────────────────────────────────────────────────────

const MODES = [
  {
    key: "sd",
    label: "SD (5–12 thn)",
    biayaKey: "biayaSD",
    apsKey:   "aps712",
    apsLabel: "APS 7–12 (%)",
    biayaLabel: "Biaya SD (Juta Rp)",
    dotColor: "rgba(255, 209, 102, 0.85)",
    dotBorder: "rgba(255, 209, 102, 1)",
    lineColor: "rgba(255, 209, 102, 0.6)",
    rColor:    "#FFD166",
  },
  {
    key: "smp",
    label: "SMP (13–15 thn)",
    biayaKey: "biayaSMP",
    apsKey:   "aps1315",
    apsLabel: "APS 13–15 (%)",
    biayaLabel: "Biaya SMP (Juta Rp)",
    dotColor: "rgba(6, 214, 160, 0.85)",
    dotBorder: "rgba(6, 214, 160, 1)",
    lineColor: "rgba(6, 214, 160, 0.6)",
    rColor:    "#06D6A0",
  },
  {
    key: "sma",
    label: "SMA (16–18 thn)",
    biayaKey: "biayaSMA",
    apsKey:   "aps1618",
    apsLabel: "APS 16–18 (%)",
    biayaLabel: "Biaya SMA (Juta Rp)",
    dotColor: "rgba(255, 107, 53, 0.85)",
    dotBorder: "rgba(255, 107, 53, 1)",
    lineColor: "rgba(255, 107, 53, 0.6)",
    rColor:    "#FF6B35",
  },
];

// ── Highlight provinsi ──────────────────────────────────────────────────────

const HIGHLIGHTS = {
  "Sumatera Selatan": { color: "#E71D36", note: "Biaya SMA termahal #2" },
  "Maluku":           { color: "#6B4226", note: "Biaya SMA termurah"    },
};

// ── Init ────────────────────────────────────────────────────────────────────

function initScatterChart() {
  const canvas = document.getElementById("scatterChart");
  if (!canvas) return;

  // Inject tab buttons ke dalam #scatter-chart-container (sebelum canvas)
  const container = document.getElementById("scatter-chart-container");
  const tabBar = document.createElement("div");
  tabBar.id = "scatter-tabs";
  tabBar.style.cssText = "display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;";
  container.insertBefore(tabBar, canvas);

  // Inject korelasi box
  const corrBox = document.createElement("div");
  corrBox.id = "scatter-corr-box";
  corrBox.style.cssText = [
    "position:absolute",
    "top:56px",
    "right:16px",
    "background:#111827",
    "border:1px solid rgba(255,255,255,0.12)",
    "border-radius:8px",
    "padding:12px 16px",
    "min-width:180px",
    "pointer-events:none",
    "z-index:10",
  ].join(";");
  container.style.position = "relative";
  container.appendChild(corrBox);

  let activeMode = 0;
  let chartInstance = null;

  function buildPairs(mode) {
    return DATA_KORELASI
      .filter(d => d[mode.biayaKey] != null)
      .map(d => ({ x: d[mode.biayaKey], y: d[mode.apsKey], provinsi: d.provinsi }));
  }

  function updateCorrBox(mode, pairs) {
    const r = pearson(pairs);
    corrBox.innerHTML = `
      <div style="font-size:9px;letter-spacing:.08em;color:#7a7d90;margin-bottom:6px;text-transform:uppercase;">Korelasi Pearson</div>
      <div style="font-size:22px;font-weight:700;color:${mode.rColor};letter-spacing:-.5px;">
        ${r >= 0 ? "▲" : "▼"} r = ${r.toFixed(4)}
      </div>
      <div style="font-size:11px;color:#a0a4b8;margin-top:4px;">${rLabel(r)}</div>
    `;
  }

  function renderChart(modeIndex) {
    activeMode = modeIndex;
    const mode  = MODES[modeIndex];
    const pairs = buildPairs(mode);
    const { a, b } = regressionLine(pairs);

    const xVals = pairs.map(p => p.x);
    const xMin  = Math.floor(Math.min(...xVals) - 0.5);
    const xMax  = Math.ceil(Math.max(...xVals)  + 0.5);

    // Warna titik: highlight khusus, sisanya pakai warna mode
    const pointColors  = pairs.map(p => HIGHLIGHTS[p.provinsi]?.color ?? mode.dotColor);
    const pointBorders = pairs.map(p => HIGHLIGHTS[p.provinsi]?.color ?? mode.dotBorder);
    const pointRadii   = pairs.map(p => HIGHLIGHTS[p.provinsi] ? 7 : 5);

    const regrPoints = [
      { x: xMin, y: a + b * xMin },
      { x: xMax, y: a + b * xMax },
    ];

    if (chartInstance) chartInstance.destroy();

    const ctx = canvas.getContext("2d");
    chartInstance = new Chart(ctx, {
      data: {
        datasets: [
          {
            type: "scatter",
            label: "Provinsi",
            data: pairs,
            backgroundColor: pointColors,
            borderColor: pointBorders,
            borderWidth: 1.5,
            pointRadius: pointRadii,
            pointHoverRadius: 8,
          },
          {
            type: "line",
            label: "Regresi Linear",
            data: regrPoints,
            borderColor: mode.lineColor,
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: "easeOutQuart" },
        layout: { padding: { top: 8, right: 16, bottom: 8, left: 8 } },
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: mode.biayaLabel,
              color: "#7a7d90",
              font: { size: 11 },
            },
            min: xMin,
            max: xMax,
            ticks: {
              color: "#7a7d90",
              font: { size: 10 },
              callback: v => `Rp${v}jt`,
            },
            grid: { color: "rgba(255,255,255,0.06)", borderDash: [3, 3] },
            border: { color: "rgba(255,255,255,0.12)" },
          },
          y: {
            title: {
              display: true,
              text: mode.apsLabel,
              color: "#7a7d90",
              font: { size: 11 },
            },
            min: 40,
            max: 102,
            ticks: {
              color: "#7a7d90",
              font: { size: 10 },
              callback: v => `${v}%`,
            },
            grid: { color: "rgba(255,255,255,0.06)", borderDash: [3, 3] },
            border: { color: "rgba(255,255,255,0.12)" },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            filter: item => item.datasetIndex === 0, // hanya titik, bukan garis regresi
            backgroundColor: "#1a1d27",
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
            titleColor: "#ffffff",
            bodyColor: "#a0a4b8",
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              title: items => items[0].raw.provinsi,
              label: item => [
                `  Biaya: Rp${item.raw.x.toFixed(2)} juta`,
                `  APS  : ${item.raw.y.toFixed(2)}%`,
              ],
              afterBody: items => {
                const prov = items[0].raw.provinsi;
                const h = HIGHLIGHTS[prov];
                return h ? ["", `  ★ ${h.note}`] : [];
              },
            },
          },
        },
      },
    });

    updateCorrBox(mode, pairs);
    updateTabs(modeIndex);
  }

  // ── Tab buttons ────────────────────────────────────────────────────────────

  function updateTabs(activeIdx) {
    tabBar.innerHTML = "";
    MODES.forEach((m, i) => {
      const btn = document.createElement("button");
      btn.textContent = m.label;
      const isActive = i === activeIdx;
      btn.style.cssText = [
        "padding:8px 16px",
        "border-radius:6px",
        "font-size:13px",
        "font-weight:" + (isActive ? "600" : "400"),
        "cursor:pointer",
        "transition:all .2s",
        isActive
          ? `background:${m.rColor};color:#111;border:none;`
          : "background:transparent;color:#c0c4d6;border:1px solid rgba(255,255,255,0.15);",
      ].join(";");
      btn.addEventListener("click", () => renderChart(i));
      tabBar.appendChild(btn);
    });
  }

  // ── Legend bawah ──────────────────────────────────────────────────────────

  const legendBar = document.createElement("div");
  legendBar.style.cssText = [
    "display:flex",
    "justify-content:space-between",
    "flex-wrap:wrap",
    "gap:8px",
    "margin-top:12px",
    "font-size:11px",
    "color:#7a7d90",
    "padding:0 4px",
  ].join(";");
  legendBar.innerHTML = `
    <div style="display:flex;gap:16px;flex-wrap:wrap;">
      <span style="display:flex;align-items:center;gap:5px;">
        <span style="width:10px;height:10px;border-radius:50%;background:#aaa;display:inline-block;"></span>
        Satu titik = satu provinsi
      </span>
      <span style="display:flex;align-items:center;gap:5px;">
        <span style="display:inline-block;width:22px;height:1px;border-top:2px dashed #888;"></span>
        Garis regresi linear
      </span>
    </div>
    <span>Sumber: BPS / Susenas</span>
  `;
  container.appendChild(legendBar);

  // Highlight legend
  const hlLegend = document.createElement("div");
  hlLegend.style.cssText = "display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;font-size:11px;padding:0 4px;";
  Object.entries(HIGHLIGHTS).forEach(([prov, cfg]) => {
    hlLegend.innerHTML += `
      <span style="display:flex;align-items:center;gap:4px;color:${cfg.color};">
        <span style="width:8px;height:8px;border-radius:50%;background:${cfg.color};display:inline-block;"></span>
        ${prov}
      </span>`;
  });
  container.appendChild(hlLegend);

  // Render default: SMA
  renderChart(2);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScatterChart);
} else {
  initScatterChart();
}

// ==============================
// SECTION 05 — Korelasi Asupan Protein vs Stunting
// Canvas: #proteinChart
// ==============================

const DATA_PROTEIN = [
  { provinsi: "Aceh",                   p512: 47.2, p1315: 56.3, p1618: 60.1, s512: 24.1, s1315: 42.9, s1618: 35.6 },
  { provinsi: "Sumatera Utara",         p512: 52.1, p1315: 61.4, p1618: 65.8, s512: 20.2, s1315: 33.2, s1618: 31.4 },
  { provinsi: "Sumatera Barat",         p512: 54.3, p1315: 63.7, p1618: 67.2, s512: 21.3, s1315: 22.2, s1618: 26.3 },
  { provinsi: "Riau",                   p512: 57.8, p1315: 66.2, p1618: 69.5, s512: 15.2, s1315: 24.6, s1618: 25.6 },
  { provinsi: "Jambi",                  p512: 49.6, p1315: 58.1, p1618: 62.4, s512: 20.5, s1315: 42.9, s1618: 27.9 },
  { provinsi: "Sumatera Selatan",       p512: 53.2, p1315: 62.5, p1618: 66.3, s512: 18.1, s1315: 24.9, s1618: 20.5 },
  { provinsi: "Bengkulu",               p512: 50.8, p1315: 59.4, p1618: 63.7, s512: 17.7, s1315: 25.6, s1618: 25.8 },
  { provinsi: "Lampung",                p512: 51.4, p1315: 60.8, p1618: 64.2, s512: 17.4, s1315: 27.6, s1618: 22.5 },
  { provinsi: "Kep. Bangka Belitung",   p512: 58.6, p1315: 67.3, p1618: 70.8, s512: 14.8, s1315: 21.7, s1618: 19.6 },
  { provinsi: "Kepulauan Riau",         p512: 62.3, p1315: 71.5, p1618: 74.9, s512: 15.3, s1315: 15.3, s1618: 13.7 },
  { provinsi: "DKI Jakarta",            p512: 68.7, p1315: 78.2, p1618: 81.4, s512: 10.3, s1315:  9.5, s1618: 13.7 },
  { provinsi: "Jawa Barat",             p512: 55.4, p1315: 64.8, p1618: 68.1, s512: 17.2, s1315: 20.3, s1618: 20.6 },
  { provinsi: "Jawa Tengah",            p512: 56.9, p1315: 66.1, p1618: 69.4, s512: 16.2, s1315: 19.0, s1618: 19.5 },
  { provinsi: "D I Yogyakarta",         p512: 67.4, p1315: 76.9, p1618: 80.2, s512: 11.2, s1315: 12.2, s1618: 14.8 },
  { provinsi: "Jawa Timur",             p512: 57.3, p1315: 66.7, p1618: 70.0, s512: 16.1, s1315: 20.4, s1618: 19.8 },
  { provinsi: "Banten",                 p512: 58.1, p1315: 67.4, p1618: 70.7, s512: 16.8, s1315: 22.1, s1618: 21.3 },
  { provinsi: "Bali",                   p512: 69.8, p1315: 79.3, p1618: 82.6, s512:  8.9, s1315: 10.4, s1618: 11.2 },
  { provinsi: "NTB",                    p512: 48.7, p1315: 57.9, p1618: 61.2, s512: 22.4, s1315: 30.1, s1618: 28.7 },
  { provinsi: "NTT",                    p512: 43.2, p1315: 51.6, p1618: 55.8, s512: 30.2, s1315: 38.5, s1618: 34.1 },
  { provinsi: "Kalimantan Barat",       p512: 50.3, p1315: 59.6, p1618: 63.9, s512: 23.1, s1315: 32.4, s1618: 29.8 },
  { provinsi: "Kalimantan Tengah",      p512: 54.7, p1315: 64.0, p1618: 67.3, s512: 19.8, s1315: 28.3, s1618: 26.5 },
  { provinsi: "Kalimantan Selatan",     p512: 55.9, p1315: 65.2, p1618: 68.5, s512: 18.6, s1315: 26.7, s1618: 24.3 },
  { provinsi: "Kalimantan Timur",       p512: 61.4, p1315: 70.7, p1618: 74.0, s512: 14.9, s1315: 21.3, s1618: 20.1 },
  { provinsi: "Kalimantan Utara",       p512: 59.2, p1315: 68.5, p1618: 71.8, s512: 16.3, s1315: 23.8, s1618: 22.4 },
  { provinsi: "Sulawesi Utara",         p512: 56.8, p1315: 66.1, p1618: 69.4, s512: 15.2, s1315: 23.6, s1618: 24.3 },
  { provinsi: "Sulawesi Tengah",        p512: 46.3, p1315: 55.6, p1618: 58.9, s512: 22.7, s1315: 28.4, s1618: 33.0 },
  { provinsi: "Sulawesi Selatan",       p512: 53.6, p1315: 62.9, p1618: 66.2, s512: 24.6, s1315: 24.7, s1618: 26.0 },
  { provinsi: "Sulawesi Tenggara",      p512: 48.1, p1315: 57.4, p1618: 60.7, s512: 24.3, s1315: 27.6, s1618: 30.2 },
  { provinsi: "Gorontalo",              p512: 47.5, p1315: 56.8, p1618: 60.1, s512: 24.8, s1315: 28.2, s1618: 35.2 },
  { provinsi: "Sulawesi Barat",         p512: 44.8, p1315: 53.1, p1618: 57.4, s512: 28.4, s1315: 36.9, s1618: 37.7 },
  { provinsi: "Maluku",                 p512: 51.7, p1315: 61.0, p1618: 64.3, s512: 26.6, s1315: 31.4, s1618: 29.8 },
  { provinsi: "Maluku Utara",           p512: 52.4, p1315: 61.7, p1618: 65.0, s512: 21.9, s1315: 32.9, s1618: 25.4 },
  { provinsi: "Papua Barat",            p512: 48.9, p1315: 58.2, p1618: 61.5, s512: 27.3, s1315: 24.8, s1618: 21.2 },
  { provinsi: "Papua Barat Daya",       p512: 47.6, p1315: 56.9, p1618: 60.2, s512: 27.0, s1315: 33.3, s1618: 26.5 },
  { provinsi: "Papua",                  p512: 46.1, p1315: 55.4, p1618: 58.7, s512: 21.8, s1315: 21.8, s1618: 24.1 },
  { provinsi: "Papua Selatan",          p512: 44.5, p1315: 53.8, p1618: 57.1, s512: 23.4, s1315: 33.3, s1618: 32.8 },
  { provinsi: "Papua Tengah",           p512: 41.3, p1315: 49.6, p1618: 53.9, s512: 32.8, s1315: 22.8, s1618: 36.8 },
  { provinsi: "Papua Pegunungan",       p512: 38.7, p1315: 46.2, p1618: 50.5, s512: 25.0, s1315: 58.4, s1618: 41.5 },
];

// ── Statistik ────────────────────────────────────────────────────────────────

function pearson(pairs) {
  const n  = pairs.length;
  const mx = pairs.reduce((s, p) => s + p.x, 0) / n;
  const my = pairs.reduce((s, p) => s + p.y, 0) / n;
  const num = pairs.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
  const dx  = Math.sqrt(pairs.reduce((s, p) => s + (p.x - mx) ** 2, 0));
  const dy  = Math.sqrt(pairs.reduce((s, p) => s + (p.y - my) ** 2, 0));
  return num / (dx * dy);
}

function regressionLine(pairs) {
  const n  = pairs.length;
  const mx = pairs.reduce((s, p) => s + p.x, 0) / n;
  const my = pairs.reduce((s, p) => s + p.y, 0) / n;
  const b  = pairs.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) /
             pairs.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  const a  = my - b * mx;
  return { a, b };
}

function rLabel(r) {
  const abs = Math.abs(r);
  const dir = r < 0 ? "Negatif" : "Positif";
  const str = abs >= 0.7 ? "Kuat" : abs >= 0.4 ? "Sedang" : "Lemah";
  return `${dir} – ${str}`;
}

// ── Mode per jenjang ─────────────────────────────────────────────────────────

const PROTEIN_MODES = [
  {
    key: "sd",
    label: "SD (5–12 thn)",
    proteinKey: "p512",
    stuntingKey: "s512",
    xLabel: "Asupan Protein SD (gr/kapita/hari)",
    yLabel: "Prevalensi Stunting 5–12 (%)",
    dotColor:  "rgba(255, 209, 102, 0.85)",
    dotBorder: "rgba(255, 209, 102, 1)",
    lineColor: "rgba(255, 209, 102, 0.55)",
    rColor:    "#FFD166",
    activeText: "#111",
  },
  {
    key: "smp",
    label: "SMP (13–15 thn)",
    proteinKey: "p1315",
    stuntingKey: "s1315",
    xLabel: "Asupan Protein SMP (gr/kapita/hari)",
    yLabel: "Prevalensi Stunting 13–15 (%)",
    dotColor:  "rgba(6, 214, 160, 0.85)",
    dotBorder: "rgba(6, 214, 160, 1)",
    lineColor: "rgba(6, 214, 160, 0.55)",
    rColor:    "#06D6A0",
    activeText: "#111",
  },
  {
    key: "sma",
    label: "SMA (16–18 thn)",
    proteinKey: "p1618",
    stuntingKey: "s1618",
    xLabel: "Asupan Protein SMA (gr/kapita/hari)",
    yLabel: "Prevalensi Stunting 16–18 (%)",
    dotColor:  "rgba(255, 107, 53, 0.85)",
    dotBorder: "rgba(255, 107, 53, 1)",
    lineColor: "rgba(255, 107, 53, 0.55)",
    rColor:    "#FF6B35",
    activeText: "#fff",
  },
];

// ── Highlight provinsi ────────────────────────────────────────────────────────

const PROTEIN_HIGHLIGHTS = {
  "Papua Pegunungan": { color: "#E71D36", note: "Protein terendah, stunting tertinggi" },
  "Bali":             { color: "#8B4513", note: "Protein tinggi, stunting terendah"         },
  "DKI Jakarta":   { color: "#A78BFA", note: "Protein tinggi, stunting sangat rendah"    },
};

// ── Init ──────────────────────────────────────────────────────────────────────

function initProteinChart() {
  const canvas  = document.getElementById("proteinChart");
  const tabBar  = document.getElementById("protein-tabs");
  const corrBox = document.getElementById("protein-corr-box");
  if (!canvas || !tabBar || !corrBox) return;

  let chartInstance = null;

  function buildPairs(mode) {
    return DATA_PROTEIN.map(d => ({
      x: d[mode.proteinKey],
      y: d[mode.stuntingKey],
      provinsi: d.provinsi,
    }));
  }

  function updateCorrBox(mode, pairs) {
    const r = pearson(pairs);
    corrBox.innerHTML = `
      <div class="corr-label">Korelasi Pearson</div>
      <div class="corr-value" style="color:${mode.rColor};">
        ${r >= 0 ? "▲" : "▼"} r = ${r.toFixed(4)}
      </div>
      <div class="corr-desc">${rLabel(r)}</div>
    `;
  }

  function renderChart(modeIndex) {
    const mode  = PROTEIN_MODES[modeIndex];
    const pairs = buildPairs(mode);
    const { a, b } = regressionLine(pairs);

    const xVals = pairs.map(p => p.x);
    const xMin  = Math.floor(Math.min(...xVals) - 1);
    const xMax  = Math.ceil(Math.max(...xVals)  + 1);
    const yVals = pairs.map(p => p.y);
    const yMin  = Math.max(0, Math.floor(Math.min(...yVals) - 3));
    const yMax  = Math.ceil(Math.max(...yVals) + 5);

    const pointColors  = pairs.map(p => PROTEIN_HIGHLIGHTS[p.provinsi]?.color ?? mode.dotColor);
    const pointBorders = pairs.map(p => PROTEIN_HIGHLIGHTS[p.provinsi]?.color ?? mode.dotBorder);
    const pointRadii   = pairs.map(p => PROTEIN_HIGHLIGHTS[p.provinsi] ? 7 : 5);

    const regrPoints = [
      { x: xMin, y: a + b * xMin },
      { x: xMax, y: a + b * xMax },
    ];

    if (chartInstance) chartInstance.destroy();

    const ctx = canvas.getContext("2d");
    chartInstance = new Chart(ctx, {
      data: {
        datasets: [
          {
            type: "scatter",
            label: "Provinsi",
            data: pairs,
            backgroundColor: pointColors,
            borderColor: pointBorders,
            borderWidth: 1.5,
            pointRadius: pointRadii,
            pointHoverRadius: 8,
          },
          {
            type: "line",
            label: "Regresi Linear",
            data: regrPoints,
            borderColor: mode.lineColor,
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: "easeOutQuart" },
        layout: { padding: { top: 8, right: 16, bottom: 8, left: 8 } },
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: mode.xLabel,
              color: "#7a7d90",
              font: { size: 11 },
            },
            min: xMin,
            max: xMax,
            ticks: {
              color: "#7a7d90",
              font: { size: 10 },
              callback: v => `${v} gr`,
            },
            grid: { color: "rgba(255,255,255,0.06)", borderDash: [3, 3] },
            border: { color: "rgba(255,255,255,0.12)" },
          },
          y: {
            title: {
              display: true,
              text: mode.yLabel,
              color: "#7a7d90",
              font: { size: 11 },
            },
            min: yMin,
            max: yMax,
            ticks: {
              color: "#7a7d90",
              font: { size: 10 },
              callback: v => `${v}%`,
            },
            grid: { color: "rgba(255,255,255,0.06)", borderDash: [3, 3] },
            border: { color: "rgba(255,255,255,0.12)" },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            filter: item => item.datasetIndex === 0,
            backgroundColor: "#1a1d27",
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
            titleColor: "#ffffff",
            bodyColor: "#a0a4b8",
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              title: items => items[0].raw.provinsi,
              label: item => [
                `  Protein : ${item.raw.x.toFixed(1)} gr/kapita/hari`,
                `  Stunting: ${item.raw.y.toFixed(1)}%`,
              ],
              afterBody: items => {
                const h = PROTEIN_HIGHLIGHTS[items[0].raw.provinsi];
                return h ? ["", `  ★ ${h.note}`] : [];
              },
            },
          },
        },
      },
    });

    updateCorrBox(mode, pairs);
    updateTabs(modeIndex);
  }

  function updateTabs(activeIdx) {
    tabBar.innerHTML = "";
    PROTEIN_MODES.forEach((m, i) => {
      const btn = document.createElement("button");
      btn.textContent = m.label;
      if (i === activeIdx) {
        btn.classList.add("tab-active");
        btn.style.background = m.rColor;
        btn.style.color = m.activeText;
      } else {
        btn.classList.add("tab-inactive");
      }
      btn.addEventListener("click", () => renderChart(i));
      tabBar.appendChild(btn);
    });
  }

  // Default: SD
  renderChart(0);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProteinChart);
} else {
  initProteinChart();
}