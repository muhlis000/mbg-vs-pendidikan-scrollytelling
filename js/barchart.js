// ==============================
// SECTION — Asupan Protein per Provinsi
// Canvas : #proteinChart
// Container: #protein-chart-container
// ==============================

const DATA_PROTEIN = [
  { provinsi: "Aceh",                 protein: 61.56 },
  { provinsi: "Sumatera Utara",       protein: 63.33 },
  { provinsi: "Sumatera Barat",       protein: 60.17 },
  { provinsi: "Riau",                 protein: 60.13 },
  { provinsi: "Jambi",                protein: 60.29 },
  { provinsi: "Sumatera Selatan",     protein: 66.89 },
  { provinsi: "Bengkulu",             protein: 61.87 },
  { provinsi: "Lampung",              protein: 59.05 },
  { provinsi: "Kep. Bangka Belitung", protein: 67.00 },
  { provinsi: "Kepulauan Riau",       protein: 69.83 },
  { provinsi: "DKI Jakarta",          protein: 68.25 },
  { provinsi: "Jawa Barat",           protein: 63.51 },
  { provinsi: "Jawa Tengah",          protein: 60.26 },
  { provinsi: "D I Yogyakarta",       protein: 65.00 },
  { provinsi: "Jawa Timur",           protein: 62.32 },
  { provinsi: "Banten",               protein: 62.13 },
  { provinsi: "Bali",                 protein: 67.72 },
  { provinsi: "NTB",                  protein: 58.41 },
  { provinsi: "NTT",                  protein: 55.06 },
  { provinsi: "Kalimantan Barat",     protein: 62.35 },
  { provinsi: "Kalimantan Tengah",    protein: 63.07 },
  { provinsi: "Kalimantan Selatan",   protein: 63.63 },
  { provinsi: "Kalimantan Timur",     protein: 67.72 },
  { provinsi: "Kalimantan Utara",     protein: 64.43 },
  { provinsi: "Sulawesi Utara",       protein: 65.89 },
  { provinsi: "Sulawesi Tengah",      protein: 59.90 },
  { provinsi: "Sulawesi Selatan",     protein: 64.78 },
  { provinsi: "Sulawesi Tenggara",    protein: 62.17 },
  { provinsi: "Gorontalo",            protein: 60.59 },
  { provinsi: "Sulawesi Barat",       protein: 61.54 },
  { provinsi: "Maluku",               protein: 56.32 },
  { provinsi: "Maluku Utara",         protein: 54.11 },
  { provinsi: "Papua Barat",          protein: 51.78 },
  { provinsi: "Papua Barat Daya",     protein: 56.26 },
  { provinsi: "Papua",                protein: 52.45 },
  { provinsi: "Papua Selatan",        protein: 55.60 },
  { provinsi: "Papua Tengah",         protein: 46.59 },
  { provinsi: "Papua Pegunungan",     protein: 41.34 },
];

// Urutkan: tertinggi → terendah
const DATA_PROTEIN_SORTED = [...DATA_PROTEIN].sort((a, b) => b.protein - a.protein);

// Rata-rata nasional
const PROTEIN_AVG = +(
  DATA_PROTEIN.reduce((s, d) => s + d.protein, 0) / DATA_PROTEIN.length
).toFixed(2);

// Ambang kecukupan protein WHO (57 gr/hari sebagai referensi umum)
const PROTEIN_WHO = 57;

function initProteinsChart() {
  const canvas = document.getElementById("proteinsChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Warna per bar: di atas rata-rata = oranye, di bawah = merah muda, terendah 5 = merah
  const sortedVals = DATA_PROTEIN_SORTED.map(d => d.protein);
  const bottomFive = new Set(
    [...DATA_PROTEIN].sort((a, b) => a.protein - b.protein).slice(0, 5).map(d => d.provinsi)
  );

  const barColors = DATA_PROTEIN_SORTED.map(d => {
    if (bottomFive.has(d.provinsi))  return "rgba(231, 29,  54,  0.85)"; // merah — kritis
    if (d.protein < PROTEIN_AVG)     return "rgba(255, 107, 53,  0.55)"; // oranye redup — di bawah rata-rata
    return                                   "rgba(255, 107, 53,  0.85)"; // oranye — di atas rata-rata
  });

  const borderColors = DATA_PROTEIN_SORTED.map(d => {
    if (bottomFive.has(d.provinsi))  return "#E71D36";
    if (d.protein < PROTEIN_AVG)     return "rgba(255,107,53,0.7)";
    return                                   "rgba(255,107,53,1)";
  });

  // Plugin: garis referensi rata-rata & WHO
  const refLinesPlugin = {
    id: "proteinRefLines",
    afterDraw(chart) {
      const { ctx: c, chartArea, scales } = chart;
      const xScale = scales.x;

      const lines = [
        { val: PROTEIN_AVG, color: "rgba(255,209,102,0.8)", dash: [5, 4], label: `Rata-rata: ${PROTEIN_AVG} gr` },
        { val: PROTEIN_WHO, color: "rgba(46,196,182,0.8)",  dash: [3, 3], label: `Ref. WHO: ${PROTEIN_WHO} gr`  },
      ];

      lines.forEach(line => {
        const px = xScale.getPixelForValue(line.val);
        if (px < chartArea.left || px > chartArea.right) return;

        c.save();
        c.beginPath();
        c.moveTo(px, chartArea.top);
        c.lineTo(px, chartArea.bottom);
        c.strokeStyle = line.color;
        c.lineWidth = 1.5;
        c.setLineDash(line.dash);
        c.stroke();

        // Label di atas garis
        c.font = "600 10px system-ui, sans-serif";
        c.fillStyle = line.color;
        c.textAlign = "center";
        c.fillText(line.label, px, chartArea.top - 6);
        c.restore();
      });
    },
  };

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: DATA_PROTEIN_SORTED.map(d => d.provinsi),
      datasets: [
        {
          label: "Asupan Protein (gr/kapita/hari)",
          data: DATA_PROTEIN_SORTED.map(d => d.protein),
          backgroundColor: barColors,
          borderColor: borderColors,
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      layout: { padding: { top: 20, right: 24, bottom: 4, left: 4 } },
      scales: {
        x: {
          min: 35,
          max: 75,
          title: {
            display: true,
            text: "Asupan Protein (gr/kapita/hari)",
            color: "#7a7d90",
            font: { size: 11 },
          },
          ticks: {
            color: "#7a7d90",
            font: { size: 10 },
            callback: val => val + " gr",
          },
          grid: {
            color: "rgba(255,255,255,0.06)",
            borderDash: [3, 3],
          },
          border: { color: "rgba(255,255,255,0.12)" },
        },
        y: {
          ticks: {
            color: item => {
              const prov = DATA_PROTEIN_SORTED[item.index]?.provinsi;
              return bottomFive.has(prov) ? "#E71D36" : "#c0c4d6";
            },
            font: { size: 10 },
            autoSkip: false,
          },
          grid: { display: false },
          border: { color: "rgba(255,255,255,0.08)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1a1d27",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
          titleColor: "#ffffff",
          bodyColor: "#a0a4b8",
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: items => items[0].label,
            label: item => `  Protein: ${item.raw} gr/kapita/hari`,
            afterLabel: item => {
              const val = item.raw;
              const diff = (val - PROTEIN_AVG).toFixed(2);
              const sign = diff >= 0 ? "+" : "";
              const vs   = `  vs rata-rata nasional: ${sign}${diff} gr`;
              const warn = bottomFive.has(item.label) ? "\n  ⚠ Termasuk 5 terendah nasional" : "";
              return [vs, ...(warn ? [warn] : [])];
            },
          },
        },
      },
    },
    plugins: [refLinesPlugin],
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProteinsChart);
} else {
  initProteinsChart();
}

// ==============================
// SECTION 02 — Biaya Pendidikan per Jenjang
// Canvas: #biayaChart
// ==============================

const DATA_BIAYA = [
  { provinsi: "Aceh",                   sd: 4.99,  smp: 6.04,  sma: 8.08  },
  { provinsi: "Sumatera Utara",         sd: 4.08,  smp: 4.95,  sma: 7.54  },
  { provinsi: "Sumatera Barat",         sd: 3.65,  smp: 6.36,  sma: 8.75  },
  { provinsi: "Riau",                   sd: 4.84,  smp: 7.07,  sma: 8.12  },
  { provinsi: "Jambi",                  sd: 3.55,  smp: 5.63,  sma: 7.25  },
  { provinsi: "Sumatera Selatan",       sd: 3.94,  smp: 6.54,  sma: 14.60 },
  { provinsi: "Bengkulu",               sd: 5.32,  smp: 6.68,  sma: 12.27 },
  { provinsi: "Lampung",                sd: 3.35,  smp: 4.96,  sma: 8.21  },
  { provinsi: "Kep. Bangka Belitung",   sd: 3.63,  smp: 5.80,  sma: 7.88  },
  { provinsi: "Kepulauan Riau",         sd: 9.49,  smp: 11.73, sma: 8.83  },
  { provinsi: "DKI Jakarta",            sd: 8.77,  smp: 8.73,  sma: 14.41 },
  { provinsi: "Jawa Barat",             sd: 4.62,  smp: 8.64,  sma: 11.49 },
  { provinsi: "Jawa Tengah",            sd: 4.25,  smp: 7.45,  sma: 9.67  },
  { provinsi: "D I Yogyakarta",         sd: 5.78,  smp: 7.07,  sma: 13.96 },
  { provinsi: "Jawa Timur",             sd: 4.15,  smp: 6.80,  sma: 10.35 },
  { provinsi: "Banten",                 sd: 5.10,  smp: 9.60,  sma: 11.10 },
  { provinsi: "Bali",                   sd: 5.50,  smp: 7.20,  sma: 11.20 },
  { provinsi: "NTB",                    sd: 3.80,  smp: 5.90,  sma: 7.95  },
  { provinsi: "NTT",                    sd: 3.20,  smp: 4.50,  sma: 6.45  },
  { provinsi: "Kalimantan Barat",       sd: 4.10,  smp: 6.20,  sma: 8.50  },
  { provinsi: "Kalimantan Tengah",      sd: 4.50,  smp: 6.80,  sma: 9.20  },
  { provinsi: "Kalimantan Selatan",     sd: 4.30,  smp: 7.10,  sma: 9.80  },
  { provinsi: "Kalimantan Timur",       sd: 5.80,  smp: 8.40,  sma: 11.50 },
  { provinsi: "Kalimantan Utara",       sd: 5.20,  smp: 7.60,  sma: 10.40 },
  { provinsi: "Sulawesi Utara",         sd: 4.36,  smp: 7.62,  sma: 11.75 },
  { provinsi: "Sulawesi Tengah",        sd: 3.81,  smp: 7.31,  sma: 7.86  },
  { provinsi: "Sulawesi Selatan",       sd: 4.34,  smp: 7.33,  sma: 10.01 },
  { provinsi: "Sulawesi Tenggara",      sd: 2.52,  smp: 3.81,  sma: 6.75  },
  { provinsi: "Gorontalo",              sd: 3.96,  smp: 6.34,  sma: 7.66  },
  { provinsi: "Sulawesi Barat",         sd: 2.93,  smp: 3.42,  sma: 6.18  },
  { provinsi: "Maluku",                 sd: 2.05,  smp: 3.18,  sma: 4.99  },
  { provinsi: "Maluku Utara",           sd: 3.15,  smp: 6.93,  sma: 8.05  },
  { provinsi: "Papua Barat",            sd: 4.45,  smp: 7.08,  sma: 14.11 },
  { provinsi: "Papua Barat Daya",       sd: 3.27,  smp: 8.73,  sma: 8.81  },
  { provinsi: "Papua",                  sd: 5.49,  smp: 9.05,  sma: 17.91 },
  { provinsi: "Papua Selatan",          sd: 4.79,  smp: 6.69,  sma: 8.08  },
  { provinsi: "Papua Tengah",           sd: 4.62,  smp: 4.68,  sma: 6.52  },
  { provinsi: "Papua Pegunungan",       sd: 1.60,  smp: null,  sma: 3.43  },
];

const DATA_BIAYA_SORTED = [...DATA_BIAYA].sort((a, b) => {
  const avg = d => {
    const vals = [d.sd, d.smp, d.sma].filter(v => v != null);
    return vals.reduce((s, v) => s + v, 0) / vals.length;
  };
  return avg(a) - avg(b);
});

const BIAYA_LABELS = DATA_BIAYA_SORTED.map(d => d.provinsi);

const COLOR_SD  = "rgba(255, 209, 102, 0.85)";
const COLOR_SMP = "rgba(6,  214, 160, 0.85)";
const COLOR_SMA = "rgba(255, 107, 53,  0.85)";

function initBiayaChart() {
  const canvas = document.getElementById("biayaChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const avgSD  = +(DATA_BIAYA.reduce((s, d) => s + (d.sd  ?? 0), 0) / DATA_BIAYA.filter(d => d.sd  != null).length).toFixed(2);
  const avgSMP = +(DATA_BIAYA.reduce((s, d) => s + (d.smp ?? 0), 0) / DATA_BIAYA.filter(d => d.smp != null).length).toFixed(2);
  const avgSMA = +(DATA_BIAYA.reduce((s, d) => s + (d.sma ?? 0), 0) / DATA_BIAYA.filter(d => d.sma != null).length).toFixed(2);

  // Konfigurasi garis rata-rata — terikat ke datasetIndex masing-masing
  const AVG_LINE_CONFIG = [
    { datasetIndex: 0, val: avgSD,  color: "rgba(255,209,102,0.75)", label: `Rata-rata SD: Rp${avgSD}jt`   },
    { datasetIndex: 1, val: avgSMP, color: "rgba(6,214,160,0.75)",   label: `Rata-rata SMP: Rp${avgSMP}jt`  },
    { datasetIndex: 2, val: avgSMA, color: "rgba(255,107,53,0.75)",  label: `Rata-rata SMA: Rp${avgSMA}jt`  },
  ];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: BIAYA_LABELS,
      datasets: [
        {
          label: "SD/Sederajat",
          data: DATA_BIAYA_SORTED.map(d => d.sd),
          backgroundColor: COLOR_SD,
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          label: "SMP/Sederajat",
          data: DATA_BIAYA_SORTED.map(d => d.smp),
          backgroundColor: COLOR_SMP,
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          label: "SMA/SMK",
          data: DATA_BIAYA_SORTED.map(d => d.sma),
          backgroundColor: DATA_BIAYA_SORTED.map(d =>
            d.provinsi === "Sumatera Selatan" ? "#E71D36" :
            d.provinsi === "Maluku"           ? "#2EC4B6" :
            COLOR_SMA
          ),
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      layout: { padding: { top: 20, right: 24, bottom: 4, left: 4 } },
      scales: {
        x: {
          title: {
            display: true,
            text: "Biaya (Juta Rp)",
            color: "#7a7d90",
            font: { size: 11 },
          },
          min: 0,
          ticks: {
            color: "#7a7d90",
            font: { size: 10 },
            callback: val => `Rp${val}jt`,
          },
          grid: { color: "rgba(255,255,255,0.06)", borderDash: [3, 3] },
          border: { color: "rgba(255,255,255,0.12)" },
        },
        y: {
          ticks: { color: "#c0c4d6", font: { size: 10 }, autoSkip: false },
          grid: { display: false },
          border: { color: "rgba(255,255,255,0.08)" },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            color: "#c0c4d6",
            font: { size: 11 },
            boxWidth: 12,
            boxHeight: 12,
            borderRadius: 3,
            padding: 16,
            usePointStyle: false,
          },
        },
        tooltip: {
          backgroundColor: "#1a1d27",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
          titleColor: "#ffffff",
          bodyColor: "#a0a4b8",
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: items => items[0].label,
            label: item => {
              if (item.raw == null) return null;
              return `  ${item.dataset.label}: Rp${item.raw.toFixed(2)} juta`;
            },
            afterBody: items => {
              const prov = items[0].label;
              if (prov === "Sumatera Selatan") return ["", "⚠ Biaya SMA Termahal #2 Nasional"];
              if (prov === "Maluku")           return ["", "✦ Biaya SMA Termurah Nasional"];
              return [];
            },
          },
        },
      },
    },

    plugins: [
      {
        id: "avgLines",
        afterDraw(chart) {
          const { ctx, chartArea, scales } = chart;
          const xScale = scales.x;

          // Kumpulkan hanya dataset yang sedang visible
          const visibleLines = AVG_LINE_CONFIG.filter(cfg =>
            chart.getDatasetMeta(cfg.datasetIndex).visible
          );

          visibleLines.forEach((cfg, lineIndex) => {
            const px = xScale.getPixelForValue(cfg.val);
            if (px < chartArea.left || px > chartArea.right) return;

            ctx.save();

            // Garis putus-putus vertikal
            ctx.beginPath();
            ctx.moveTo(px, chartArea.top);
            ctx.lineTo(px, chartArea.bottom);
            ctx.strokeStyle = cfg.color;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();

            // Label — offset berdasarkan urutan visible agar tidak tumpang tindih
            ctx.font = "10px system-ui, sans-serif";
            ctx.fillStyle = cfg.color;
            ctx.textAlign = "center";
            ctx.fillText(cfg.label, px, chartArea.top - 6 + lineIndex * 12);

            ctx.restore();
          });
        },
      },
    ],
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBiayaChart);
} else {
  initBiayaChart();
}

//==============================
// SECTION 03 — Tingkat Partisipasi Sekolah per Kelompok Usia (%)
// Canvas: #partisipasiChart
// ==============================

const DATA_APS = [
  { provinsi: "Aceh",                   aps712: 99.38, aps1315: 97.65, aps1618: 80.94 },
  { provinsi: "Sumatera Utara",         aps712: 99.54, aps1315: 97.67, aps1618: 77.51 },
  { provinsi: "Sumatera Barat",         aps712: 99.63, aps1315: 97.00, aps1618: 85.04 },
  { provinsi: "Riau",                   aps712: 99.74, aps1315: 95.47, aps1618: 77.42 },
  { provinsi: "Jambi",                  aps712: 99.45, aps1315: 95.59, aps1618: 74.39 },
  { provinsi: "Sumatera Selatan",       aps712: 99.50, aps1315: 95.68, aps1618: 73.78 },
  { provinsi: "Bengkulu",               aps712: 99.29, aps1315: 97.01, aps1618: 80.48 },
  { provinsi: "Lampung",                aps712: 99.62, aps1315: 95.72, aps1618: 75.35 },
  { provinsi: "Kep. Bangka Belitung",   aps712: 99.49, aps1315: 92.90, aps1618: 76.03 },
  { provinsi: "Kepulauan Riau",         aps712: 99.71, aps1315: 98.60, aps1618: 88.24 },
  { provinsi: "DKI Jakarta",            aps712: 99.32, aps1315: 98.74, aps1618: 88.22 },
  { provinsi: "Jawa Barat",             aps712: 99.50, aps1315: 96.58, aps1618: 75.80 },
  { provinsi: "Jawa Tengah",            aps712: 99.54, aps1315: 97.05, aps1618: 77.97 },
  { provinsi: "D I Yogyakarta",         aps712: 99.61, aps1315: 99.60, aps1618: 93.03 },
  { provinsi: "Jawa Timur",             aps712: 99.31, aps1315: 96.54, aps1618: 76.74 },
  { provinsi: "Banten",                 aps712: 99.22, aps1315: 95.86, aps1618: 73.53 },
  { provinsi: "Bali",                   aps712: 99.54, aps1315: 97.82, aps1618: 83.27 },
  { provinsi: "NTB",                    aps712: 99.18, aps1315: 96.85, aps1618: 79.52 },
  { provinsi: "NTT",                    aps712: 98.30, aps1315: 94.82, aps1618: 72.41 },
  { provinsi: "Kalimantan Barat",       aps712: 98.87, aps1315: 94.02, aps1618: 70.35 },
  { provinsi: "Kalimantan Tengah",      aps712: 98.93, aps1315: 93.88, aps1618: 71.66 },
  { provinsi: "Kalimantan Selatan",     aps712: 99.07, aps1315: 94.57, aps1618: 69.57 },
  { provinsi: "Kalimantan Timur",       aps712: 99.41, aps1315: 96.57, aps1618: 79.97 },
  { provinsi: "Kalimantan Utara",       aps712: 99.16, aps1315: 95.84, aps1618: 76.27 },
  { provinsi: "Sulawesi Utara",         aps712: 99.28, aps1315: 96.11, aps1618: 71.45 },
  { provinsi: "Sulawesi Tengah",        aps712: 98.56, aps1315: 94.58, aps1618: 75.36 },
  { provinsi: "Sulawesi Selatan",       aps712: 99.21, aps1315: 94.22, aps1618: 75.94 },
  { provinsi: "Sulawesi Tenggara",      aps712: 99.05, aps1315: 96.53, aps1618: 79.58 },
  { provinsi: "Gorontalo",              aps712: 98.85, aps1315: 92.35, aps1618: 72.00 },
  { provinsi: "Sulawesi Barat",         aps712: 98.56, aps1315: 92.30, aps1618: 73.22 },
  { provinsi: "Maluku",                 aps712: 99.56, aps1315: 97.75, aps1618: 77.28 },
  { provinsi: "Maluku Utara",           aps712: 99.04, aps1315: 97.08, aps1618: 79.62 },
  { provinsi: "Papua Barat",            aps712: 97.59, aps1315: 96.22, aps1618: 77.53 },
  { provinsi: "Papua Barat Daya",       aps712: 98.67, aps1315: 96.38, aps1618: 81.70 },
  { provinsi: "Papua",                  aps712: 97.51, aps1315: 97.32, aps1618: 81.78 },
  { provinsi: "Papua Selatan",          aps712: 91.65, aps1315: 89.29, aps1618: 66.97 },
  { provinsi: "Papua Tengah",           aps712: 80.13, aps1315: 67.86, aps1618: 44.61 },
  { provinsi: "Papua Pegunungan",       aps712: 82.24, aps1315: 71.08, aps1618: 50.79 },
];

const DATA_APS_SORTED = [...DATA_APS].sort((a, b) => a.aps1618 - b.aps1618);
const APS_LABELS = DATA_APS_SORTED.map(d => d.provinsi);

const HIGHLIGHT_LOW  = "Papua Tengah";
const HIGHLIGHT_HIGH = "D I Yogyakarta";

// Rata-rata nasional per kelompok
const avg712  = +(DATA_APS.reduce((s, d) => s + d.aps712,  0) / DATA_APS.length).toFixed(2);
const avg1315 = +(DATA_APS.reduce((s, d) => s + d.aps1315, 0) / DATA_APS.length).toFixed(2);
const avg1618 = +(DATA_APS.reduce((s, d) => s + d.aps1618, 0) / DATA_APS.length).toFixed(2);

// Konfigurasi per dataset: index → meta rata-rata
const AVG_LINE_CONFIG = [
  { datasetIndex: 0, val: avg712,  color: "rgba(99,179,237,0.75)",  label: `Rata-rata 7–12: ${avg712}%`   },
  { datasetIndex: 1, val: avg1315, color: "rgba(104,211,145,0.75)", label: `Rata-rata 13–15: ${avg1315}%`  },
  { datasetIndex: 2, val: avg1618, color: "rgba(252,129,74,0.75)",  label: `Rata-rata 16–18: ${avg1618}%`  },
];

function initPartisipasiChart() {
  const canvas = document.getElementById("partisipasiChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: APS_LABELS,
      datasets: [
        {
          label: "Usia 7–12 (SD)",
          data: DATA_APS_SORTED.map(d => d.aps712),
          backgroundColor: "rgba(99, 179, 237, 0.85)",
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          label: "Usia 13–15 (SMP)",
          data: DATA_APS_SORTED.map(d => d.aps1315),
          backgroundColor: "rgba(104, 211, 145, 0.85)",
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          label: "Usia 16–18 (SMA)",
          data: DATA_APS_SORTED.map(d => d.aps1618),
          backgroundColor: DATA_APS_SORTED.map(d =>
            d.provinsi === HIGHLIGHT_LOW  ? "#E53E3E" :
            d.provinsi === HIGHLIGHT_HIGH ? "#38B2AC" :
            "rgba(255, 107, 53,  0.85)"
          ),
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      layout: { padding: { top: 24, right: 24, bottom: 4, left: 4 } },
      scales: {
        x: {
          min: 0,
          max: 105,
          title: {
            display: true,
            text: "Angka Partisipasi Sekolah (%)",
            color: "#7a7d90",
            font: { size: 11 },
          },
          ticks: {
            color: "#7a7d90",
            font: { size: 10 },
            callback: val => `${val}%`,
          },
          grid: { color: "rgba(255,255,255,0.06)", borderDash: [3, 3] },
          border: { color: "rgba(255,255,255,0.12)" },
        },
        y: {
          ticks: {
            color: tickCtx => {
              const label = tickCtx.tick?.label;
              if (label === HIGHLIGHT_LOW)  return "#FC8181";
              if (label === HIGHLIGHT_HIGH) return "#81E6D9";
              return "#c0c4d6";
            },
            font: tickCtx => {
              const label = tickCtx.tick?.label;
              const isBold = label === HIGHLIGHT_LOW || label === HIGHLIGHT_HIGH;
              return { size: 10, weight: isBold ? "600" : "400" };
            },
            autoSkip: false,
          },
          grid: { display: false },
          border: { color: "rgba(255,255,255,0.08)" },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            color: "#c0c4d6",
            font: { size: 11 },
            boxWidth: 12,
            boxHeight: 12,
            borderRadius: 3,
            padding: 16,
            usePointStyle: false,
          },
        },
        tooltip: {
          backgroundColor: "#1a1d27",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
          titleColor: "#ffffff",
          bodyColor: "#a0a4b8",
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: items => items[0].label,
            label: item => `  ${item.dataset.label}: ${item.raw.toFixed(2)}%`,
            afterBody: items => {
              const prov = items[0].label;
              if (prov === HIGHLIGHT_LOW)  return ["", "⚠ APS 16–18 Terendah Nasional"];
              if (prov === HIGHLIGHT_HIGH) return ["", "✦ APS 16–18 Tertinggi Nasional"];
              return [];
            },
          },
        },
      },
    },

    plugins: [
      {
        id: "avgLinesAPS",
        afterDraw(chart) {
          const { ctx, chartArea, scales } = chart;
          const xScale = scales.x;

          AVG_LINE_CONFIG.forEach((cfg, i) => {
            // Cek apakah dataset ini sedang visible (user belum klik legend untuk hide)
            const meta = chart.getDatasetMeta(cfg.datasetIndex);
            if (!meta.visible) return;

            const px = xScale.getPixelForValue(cfg.val);
            if (px < chartArea.left || px > chartArea.right) return;

            // Hitung offset vertikal: hanya tampil label untuk dataset yang visible
            // Kumpulkan semua dataset visible agar label tidak tumpang tindih
            const visibleLines = AVG_LINE_CONFIG.filter(c =>
              chart.getDatasetMeta(c.datasetIndex).visible
            );
            const lineIndex = visibleLines.findIndex(c => c.datasetIndex === cfg.datasetIndex);

            ctx.save();

            // Garis putus-putus
            ctx.beginPath();
            ctx.moveTo(px, chartArea.top);
            ctx.lineTo(px, chartArea.bottom);
            ctx.strokeStyle = cfg.color;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();

            // Label di atas chart area, offset berdasarkan urutan visible
            ctx.font = "10px system-ui, sans-serif";
            ctx.fillStyle = cfg.color;
            ctx.textAlign = "center";
            ctx.fillText(cfg.label, px, chartArea.top - 6 + lineIndex * 12);

            ctx.restore();
          });
        },
      },
    ],
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPartisipasiChart);
} else {
  initPartisipasiChart();
}

// ==============================
// SECTION — Prevalensi Stunting per Kelompok Usia (%)
// Canvas: #stuntingChart
// ==============================

const DATA_STUNTING = [
  { provinsi: "Aceh",                   s512: 24.1, s1315: 42.9, s1618: 35.6 },
  { provinsi: "Sumatera Utara",         s512: 20.2, s1315: 33.2, s1618: 31.4 },
  { provinsi: "Sumatera Barat",         s512: 21.3, s1315: 22.2, s1618: 26.3 },
  { provinsi: "Riau",                   s512: 15.2, s1315: 24.6, s1618: 25.6 },
  { provinsi: "Jambi",                  s512: 20.5, s1315: 42.9, s1618: 27.9 },
  { provinsi: "Sumatera Selatan",       s512: 18.1, s1315: 24.9, s1618: 20.5 },
  { provinsi: "Bengkulu",               s512: 17.7, s1315: 25.6, s1618: 25.8 },
  { provinsi: "Lampung",                s512: 17.4, s1315: 27.6, s1618: 22.5 },
  { provinsi: "Kep. Bangka Belitung",   s512: 14.8, s1315: 21.7, s1618: 19.6 },
  { provinsi: "Kepulauan Riau",         s512: 15.3, s1315: 15.3, s1618: 13.7 },
  { provinsi: "DKI Jakarta",            s512: 10.3, s1315:  9.5, s1618: 13.7 },
  { provinsi: "Jawa Barat",             s512: 17.2, s1315: 20.3, s1618: 20.6 },
  { provinsi: "Jawa Tengah",            s512: 16.2, s1315: 19.0, s1618: 19.5 },
  { provinsi: "D I Yogyakarta",         s512: 11.2, s1315: 12.2, s1618: 14.8 },
  { provinsi: "Jawa Timur",             s512: 16.1, s1315: 20.4, s1618: 19.8 },
  { provinsi: "Banten",                 s512: 16.8, s1315: 22.1, s1618: 21.3 },
  { provinsi: "Bali",                   s512:  8.9, s1315: 10.4, s1618: 11.2 },
  { provinsi: "NTB",                    s512: 22.4, s1315: 30.1, s1618: 28.7 },
  { provinsi: "NTT",                    s512: 30.2, s1315: 38.5, s1618: 34.1 },
  { provinsi: "Kalimantan Barat",       s512: 23.1, s1315: 32.4, s1618: 29.8 },
  { provinsi: "Kalimantan Tengah",      s512: 19.8, s1315: 28.3, s1618: 26.5 },
  { provinsi: "Kalimantan Selatan",     s512: 18.6, s1315: 26.7, s1618: 24.3 },
  { provinsi: "Kalimantan Timur",       s512: 14.9, s1315: 21.3, s1618: 20.1 },
  { provinsi: "Kalimantan Utara",       s512: 16.3, s1315: 23.8, s1618: 22.4 },
  { provinsi: "Sulawesi Utara",         s512: 15.2, s1315: 23.6, s1618: 24.3 },
  { provinsi: "Sulawesi Tengah",        s512: 22.7, s1315: 28.4, s1618: 33.0 },
  { provinsi: "Sulawesi Selatan",       s512: 24.6, s1315: 24.7, s1618: 26.0 },
  { provinsi: "Sulawesi Tenggara",      s512: 24.3, s1315: 27.6, s1618: 30.2 },
  { provinsi: "Gorontalo",              s512: 24.8, s1315: 28.2, s1618: 35.2 },
  { provinsi: "Sulawesi Barat",         s512: 28.4, s1315: 36.9, s1618: 37.7 },
  { provinsi: "Maluku",                 s512: 26.6, s1315: 31.4, s1618: 29.8 },
  { provinsi: "Maluku Utara",           s512: 21.9, s1315: 32.9, s1618: 25.4 },
  { provinsi: "Papua Barat",            s512: 27.3, s1315: 24.8, s1618: 21.2 },
  { provinsi: "Papua Barat Daya",       s512: 27.0, s1315: 33.3, s1618: 26.5 },
  { provinsi: "Papua",                  s512: 21.8, s1315: 21.8, s1618: 24.1 },
  { provinsi: "Papua Selatan",          s512: 23.4, s1315: 33.3, s1618: 32.8 },
  { provinsi: "Papua Tengah",           s512: 32.8, s1315: 22.8, s1618: 36.8 },
  { provinsi: "Papua Pegunungan",       s512: 25.0, s1315: 58.4, s1618: 41.5 },
];

// Urutkan berdasarkan rata-rata stunting (descending — terparah di atas)
const DATA_STUNTING_SORTED = [...DATA_STUNTING].sort((a, b) => {
  const avg = d => (d.s512 + d.s1315 + d.s1618) / 3;
  return avg(b) - avg(a);
});

const STUNTING_LABELS = DATA_STUNTING_SORTED.map(d => d.provinsi);

const COLOR_512  = "rgba(99,  179, 237, 0.85)"; // biru — SD
const COLOR_1315 = "rgba(248, 150,  30, 0.85)"; // oranye — SMP
const COLOR_1618 = "rgba(240,  62,  62, 0.85)"; // merah — SMA

// Highlight provinsi ekstrem
const HIGHLIGHT_WORST = "Papua Pegunungan"; // s1315 = 58.4% tertinggi
const HIGHLIGHT_BEST  = "Bali";             // rata-rata terendah

function initStuntingChart() {
  const canvas = document.getElementById("stuntingChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const avg512  = +(DATA_STUNTING.reduce((s, d) => s + d.s512,  0) / DATA_STUNTING.length).toFixed(2);
  const avg1315 = +(DATA_STUNTING.reduce((s, d) => s + d.s1315, 0) / DATA_STUNTING.length).toFixed(2);
  const avg1618 = +(DATA_STUNTING.reduce((s, d) => s + d.s1618, 0) / DATA_STUNTING.length).toFixed(2);

  const AVG_LINE_CONFIG = [
    { datasetIndex: 0, val: avg512,  color: "rgba(99,179,237,0.8)",  label: `Rata-rata SD: ${avg512}%`   },
    { datasetIndex: 1, val: avg1315, color: "rgba(248,150,30,0.8)",  label: `Rata-rata SMP: ${avg1315}%`  },
    { datasetIndex: 2, val: avg1618, color: "rgba(240,62,62,0.8)",   label: `Rata-rata SMA: ${avg1618}%`  },
  ];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: STUNTING_LABELS,
      datasets: [
        {
          label: "Usia 5–12 (SD)",
          data: DATA_STUNTING_SORTED.map(d => d.s512),
          backgroundColor: DATA_STUNTING_SORTED.map(d =>
            d.provinsi === HIGHLIGHT_BEST ? "rgba(56,178,172,0.85)" : COLOR_512
          ),
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          label: "Usia 13–15 (SMP)",
          data: DATA_STUNTING_SORTED.map(d => d.s1315),
          backgroundColor: DATA_STUNTING_SORTED.map(d =>
            d.provinsi === HIGHLIGHT_WORST ? "#C05621" :
            d.provinsi === HIGHLIGHT_BEST  ? "rgba(56,178,172,0.6)" :
            COLOR_1315
          ),
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          label: "Usia 16–18 (SMA)",
          data: DATA_STUNTING_SORTED.map(d => d.s1618),
          backgroundColor: DATA_STUNTING_SORTED.map(d =>
            d.provinsi === HIGHLIGHT_WORST ? "#9B2335" :
            d.provinsi === HIGHLIGHT_BEST  ? "rgba(56,178,172,0.4)" :
            COLOR_1618
          ),
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      layout: { padding: { top: 24, right: 24, bottom: 4, left: 4 } },
      scales: {
        x: {
          min: 0,
          max: 65,
          title: {
            display: true,
            text: "Prevalensi Stunting (%)",
            color: "#7a7d90",
            font: { size: 11 },
          },
          ticks: {
            color: "#7a7d90",
            font: { size: 10 },
            callback: val => `${val}%`,
          },
          grid: { color: "rgba(255,255,255,0.06)", borderDash: [3, 3] },
          border: { color: "rgba(255,255,255,0.12)" },
        },
        y: {
          ticks: {
            color: tickCtx => {
              const label = tickCtx.tick?.label;
              if (label === HIGHLIGHT_WORST) return "#FC8181";
              if (label === HIGHLIGHT_BEST)  return "#81E6D9";
              return "#c0c4d6";
            },
            font: tickCtx => {
              const label = tickCtx.tick?.label;
              const isBold = label === HIGHLIGHT_WORST || label === HIGHLIGHT_BEST;
              return { size: 10, weight: isBold ? "600" : "400" };
            },
            autoSkip: false,
          },
          grid: { display: false },
          border: { color: "rgba(255,255,255,0.08)" },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            color: "#c0c4d6",
            font: { size: 11 },
            boxWidth: 12,
            boxHeight: 12,
            borderRadius: 3,
            padding: 16,
            usePointStyle: false,
          },
        },
        tooltip: {
          backgroundColor: "#1a1d27",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
          titleColor: "#ffffff",
          bodyColor: "#a0a4b8",
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: items => items[0].label,
            label: item => `  ${item.dataset.label}: ${item.raw.toFixed(1)}%`,
            afterBody: items => {
              const prov = items[0].label;
              if (prov === HIGHLIGHT_WORST) return ["", "⚠ Stunting SMP Tertinggi Nasional (58.4%)"];
              if (prov === HIGHLIGHT_BEST)  return ["", "✦ Rata-rata Stunting Terendah Nasional"];
              return [];
            },
          },
        },
      },
    },

    plugins: [
      {
        id: "avgLinesStunting",
        afterDraw(chart) {
          const { ctx, chartArea, scales } = chart;
          const xScale = scales.x;

          // Hanya gambar garis untuk dataset yang sedang visible
          const visibleLines = AVG_LINE_CONFIG.filter(cfg =>
            chart.getDatasetMeta(cfg.datasetIndex).visible
          );

          visibleLines.forEach((cfg, lineIndex) => {
            const px = xScale.getPixelForValue(cfg.val);
            if (px < chartArea.left || px > chartArea.right) return;

            ctx.save();

            // Garis putus-putus
            ctx.beginPath();
            ctx.moveTo(px, chartArea.top);
            ctx.lineTo(px, chartArea.bottom);
            ctx.strokeStyle = cfg.color;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();

            // Label — offset berdasarkan urutan visible agar tidak tumpang tindih
            ctx.font = "10px system-ui, sans-serif";
            ctx.fillStyle = cfg.color;
            ctx.textAlign = "center";
            ctx.fillText(cfg.label, px, chartArea.top - 6 + lineIndex * 12);

            ctx.restore();
          });
        },
      },
    ],
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStuntingChart);
} else {
  initStuntingChart();
}

// ==============================
// SECTION — Rata-rata Lama Sekolah (RLS)
// Canvas : #rlsChart
// Container: #rls-chart-container
// ==============================
 
const DATA_RLS = [
  { provinsi: "Aceh",                 rls: 9.18  },
  { provinsi: "Sumatera Utara",       rls: 9.72  },
  { provinsi: "Sumatera Barat",       rls: 9.00  },
  { provinsi: "Riau",                 rls: 9.03  },
  { provinsi: "Jambi",                rls: 8.59  },
  { provinsi: "Sumatera Selatan",     rls: 8.39  },
  { provinsi: "Bengkulu",             rls: 8.93  },
  { provinsi: "Lampung",              rls: 7.95  },
  { provinsi: "Kep. Bangka Belitung", rls: 8.44  },
  { provinsi: "Kepulauan Riau",       rls: 10.40 },
  { provinsi: "DKI Jakarta",          rls: 11.23 },
  { provinsi: "Jawa Barat",           rls: 8.61  },
  { provinsi: "Jawa Tengah",          rls: 7.96  },
  { provinsi: "D I Yogyakarta",       rls: 9.60  },
  { provinsi: "Jawa Timur",           rls: 7.88  },
  { provinsi: "Banten",               rls: 9.11  },
  { provinsi: "Bali",                 rls: 9.00  },
  { provinsi: "NTB",                  rls: 7.70  },
  { provinsi: "NTT",                  rls: 7.65  },
  { provinsi: "Kalimantan Barat",     rls: 7.63  },
  { provinsi: "Kalimantan Tengah",    rls: 8.78  },
  { provinsi: "Kalimantan Selatan",   rls: 8.15  },
  { provinsi: "Kalimantan Timur",     rls: 10.10 },
  { provinsi: "Kalimantan Utara",     rls: 9.04  },
  { provinsi: "Sulawesi Utara",       rls: 9.67  },
  { provinsi: "Sulawesi Tengah",      rls: 8.37  },
  { provinsi: "Sulawesi Selatan",     rls: 8.40  },
  { provinsi: "Sulawesi Tenggara",    rls: 8.90  },
  { provinsi: "Gorontalo",            rls: 7.95  },
  { provinsi: "Sulawesi Barat",       rls: 7.59  },
  { provinsi: "Maluku",               rls: 9.90  },
  { provinsi: "Maluku Utara",         rls: 9.27  },
  { provinsi: "Papua Barat",          rls: 9.12  },
  { provinsi: "Papua Barat Daya",     rls: 8.50  },
  { provinsi: "Papua",                rls: 6.87  },
  { provinsi: "Papua Selatan",        rls: 6.50  },
  { provinsi: "Papua Tengah",         rls: 5.40  },
  { provinsi: "Papua Pegunungan",     rls: 4.12  },
];
 
// Urutkan tertinggi → terendah
const DATA_RLS_SORTED = [...DATA_RLS].sort((a, b) => b.rls - a.rls);
 
// Rata-rata nasional
const RLS_AVG = +(DATA_RLS.reduce((s, d) => s + d.rls, 0) / DATA_RLS.length).toFixed(2);
 
// Target RPJMN 2024: 8.77 tahun
const RLS_TARGET = 8.77;
 
// 5 terendah
const RLS_BOTTOM5 = new Set(
  [...DATA_RLS].sort((a, b) => a.rls - b.rls).slice(0, 5).map(d => d.provinsi)
);
 
// Warna bar
const RLS_BAR_COLORS = DATA_RLS_SORTED.map(d => {
  if (RLS_BOTTOM5.has(d.provinsi)) return "rgba(231, 29, 54, 0.85)";   // merah — kritis
  if (d.rls < RLS_TARGET)          return "rgba(46, 196, 182, 0.50)";  // teal redup — di bawah target
  return                                   "rgba(46, 196, 182, 0.85)"; // teal — memenuhi target
});
 
// Plugin garis referensi
const rlsRefLinesPlugin = {
  id: "rlsRefLines",
  afterDraw(chart) {
    const { ctx: c, chartArea, scales } = chart;
    const xScale = scales.x;
 
    const lines = [
      { val: RLS_AVG,    color: "rgba(255,209,102,0.85)", dash: [5, 4], label: `Rata-rata: ${RLS_AVG} thn`   },
      { val: RLS_TARGET, color: "rgba(255,107, 53, 0.85)", dash: [3, 3], label: `Target RPJMN: ${RLS_TARGET} thn` },
    ];
 
    lines.forEach(line => {
      const px = xScale.getPixelForValue(line.val);
      if (px < chartArea.left || px > chartArea.right) return;
 
      c.save();
      c.beginPath();
      c.moveTo(px, chartArea.top);
      c.lineTo(px, chartArea.bottom);
      c.strokeStyle = line.color;
      c.lineWidth = 1.5;
      c.setLineDash(line.dash);
      c.stroke();
 
      c.font = "600 10px system-ui, sans-serif";
      c.fillStyle = line.color;
      c.textAlign = "center";
      c.fillText(line.label, px, chartArea.top - 6);
      c.restore();
    });
  },
};
 
function initRLSChart() {
  const canvas = document.getElementById("rlsChart");
  if (!canvas) return;
 
  const ctx = canvas.getContext("2d");
 
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: DATA_RLS_SORTED.map(d => d.provinsi),
      datasets: [
        {
          label: "Rata-rata Lama Sekolah (tahun)",
          data: DATA_RLS_SORTED.map(d => d.rls),
          backgroundColor: RLS_BAR_COLORS,
          borderWidth: 0,
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      layout: { padding: { top: 20, right: 24, bottom: 4, left: 4 } },
      scales: {
        x: {
          min: 3,
          max: 13,
          title: {
            display: true,
            text: "Rata-rata Lama Sekolah (tahun)",
            color: "#7a7d90",
            font: { size: 11 },
          },
          ticks: {
            color: "#7a7d90",
            font: { size: 10 },
            callback: val => val + " thn",
          },
          grid: {
            color: "rgba(255,255,255,0.06)",
            borderDash: [3, 3],
          },
          border: { color: "rgba(255,255,255,0.12)" },
        },
        y: {
          ticks: {
            color: item => {
              const prov = DATA_RLS_SORTED[item.index]?.provinsi;
              return RLS_BOTTOM5.has(prov) ? "#E71D36" : "#c0c4d6";
            },
            font: { size: 10 },
            autoSkip: false,
          },
          grid: { display: false },
          border: { color: "rgba(255,255,255,0.08)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1a1d27",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
          titleColor: "#ffffff",
          bodyColor: "#a0a4b8",
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: items => items[0].label,
            label: item => `  RLS: ${item.raw} tahun`,
            afterLabel: item => {
              const val  = item.raw;
              const diffAvg    = (val - RLS_AVG).toFixed(2);
              const diffTarget = (val - RLS_TARGET).toFixed(2);
              const signAvg    = diffAvg >= 0    ? "+" : "";
              const signTarget = diffTarget >= 0 ? "+" : "";
              const lines = [
                `  vs rata-rata nasional  : ${signAvg}${diffAvg} thn`,
                `  vs target RPJMN 2024  : ${signTarget}${diffTarget} thn`,
              ];
              if (RLS_BOTTOM5.has(item.label)) lines.push("  ⚠ Termasuk 5 terendah nasional");
              return lines;
            },
          },
        },
      },
    },
    plugins: [rlsRefLinesPlugin],
  });
}
 
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRLSChart);
} else {
  initRLSChart();
}