import fs from "fs";

const geo = JSON.parse(fs.readFileSync("provinsi.geojson"));
const data = JSON.parse(fs.readFileSync("data_provinsi.json"));

// normalisasi nama
function normalize(str) {
  return str
    .toLowerCase()
    .replace("special region of ", "")
    .replace("special capital region ", "")
    .replace("province of ", "")
    .replace("islands", "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// mapping data
const mapData = {};
data.forEach(d => {
  const key = normalize(d.Provinsi);
  mapData[key] = d;
});

// merge
geo.features.forEach(f => {
  const geoName = normalize(f.properties.state || f.properties.name || "");

  if (mapData[geoName]) {
    f.properties.sppg = mapData[geoName]["SPPG (unit)"];
    f.properties.nama = mapData[geoName]["Provinsi"]; // ✅ FIX penting
  } else {
    console.log("❌ tidak ketemu:", geoName);
  }
});

// simpan
fs.writeFileSync("final.geojson", JSON.stringify(geo, null, 2));

console.log("✅ BERHASIL");