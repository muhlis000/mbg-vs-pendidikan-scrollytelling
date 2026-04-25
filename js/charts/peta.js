// Konfigurasi Dasar
const width = 800;
const height = 500;

const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

const projection = d3.geoMercator()
    .center([118, -2]) // Fokus ke tengah Indonesia
    .scale(1000)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Skala Warna
const colorScale = d3.scaleQuantize()
    .range(["#deebf7", "#9ecae1", "#4292c6", "#2171b5", "#084594"]);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute").style("display", "none");

let geoData, csvData;

Promise.all([
    d3.json("data/Provinsi Indonesia - Provinsi.json"),
    d3.json("data/data_provinsi.json")
]).then(([geo, csv]) => {
    geoData = geo;
    csvData = csv;
    drawMap('Jumlah SD/Sederajat');
}).catch(err => console.error("Gagal memuat data:", err));

// Fungsi Utama Menggambar Peta
function drawMap(dataType) {
    const valueMap = new Map(csvData.map(d => [d.Provinsi, d[dataType]]));
    const values = [...valueMap.values()];
    colorScale.domain([d3.min(values), d3.max(values)]);

    const getPropName = f => f.properties.Propinsi || f.properties.NAME_1;
    const paths = svg.selectAll("path")
        .data(geoData.features)
        .join("path")
        .attr("d", path)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);

    paths.transition().duration(750)
        .attr("fill", d => colorScale(valueMap.get(getPropName(d)) ?? 0));

    paths
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#000").attr("stroke-width", 1.5);
            tooltip.style("display", "block")
                .html(`<b>${getPropName(d)}</b>: ${valueMap.get(getPropName(d)) ?? 0}`);
        })
        .on("mousemove", event => {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.5);
            tooltip.style("display", "none");
        });

}