const scroller = scrollama();

function handleStepEnter(response) {
    // response.element = elemen yang sedang aktif
    // response.index = urutan step (0, 1, 2...)
    
    // Tambahkan class aktif untuk styling teks
    d3.selectAll('.step').classed('is-active', false);
    d3.select(response.element).classed('is-active', true);

    // Panggil fungsi update grafik dari chart.js
    updateChart(response.index);
}

function init() {
    scroller
        .setup({
            step: ".step",
            offset: 0.5, // Memicu saat teks berada di tengah layar
            debug: true // Munculkan garis bantu untuk pengembangan
        })
        .onStepEnter(handleStepEnter);

    window.addEventListener("resize", scroller.resize);
}

init();