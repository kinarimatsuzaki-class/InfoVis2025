class PieChart {
    constructor(config) {
      this.config = config;
      this.init();
    }
  
    init() {
      const c = this.config;
  
      this.svg = d3.select(c.parent)
        .append("svg")
        .attr("width", c.width)
        .attr("height", c.height)
        .append("g")
        .attr("transform", `translate(${c.width/2}, ${c.height/2})`);
  
      this.radius = Math.min(c.width, c.height) / 2;
  
      this.pie = d3.pie().value(d => d.value);
  
      this.arc = d3.arc()
        .innerRadius(0)              // ここを radius/2 にするとドーナツになる
        .outerRadius(this.radius);
  
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
    }
  
    update(data) {
      this.data = data;
      this.render();
    }
  
    render() {
      const arcs = this.svg.selectAll("path")
        .data(this.pie(this.data))
        .join("path")
        .attr("d", this.arc)
        .attr("fill", d => this.color(d.data.label))
        .attr("stroke", "white")
        .style("stroke-width", "2px");
  
      this.svg.selectAll("text")
        .data(this.pie(this.data))
        .join("text")
        .attr("transform", d => `translate(${this.arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(d => d.data.label);
    }
  }
  