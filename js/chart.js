// Inisialisasi Grafik
function initChart() {
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
    
    console.log("SVG Initialized");
}

// Fungsi Update Visual berdasarkan Step
function updateChart(index) {
    console.log("Updating chart to step:", index);
    // Logika transisi D3 akan diletakkan di sini oleh Orang 2
}

initChart();