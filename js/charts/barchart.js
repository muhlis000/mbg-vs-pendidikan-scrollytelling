/* ===================================================
   barchart.js
   Bar chart horizontal (RLS, Biaya) dan vertikal
   (Stunting, APS) dengan animasi transisi antar
   kelompok usia dan highlight 5 provinsi terparah.
=================================================== */

const BAR_COLORS = {
  orange: '#F4623A',
  blue:   '#3B82F6',
  gold:   '#F59E0B',
  muted:  'rgba(139,149,168,0.35)',
};

const MARGIN = { top: 40, right: 30, bottom: 110, left: 56 };
const MARGIN_H = { top: 20, right: 100, bottom: 30, left: 180 };

// Ambil 5 provinsi terparah (nilai tertinggi = paling parah untuk stunting/biaya)
function getWorst5(data, field, ascending = false) {
  return [...data]
    .sort((a, b) => ascending
      ? a[field] - b[field]
      : b[field] - a[field])
    .slice(0, 5);
}

// Inisialisasi SVG dan group utama
function initSvg(containerId, w, h) {
  const container = d3.select(`#${containerId}`);
  container.html('');
  return container
    .append('svg')
    .attr('viewBox', `0 0 ${w} ${h}`)
    .style('width', '100%')
    .style('height', '100%');
}

// Bar chart vertikal — Stunting (5 terparah, dengan toggle usia)
function drawStuntingChart(data, ageKey = 'Stunting 5-12') {
  const W = 860, H = 480;
  const sorted = getWorst5(data, ageKey);

  const svg = initSvg('d3-visual-target', W, H);

  const x = d3.scaleBand()
    .domain(sorted.map(d => d.Provinsi))
    .range([MARGIN.left, W - MARGIN.right])
    .padding(0.32);

  const y = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(data, d => d[ageKey]) / 5) * 5])
    .range([H - MARGIN.bottom, MARGIN.top]);

  // Grid lines
  svg.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${MARGIN.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickSize(-(W - MARGIN.left - MARGIN.right)).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', 'rgba(245,240,232,0.06)'));

  // Axis X
  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(0,${H - MARGIN.bottom})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select('.domain').remove())
    .selectAll('text')
    .style('fill', '#F5F0E8')
    .style('font-family', "'DM Sans', sans-serif")
    .style('font-size', '12px')
    .attr('dy', '1.2em')
    .call(wrapText, x.bandwidth() + 8);

  // Axis Y
  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(${MARGIN.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
    .call(g => g.select('.domain').remove());

  // Bars
  const bars = svg.selectAll('.bar')
    .data(sorted)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.Provinsi))
    .attr('width', x.bandwidth())
    .attr('y', H - MARGIN.bottom)
    .attr('height', 0)
    .attr('rx', 4)
    .attr('fill', (d, i) => i === 0 ? BAR_COLORS.orange : BAR_COLORS.muted);

  bars.transition().duration(700).ease(d3.easeCubicOut)
    .attr('y', d => y(d[ageKey]))
    .attr('height', d => (H - MARGIN.bottom) - y(d[ageKey]));

  // Label nilai di atas bar
  svg.selectAll('.bar-lbl')
    .data(sorted)
    .enter().append('text')
    .attr('class', 'bar-lbl chart-label')
    .attr('x', d => x(d.Provinsi) + x.bandwidth() / 2)
    .attr('y', H - MARGIN.bottom)
    .attr('text-anchor', 'middle')
    .style('font-size', '13px')
    .transition().duration(700).ease(d3.easeCubicOut)
    .attr('y', d => y(d[ageKey]) - 8)
    .text(d => `${d[ageKey]}%`);

  // Chart title
  const ageLabel = { 'Stunting 5-12': 'SD (5-12 th)', 'Stunting 13-15': 'SMP (13-15 th)', 'Stunting 16-18': 'SMA (16-18 th)' };
  svg.append('text')
    .attr('class', 'chart-label')
    .attr('x', W / 2)
    .attr('y', 22)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('letter-spacing', '0.04em')
    .style('fill', '#8B95A8')
    .text(`5 Provinsi Stunting Tertinggi — ${ageLabel[ageKey] || ageKey} (%)`);
}

// Transisi bar ketika toggle usia berubah — animasi smooth
function updateStuntingChart(data, ageKey) {
  const sorted = getWorst5(data, ageKey);
  const W = 860, H = 480;

  const y = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(data, d => d[ageKey]) / 5) * 5])
    .range([H - MARGIN.bottom, MARGIN.top]);

  const x = d3.scaleBand()
    .domain(sorted.map(d => d.Provinsi))
    .range([MARGIN.left, W - MARGIN.right])
    .padding(0.32);

  const svg = d3.select('#d3-visual-target svg');

  svg.selectAll('.bar')
    .data(sorted)
    .transition().duration(600).ease(d3.easeCubicInOut)
    .attr('x', d => x(d.Provinsi))
    .attr('y', d => y(d[ageKey]))
    .attr('height', d => (H - MARGIN.bottom) - y(d[ageKey]))
    .attr('fill', (d, i) => i === 0 ? BAR_COLORS.orange : BAR_COLORS.muted);

  svg.selectAll('.bar-lbl')
    .data(sorted)
    .transition().duration(600).ease(d3.easeCubicInOut)
    .attr('x', d => x(d.Provinsi) + x.bandwidth() / 2)
    .attr('y', d => y(d[ageKey]) - 8)
    .text(d => `${d[ageKey]}%`);

  svg.selectAll('.chart-axis')
    .filter((d, i, nodes) => d3.select(nodes[i]).attr('transform').includes(`translate(0,${H - MARGIN.bottom})`))
    .call(d3.axisBottom(x).tickSize(0));

  const ageLabel = { 'Stunting 5-12': 'SD (5-12 th)', 'Stunting 13-15': 'SMP (13-15 th)', 'Stunting 16-18': 'SMA (16-18 th)' };
  svg.select('.chart-label').text(`5 Provinsi Stunting Tertinggi — ${ageLabel[ageKey] || ageKey} (%)`);
}

// Bar chart horizontal — RLS (5 terendah)
function drawRLSChart(data) {
  const W = 860, H = 440;
  const sorted = getWorst5(data, 'RLS', true);
  const svg = initSvg('d3-visual-target', W, H);

  const xMax = d3.max(data, d => d.RLS);
  const x = d3.scaleLinear()
    .domain([0, Math.ceil(xMax)])
    .range([MARGIN_H.left, W - MARGIN_H.right]);

  const y = d3.scaleBand()
    .domain(sorted.map(d => d.Provinsi))
    .range([MARGIN_H.top, H - MARGIN_H.bottom])
    .padding(0.28);

  // Grid
  svg.append('g')
    .attr('transform', `translate(0,${MARGIN_H.top})`)
    .call(d3.axisTop(x).ticks(5).tickSize(H - MARGIN_H.top - MARGIN_H.bottom).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', 'rgba(245,240,232,0.06)').attr('transform', `translate(0,0)`));

  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(${MARGIN_H.left},0)`)
    .call(d3.axisLeft(y).tickSize(0))
    .call(g => g.select('.domain').remove())
    .selectAll('text')
    .style('fill', '#F5F0E8')
    .style('font-family', "'DM Sans', sans-serif")
    .style('font-size', '12px');

  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(0,${H - MARGIN_H.bottom})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d} th`))
    .call(g => g.select('.domain').remove());

  const bars = svg.selectAll('.bar')
    .data(sorted)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('y', d => y(d.Provinsi))
    .attr('height', y.bandwidth())
    .attr('x', MARGIN_H.left)
    .attr('width', 0)
    .attr('rx', 4)
    .attr('fill', (d, i) => i === 0 ? BAR_COLORS.blue : BAR_COLORS.muted);

  bars.transition().duration(700).ease(d3.easeCubicOut)
    .attr('width', d => x(d.RLS) - MARGIN_H.left);

  svg.selectAll('.bar-lbl')
    .data(sorted)
    .enter().append('text')
    .attr('class', 'bar-lbl chart-label')
    .attr('y', d => y(d.Provinsi) + y.bandwidth() / 2 + 5)
    .attr('x', MARGIN_H.left)
    .style('font-size', '13px')
    .transition().duration(700).ease(d3.easeCubicOut)
    .attr('x', d => x(d.RLS) + 8)
    .text(d => `${d.RLS} th`);

  svg.append('text')
    .attr('class', 'chart-label')
    .attr('x', W / 2)
    .attr('y', MARGIN_H.top - 4)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('fill', '#8B95A8')
    .text('5 Provinsi RLS Terendah (Tahun)');
}

// Bar chart vertikal — APS dengan toggle usia
function drawAPSChart(data, ageKey = 'APS 16-18') {
  const W = 860, H = 480;
  const sorted = getWorst5(data, ageKey, true);
  const svg = initSvg('d3-visual-target', W, H);

  const x = d3.scaleBand()
    .domain(sorted.map(d => d.Provinsi))
    .range([MARGIN.left, W - MARGIN.right])
    .padding(0.32);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([H - MARGIN.bottom, MARGIN.top]);

  svg.append('g')
    .attr('transform', `translate(${MARGIN.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickSize(-(W - MARGIN.left - MARGIN.right)).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', 'rgba(245,240,232,0.06)'));

  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(0,${H - MARGIN.bottom})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select('.domain').remove())
    .selectAll('text')
    .style('fill', '#F5F0E8')
    .style('font-family', "'DM Sans', sans-serif")
    .style('font-size', '12px')
    .attr('dy', '1.2em')
    .call(wrapText, x.bandwidth() + 8);

  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(${MARGIN.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
    .call(g => g.select('.domain').remove());

  const bars = svg.selectAll('.bar')
    .data(sorted)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.Provinsi))
    .attr('width', x.bandwidth())
    .attr('y', H - MARGIN.bottom)
    .attr('height', 0)
    .attr('rx', 4)
    .attr('fill', (d, i) => i === 0 ? BAR_COLORS.orange : BAR_COLORS.muted);

  bars.transition().duration(700).ease(d3.easeCubicOut)
    .attr('y', d => y(d[ageKey]))
    .attr('height', d => (H - MARGIN.bottom) - y(d[ageKey]));

  svg.selectAll('.bar-lbl')
    .data(sorted)
    .enter().append('text')
    .attr('class', 'bar-lbl chart-label')
    .attr('x', d => x(d.Provinsi) + x.bandwidth() / 2)
    .attr('y', H - MARGIN.bottom)
    .attr('text-anchor', 'middle')
    .style('font-size', '13px')
    .transition().duration(700).ease(d3.easeCubicOut)
    .attr('y', d => y(d[ageKey]) - 8)
    .text(d => `${d[ageKey]}%`);

  const ageLabel = { 'APS 7-12': 'SD (7-12 th)', 'APS 13-15': 'SMP (13-15 th)', 'APS 16-18': 'SMA (16-18 th)' };
  svg.append('text')
    .attr('class', 'chart-label')
    .attr('x', W / 2)
    .attr('y', 22)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('fill', '#8B95A8')
    .text(`5 Provinsi APS Terendah — ${ageLabel[ageKey] || ageKey} (%)`);
}

// Transisi APS ketika toggle usia berubah
function updateAPSChart(data, ageKey) {
  const sorted = getWorst5(data, ageKey, true);
  const W = 860, H = 480;

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([H - MARGIN.bottom, MARGIN.top]);

  const x = d3.scaleBand()
    .domain(sorted.map(d => d.Provinsi))
    .range([MARGIN.left, W - MARGIN.right])
    .padding(0.32);

  const svg = d3.select('#d3-visual-target svg');

  svg.selectAll('.bar')
    .data(sorted)
    .transition().duration(600).ease(d3.easeCubicInOut)
    .attr('x', d => x(d.Provinsi))
    .attr('y', d => y(d[ageKey]))
    .attr('height', d => (H - MARGIN.bottom) - y(d[ageKey]))
    .attr('fill', (d, i) => i === 0 ? BAR_COLORS.orange : BAR_COLORS.muted);

  svg.selectAll('.bar-lbl')
    .data(sorted)
    .transition().duration(600).ease(d3.easeCubicInOut)
    .attr('x', d => x(d.Provinsi) + x.bandwidth() / 2)
    .attr('y', d => y(d[ageKey]) - 8)
    .text(d => `${d[ageKey]}%`);

  const ageLabel = { 'APS 7-12': 'SD (7-12 th)', 'APS 13-15': 'SMP (13-15 th)', 'APS 16-18': 'SMA (16-18 th)' };
  svg.select('.chart-label').text(`5 Provinsi APS Terendah — ${ageLabel[ageKey] || ageKey} (%)`);
}

// Bar chart grouped horizontal — Biaya pendidikan (5 termahal SMA)
function drawBiayaChart(data) {
  const W = 860, H = 460;
  const sorted = getWorst5(data, 'Rata-rata Biaya SMA/SMK Sederajat (Juta)');
  const svg = initSvg('d3-visual-target', W, H);

  const jenjang = [
    { key: 'Rata-rata Biaya SD Sederajat (Juta)',    label: 'SD',  color: BAR_COLORS.muted },
    { key: 'Rata-rata Biaya SMP Sederajat (Juta)',   label: 'SMP', color: BAR_COLORS.blue },
    { key: 'Rata-rata Biaya SMA/SMK Sederajat (Juta)', label: 'SMA', color: BAR_COLORS.orange },
  ];

  const xMax = d3.max(sorted, d => d['Rata-rata Biaya SMA/SMK Sederajat (Juta)']);
  const x = d3.scaleLinear()
    .domain([0, Math.ceil(xMax / 2) * 2 + 2])
    .range([MARGIN_H.left, W - MARGIN_H.right]);

  const y0 = d3.scaleBand()
    .domain(sorted.map(d => d.Provinsi))
    .range([MARGIN_H.top, H - MARGIN_H.bottom + 10])
    .padding(0.2);

  const y1 = d3.scaleBand()
    .domain(jenjang.map(j => j.label))
    .range([0, y0.bandwidth()])
    .padding(0.08);

  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(${MARGIN_H.left},0)`)
    .call(d3.axisLeft(y0).tickSize(0))
    .call(g => g.select('.domain').remove())
    .selectAll('text')
    .style('fill', '#F5F0E8')
    .style('font-family', "'DM Sans', sans-serif")
    .style('font-size', '12px');

  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(0,${H - MARGIN_H.bottom + 10})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => `Rp${d}jt`))
    .call(g => g.select('.domain').remove());

  const provinceGroups = svg.selectAll('.prov-group')
    .data(sorted)
    .enter().append('g')
    .attr('class', 'prov-group')
    .attr('transform', d => `translate(0,${y0(d.Provinsi)})`);

  jenjang.forEach(j => {
    provinceGroups.append('rect')
      .attr('y', y1(j.label))
      .attr('height', y1.bandwidth())
      .attr('x', MARGIN_H.left)
      .attr('width', 0)
      .attr('rx', 3)
      .attr('fill', j.color)
      .transition().duration(700).ease(d3.easeCubicOut)
      .attr('width', d => x(d[j.key]) - MARGIN_H.left);
  });

  // Legend
  const legend = svg.append('g').attr('transform', `translate(${W - 90}, ${MARGIN_H.top})`);
  jenjang.forEach((j, i) => {
    legend.append('rect').attr('y', i * 22).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', j.color);
    legend.append('text').attr('x', 16).attr('y', i * 22 + 9)
      .style('fill', '#8B95A8').style('font-size', '11px')
      .style('font-family', "'JetBrains Mono', monospace").text(j.label);
  });

  svg.append('text')
    .attr('class', 'chart-label')
    .attr('x', W / 2)
    .attr('y', MARGIN_H.top - 4)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('fill', '#8B95A8')
    .text('5 Provinsi Biaya Pendidikan Tertinggi (Juta Rupiah/Tahun)');
}

// Utility: wrap long axis labels
function wrapText(selection, width) {
  selection.each(function() {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word, line = [], lineNumber = 0;
    const lineHeight = 1.1;
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy')) || 0;
    let tspan = text.text(null).append('tspan')
      .attr('x', 0).attr('y', y).attr('dy', `${dy}em`);
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan')
          .attr('x', 0).attr('y', y)
          .attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word);
      }
    }
  });
}