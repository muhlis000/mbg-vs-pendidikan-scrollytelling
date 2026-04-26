/* ===================================================
   anggaran.js
   Bar chart komparasi anggaran MBG vs Pendidikan
   dengan label nilai dan anotasi konteks.
=================================================== */

function drawBudgetComparison() {
  const container = d3.select('#d3-visual-target');
  container.html('');

  const W = 860, H = 460;
  const margin = { top: 60, right: 60, bottom: 80, left: 80 };
  const svg = container.append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .style('width', '100%').style('height', '100%');

  const budgets = [
    { name: 'Anggaran MBG',        val: 400, color: '#F4623A', sub: 'Program Makan Bergizi Gratis' },
    { name: 'Anggaran Pendidikan',  val: 665, color: '#3B82F6', sub: '20% APBN 2025' },
  ];

  const x = d3.scaleBand()
    .domain(budgets.map(d => d.name))
    .range([margin.left, W - margin.right])
    .padding(0.45);

  const y = d3.scaleLinear()
    .domain([0, 750])
    .range([H - margin.bottom, margin.top]);

  // Grid
  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickSize(-(W - margin.left - margin.right)).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', 'rgba(245,240,232,0.06)'));

  // Axis Y
  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => `Rp${d}T`))
    .call(g => g.select('.domain').remove());

  // Axis X
  svg.append('g')
    .attr('class', 'chart-axis')
    .attr('transform', `translate(0,${H - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select('.domain').remove())
    .selectAll('text')
    .style('font-size', '13px')
    .style('fill', '#F5F0E8');

  // Bars
  svg.selectAll('.bar')
    .data(budgets)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.name))
    .attr('width', x.bandwidth())
    .attr('y', H - margin.bottom)
    .attr('height', 0)
    .attr('rx', 6)
    .attr('fill', d => d.color)
    .transition().duration(900).ease(d3.easeCubicOut)
    .attr('y', d => y(d.val))
    .attr('height', d => (H - margin.bottom) - y(d.val));

  // Nilai di atas bar
  svg.selectAll('.bar-val')
    .data(budgets)
    .enter().append('text')
    .attr('class', 'bar-val chart-label')
    .attr('x', d => x(d.name) + x.bandwidth() / 2)
    .attr('y', H - margin.bottom)
    .attr('text-anchor', 'middle')
    .style('font-size', '22px')
    .transition().duration(900).ease(d3.easeCubicOut)
    .attr('y', d => y(d.val) - 14)
    .text(d => `Rp${d.val} T`);

  // Subjudul bar
  svg.selectAll('.bar-sub')
    .data(budgets)
    .enter().append('text')
    .attr('class', 'bar-sub chart-sublabel')
    .attr('x', d => x(d.name) + x.bandwidth() / 2)
    .attr('y', H - margin.bottom + 32)
    .attr('text-anchor', 'middle')
    .text(d => d.sub);

  // Title
  svg.append('text')
    .attr('x', W / 2).attr('y', 26)
    .attr('text-anchor', 'middle')
    .attr('class', 'chart-label')
    .style('font-size', '14px')
    .style('fill', '#8B95A8')
    .text('Komparasi Alokasi Anggaran (Triliun Rupiah, 2025)');
}