// ============================================================
// main.js — Scrolly Master (Orang 3) — Enhanced Animation Edition
//
// Pattern   : NYT-style sticky graphic + scrolling narrative steps
// Animasi   : Chart reveal (clip-path wipe), shimmer skeleton,
//             stat cards pop, annotation callouts, highlight pulse,
//             floating particles hero, morph transition antar step
// ============================================================

"use strict";

// ─────────────────────────────────────────────────────────────
// 0. CONFIG & METADATA
// ─────────────────────────────────────────────────────────────
const CFG = {
  STEP_HEIGHT_VH : 85,
  IO_MARGIN      : "42%",
  TRANSITION_MS  : 550,
};

// Global step registry — chartIndex null = full section (no chart)
const STEP_META = [
  { id: "hero",      label: "Dilema Besar",               chartIndex: null },
  { id: "biaya-1",   label: "Biaya Pendidikan Timpang",   chartIndex: 0    },
  { id: "biaya-2",   label: "Biaya Tinggi ≠ Partisipasi",chartIndex: 0    },
  { id: "aps-1",     label: "Papua: Lebih dari 50% DO",   chartIndex: 1    },
  { id: "aps-2",     label: "Kesenjangan 48 Poin",        chartIndex: 1    },
  { id: "scatter-1", label: "Paradoks Terungkap",         chartIndex: 2    },
  { id: "scatter-2", label: "Maluku > Sumsel",            chartIndex: 2    },
  { id: "mbg",       label: "MBG: Investasi atau Beban?", chartIndex: null },
  { id: "rls-1",     label: "Hanya 4.3 Tahun di PaPeg",  chartIndex: 3    },
  { id: "rls-2",     label: "Kesenjangan 7 Tahun",        chartIndex: 3    },
  { id: "conclusion",label: "Tidak Ada Jawaban Tunggal",  chartIndex: null },
];

// Stat cards yang dirender di sticky graphic area tiap section
const SECTION_STATS = {
  "section-2": [
    { value: "Rp17.91jt", label: "Biaya SMA Termahal", sub: "Papua",           color: "#FF6B35", icon: "📕" },
    { value: "Rp1.60jt",  label: "Biaya SD Termurah",  sub: "Papua Pegunungan",color: "#2A9D8F", icon: "📗" },
    { value: "Rp4.99jt",  label: "Biaya SMA Termurah", sub: "Maluku",           color: "#06D6A0", icon: "📘" },
  ],
  "section-3": [
    { value: "44.61%", label: "APS 16-18 Terendah",  sub: "Papua Tengah",    color: "#E63946", icon: "⚠️" },
    { value: "93.03%", label: "APS 16-18 Tertinggi", sub: "DIY Yogyakarta",  color: "#2A9D8F", icon: "✅" },
    { value: "48.42%", label: "Selisih",              sub: "Antar provinsi",  color: "#F4A261", icon: "↕️" },
  ],
  "section-4": [
    { value: "r ≈ 0.1", label: "Korelasi Biaya–APS", sub: "Sangat lemah",    color: "#A78BFA", icon: "📊" },
    { value: "73.78%",  label: "APS Sumsel",           sub: "Biaya Rp14.6jt", color: "#FF6B35", icon: "📉" },
    { value: "77.28%",  label: "APS Maluku",           sub: "Biaya Rp4.99jt", color: "#2A9D8F", icon: "📈" },
  ],
  "section-6": [
    { value: "4.30 th", label: "RLS Terendah",   sub: "Papua Pegunungan", color: "#E63946", icon: "📍" },
    { value: "11.59 th",label: "RLS Tertinggi",  sub: "DKI Jakarta",      color: "#2A9D8F", icon: "🏆" },
    { value: "7.29 th", label: "Selisih RLS",    sub: "Kesenjangan besar",color: "#F4A261", icon: "⚡" },
  ],
};

// Annotation callouts muncul di atas chart wrapper saat step tertentu aktif
const STEP_ANNOTATIONS = {
  1: { text: "⚡ Sumsel: SMA Rp14.6jt — Termahal #2", color: "#FF6B35" },
  2: { text: "💡 Biaya tinggi tidak berarti partisipasi tinggi", color: "#F4A261" },
  3: { text: "⚠️ Papua Tengah: hanya 44.61% remaja bersekolah", color: "#E63946" },
  4: { text: "📊 Kesenjangan 48 poin: DIY vs Papua Tengah", color: "#A78BFA" },
  5: { text: "🔍 Titik kiri-atas = mahal tapi partisipasi rendah", color: "#FF6B35" },
  6: { text: "✨ Maluku buktikan: murah bisa lebih baik", color: "#2A9D8F" },
  8: { text: "📍 Papua Peg: rata-rata hanya kelas 4 SD", color: "#E63946" },
  9: { text: "⚡ Kesenjangan 7.29 tahun antara ujung-ujung Indonesia", color: "#F4A261" },
};

let currentGlobalStep = -1;
let rafPending        = false;
let _pillTimer        = null;
let _annotTimer       = null;

// ─────────────────────────────────────────────────────────────
// 1. INJECT CSS
// ─────────────────────────────────────────────────────────────
function injectCSS() {
  const s = document.createElement("style");
  s.id = "scrolly-master-styles";
  s.textContent = /* css */ `

/* ══════════════════════════════════════
   STICKY SCENE LAYOUT
══════════════════════════════════════ */
.sticky-scene {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  min-height: 100vh;
}

.steps-column {
  padding: 10vh 3rem 28vh 4rem;
  order: 1;
}

.sticky-graphic {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 4rem 1.5rem 2rem;
  order: 2;
}

/* ── Chart wrapper reveal ── */
.sticky-graphic .chart-wrapper {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
  /* clip-path wipe from bottom on entry */
  clip-path: inset(100% 0 0 0);
  transition:
    clip-path 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    opacity   0.45s ease,
    transform ${CFG.TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1);
}

.sticky-graphic .chart-wrapper.revealed {
  clip-path: inset(0% 0 0 0);
  opacity: 1;
}

.sticky-graphic .chart-wrapper.chart-flash {
  opacity: 0.45;
  transform: scale(0.965);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.sticky-caption {
  text-align: center;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.8rem;
  line-height: 1.6;
  padding: 0 1rem;
  opacity: 0.85;
}

/* ── Shimmer skeleton (shown before chart loads) ── */
.chart-shimmer {
  position: absolute;
  inset: 0;
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  z-index: 5;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.4s ease 0.6s;
}
.chart-shimmer.hidden { opacity: 0; pointer-events: none; }

.chart-shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255,255,255,0.06) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: shimmerSweep 1.6s infinite;
}

@keyframes shimmerSweep {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Shimmer bars */
.shimmer-bars {
  position: absolute;
  inset: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
}
.shimmer-bar {
  height: 10px;
  border-radius: 4px;
  background: rgba(255,255,255,0.06);
}

/* ── Stat Cards ── */
.stat-cards-row {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.8rem;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 80px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 0.75rem 0.8rem;
  text-align: center;

  opacity: 0;
  transform: translateY(18px) scale(0.92);
  transition:
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.3s ease,
    background 0.3s ease;
}

.stat-card.popped {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.stat-card:hover {
  border-color: rgba(244,162,97,0.25);
  background: rgba(244,162,97,0.05);
}

.stat-card-icon  { font-size: 1.1rem; display: block; margin-bottom: 0.3rem; }
.stat-card-value {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  margin-bottom: 0.25rem;
}
.stat-card-label { display: block; font-size: 0.65rem; color: var(--text-muted); line-height: 1.4; }
.stat-card-sub   { display: block; font-size: 0.6rem; color: var(--text-muted); opacity: 0.7; }

/* ── Annotation Callout ── */
#chart-annotation {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%) translateY(-6px);
  background: rgba(10,22,40,0.92);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 0.72rem;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  border-left: 3px solid currentColor;
  z-index: 20;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.4,0.64,1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

#chart-annotation.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── Highlight pulse ring (around chart wrapper) ── */
.sticky-graphic .chart-wrapper::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 22px;
  border: 2px solid transparent;
  pointer-events: none;
  z-index: 15;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.sticky-graphic .chart-wrapper.pulse-ring::before {
  border-color: rgba(244,162,97,0.55);
  box-shadow: 0 0 0 4px rgba(244,162,97,0.12), inset 0 0 30px rgba(244,162,97,0.04);
  animation: ringPulse 1.8s ease-out forwards;
}

@keyframes ringPulse {
  0%   { box-shadow: 0 0 0 0   rgba(244,162,97,0.45), inset 0 0 30px rgba(244,162,97,0.04); }
  40%  { box-shadow: 0 0 0 12px rgba(244,162,97,0.12), inset 0 0 30px rgba(244,162,97,0.06); }
  100% { box-shadow: 0 0 0 20px rgba(244,162,97,0),    inset 0 0 30px rgba(244,162,97,0); }
}

/* ── Section transition overlay ── */
.section-enter-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 500;
  background: radial-gradient(ellipse at center, rgba(244,162,97,0.08) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease;
}
.section-enter-overlay.flash {
  opacity: 1;
}

/* ══════════════════════════════════════
   SCROLL STEPS
══════════════════════════════════════ */
.scroll-step {
  min-height: ${CFG.STEP_HEIGHT_VH}vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 0;
  opacity: 0.18;
  transform: translateY(20px);
  transition:
    opacity ${CFG.TRANSITION_MS}ms ease,
    transform ${CFG.TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}
.scroll-step.is-active  { opacity: 1;    transform: translateY(0); }
.scroll-step.was-active { opacity: 0.28; transform: translateY(-14px); }

/* Step typography */
.step-badge {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 900;
  color: rgba(244,162,97,0.09);
  line-height: 1;
  margin-bottom: -0.7rem;
  display: block;
}
.step-heading {
  font-family: 'Playfair Display', serif;
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
  margin-bottom: 1.4rem;
}
.scroll-step p {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 1.3rem;
}
.step-callout {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.1rem 1.4rem;
  background: rgba(42,157,143,0.08);
  border-left: 3px solid var(--accent-green);
  border-radius: 0 10px 10px 0;
  margin-top: 1.2rem;
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.7;
}
.step-callout.warning {
  background: rgba(230,57,70,0.08);
  border-left-color: var(--accent-red);
}
.callout-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }

/* ══════════════════════════════════════
   HERO PARTICLES
══════════════════════════════════════ */
#hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat linear infinite;
}
@keyframes particleFloat {
  0%   { transform: translateY(100vh) scale(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.6; }
  100% { transform: translateY(-20vh) scale(1); opacity: 0; }
}

/* ══════════════════════════════════════
   PROGRESS BAR (CSS scroll-driven)
══════════════════════════════════════ */
#scrolly-progress-bar {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, #2A9D8F, #F4A261, #FF6B35);
  transform-origin: left;
  transform: scaleX(0);
  z-index: 9999;
  pointer-events: none;
  animation: scrollProgressNative linear forwards;
  animation-timeline: scroll(root);
}
@keyframes scrollProgressNative { from { transform: scaleX(0); } to { transform: scaleX(1); } }
#scrolly-progress-bar.js-driven { animation: none; transition: transform 0.1s linear; }

/* ══════════════════════════════════════
   CHAPTER PILL
══════════════════════════════════════ */
#chapter-pill {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-14px);
  background: rgba(10,22,40,0.9);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(244,162,97,0.2);
  color: var(--synergy-gold, #F4A261);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 18px;
  border-radius: 100px;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1);
  white-space: nowrap;
}
#chapter-pill.visible { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ══════════════════════════════════════
   DOT NAV
══════════════════════════════════════ */
#dot-nav {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}
.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.25);
  background: transparent;
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
}
.dot::before {
  content: attr(data-label);
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(10,22,40,0.92);
  border: 1px solid rgba(244,162,97,0.18);
  color: var(--text-secondary);
  font-size: 0.67rem;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.dot:hover::before       { opacity: 1; }
.dot.is-active  { background: var(--synergy-gold, #F4A261); border-color: var(--synergy-gold, #F4A261); transform: scale(1.65); }
.dot.is-passed  { background: rgba(244,162,97,0.28); border-color: rgba(244,162,97,0.35); }

/* ══════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════ */
#back-to-top {
  position: fixed;
  bottom: 28px; right: 28px;
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1.5px solid rgba(244,162,97,0.3);
  background: rgba(10,22,40,0.85);
  backdrop-filter: blur(10px);
  color: var(--synergy-gold, #F4A261);
  font-size: 15px;
  cursor: pointer;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(14px);
  pointer-events: none;
  transition: opacity 0.3s, transform 0.3s, border-color 0.2s;
}
#back-to-top.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
#back-to-top:hover   { border-color: var(--synergy-gold, #F4A261); background: rgba(244,162,97,0.08); }

/* ══════════════════════════════════════
   HERO ENTRANCE ANIMATIONS
══════════════════════════════════════ */
.hero-content > * {
  opacity: 0;
  transform: translateY(38px);
  transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.4,0,0.2,1);
}
.hero-content.animate-in > *:nth-child(1) { opacity:1; transform:none; transition-delay:.05s }
.hero-content.animate-in > *:nth-child(2) { opacity:1; transform:none; transition-delay:.15s }
.hero-content.animate-in > *:nth-child(3) { opacity:1; transform:none; transition-delay:.25s }
.hero-content.animate-in > *:nth-child(4) { opacity:1; transform:none; transition-delay:.35s }
.hero-content.animate-in > *:nth-child(5) { opacity:1; transform:none; transition-delay:.45s }
.hero-content.animate-in > *:nth-child(6) { opacity:1; transform:none; transition-delay:.55s }

/* ══════════════════════════════════════
   MBG SECTION
══════════════════════════════════════ */
.mbg-content > * {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.mbg-section.animate-in .mbg-content > *:nth-child(1) { opacity:1; transform:none; transition-delay:.00s }
.mbg-section.animate-in .mbg-content > *:nth-child(2) { opacity:1; transform:none; transition-delay:.12s }
.mbg-section.animate-in .mbg-content > *:nth-child(3) { opacity:1; transform:none; transition-delay:.24s }
.mbg-section.animate-in .mbg-content > *:nth-child(4) { opacity:1; transform:none; transition-delay:.36s }

/* MBG comparison cards fly in from sides */
.comparison-card {
  opacity: 0;
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.34,1.3,0.64,1) !important;
}
.comparison-card:nth-child(1) { transform: translateX(-40px); }
.comparison-card:nth-child(2) { transform: translateX(40px);  }
.mbg-section.animate-in .comparison-card {
  opacity: 1 !important;
  transform: none !important;
}
.mbg-section.animate-in .comparison-card:nth-child(1) { transition-delay: .42s !important }
.mbg-section.animate-in .comparison-card:nth-child(2) { transition-delay: .58s !important }

/* ══════════════════════════════════════
   CONCLUSION SECTION
══════════════════════════════════════ */
.conclusion-content > * {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.conclusion-section.animate-in .conclusion-content > *:nth-child(1) { opacity:1; transform:none; transition-delay:.00s }
.conclusion-section.animate-in .conclusion-content > *:nth-child(2) { opacity:1; transform:none; transition-delay:.14s }
.conclusion-section.animate-in .conclusion-content > *:nth-child(3) { opacity:1; transform:none; transition-delay:.28s }
.conclusion-section.animate-in .conclusion-content > *:nth-child(4) { opacity:1; transform:none; transition-delay:.42s }
.conclusion-section.animate-in .conclusion-content > *:nth-child(5) { opacity:1; transform:none; transition-delay:.56s }

.final-number { font-variant-numeric: tabular-nums; }

/* ══════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════ */
@media (max-width: 860px) {
  .sticky-scene { grid-template-columns: 1fr; }
  .sticky-graphic {
    position: relative; top: auto;
    height: auto; min-height: 60vw;
    padding: 1.5rem;
    order: 1;
  }
  .steps-column { padding: 0 1.5rem 12vh; order: 2; }
  .scroll-step  { min-height: 55vh; }
  #dot-nav, #chapter-pill { display: none; }
  .stat-cards-row { gap: 0.4rem; }
  .stat-card { padding: 0.6rem; }
  .stat-card-value { font-size: 0.9rem; }
}
  `;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────
// 2. DOM RESTRUCTURE — Data sections → sticky layout
// ─────────────────────────────────────────────────────────────
function restructureDOM() {
  const SECTIONS = [
    {
      sectionId:   "section-2",
      chartId:     "biaya-chart-container",
      caption:     "Perbandingan Biaya Pendidikan per Jenjang (dalam Juta Rupiah)",
      globalStart: 1,
      steps: [
        `<span class="step-badge">01</span>
         <h3 class="step-heading">Biaya Pendidikan yang Mencekik</h3>
         <p>Realita di lapangan menunjukkan bahwa
         <span class="highlight">biaya pendidikan di Indonesia sangat timpang</span>.
         Di Sumatera Selatan, biaya SMA/SMK mencapai
         <strong>Rp14.6 juta per tahun</strong>, sementara di Maluku hanya Rp4.99 juta.</p>`,

        `<p>Pertanyaannya: <em>apakah biaya tinggi menjamin partisipasi tinggi?</em>
         Data membuktikan sebaliknya. Banten dengan biaya SMP Rp9.6 juta
         justru memiliki partisipasi SMA hanya
         <span class="highlight">73.84%</span>.</p>
         <div class="step-callout">
           <span class="callout-icon">💡</span>
           <span>Biaya tinggi tanpa daya beli masyarakat justru <strong>menurunkan</strong> partisipasi sekolah.</span>
         </div>`,
      ],
    },
    {
      sectionId:   "section-3",
      chartId:     "partisipasi-chart-container",
      caption:     "Tingkat Partisipasi Sekolah per Kelompok Usia (%)",
      globalStart: 3,
      steps: [
        `<span class="step-badge">02</span>
         <h3 class="step-heading">Partisipasi Sekolah yang Mengkhawatirkan</h3>
         <p><span class="highlight">Papua Tengah menjadi provinsi dengan kondisi paling kritis</span>.
         Hanya <strong>44.61%</strong> anak usia 16–18 tahun yang bersekolah —
         lebih dari separuh remaja di sana putus sekolah.</p>`,

        `<p>Sementara DKI Jakarta dan DIY Yogyakarta menikmati partisipasi di atas 88%.
         <span class="highlight">Kesenjangan ini bukan hanya soal biaya, tapi kemiskinan struktural</span>
         yang memaksa anak-anak bekerja daripada belajar.</p>
         <div class="stats-comparison">
           <div class="stat-low"><span class="stat-value">44.61%</span><span class="stat-region">Papua Tengah</span></div>
           <div class="stat-divider">VS</div>
           <div class="stat-high"><span class="stat-value">93.03%</span><span class="stat-region">DIY Yogyakarta</span></div>
         </div>`,
      ],
    },
    {
      sectionId:   "section-4",
      chartId:     "scatter-chart-container",
      caption:     "Korelasi Biaya SMA vs Partisipasi Sekolah 16–18 Tahun<br><small>💡 Hover titik untuk detail provinsi</small>",
      globalStart: 5,
      steps: [
        `<span class="step-badge">03</span>
         <h3 class="step-heading">Paradoks: Mahal ≠ Banyak yang Sekolah</h3>
         <p><span class="highlight">Sumatera Selatan memiliki biaya SMA termahal kedua (Rp14.6 juta)</span>,
         tapi partisipasi sekolah usia 16–18 tahun hanya <strong>73.78%</strong>.
         Angka yang mengejutkan untuk provinsi dengan investasi pendidikan sebesar itu.</p>`,

        `<p>Sebaliknya, <span class="highlight">Maluku dengan biaya SMA termurah (Rp4.99 juta)</span>
         memiliki partisipasi <strong>77.28%</strong> — lebih tinggi dari Sumatera Selatan.</p>
         <p>Bukti nyata bahwa <em>biaya tinggi tidak menjamin akses</em>. Ada masalah yang jauh lebih mendasar.</p>`,
      ],
    },
    {
      sectionId:   "section-6",
      chartId:     "rls-map-container",
      caption:     "Rata-rata Lama Sekolah per Provinsi (Tahun)<br><small>Warna lebih gelap = RLS lebih tinggi</small>",
      globalStart: 8,
      steps: [
        `<span class="step-badge">05</span>
         <h3 class="step-heading">Rata-rata Lama Sekolah: Potret Ketimpangan</h3>
         <p><span class="highlight">Rata-rata anak di Papua Pegunungan hanya sekolah 4.3 tahun</span>
         — setara tidak lulus SD. Bandingkan dengan DKI Jakarta
         yang mencapai <strong>11.59 tahun</strong> (setara lulus SMA).</p>`,

        `<p>Kesenjangan <strong>7.29 tahun</strong> ini bukan hanya tentang biaya, tapi juga
         <strong>kemiskinan, akses transportasi, dan kebutuhan dasar yang belum terpenuhi</strong>.</p>
         <div class="step-callout warning">
           <span class="callout-icon">⚠️</span>
           <span>Anak yang lapar tidak bisa fokus belajar. Tapi anak yang tidak sekolah
           tidak akan mendapat ilmu. <strong>Mana yang lebih dulu diperbaiki?</strong></span>
         </div>`,
      ],
    },
  ];

  SECTIONS.forEach(({ sectionId, chartId, caption, globalStart, steps }) => {
    const section       = document.getElementById(sectionId);
    const chartEl       = document.getElementById(chartId);
    if (!section || !chartEl) return;

    const chartWrapper  = chartEl.closest(".chart-wrapper") || chartEl;

    // ── Steps column ──
    const stepsCol = document.createElement("div");
    stepsCol.className = "steps-column";
    steps.forEach((html, i) => {
      const stepEl = document.createElement("div");
      stepEl.className = "scroll-step";
      stepEl.dataset.globalStep = String(globalStart + i);
      stepEl.innerHTML = html;
      stepsCol.appendChild(stepEl);
    });

    // ── Graphic column ──
    const graphicCol = document.createElement("div");
    graphicCol.className = "sticky-graphic";
    graphicCol.dataset.sectionId = sectionId;

    // Shimmer skeleton layer
    const shimmer = document.createElement("div");
    shimmer.className = "chart-shimmer";
    const sbars = document.createElement("div");
    sbars.className = "shimmer-bars";
    const widths = [85, 70, 90, 55, 80, 65, 95, 72, 60, 88];
    widths.forEach(w => {
      const b = document.createElement("div");
      b.className = "shimmer-bar";
      b.style.width = w + "%";
      sbars.appendChild(b);
    });
    shimmer.appendChild(sbars);
    chartWrapper.appendChild(shimmer);

    // Annotation element (injected once per graphic col)
    const annot = document.createElement("div");
    annot.id = "chart-annotation";
    chartWrapper.style.position = "relative";
    chartWrapper.appendChild(annot);

    graphicCol.appendChild(chartWrapper);

    // Caption
    const cap = document.createElement("p");
    cap.className = "sticky-caption";
    cap.innerHTML = caption;
    graphicCol.appendChild(cap);

    // Stat cards row
    const stats = SECTION_STATS[sectionId];
    if (stats) {
      const row = buildStatCards(stats);
      row.dataset.sectionId = sectionId;
      graphicCol.appendChild(row);
    }

    // Scene
    const scene = document.createElement("div");
    scene.className = "sticky-scene";
    scene.appendChild(stepsCol);
    scene.appendChild(graphicCol);

    section.innerHTML = "";
    section.appendChild(scene);
  });
}

// ─────────────────────────────────────────────────────────────
// 3. STAT CARDS
// ─────────────────────────────────────────────────────────────
function buildStatCards(stats) {
  const row = document.createElement("div");
  row.className = "stat-cards-row";
  stats.forEach(({ value, label, sub, color, icon }) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <span class="stat-card-icon">${icon}</span>
      <span class="stat-card-value" style="color:${color}">${value}</span>
      <span class="stat-card-label">${label}</span>
      <span class="stat-card-sub">${sub}</span>
    `;
    row.appendChild(card);
  });
  return row;
}

function popStatCards(sectionId, delay = 400) {
  const row = document.querySelector(`.stat-cards-row[data-section-id="${sectionId}"]`);
  if (!row) return;
  row.querySelectorAll(".stat-card").forEach((card, i) => {
    // Reset
    card.classList.remove("popped");
    void card.offsetWidth; // reflow
    setTimeout(() => card.classList.add("popped"), delay + i * 100);
  });
}

// ─────────────────────────────────────────────────────────────
// 4. CHART WRAPPER REVEAL (clip-path wipe)
// ─────────────────────────────────────────────────────────────
function revealChartWrapper(sectionId) {
  const graphicCol = document.querySelector(`.sticky-graphic[data-section-id="${sectionId}"]`);
  if (!graphicCol) return;
  const wrapper = graphicCol.querySelector(".chart-wrapper");
  if (!wrapper) return;

  // Dismiss shimmer after chart is presumably rendered (500ms)
  const shimmer = wrapper.querySelector(".chart-shimmer");
  if (shimmer) setTimeout(() => shimmer.classList.add("hidden"), 500);

  // Clip-path wipe reveal
  wrapper.classList.remove("revealed");
  void wrapper.offsetWidth;
  setTimeout(() => {
    wrapper.classList.add("revealed");
    // Pulse ring
    wrapper.classList.remove("pulse-ring");
    void wrapper.offsetWidth;
    wrapper.classList.add("pulse-ring");
    setTimeout(() => wrapper.classList.remove("pulse-ring"), 1800);
  }, 80);
}

// ─────────────────────────────────────────────────────────────
// 5. ANNOTATION CALLOUT
// ─────────────────────────────────────────────────────────────
function showAnnotation(globalStep) {
  // Find the visible annotation element
  const annot = document.getElementById("chart-annotation");
  if (!annot) return;

  clearTimeout(_annotTimer);
  const data = STEP_ANNOTATIONS[globalStep];

  if (!data) {
    annot.classList.remove("visible");
    return;
  }

  // Update content & colour
  annot.textContent   = data.text;
  annot.style.color   = data.color;
  annot.style.borderLeftColor = data.color;

  // Briefly hide then re-show for transition
  annot.classList.remove("visible");
  void annot.offsetWidth;
  _annotTimer = setTimeout(() => {
    annot.classList.add("visible");
    // Auto-hide after 4 s
    _annotTimer = setTimeout(() => annot.classList.remove("visible"), 4000);
  }, 200);
}

// ─────────────────────────────────────────────────────────────
// 6. FLASH OVERLAY between sections
// ─────────────────────────────────────────────────────────────
function buildFlashOverlay() {
  const ov = document.createElement("div");
  ov.className = "section-enter-overlay";
  ov.id = "section-flash";
  document.body.appendChild(ov);
}

function flashOverlay() {
  const ov = document.getElementById("section-flash");
  if (!ov) return;
  ov.classList.add("flash");
  setTimeout(() => ov.classList.remove("flash"), 650);
}

// ─────────────────────────────────────────────────────────────
// 7. HERO PARTICLES
// ─────────────────────────────────────────────────────────────
function buildHeroParticles() {
  const heroSection = document.querySelector(".hero-section");
  if (!heroSection) return;

  heroSection.style.position = "relative";
  heroSection.style.overflow = "hidden";

  const container = document.createElement("div");
  container.id = "hero-particles";
  heroSection.prepend(container);

  const colors  = ["#F4A261", "#2A9D8F", "#FF6B35", "#E9C46A", "#06D6A0"];
  const N = 28;

  for (let i = 0; i < N; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 3 + Math.random() * 7;
    p.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `opacity:${0.3 + Math.random() * 0.4}`,
      `animation-duration:${8 + Math.random() * 14}s`,
      `animation-delay:${Math.random() * 10}s`,
    ].join(";");
    container.appendChild(p);
  }
}

// ─────────────────────────────────────────────────────────────
// 8. BUILD UI
// ─────────────────────────────────────────────────────────────
function buildUI() {
  // Progress bar
  const bar = document.createElement("div");
  bar.id = "scrolly-progress-bar";
  if (!CSS.supports("animation-timeline", "scroll()")) bar.classList.add("js-driven");
  document.body.prepend(bar);

  // Chapter pill
  const pill = document.createElement("div");
  pill.id = "chapter-pill";
  document.body.appendChild(pill);

  // Dot nav
  const nav = document.createElement("nav");
  nav.id = "dot-nav";
  nav.setAttribute("aria-label", "Navigasi Bagian");
  STEP_META.forEach((meta, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.dataset.label = meta.label;
    dot.setAttribute("aria-label", `Ke: ${meta.label}`);
    dot.addEventListener("click", () => scrollToStep(i));
    nav.appendChild(dot);
  });
  document.body.appendChild(nav);

  // Back to top
  const btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.innerHTML = "↑";
  btn.setAttribute("aria-label", "Kembali ke atas");
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(btn);

  buildFlashOverlay();
  buildHeroParticles();
}

// ─────────────────────────────────────────────────────────────
// 9. STATE UPDATE — called on every step change
// ─────────────────────────────────────────────────────────────

// Map chartIndex → sectionId (for reveal + stat cards)
const CHART_TO_SECTION = { 0: "section-2", 1: "section-3", 2: "section-4", 3: "section-6" };

function setStep(globalStep) {
  if (globalStep === currentGlobalStep) return;
  const prev     = currentGlobalStep;
  currentGlobalStep = globalStep;

  const meta     = STEP_META[globalStep];
  const prevMeta = STEP_META[prev] ?? {};
  if (!meta) return;

  // Chapter pill
  const pill = document.getElementById("chapter-pill");
  if (pill) { pill.textContent = meta.label; showPillBriefly(pill); }

  // Dot nav
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("is-active", i === globalStep);
    dot.classList.toggle("is-passed", i < globalStep);
  });

  document.title = `${meta.label} — MBG vs Pendidikan`;

  // Chart logic
  if (meta.chartIndex !== null) {
    const sectionId   = CHART_TO_SECTION[meta.chartIndex];
    const prevSection = CHART_TO_SECTION[prevMeta.chartIndex ?? -1];
    const chartChanged = prevSection !== sectionId;

    if (chartChanged) {
      // Reveal new chart wrapper with wipe animation
      revealChartWrapper(sectionId);
      popStatCards(sectionId);
      if (prev >= 0) flashOverlay();
    }

    // Flash chart on same-chart step change
    if (!chartChanged && prev >= 0) {
      const graphicCol = document.querySelector(`.sticky-graphic[data-section-id="${sectionId}"]`);
      const wrapper    = graphicCol?.querySelector(".chart-wrapper");
      if (wrapper) {
        wrapper.classList.add("chart-flash");
        setTimeout(() => wrapper.classList.remove("chart-flash"), 300);
      }
    }

    // Signal Orang 2
    if (typeof updateChart === "function") updateChart(meta.chartIndex);
  }

  // Annotation callout
  showAnnotation(globalStep);
}

// ─────────────────────────────────────────────────────────────
// 10. INTERSECTION OBSERVER — scroll steps
// ─────────────────────────────────────────────────────────────
function initStepObserver() {
  const steps = document.querySelectorAll(".scroll-step");
  if (!steps.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        document.querySelectorAll(".scroll-step.is-active").forEach(prev => {
          if (prev !== el) { prev.classList.remove("is-active"); prev.classList.add("was-active"); }
        });
        el.classList.remove("was-active");
        el.classList.add("is-active");

        const gs = parseInt(el.dataset.globalStep, 10);
        if (!isNaN(gs)) setStep(gs);
      });
    },
    { rootMargin: `-${CFG.IO_MARGIN} 0px -${CFG.IO_MARGIN} 0px`, threshold: 0 }
  );

  steps.forEach(step => io.observe(step));
}

// ─────────────────────────────────────────────────────────────
// 11. INTERSECTION OBSERVER — full sections (Hero, MBG, Conclusion)
// ─────────────────────────────────────────────────────────────
function initSectionObserver() {
  const targets = [
    { selector: ".hero-section",       globalStep: 0,  enterClass: null,         contentSel: ".hero-content" },
    { selector: ".mbg-section",        globalStep: 7,  enterClass: "animate-in", contentSel: null },
    { selector: ".conclusion-section", globalStep: 10, enterClass: "animate-in", contentSel: null },
  ];

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const t = targets.find(x => entry.target.matches(x.selector));
        if (!t) return;
        if (t.enterClass) entry.target.classList.add(t.enterClass);
        if (t.contentSel) entry.target.querySelector(t.contentSel)?.classList.add("animate-in");
        setStep(t.globalStep);
        if (t.globalStep === 10) setTimeout(() => runCounters(entry.target), 650);
      });
    },
    { threshold: 0.2 }
  );

  targets.forEach(({ selector }) => {
    const el = document.querySelector(selector);
    if (el) io.observe(el);
  });

  // Hero: animate immediately
  requestAnimationFrame(() => setTimeout(() => {
    document.querySelector(".hero-content")?.classList.add("animate-in");
    setStep(0);
  }, 250));
}

// ─────────────────────────────────────────────────────────────
// 12. COUNTER-UP (conclusion)
// ─────────────────────────────────────────────────────────────
function runCounters(container) {
  container.querySelectorAll(".final-number").forEach(el => {
    const target = parseFloat(el.textContent.replace(",", "."));
    if (isNaN(target)) return;
    const isInt  = Number.isInteger(target);
    const dur    = 1400;
    const t0     = performance.now();
    function tick(now) {
      const p     = Math.min((now - t0) / dur, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = isInt ? String(Math.round(eased * target)) : (eased * target).toFixed(2);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ─────────────────────────────────────────────────────────────
// 13. SCROLL LISTENER (progress bar JS fallback + back-to-top)
// ─────────────────────────────────────────────────────────────
function initScrollListener() {
  const bar      = document.getElementById("scrolly-progress-bar");
  const btn      = document.getElementById("back-to-top");
  const jsDriven = bar?.classList.contains("js-driven");

  window.addEventListener("scroll", () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      if (jsDriven && bar) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
      }
      btn?.classList.toggle("visible", window.scrollY > window.innerHeight * 0.8);
      rafPending = false;
    });
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 14. KEYBOARD
// ─────────────────────────────────────────────────────────────
function initKeyboard() {
  document.addEventListener("keydown", e => {
    const len = STEP_META.length;
    let next = -1;
    if      (["ArrowDown","PageDown","j"].includes(e.key)) next = Math.min(currentGlobalStep + 1, len - 1);
    else if (["ArrowUp","PageUp","k"].includes(e.key))    next = Math.max(currentGlobalStep - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End")  next = len - 1;
    if (next >= 0) { e.preventDefault(); scrollToStep(next); }
  });
}

function scrollToStep(gs) {
  const el = document.querySelector(`.scroll-step[data-global-step="${gs}"]`);
  if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
  const map = { 0: "section-1", 7: "section-5", 10: "section-7" };
  document.getElementById(map[gs])?.scrollIntoView({ behavior: "smooth" });
}

// ─────────────────────────────────────────────────────────────
// 15. CHAPTER PILL
// ─────────────────────────────────────────────────────────────
function showPillBriefly(pill) {
  pill.classList.add("visible");
  clearTimeout(_pillTimer);
  _pillTimer = setTimeout(() => pill.classList.remove("visible"), 3000);
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
function init() {
  injectCSS();
  restructureDOM();
  buildUI();
  initStepObserver();
  initSectionObserver();
  initScrollListener();
  initKeyboard();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
