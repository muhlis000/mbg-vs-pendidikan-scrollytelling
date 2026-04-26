/* ===================================================
   peta.js
   Choropleth map Indonesia menggunakan D3 geoMercator.
   Cache GeoJSON untuk menghindari fetch berulang.
=================================================== */

let geoCache = null;

// Normalisasi nama provinsi untuk join data vs GeoJSON
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace('dki jakarta', 'jakarta')
    .replace('daerah istimewa yogyakarta', 'yogyakarta')
    .replace('di yogyakarta', 'yogyakarta')
    .replace('kepulauan bangka belitung', 'bangka belitung')
    .replace('kepulauan riau', 'riau islands')
    .replace(/\s+/g, ' ')
    .trim();
}

// Render choropleth dengan kolom data yang diberikan
async function drawMap(column, data, colorScheme = 'orange') {
  const container = d3.select('#d3-visual-target');
  container.html('');

  const W = 900, H = 480;

  const svg = container.append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .style('width', '100%')
    .style('height', '100%');

  const projection = d3.geoMercator();
  const path = d3.geoPath().projection(projection);

  // Load GeoJSON sekali saja
  if (!geoCache) {
    try {
      geoCache = await d3.json('data/Provinsi Indonesia - Provinsi.json');
    } catch (e) {
      console.error('GeoJSON gagal dimuat:', e);
      container.append('p')
        .style('color', '#8B95A8')
        .style('text-align', 'center')
        .style('padding-top', '40%')
        .text('Peta tidak dapat dimuat. Pastikan file GeoJSON tersedia.');
      return;
    }
  }

  // Auto-fit projection ke ukuran SVG
  projection.fitSize([W, H], geoCache);

  // Mapping data
  const dataMap = new Map(data.map(d => [normalizeName(d.Provinsi), d]));

  const vals = data
    .map(d => d[column])
    .filter(v => v != null && !isNaN(v));

  const minVal = d3.min(vals);
  const maxVal = d3.max(vals);

  // Smooth gradient scale
  const colorScale = colorScheme === 'blue'
    ? d3.scaleSequential(d3.interpolateBlues).domain([minVal, maxVal])
    : d3.scaleSequential()
        .domain([minVal, maxVal])
        .interpolator(d3.interpolateRgb('#1E2D44', '#F4623A'));

  const tooltip = d3.select('#tooltip');

  // DRAW MAP
  svg.selectAll('path')
    .data(geoCache.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('stroke', '#0A0E17')
    .attr('stroke-width', 0.6)
    .attr('fill', '#1E2D44')
    .attr('opacity', 0)
    .on('mousemove', function(event, d) {
      const geoName = d.properties.PROVINSI;
      const match = dataMap.get(normalizeName(geoName));
      const val = match ? match[column] : null;

      tooltip
        .style('opacity', 1)
        .style('left', `${event.pageX + 12}px`)
        .style('top', `${event.pageY - 18}px`)
        .html(
          `<strong>${geoName}</strong><br/>
           ${column}: ${val != null ? val.toLocaleString('id-ID') : 'N/A'}`
        );
    })
    .on('mouseleave', function() {
      tooltip.style('opacity', 0);
    })
    .on('mouseover', function() {
      d3.select(this)
        .transition()
        .duration(150)
        .attr('stroke-width', 1.4);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(150)
        .attr('stroke-width', 0.6);
    })
    // ANIMATION MASUK (smooth, tidak berlebihan)
    .transition()
    .duration(800)
    .ease(d3.easeCubicOut)
    .attr('opacity', 1)
    .attr('fill', d => {
      const geoName = d.properties.PROVINSI;
      const match = dataMap.get(normalizeName(geoName));
      return match && match[column] != null
        ? colorScale(match[column])
        : '#1E2D44';
    });

  // =========================
  // LEGEND
  // =========================
  const legendW = 160, legendH = 8;
  const legendX = W - legendW - 20;
  const legendY = H - 40;

  const defs = svg.append('defs');

  const grad = defs.append('linearGradient')
    .attr('id', 'map-legend-grad');

  grad.append('stop')
    .attr('offset', '0%')
    .attr('stop-color',
      colorScheme === 'blue' ? d3.interpolateBlues(0.2) : '#1E2D44'
    );

  grad.append('stop')
    .attr('offset', '100%')
    .attr('stop-color',
      colorScheme === 'blue' ? d3.interpolateBlues(0.9) : '#F4623A'
    );

  svg.append('rect')
    .attr('x', legendX)
    .attr('y', legendY)
    .attr('width', legendW)
    .attr('height', legendH)
    .attr('rx', 3)
    .attr('fill', 'url(#map-legend-grad)');

  svg.append('text')
    .attr('x', legendX)
    .attr('y', legendY - 6)
    .style('fill', '#8B95A8')
    .style('font-size', '10px')
    .style('font-family', "'JetBrains Mono', monospace")
    .text(minVal.toLocaleString('id-ID'));

  svg.append('text')
    .attr('x', legendX + legendW)
    .attr('y', legendY - 6)
    .attr('text-anchor', 'end')
    .style('fill', '#8B95A8')
    .style('font-size', '10px')
    .style('font-family', "'JetBrains Mono', monospace")
    .text(maxVal.toLocaleString('id-ID'));
}