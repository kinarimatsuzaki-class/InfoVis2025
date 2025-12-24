const svg = d3.select("#drawing_region");
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 10, right: 10, bottom: 30, left: 60 };
const innerW = width - margin.left - margin.right;
const innerH = height - margin.top - margin.bottom;

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().range([0, innerW]);
const y = d3.scaleBand().range([0, innerH]).padding(0.2);

const xAxisG = g.append("g").attr("transform", `translate(0,${innerH})`);
const yAxisG = g.append("g");

let rawData = [];
let reversed = false;
let order = "desc";
let barColor = "steelblue";

// 外部データ読込（必須）
d3.csv("./data/task1.csv").then(rows => {
  rawData = rows.map(d => ({ name: d.name, value: +d.value }));
  render();
});

function render() {
  let data = [...rawData];

  // Asc / Desc
  data.sort((a, b) => order === "asc" ? a.value - b.value : b.value - a.value);

  // Reverse
  if (reversed) data.reverse();

  update(data);
}

function update(data) {
  // スケール更新
  x.domain([0, d3.max(data, d => d.value) || 1]);
  y.domain(data.map(d => d.name));

  const t = svg.transition().duration(900);

  // 軸（アニメ付き）
  xAxisG.transition(t).call(d3.axisBottom(x).ticks(5));
  yAxisG.transition(t).call(d3.axisLeft(y));

  // バー（並べ替えで位置がスッと移動）
  const bars = g.selectAll("rect").data(data, d => d.name);

  bars.join(
    enter => enter.append("rect")
      .attr("x", 0)
      .attr("y", d => y(d.name))
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("fill", barColor)
      .call(enter => enter.transition(t).attr("width", d => x(d.value))),
    update => update
      .attr("fill", barColor)
      .call(update => update.transition(t)
        .attr("y", d => y(d.name))
        .attr("height", y.bandwidth())
        .attr("width", d => x(d.value))),
    exit => exit.call(exit => exit.transition(t).attr("width", 0).remove())
  );
}

// UI
d3.select("#reverseBtn").on("click", () => {
  reversed = !reversed;
  render();
});

d3.select("#orderSel").on("change", function () {
  order = this.value;
  render();
});

d3.select("#colorSel").on("change", function () {
  barColor = this.value; // Option
  render();
});
