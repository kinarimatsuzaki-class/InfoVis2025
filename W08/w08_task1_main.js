d3.csv("bar_data.csv").then(data => {
    data.forEach(d => d.value = +d.value);
  
    const chart = new BarChart({
      parent: "#barchart",
      width: 500,
      height: 300,
      margin: {top:40, right:20, bottom:40, left:80}
    });
  
    chart.update(data);
  });
  