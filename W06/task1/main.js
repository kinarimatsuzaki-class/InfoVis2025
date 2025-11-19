class ScatterPlot {

    constructor(config, data) {
        this.config = {
            parent: config.parent || '#drawing_region',
            width:  config.width  || 256,
            height: config.height || 256,
            margin: config.margin || { top: 40, right: 40, bottom: 40, left: 40 }
        };
        this.data = data;
        this.init();
    }

    init() {
        const self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width  = self.config.width  - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top  - self.config.margin.bottom;

        
        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        
        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

       
        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSize(5)
            .tickPadding(5);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            .tickSize(5)
            .tickPadding(5);

        
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        
        self.points_group = self.chart.append('g');
    }

    update() {
        const self = this;

        const xmin = d3.min(self.data, d => d.x);
        const xmax = d3.max(self.data, d => d.x);
        const ymin = d3.min(self.data, d => d.y);
        const ymax = d3.max(self.data, d => d.y);

        self.xscale.domain([xmin, xmax]);
        self.yscale.domain([ymin, ymax]);

        self.render();
    }

    render() {
        const self = this;

   
        const circles = self.points_group.selectAll('circle')
            .data(self.data);

        circles.enter()
            .append('circle')
            .merge(circles)
            .attr('cx', d => self.xscale(d.x))
            .attr('cy', d => self.yscale(d.y))
            .attr('r',  d => d.r);

        circles.exit().remove();

      
        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}


d3.csv('../W04/data.csv')
    .then(data => {
        data.forEach(d => {
            d.x = +d.x;
            d.y = +d.y;
            d.r = +d.r;
        });

        const config = {
            parent: '#drawing_region',
            width: 400,
            height: 300,
            margin: { top: 40, right: 40, bottom: 40, left: 40 }  
        };

        const plot = new ScatterPlot(config, data);
        plot.update();
    })
    .catch(error => {
        console.log(error);
    });
