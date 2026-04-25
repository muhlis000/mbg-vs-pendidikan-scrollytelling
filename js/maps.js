// ==============================
// SECTION — Peta Persebaran SPPG (MBG)
// Map container: #map
// ==============================

const SPPG_DATA = {
  "Aceh":                       670,
  "Sumatera Utara":             1309,
  "Sumatera Barat":             396,
  "Riau":                       685,
  "Jambi":                      200,
  "Sumatera Selatan":           785,
  "Bengkulu":                   136,
  "Lampung":                    1122,
  "Kepulauan Bangka Belitung":  101,
  "Kepulauan Riau":             223,
  "DKI Jakarta":                577,
  "Jawa Barat":                 6059,
  "Jawa Tengah":                4136,
  "D I Yogyakarta":             431,
  "Jawa Timur":                 3856,
  "Banten":                     1310,
  "Bali":                       636,
  "Nusa Tenggara Barat":        539,
  "Nusa Tenggara Timur":        1030,
  "Kalimantan Barat":           697,
  "Kalimantan Tengah":          342,
  "Kalimantan Selatan":         601,
  "Kalimantan Timur":           538,
  "Kalimantan Utara":           101,
  "Sulawesi Utara":             177,
  "Sulawesi Tengah":            223,
  "Sulawesi Selatan":           804,
  "Sulawesi Tenggara":          267,
  "Gorontalo":                  89,
  "Sulawesi Barat":             171,
  "Maluku":                     104,
  "Maluku Utara":               102,
  "Papua Barat":                49,
  "Papua Barat Daya":           33,
  "Papua":                      1,
  "Papua Selatan":              16,
  "Papua Tengah":               34,
  "Papua Pegunungan":           12,
};

// ── Skala warna choropleth (7 level, ramp hijau) ──────────────────────────────

const BREAKS = [0, 50, 150, 400, 800, 2000, 6100];
const COLORS  = [
  "#EAF3DE", // < 50       — hijau paling terang
  "#C0DD97", // 50–149
  "#97C459", // 150–399
  "#639922", // 400–799
  "#3B6D11", // 800–1.999
  "#27500A", // 2.000–6.000
  "#173404", // 6.000+     — hijau paling gelap
];
const LEGEND_LABELS = [
  "< 50",
  "50–149",
  "150–399",
  "400–799",
  "800–1.999",
  "2.000–6.000",
  "6.000+",
];

function getColor(val) {
  for (let i = BREAKS.length - 2; i >= 0; i--) {
    if (val >= BREAKS[i]) return COLORS[i];
  }
  return COLORS[0];
}

// ── Normalisasi nama provinsi GeoJSON → key SPPG_DATA ────────────────────────

const ALIASES = {
  "jakarta":              "DKI Jakarta",
  "yogyakarta":           "D I Yogyakarta",
  "bangka":               "Kepulauan Bangka Belitung",
  "nusa tenggara barat":  "Nusa Tenggara Barat",
  "nusa tenggara timur":  "Nusa Tenggara Timur",
  "kalimantan timur":     "Kalimantan Timur",
  "kalimantan utara":     "Kalimantan Utara",
};

function normStr(s) {
  return s
    .toLowerCase()
    .replace(/^(provinsi|daerah istimewa|kepulauan)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function nameMatch(geoName) {
  const gn = normStr(geoName);

  // Exact match
  for (const [key, val] of Object.entries(SPPG_DATA)) {
    if (normStr(key) === gn) return { name: key, val };
  }

  // Partial match
  for (const [key, val] of Object.entries(SPPG_DATA)) {
    const kn = normStr(key);
    if (gn.includes(kn) || kn.includes(gn)) return { name: key, val };
  }

  // Alias fallback
  for (const [alias, mapped] of Object.entries(ALIASES)) {
    if (gn.includes(alias)) return { name: mapped, val: SPPG_DATA[mapped] || 0 };
  }

  return { name: geoName, val: 0 };
}

// ── Precompute ranking ────────────────────────────────────────────────────────

const RANKING = Object.entries(SPPG_DATA)
  .sort((a, b) => b[1] - a[1])
  .reduce((acc, [name], i) => { acc[name] = i + 1; return acc; }, {});

const TOTAL_SPPG = Object.values(SPPG_DATA).reduce((a, b) => a + b, 0);

// ── Init peta ─────────────────────────────────────────────────────────────────

function initSPPGMap() {
  const mapEl   = document.getElementById("map");
  const infoBox = document.getElementById("sppg-info-box");
  const legendBar  = document.getElementById("sppg-legend-bar");
  const legendLabs = document.getElementById("sppg-legend-labels");

  if (!mapEl) return;

  // Deteksi dark mode untuk tile layer
  const isDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const tileUrl = isDark
    ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
    : "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png";

  const map = L.map(mapEl, {
    center: [-2.5, 118],
    zoom: 4,
    zoomControl: true,
    scrollWheelZoom: false,  // nonaktif agar tidak bentrok dengan scroll halaman
    attributionControl: false,
  });

  L.tileLayer(tileUrl, {
    maxZoom: 10,
    subdomains: "abcd",
  }).addTo(map);

  let geojsonLayer = null;

  // ── Style per feature ───────────────────────────────────────────────────────

  function styleFeature(feature) {
    const rawName = feature.properties.name || feature.properties.NAME_1 || "";
    const { val } = nameMatch(rawName);
    return {
      fillColor:   getColor(val || 0),
      fillOpacity: 0.82,
      color:       isDark ? "#1a2a1a" : "#ffffff",
      weight:      0.8,
      opacity:     1,
    };
  }

  // ── Event per feature ───────────────────────────────────────────────────────

  function onEachFeature(feature, layer) {
    const rawName = feature.properties.name || feature.properties.NAME_1 || "";
    const { name, val } = nameMatch(rawName);
    const pct  = val ? ((val / TOTAL_SPPG) * 100).toFixed(1) : "0.0";
    const rank = RANKING[name] ?? "–";

    layer.on({
      mouseover(e) {
        const l = e.target;
        l.setStyle({ weight: 2, fillOpacity: 1, color: "#FFD166" });
        l.bringToFront();

        if (infoBox) {
          infoBox.innerHTML = val
            ? `<strong style="font-size:13px;">${name}</strong>
               <span style="margin-left:10px;font-size:12px;">
                 <strong>${val.toLocaleString("id-ID")} unit SPPG</strong>
                 &nbsp;·&nbsp; ${pct}% dari total nasional
                 &nbsp;·&nbsp; Peringkat #${rank} dari 38 provinsi
               </span>`
            : `<strong>${rawName}</strong> — data tidak tersedia`;
        }
      },

      mouseout(e) {
        geojsonLayer.resetStyle(e.target);
        if (infoBox) {
          infoBox.innerHTML = "Arahkan kursor ke provinsi untuk melihat detail.";
        }
      },

      click(e) {
        map.fitBounds(e.target.getBounds(), { padding: [20, 20] });
      },
    });

    // Tooltip
    if (val > 0) {
      layer.bindTooltip(
        `<div style="font-size:11px;line-height:1.5;">
          <strong>${name}</strong><br>
          ${val.toLocaleString("id-ID")} unit SPPG<br>
          Peringkat #${rank}
        </div>`,
        { sticky: true, opacity: 0.95 }
      );
    }
  }

  // ── Load GeoJSON (dengan fallback CDN) ──────────────────────────────────────

  const GEOJSON_URLS = [
    "https://cdn.jsdelivr.net/npm/indonesia-provinces-geojson@1.0.1/provinces.geojson",
    "https://unpkg.com/indonesia-provinces-geojson@1.0.1/provinces.geojson",
  ];

  function loadGeoJSON(urls, index = 0) {
    if (index >= urls.length) {
      if (infoBox) infoBox.textContent = "GeoJSON gagal dimuat. Coba refresh halaman.";
      return;
    }
    fetch(urls[index])
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(data => {
        geojsonLayer = L.geoJSON(data, {
          style: styleFeature,
          onEachFeature,
        }).addTo(map);
        map.fitBounds(geojsonLayer.getBounds());
      })
      .catch(() => loadGeoJSON(urls, index + 1));
  }

  loadGeoJSON(GEOJSON_URLS);

  // ── Legend bar ──────────────────────────────────────────────────────────────

  if (legendBar && legendLabs) {
    COLORS.forEach((color, i) => {
      const seg = document.createElement("div");
      seg.style.cssText = `width:52px;height:14px;background:${color};`;
      legendBar.appendChild(seg);

      const lbl = document.createElement("span");
      lbl.style.cssText = [
        "width:52px",
        "display:inline-block",
        "text-align:center",
        "font-size:10px",
        "margin-top:2px",
      ].join(";");
      lbl.textContent = LEGEND_LABELS[i];
      legendLabs.appendChild(lbl);
    });
  }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSPPGMap);
} else {
  initSPPGMap();
}