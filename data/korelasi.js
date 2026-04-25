import fs from "fs";

const data = JSON.parse(
  fs.readFileSync("./data/data_provinsi.json", "utf-8")
);
// ==============================
// FIELD
// ==============================
const FIELDS = {
  PROVINSI: "Provinsi",
  PROTEIN: "Protein (gr)",
  STUNTING_SD: "Stunting 5-12",
  STUNTING_SMP: "Stunting 13-15",
  STUNTING_SMA: "Stunting 16-18",
};

// ==============================
// UTIL
// ==============================
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const stdDev = (arr) => {
  const avg = mean(arr);
  return Math.sqrt(
    arr.reduce((sum, v) => sum + (v - avg) ** 2, 0) / arr.length
  );
};

// ==============================
// PEARSON CORRELATION
// ==============================
function pearson(x, y) {
  const avgX = mean(x);
  const avgY = mean(y);

  const num = x.reduce(
    (sum, xi, i) => sum + (xi - avgX) * (y[i] - avgY),
    0
  );

  const den = stdDev(x) * stdDev(y) * x.length;

  return den === 0 ? 0 : num / den;
}

// ==============================
// INTERPRETASI
// ==============================
function interpret(r) {
  const abs = Math.abs(r);
  const dir = r > 0 ? "Positif" : r < 0 ? "Negatif" : "Tidak Ada";

  let strength = "Sangat Lemah";
  if (abs >= 0.7) strength = "Kuat";
  else if (abs >= 0.5) strength = "Sedang";
  else if (abs >= 0.3) strength = "Lemah";

  return `${dir} – ${strength}`;
}

// ==============================
// FUNGSI UTAMA (REUSABLE)
// ==============================
function korelasiProteinStunting(data, stuntingKey) {
  const pairs = data
    .map((d) => ({
      protein: parseFloat(d[FIELDS.PROTEIN]),
      stunting: parseFloat(d[stuntingKey]),
    }))
    .filter(
      (d) =>
        !isNaN(d.protein) &&
        !isNaN(d.stunting) &&
        isFinite(d.protein) &&
        isFinite(d.stunting)
    );

  if (pairs.length < 2) throw new Error("Data tidak cukup");

  const x = pairs.map((d) => d.protein);
  const y = pairs.map((d) => d.stunting);

  const r = pearson(x, y);

  return {
    r: +r.toFixed(4),
    interpretasi: interpret(r),
    n: pairs.length,
  };
}

// ==============================
// FUNGSI DATA UNTUK SCATTER (D3)
// ==============================
function getScatterData(data, stuntingKey) {
  return data
    .map((d) => ({
      id: d[FIELDS.PROVINSI],
      provinsi: d[FIELDS.PROVINSI],
      protein: parseFloat(d[FIELDS.PROTEIN]),
      stunting: parseFloat(d[stuntingKey]),
    }))
    .filter(
      (d) =>
        !isNaN(d.protein) &&
        !isNaN(d.stunting) &&
        isFinite(d.protein) &&
        isFinite(d.stunting)
    );
}

// ==============================
// CONTOH PEMAKAIAN
// ==============================
// 1. Stunting SD
const sd = korelasiProteinStunting(data, FIELDS.STUNTING_SD);

// 2. Stunting SMP
const smp = korelasiProteinStunting(data, FIELDS.STUNTING_SMP);

// 3. Stunting SMA
const sma = korelasiProteinStunting(data, FIELDS.STUNTING_SMA);

// OUTPUT
console.log("=== HASIL KORELASI ===");
console.log("SD  :", sd);
console.log("SMP :", smp);
console.log("SMA :", sma);

// ==============================
// DATA UNTUK CHART (SCATTER)
// ==============================
const scatterAll = {
  sd: getScatterData(data, FIELDS.STUNTING_SD),
  smp: getScatterData(data, FIELDS.STUNTING_SMP),
  sma: getScatterData(data, FIELDS.STUNTING_SMA),
};

console.log("\n=== SCATTER SD ===");
console.log(scatterAll.sd);

console.log("\n=== SCATTER SMP ===");
console.log(scatterAll.smp);

console.log("\n=== SCATTER SMA ===");
console.log(scatterAll.sma);