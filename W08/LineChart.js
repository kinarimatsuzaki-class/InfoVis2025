class LineChart {
    constructor(config) {
      this.config = config;
      this.config.margin = this.config.margin || {top:40, right:20, bottom:40, left:50};
      this.init();
    }
  
    init() {
      const c = this.config;
      this.w = c.width - c.margin.left - c.margin.right;
      this.h = c.height - c.margin.top - c.margin.bottom;
  
      this.svg = d3.select(c.parent)
        .append("svg")
        .attr("width", c.width)
        .attr("height", c.height);
  
      this.chart = this.svg.append("g")
        .attr("transform", `translate(${c.margin.left}, ${c.margin.top})`);
  
      this.xscale = d3.scaleLinear().range([0, this.w]);
      this.yscale = d3.scaleLinear().range([this.h, 0]);
  
      // 線
      this.line = d3.line()
        .x(d => this.xscale(d.x))
        .y(d => this.yscale(d.y));
  
      // ★ 追加：エリア
      this.area = d3.area()
        .x(d => this.xscale(d.x))
        .y1(d => this.yscale(d.y))
        .y0(this.h);   // x 軸まで塗る
  
      this.xaxis = this.chart.append("g")
        .attr("transform", `translate(0, ${this.h})`);
  
      this.yaxis = this.chart.append("g");
    }
  
    update(data) {
      this.data = data;
      this.xscale.domain(d3.extent(data, d => d.x));
      this.yscale.domain([0, d3.max(data, d => d.y)]);
      this.render();
    }
  
    render() {
      const chart = this.chart;
  
      // ★ 先にエリアを描画
      chart.selectAll("path.area")
        .data([this.data])
        .join("path")
        .attr("class", "area")
        .attr("d", this.area)
        .attr("fill", "rgba(255,0,0,0.2)");
  
      // 線
      chart.selectAll("path.line")
        .data([this.data])
        .join("path")
        .attr("class", "line")
        .attr("d", this.line)
        .attr("fill", "none")
        .attr("stroke", "red");
  
      // ドット
      chart.selectAll("circle")
        .data(this.data)
        .join("circle")
        .attr("cx", d => this.xscale(d.x))
        .attr("cy", d => this.yscale(d.y))
        .attr("r", 4)
        .attr("fill", "black");
  
      this.xaxis.call(d3.axisBottom(this.xscale));
      this.yaxis.call(d3.axisLeft(this.yscale));
    }
  }
  