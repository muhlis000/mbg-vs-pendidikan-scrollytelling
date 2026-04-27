let geoCache = null;

async function drawMap() {
  const container = d3.select('#d3-visual-target');
  container.html('');

  const W = 900, H = 480;

  const svg = container.append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .style('width', '100%')
    .style('height', '100%');

  const projection = d3.geoMercator();
  const path = d3.geoPath().projection(projection);

  // ✅ LOAD FINAL GEOJSON
  if (!geoCache) {
    geoCache = await d3.json('data/final.geojson');
  }

  projection.fitSize([W, H], geoCache);

  // ambil semua nilai sppg
  const vals = geoCache.features
    .map(d => d.properties.sppg)
    .filter(v => v != null);

  const minVal = d3.min(vals);
  const maxVal = d3.max(vals);

  const colorScale = d3.scaleSequential()
    .domain([minVal, maxVal])
    .interpolator(d3.interpolateRgb('#1E2D44', '#F4623A'));

  const tooltip = d3.select('#tooltip');

  // DRAW
  svg.selectAll('path')
    .data(geoCache.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('stroke', '#0A0E17')
    .attr('stroke-width', 0.6)
    .attr('fill', d => {
      return d.properties.sppg
        ? colorScale(d.properties.sppg)
        : '#1E2D44';
    })
    .on('mousemove', function(event, d) {
      tooltip
        .style('opacity', 1)
        .style('left', `${event.pageX + 12}px`)
        .style('top', `${event.pageY - 18}px`)
        .html(`
          <strong>${d.properties.nama}</strong><br/>
          SPPG: ${d.properties.sppg ?? 'N/A'}
        `);
    })
    .on('mouseleave', () => tooltip.style('opacity', 0));
}
