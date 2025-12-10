d3.csv("pie_data.csv").then(data => {
    data.forEach(d => d.value = +d.value);
  
    const chart = new PieChart({
      parent: "#piechart",
      width: 400,
      height: 400
    });
  
    chart.update(data);
  });
  