const svg = d3.select("#drawing_region");
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 10, right: 10, bottom: 30, left: 40 };
const innerW = width - margin.left - margin.right;
const innerH = height - margin.top - margin.bottom;

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().range([0, innerW]);
const y = d3.scaleLinear().range([innerH, 0]);

const xAxisG = g.append("g").attr("transform", `translate(0,${innerH})`);
const yAxisG = g.append("g");

const tooltip = d3.select("#tooltip");
const padding = 10;

d3.csv("./data/task2.csv").then(rows => {
  const data = rows.map(d => ({ x: +d.x, y: +d.y, label: d.label }));
  update(data);
});

function update(data) {
  x.domain(d3.extent(data, d => d.x)).nice();
  y.domain(d3.extent(data, d => d.y)).nice();

  xAxisG.call(d3.axisBottom(x).ticks(5));
  yAxisG.call(d3.axisLeft(y).ticks(5));

  g.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 6)
    .attr("fill", "steelblue")
    .on("mouseover", (e, d) => {
      // hoverで色変更（必須）
      d3.select(e.currentTarget).attr("fill", "orange");

      tooltip
        .style("opacity", 1)
        .html(
          `<div><b>${d.label}</b></div>
           <div class="tooltip-label">Position</div>(${d.x}, ${d.y})`
        );
    })
    .on("mousemove", (e) => {
      tooltip
        .style("left", (e.pageX + padding) + "px")
        .style("top", (e.pageY + padding) + "px");
    })
    .on("mouseleave", (e) => {
      d3.select(e.currentTarget).attr("fill", "steelblue");
      tooltip.style("opacity", 0);
    });
}
