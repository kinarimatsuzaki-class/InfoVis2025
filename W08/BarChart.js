class BarChart {
    constructor(config) {
      this.config = {
        parent: config.parent,
        width: config.width || 400,
        height: config.height || 300,
        margin: config.margin || {top:40, right:20, bottom:40, left:80}
      };
      this.init();   // ← ここで init() を呼んでいる
    }
  
    // ← これが BarChart.init()
    init() {
      const c = this.config;
      this.w = c.width - c.margin.left - c.margin.right;
      this.h = c.height - c.margin.top - c.margin.bottom;
  
      // SVG と g 要素
      this.svg = d3.select(c.parent)
        .append("svg")
        .attr("width", c.width)
        .attr("height", c.height);
  
      this.chart = this.svg.append("g")
        .attr("transform", `translate(${c.margin.left}, ${c.margin.top})`);
  
      // スケール
      this.xscale = d3.scaleLinear().range([0, this.w]);
      this.yscale = d3.scaleBand().range([0, this.h]).padding(0.1);
  
      // 軸用の g
      this.xaxis = this.chart.append("g")
        .attr("transform", `translate(0, ${this.h})`);
  
      this.yaxis = this.chart.append("g");
  
      // タイトル
this.svg.append("text")
.attr("x", this.config.width / 2)
.attr("y", this.config.margin.top / 2)
.attr("text-anchor", "middle")
.attr("font-size", "16px")
.text("Sales by Item");

// x 軸ラベル
this.svg.append("text")
.attr("x", this.config.width / 2)
.attr("y", this.config.height - 5)
.attr("text-anchor", "middle")
.text("Value");

// y 軸ラベル
this.svg.append("text")
.attr("transform", "rotate(-90)")
.attr("x", -this.config.height / 2)
.attr("y", 15)
.attr("text-anchor", "middle")
.text("Item");

    }
  
    update(data) {
      this.data = data;
      this.xscale.domain([0, d3.max(data, d => d.value)]);
      this.yscale.domain(data.map(d => d.label));
      this.render();
    }
  
    render() {
      const chart = this.chart;
  
      chart.selectAll("rect")
        .data(this.data)
        .join("rect")
        .attr("x", 0)
        .attr("y", d => this.yscale(d.label))
        .attr("width", d => this.xscale(d.value))
        .attr("height", this.yscale.bandwidth())
        .attr("fill", "steelblue");
  
      this.xaxis.call(d3.axisBottom(this.xscale));
      this.yaxis.call(d3.axisLeft(this.yscale));
    }
  }
  