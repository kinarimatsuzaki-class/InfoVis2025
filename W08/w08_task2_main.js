d3.csv("line_data.csv").then(data => {
    data.forEach(d => {
      d.x = +d.x;
      d.y = +d.y;
    });
  
    const chart = new LineChart({
      parent: "#linechart",
      width: 500,
      height: 300,
      margin: {top:40, right:20, bottom:40, left:50}
    });
  
    chart.update(data);
  });
  