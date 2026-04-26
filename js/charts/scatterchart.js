/* ===================================================
   scatterchart.js
   Scatter plot korelasi dengan garis regresi OLS
   dan anotasi koefisien Pearson.
=================================================== */

const SC_MARGIN = { top: 50, right: 40, bottom: 60, left: 70 };

// Hitung koefisien Pearson
function pearson(xs, ys) {
  const n = xs.length;
  const meanX = d3.mean(xs), meanY = d3.mean(ys);
  const num = d3.sum(xs.map((x, i) => (x - meanX) * (ys[i] - meanY)));
  const den = Math.sqrt(
    d3.sum(xs.map(x => (x - meanX) ** 2)) *
    d3.sum(ys.map(y => (y - meanY) ** 2))
  );
  return den === 0 ? 0 : num / den;
}

// Hitung parameter regresi linear OLS: y = a + bx
function ols(xs, ys) {
  const n = xs.length;
  const meanX = d3.mean(xs), meanY = d3.mean(ys);
  const b = d3.sum(xs.map((x, i) => (x - meanX) * (ys[i] - meanY))) /
            d3.sum(xs.map(x => (x - meanX) ** 2));
  const a = meanY - b * meanX;
  return { a, b };
}

// Scatter plot Protein (x) vs RLS (y)
function drawScatterProteinRLS(data) {
  const points = data
    .map(d => ({ prov: d.Provinsi, x: +d['Protein (gr)'], y: +d.RLS }))
    .filter(d => isFinite(d.x) && isFinite(d.y));

  _renderScatter({
    points,
    xLabel: 'Konsumsi Protein (gr/kapita/hari)',
    yLabel: 'Rata-rata Lama Sekolah (thn)',
    dotColor: '#F59E0B',
    lineColor: '#F4623A',
    title: 'Korelasi: Protein vs RLS',
  });
}

// Scatter plot Protein (x) vs Stunting 16-18 (y)
function drawScatterProteinStunting(data) {
  const points = data
    .map(d => ({ prov: d.Provinsi, x: +d['Protein (gr)'], y: +d['Stunting 16-18'] }))
    .filter(d => isFinite(d.x) && isFinite(d.y));

  _renderScatter({
    points,
    xLabel: 'Konsumsi Protein (gr/kapita/hari)',
    yLabel: 'Stunting SMA 16-18 (%)',
    dotColor: '#3B82F6',
    lineColor: '#F4623A',
    title: 'Korelasi: Protein vs Stunting SMA',
  });
}

// Render scatter internal — bisa dipakai ulang
function _renderScatter({ points, xLabel, yLabel, dotColor, lineColor, title }) {
  const container = d3.select('#d3-visual-target');
  container.html('');

  const W = 860, H = 460;
  const svg = container.append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .style('width', '100%').style('height', '100%');

  const xs = points.map(d => d.x);
  const ys = points.map(d => d.y);

  const xScale = d3.scaleLinear()
    .domain([d3.min(xs) - 1, d3.max(xs) + 1])
    .range([SC_MARGIN.left, W - SC_MARGIN.right]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(ys) - 0.5, d3.max(ys) + 0.5])
    .range([H - SC_MARGIN.bottom, SC_MARGIN.top]);

  // Grid
  svg.append('g')
    .attr('transform', `translate(${SC_MARGIN.left},0)`)
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-(W - SC_MARGIN.left - SC_MARGIN.right)).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', 'rgba(245,240,232,0.06)'));

  // Axis X
  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(0,${H - SC_MARGIN.bottom})`)
    .call(d3.axisBottom(xScale).ticks(6))
    .call(g => g.select('.domain').remove());

  svg.append('text')
    .attr('x', W / 2).attr('y', H - 12)
    .attr('text-anchor', 'middle')
    .attr('class', 'chart-sublabel')
    .text(xLabel);

  // Axis Y
  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(${SC_MARGIN.left},0)`)
    .call(d3.axisLeft(yScale).ticks(6))
    .call(g => g.select('.domain').remove());

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(H / 2)).attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('class', 'chart-sublabel')
    .text(yLabel);

  // Garis regresi OLS
  const { a, b } = ols(xs, ys);
  const x1 = d3.min(xs), x2 = d3.max(xs);
  svg.append('line')
    .attr('x1', xScale(x1)).attr('y1', yScale(a + b * x1))
    .attr('x2', xScale(x1)).attr('y2', yScale(a + b * x1))
    .attr('stroke', lineColor)
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '5,3')
    .attr('opacity', 0.7)
    .transition().duration(900).ease(d3.easeCubicOut)
    .attr('x2', xScale(x2)).attr('y2', yScale(a + b * x2));

  // Dots
  const tooltip = d3.select('#tooltip');
  svg.selectAll('circle')
    .data(points)
    .enter().append('circle')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 0)
    .attr('fill', dotColor)
    .attr('fill-opacity', 0.7)
    .attr('stroke', 'rgba(245,240,232,0.2)')
    .attr('stroke-width', 1)
    .on('mousemove', function(event, d) {
      d3.select(this).attr('fill-opacity', 1).attr('r', 7);
      tooltip
        .style('opacity', 1)
        .style('left', `${event.offsetX + 14}px`)
        .style('top', `${event.offsetY - 10}px`)
        .html(`<strong>${d.prov}</strong><br/>Protein: ${d.x} gr<br/>${yLabel.split(' (')[0]}: ${d.y}`);
    })
    .on('mouseleave', function() {
      d3.select(this).attr('fill-opacity', 0.7).attr('r', 5);
      tooltip.style('opacity', 0);
    })
    .transition().duration(700).ease(d3.easeCubicOut)
    .attr('r', 5);

  // Anotasi r Pearson
  const r = pearson(xs, ys);
  const rLabel = `r = ${r.toFixed(3)}  (${interpretR(r)})`;

  svg.append('text')
    .attr('x', W - SC_MARGIN.right - 8)
    .attr('y', SC_MARGIN.top + 4)
    .attr('text-anchor', 'end')
    .attr('class', 'chart-sublabel')
    .style('fill', lineColor)
    .text(rLabel);

  // Title
  svg.append('text')
    .attr('x', W / 2).attr('y', 22)
    .attr('text-anchor', 'middle')
    .attr('class', 'chart-label')
    .style('font-size', '14px')
    .style('fill', '#8B95A8')
    .text(title);
}

function interpretR(r) {
  const abs = Math.abs(r);
  const dir = r > 0 ? 'positif' : 'negatif';
  if (abs >= 0.7) return `korelasi ${dir} kuat`;
  if (abs >= 0.5) return `korelasi ${dir} sedang`;
  if (abs >= 0.3) return `korelasi ${dir} lemah`;
  return 'korelasi sangat lemah';
}