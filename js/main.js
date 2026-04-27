/* ===================================================
   main.js
   Orchestrator: load data, init Scrollama,
   dispatch chart berdasarkan data-step,
   kelola age toggle untuk stunting & APS.
=================================================== */

const scroller = scrollama();
let globalData = null;
let currentStep = null;
let currentAgeStunting = 'Stunting 5-12';
let currentAgeAPS = 'APS 16-18';
let currentAgeBiaya = 'Biaya SMA';

// Perbarui progress bar scroll
function updateProgressBar() {
  const scrolled = document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById('progress-bar').style.width = `${(scrolled / total) * 100}%`;
}

// Tampilkan / sembunyikan age toggle berdasarkan step aktif
function setAgeToggleVisibility(step) {
  const toggle = document.getElementById('age-toggle');
  const stepsWithToggle = ['stunting', 'aps', 'biaya'];
  toggle.classList.toggle('hidden', !stepsWithToggle.includes(step));

  // Update label tombol sesuai konteks step
  const labels = step === 'aps'
    ? [['7-12', 'SD (7-12)'], ['13-15', 'SMP (13-15)'], ['16-18', 'SMA (16-18)']]
    : step === 'biaya'
    ? [['SD', 'SD (7-12)'], ['SMP', 'SMP (13-15)'], ['SMA', 'SMA/SMK (16-18)']]
    : [['5-12', 'SD (5-12)'], ['13-15', 'SMP (13-15)'], ['16-18', 'SMA (16-18)']];

  document.querySelectorAll('.age-btn').forEach((btn, i) => {
    btn.dataset.age = labels[i][0];
    btn.textContent = labels[i][1];
  });
}

// Dispatch chart sesuai step yang masuk viewport
function handleStepEnter({ element }) {
  const step = element.dataset.step;
  currentStep = step;

  document.querySelectorAll('.step').forEach(s => s.classList.remove('is-active'));
  element.classList.add('is-active');

  setAgeToggleVisibility(step);

  // Reset active button ke default saat pindah step
  if (step === 'stunting') {
    currentAgeStunting = 'Stunting 5-12';
    setActiveAgeBtn('5-12');
  }
  if (step === 'aps') {
    currentAgeAPS = 'APS 16-18';
    setActiveAgeBtn('16-18');
  }
  if (step === 'biaya') {
    currentAgeBiaya = 'Biaya SMA';
    setActiveAgeBtn('SMA');
  }

  switch (step) {
    case 'cover':
      d3.select('#d3-visual-target').html('');
      break;
    case 'stunting':
      drawStuntingChart(globalData, currentAgeStunting);
      break;
    case 'rls':
      drawRLSChart(globalData);
      break;
    case 'aps':
      drawAPSChart(globalData, currentAgeAPS);
      break;
    case 'biaya':
      drawBiayaChart(globalData, currentAgeBiaya);
      break;
    case 'peta-sppg':
      drawMap();
      break;
    case 'peta-sekolah':
      // Gunakan total sekolah (SD + SMP + SMA) sebagai kolom turunan
      const dataWithTotal = globalData.map(d => ({
        ...d,
        'Total Sekolah': (d['Jumlah SD/Sederajat'] || 0) +
                         (d['Jumlah SMP/Sederajat'] || 0) +
                         (d['Jumlah SMA/Sederajat'] || 0),
      }));
      drawMap('Total Sekolah', dataWithTotal, 'blue');
      break;
    case 'korelasi-protein-rls':
      drawScatterProteinRLS(globalData);
      break;
    case 'korelasi-protein-stunting':
      drawScatterProteinStunting(globalData);
      break;
    case 'anggaran':
      drawBudgetComparison();
      break;
    case 'conclusion':
      d3.select('#d3-visual-target').html('');
      break;
  }
}

// Set tombol toggle aktif
function setActiveAgeBtn(age) {
  document.querySelectorAll('.age-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.age === age);
  });
}

// Handler klik age toggle
function handleAgeToggle(event) {
  const btn = event.target.closest('.age-btn');
  if (!btn) return;
  const age = btn.dataset.age;
  setActiveAgeBtn(age);

  if (currentStep === 'stunting') {
    const key = `Stunting ${age}`;
    currentAgeStunting = key;
    updateStuntingChart(globalData, key);
  } else if (currentStep === 'aps') {
    const key = `APS ${age}`;
    currentAgeAPS = key;
    updateAPSChart(globalData, key);
  } else if (currentStep === 'biaya') {
    const key = `Biaya ${age}`;
    currentAgeBiaya = key;
    updateBiayaChart(globalData, key);
  }
}

async function init() {
  try {
    globalData = await d3.json('data/data_provinsi.json');

    scroller
      .setup({ step: '.step', offset: 0.5, debug: false })
      .onStepEnter(handleStepEnter);

    document.getElementById('age-toggle').addEventListener('click', handleAgeToggle);
    window.addEventListener('scroll', updateProgressBar);
    window.addEventListener('resize', scroller.resize);
  } catch (err) {
    console.error('Inisialisasi gagal:', err);
  }
}

init();
