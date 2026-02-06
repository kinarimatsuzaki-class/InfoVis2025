/**
 * Olympic Medal Explorer - Main JavaScript
 * Interactive visualization using D3.js
 * Author: 松崎葵生 (251x068x)
 */

// ===================================
// Global State
// ===================================
const state = {
    data: null,
    selectedCountries: [], // Changed to array for multi-selection
    yearRange: [1896, 2016],
    regionFilter: 'all',
    medalFilter: 'total',
    dataMode: 'all-time' // 'all-time' or 'year-range'
};

// ===================================
// Color Scales
// ===================================
const regionColors = {
    'Americas': '#ef4444',
    'Europe': '#3b82f6',
    'Asia': '#22c55e',
    'Africa': '#f59e0b',
    'Oceania': '#a855f7'
};

const medalColors = {
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    'bronze': '#CD7F32'
};

// ===================================
// Initialize Application
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load data
        state.data = await d3.json('data/olympic_data.json');

        // Initialize visualizations
        initScatterPlot();
        initBarChart();
        initComparisonChart();
        initLegend();

        // Setup event listeners
        setupControls();

        console.log('Olympic Medal Explorer initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

// ===================================
// Setup Controls
// ===================================
function setupControls() {
    // Dual range slider for year
    const yearMin = document.getElementById('year-min');
    const yearMax = document.getElementById('year-max');
    const yearDisplay = document.getElementById('year-display');
    const sliderTrack = document.querySelector('.slider-track');

    const updateYearRange = () => {
        let minVal = parseInt(yearMin.value);
        let maxVal = parseInt(yearMax.value);

        // Ensure min doesn't exceed max
        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
            yearMin.value = minVal;
            yearMax.value = maxVal;
        }

        // Update display
        yearDisplay.textContent = `${minVal} — ${maxVal}`;

        // Update track highlight
        const minPercent = ((minVal - 1896) / (2016 - 1896)) * 100;
        const maxPercent = ((maxVal - 1896) / (2016 - 1896)) * 100;
        sliderTrack.style.setProperty('--range-start', `${minPercent}%`);
        sliderTrack.style.setProperty('--range-width', `${maxPercent - minPercent}%`);

        state.yearRange = [minVal, maxVal];
        updateVisualizations();
    };

    yearMin.addEventListener('input', updateYearRange);
    yearMax.addEventListener('input', updateYearRange);

    // Initialize track highlight
    updateYearRange();

    // Region filter
    document.getElementById('region-filter').addEventListener('change', (e) => {
        state.regionFilter = e.target.value;
        updateVisualizations();
    });

    // Medal filter
    document.getElementById('medal-filter').addEventListener('change', (e) => {
        state.medalFilter = e.target.value;
        updateVisualizations();
    });

    // Reset button
    document.getElementById('reset-btn').addEventListener('click', () => {
        state.selectedCountries = [];
        state.yearRange = [1896, 2016];
        state.regionFilter = 'all';
        state.medalFilter = 'total';
        state.dataMode = 'all-time';

        yearMin.value = 1896;
        yearMax.value = 2016;
        yearDisplay.textContent = '1896 — 2016';
        document.getElementById('region-filter').value = 'all';
        document.getElementById('medal-filter').value = 'total';

        // Reset tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === 'all-time');
        });

        updateVisualizations();
        updateInfoPanel();
    });

    // Data mode tabs
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            state.dataMode = tab.dataset.mode;

            // Update all tabs to match (sync both panels)
            document.querySelectorAll('.mode-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.mode === state.dataMode);
            });

            updateBarChart();
            // Update info panel if countries are selected
            if (state.selectedCountries.length > 0) {
                updateInfoPanel();
            }
        });
    });
}

// ===================================
// Scatter Plot (View 1)
// ===================================
let scatterSvg, scatterWidth, scatterHeight, scatterMargin;

function initScatterPlot() {
    const container = document.getElementById('scatter-chart');
    const rect = container.getBoundingClientRect();

    scatterMargin = { top: 20, right: 30, bottom: 50, left: 60 };
    scatterWidth = rect.width - scatterMargin.left - scatterMargin.right;
    scatterHeight = 350 - scatterMargin.top - scatterMargin.bottom;

    scatterSvg = d3.select('#scatter-chart')
        .append('svg')
        .attr('width', rect.width)
        .attr('height', 350)
        .append('g')
        .attr('transform', `translate(${scatterMargin.left},${scatterMargin.top})`);

    // Add axes groups
    scatterSvg.append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', `translate(0,${scatterHeight})`);

    scatterSvg.append('g')
        .attr('class', 'y-axis axis');

    // Add axis labels (will be updated dynamically)
    scatterSvg.append('text')
        .attr('class', 'x-axis-label axis-label')
        .attr('x', scatterWidth / 2)
        .attr('y', scatterHeight + 40)
        .attr('text-anchor', 'middle')
        .text('Total Medals');

    scatterSvg.append('text')
        .attr('class', 'y-axis-label axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -scatterHeight / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .text('Gold Medals');

    // Add grid
    scatterSvg.append('g')
        .attr('class', 'grid x-grid')
        .attr('transform', `translate(0,${scatterHeight})`);

    scatterSvg.append('g')
        .attr('class', 'grid y-grid');

    updateScatterPlot();
}

function updateScatterPlot() {
    const data = getFilteredCountryData();

    // Update axis labels based on medal filter
    let xLabelText, yLabelText;
    if (state.medalFilter === 'total') {
        xLabelText = 'Total Medals';
        yLabelText = 'Gold Medals';
    } else {
        const medalName = state.medalFilter.charAt(0).toUpperCase() + state.medalFilter.slice(1);
        xLabelText = `${medalName} Medals`;
        yLabelText = `${medalName} Medals`;
    }

    scatterSvg.select('.x-axis-label').text(xLabelText);
    scatterSvg.select('.y-axis-label').text(yLabelText);

    // Scales - use displayTotal and displayGold
    const xMax = d3.max(data, d => d.displayTotal) * 1.1 || 100;
    const yMax = d3.max(data, d => d.displayGold) * 1.1 || 100;

    const xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, scatterWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([scatterHeight, 0]);

    // Update axes
    scatterSvg.select('.x-axis')
        .transition()
        .duration(500)
        .call(d3.axisBottom(xScale).ticks(5));

    scatterSvg.select('.y-axis')
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale).ticks(5));

    // Update grid
    scatterSvg.select('.x-grid')
        .transition()
        .duration(500)
        .call(d3.axisBottom(xScale).ticks(5).tickSize(-scatterHeight).tickFormat(''));

    scatterSvg.select('.y-grid')
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale).ticks(5).tickSize(-scatterWidth).tickFormat(''));

    // Data join for points
    const points = scatterSvg.selectAll('.scatter-point')
        .data(data, d => d.noc);

    // Exit
    points.exit()
        .transition()
        .duration(300)
        .attr('r', 0)
        .remove();

    // Enter + Update
    points.enter()
        .append('circle')
        .attr('class', 'scatter-point')
        .attr('cx', d => xScale(d.displayTotal))
        .attr('cy', d => yScale(d.displayGold))
        .attr('r', 0)
        .attr('fill', d => regionColors[d.region] || '#888')
        .attr('opacity', 0.8)
        .on('click', (event, d) => handleCountryClick(d))
        .on('mouseover', (event, d) => showTooltip(event, d))
        .on('mouseout', hideTooltip)
        .merge(points)
        .transition()
        .duration(500)
        .attr('cx', d => xScale(d.displayTotal))
        .attr('cy', d => yScale(d.displayGold))
        .attr('r', d => {
            const baseSize = Math.sqrt(d.displayTotal) / 2 + 5;
            return state.selectedCountries.includes(d.noc) ? baseSize * 1.3 : baseSize;
        })
        .attr('fill', d => regionColors[d.region] || '#888')
        .attr('opacity', d => {
            if (state.selectedCountries.length === 0) return 0.8;
            return state.selectedCountries.includes(d.noc) ? 1 : 0.3;
        });

    // Update selection state
    scatterSvg.selectAll('.scatter-point')
        .classed('selected', d => state.selectedCountries.includes(d.noc))
        .classed('dimmed', d => state.selectedCountries.length > 0 && !state.selectedCountries.includes(d.noc));
}

function getFilteredCountryData() {
    const { countries, medalsByCountry, medalsByCountryAndYear } = state.data;

    // Get year-filtered data if available
    let baseData = medalsByCountry;

    // If we have year-specific data and year filter is not full range
    if (medalsByCountryAndYear && (state.yearRange[0] !== 1896 || state.yearRange[1] !== 2016)) {
        // Aggregate medals within the selected year range
        const yearFilteredTotals = {};
        medalsByCountryAndYear.forEach(entry => {
            if (entry.year >= state.yearRange[0] && entry.year <= state.yearRange[1]) {
                if (!yearFilteredTotals[entry.noc]) {
                    yearFilteredTotals[entry.noc] = { gold: 0, silver: 0, bronze: 0, total: 0 };
                }
                yearFilteredTotals[entry.noc].gold += entry.gold || 0;
                yearFilteredTotals[entry.noc].silver += entry.silver || 0;
                yearFilteredTotals[entry.noc].bronze += entry.bronze || 0;
                yearFilteredTotals[entry.noc].total += entry.total || 0;
            }
        });

        baseData = Object.keys(yearFilteredTotals).map(noc => ({
            noc,
            ...yearFilteredTotals[noc]
        }));
    }

    return baseData
        .map(medal => {
            const country = countries.find(c => c.noc === medal.noc);

            // Calculate display values based on medal filter
            let displayTotal, displayGold;
            switch (state.medalFilter) {
                case 'gold':
                    displayTotal = medal.gold;
                    displayGold = medal.gold;
                    break;
                case 'silver':
                    displayTotal = medal.silver;
                    displayGold = medal.silver;
                    break;
                case 'bronze':
                    displayTotal = medal.bronze;
                    displayGold = medal.bronze;
                    break;
                default: // 'total'
                    displayTotal = medal.total;
                    displayGold = medal.gold;
            }

            return {
                ...medal,
                name: country ? country.name : medal.noc,
                region: country ? country.region : 'Unknown',
                displayTotal: displayTotal,
                displayGold: displayGold
            };
        })
        .filter(d => {
            if (state.regionFilter !== 'all' && d.region !== state.regionFilter) {
                return false;
            }
            // Filter out countries with 0 medals in current view
            if (d.displayTotal === 0) {
                return false;
            }
            return true;
        });
}

// ===================================
// Bar Chart (View 2)
// ===================================
let barSvg, barWidth, barHeight, barMargin;

function initBarChart() {
    const container = document.getElementById('bar-chart');
    const rect = container.getBoundingClientRect();

    barMargin = { top: 20, right: 30, bottom: 100, left: 60 };
    barWidth = rect.width - barMargin.left - barMargin.right;
    barHeight = 350 - barMargin.top - barMargin.bottom;

    barSvg = d3.select('#bar-chart')
        .append('svg')
        .attr('width', rect.width)
        .attr('height', 350)
        .append('g')
        .attr('transform', `translate(${barMargin.left},${barMargin.top})`);

    // Add axes groups
    barSvg.append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', `translate(0,${barHeight})`);

    barSvg.append('g')
        .attr('class', 'y-axis axis');

    // Add axis label
    barSvg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -barHeight / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .text('Medal Count');

    updateBarChart();
}

function updateBarChart() {
    let data;
    const isYearMode = state.dataMode === 'year-range';
    const modeLabel = isYearMode
        ? ` (${state.yearRange[0]}-${state.yearRange[1]})`
        : ' (All-time)';

    if (state.selectedCountries.length > 0) {
        // Multiple countries selected - aggregate their data
        if (isYearMode && state.data.medalsByCountryAndSportAndYear) {
            const filtered = state.data.medalsByCountryAndSportAndYear
                .filter(d => state.selectedCountries.includes(d.noc) &&
                    d.year >= state.yearRange[0] &&
                    d.year <= state.yearRange[1]);

            const sportTotals = {};
            filtered.forEach(d => {
                if (!sportTotals[d.sport]) {
                    sportTotals[d.sport] = { sport: d.sport, gold: 0, silver: 0, bronze: 0, total: 0 };
                }
                sportTotals[d.sport].gold += d.gold;
                sportTotals[d.sport].silver += d.silver;
                sportTotals[d.sport].bronze += d.bronze;
                sportTotals[d.sport].total += d.total;
            });

            data = Object.values(sportTotals)
                .sort((a, b) => b.total - a.total)
                .slice(0, 10);
        } else {
            const filtered = state.data.medalsByCountryAndSport
                .filter(d => state.selectedCountries.includes(d.noc));

            const sportTotals = {};
            filtered.forEach(d => {
                if (!sportTotals[d.sport]) {
                    sportTotals[d.sport] = { sport: d.sport, gold: 0, silver: 0, bronze: 0, total: 0 };
                }
                sportTotals[d.sport].gold += d.gold;
                sportTotals[d.sport].silver += d.silver;
                sportTotals[d.sport].bronze += d.bronze;
                sportTotals[d.sport].total += d.total;
            });

            data = Object.values(sportTotals)
                .sort((a, b) => b.total - a.total)
                .slice(0, 10);
        }

        const countryNames = state.selectedCountries.length <= 3
            ? state.selectedCountries.map(noc => getCountryName(noc)).join(', ')
            : `${state.selectedCountries.length} countries`;
        document.getElementById('bar-description').textContent =
            `Top sports: ${countryNames}${modeLabel}`;
    } else {
        // Global sports breakdown
        if (isYearMode && state.data.medalsByCountryAndSportAndYear) {
            // Aggregate all countries' sport data within year range
            const filtered = state.data.medalsByCountryAndSportAndYear
                .filter(d => d.year >= state.yearRange[0] && d.year <= state.yearRange[1]);

            const sportTotals = {};
            filtered.forEach(d => {
                if (!sportTotals[d.sport]) {
                    sportTotals[d.sport] = { sport: d.sport, gold: 0, silver: 0, bronze: 0, total: 0 };
                }
                sportTotals[d.sport].gold += d.gold;
                sportTotals[d.sport].silver += d.silver;
                sportTotals[d.sport].bronze += d.bronze;
                sportTotals[d.sport].total += d.total;
            });

            data = Object.values(sportTotals)
                .sort((a, b) => b.total - a.total)
                .slice(0, 10);
        } else {
            // All-time: use existing data
            data = state.data.medalsBySport
                .sort((a, b) => b.total - a.total)
                .slice(0, 10);
        }

        document.getElementById('bar-description').textContent =
            `Top 10 Olympic sports${modeLabel}`;
    }

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.sport))
        .range([0, barWidth])
        .padding(0.2);

    const yMax = d3.max(data, d => d.total) * 1.1;
    const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([barHeight, 0]);

    // Update axes
    barSvg.select('.x-axis')
        .transition()
        .duration(500)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end')
        .attr('dx', '-0.5em')
        .attr('dy', '0.5em');

    barSvg.select('.y-axis')
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale).ticks(5));

    // Stack data
    const stack = d3.stack()
        .keys(['bronze', 'silver', 'gold'])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    const stackedData = stack(data);

    // Create groups for each medal type
    const groups = barSvg.selectAll('.bar-group')
        .data(stackedData, d => d.key);

    groups.exit().remove();

    const groupsEnter = groups.enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('fill', d => medalColors[d.key]);

    const allGroups = groupsEnter.merge(groups);

    // Bars within each group
    allGroups.each(function (stackData) {
        const bars = d3.select(this)
            .selectAll('.bar-rect')
            .data(stackData, d => d.data.sport);

        bars.exit()
            .transition()
            .duration(300)
            .attr('height', 0)
            .attr('y', barHeight)
            .remove();

        bars.enter()
            .append('rect')
            .attr('class', 'bar-rect')
            .attr('x', d => xScale(d.data.sport))
            .attr('y', barHeight)
            .attr('width', xScale.bandwidth())
            .attr('height', 0)
            .on('mouseover', (event, d) => showBarTooltip(event, d, stackData.key))
            .on('mouseout', hideTooltip)
            .merge(bars)
            .transition()
            .duration(500)
            .attr('x', d => xScale(d.data.sport))
            .attr('y', d => yScale(d[1]))
            .attr('width', xScale.bandwidth())
            .attr('height', d => yScale(d[0]) - yScale(d[1]));
    });
}

function getCountryName(noc) {
    const country = state.data.countries.find(c => c.noc === noc);
    return country ? country.name : noc;
}

// ===================================
// Comparison Chart (View 3) - Grouped Bar Chart
// Based on Munzner's juxtaposition principle for comparison
// ===================================
let compSvg, compWidth, compHeight, compMargin;

function initComparisonChart() {
    const container = document.getElementById('comparison-chart');
    const rect = container.getBoundingClientRect();

    compMargin = { top: 20, right: 30, bottom: 60, left: 60 };
    compWidth = rect.width - compMargin.left - compMargin.right;
    compHeight = 300 - compMargin.top - compMargin.bottom;

    compSvg = d3.select('#comparison-chart')
        .append('svg')
        .attr('width', rect.width)
        .attr('height', 300)
        .append('g')
        .attr('transform', `translate(${compMargin.left},${compMargin.top})`);

    // Add axes groups
    compSvg.append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', `translate(0,${compHeight})`);

    compSvg.append('g')
        .attr('class', 'y-axis axis');

    // Y-axis label
    compSvg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -compHeight / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .text('Medal Count');
}

function updateComparisonChart() {
    const placeholder = document.getElementById('comparison-placeholder');
    const chartContainer = document.getElementById('comparison-chart');
    const description = document.getElementById('comparison-description');

    if (state.selectedCountries.length < 2) {
        // Show placeholder, hide chart
        if (placeholder) placeholder.style.display = 'flex';
        if (chartContainer) chartContainer.style.display = 'none';

        if (description) {
            description.textContent = state.selectedCountries.length === 0
                ? 'Select 2+ countries to compare'
                : 'Select 1 more country to compare';
        }
        return;
    }

    // Hide placeholder, show chart
    if (placeholder) placeholder.style.display = 'none';
    if (chartContainer) chartContainer.style.display = 'block';

    // Get data for selected countries
    const filteredData = getFilteredCountryData();
    const comparisonData = state.selectedCountries.map(noc => {
        const countryData = filteredData.find(d => d.noc === noc) || { gold: 0, silver: 0, bronze: 0 };
        return {
            noc: noc,
            name: getCountryName(noc),
            gold: countryData.gold || 0,
            silver: countryData.silver || 0,
            bronze: countryData.bronze || 0,
            total: (countryData.gold || 0) + (countryData.silver || 0) + (countryData.bronze || 0)
        };
    });

    // Update description
    document.getElementById('comparison-description').textContent =
        `Comparing ${comparisonData.map(d => d.name).join(' vs ')}`;

    // Recalculate dimensions
    const container = document.getElementById('comparison-chart');
    const rect = container.getBoundingClientRect();
    compWidth = rect.width - compMargin.left - compMargin.right;

    // Country scale (outer)
    const x0 = d3.scaleBand()
        .domain(comparisonData.map(d => d.noc))
        .rangeRound([0, compWidth])
        .paddingInner(0.2);

    // Medal type scale (inner)
    const medalTypes = ['gold', 'silver', 'bronze'];
    const x1 = d3.scaleBand()
        .domain(medalTypes)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.1);

    // Y scale
    const yMax = d3.max(comparisonData, d => Math.max(d.gold, d.silver, d.bronze)) * 1.1;
    const y = d3.scaleLinear()
        .domain([0, yMax])
        .range([compHeight, 0]);

    // Update axes
    compSvg.select('.x-axis')
        .transition()
        .duration(500)
        .call(d3.axisBottom(x0).tickFormat(noc => getCountryName(noc)));

    compSvg.select('.y-axis')
        .transition()
        .duration(500)
        .call(d3.axisLeft(y).ticks(5));

    // Country groups
    const countryGroups = compSvg.selectAll('.country-group')
        .data(comparisonData, d => d.noc);

    countryGroups.exit().remove();

    const countryGroupsEnter = countryGroups.enter()
        .append('g')
        .attr('class', 'country-group');

    const allGroups = countryGroupsEnter.merge(countryGroups)
        .attr('transform', d => `translate(${x0(d.noc)},0)`);

    // Bars for each medal type
    medalTypes.forEach(medalType => {
        const bars = allGroups.selectAll(`.bar-${medalType}`)
            .data(d => [{ type: medalType, value: d[medalType], noc: d.noc }]);

        bars.exit().remove();

        bars.enter()
            .append('rect')
            .attr('class', `bar-${medalType}`)
            .attr('x', x1(medalType))
            .attr('y', compHeight)
            .attr('width', x1.bandwidth())
            .attr('height', 0)
            .attr('fill', medalColors[medalType])
            .merge(bars)
            .transition()
            .duration(500)
            .attr('x', x1(medalType))
            .attr('y', d => y(d.value))
            .attr('width', x1.bandwidth())
            .attr('height', d => compHeight - y(d.value));
    });

    // Add value labels on bars
    allGroups.selectAll('.bar-label').remove();
    medalTypes.forEach(medalType => {
        allGroups.each(function (d) {
            const value = d[medalType];
            if (value > 0) {
                d3.select(this).append('text')
                    .attr('class', 'bar-label')
                    .attr('x', x1(medalType) + x1.bandwidth() / 2)
                    .attr('y', y(value) - 5)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10px')
                    .attr('fill', 'var(--text-secondary)')
                    .text(value);
            }
        });
    });
}

// ===================================
// Legend
// ===================================
function initLegend() {
    const legend = document.getElementById('scatter-legend');
    legend.innerHTML = '';

    Object.entries(regionColors).forEach(([region, color]) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <span class="legend-color" style="background: ${color};"></span>
            <span>${region}</span>
        `;
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            document.getElementById('region-filter').value =
                state.regionFilter === region ? 'all' : region;
            state.regionFilter = state.regionFilter === region ? 'all' : region;
            updateVisualizations();
        });
        legend.appendChild(item);
    });
}

// ===================================
// Tooltip
// ===================================
const tooltip = document.getElementById('tooltip');

function showTooltip(event, d) {
    const content = `
        <div class="tooltip-title">${d.name} (${d.noc})</div>
        <div class="tooltip-content">
            <div>Region: ${d.region}</div>
            <div class="tooltip-medal">
                <span class="tooltip-medal-icon" style="background: ${medalColors.gold};"></span>
                Gold: ${d.gold}
            </div>
            <div class="tooltip-medal">
                <span class="tooltip-medal-icon" style="background: ${medalColors.silver};"></span>
                Silver: ${d.silver}
            </div>
            <div class="tooltip-medal">
                <span class="tooltip-medal-icon" style="background: ${medalColors.bronze};"></span>
                Bronze: ${d.bronze}
            </div>
            <div style="margin-top: 8px; font-weight: 600;">
                Total: ${d.total}
            </div>
        </div>
    `;

    tooltip.innerHTML = content;
    tooltip.classList.add('visible');

    positionTooltip(event);
}

function showBarTooltip(event, d, medalType) {
    const count = d.data[medalType];
    const content = `
        <div class="tooltip-title">${d.data.sport}</div>
        <div class="tooltip-content">
            <div class="tooltip-medal">
                <span class="tooltip-medal-icon" style="background: ${medalColors[medalType]};"></span>
                ${medalType.charAt(0).toUpperCase() + medalType.slice(1)}: ${count}
            </div>
            <div style="margin-top: 4px;">Total: ${d.data.total}</div>
        </div>
    `;

    tooltip.innerHTML = content;
    tooltip.classList.add('visible');

    positionTooltip(event);
}

function positionTooltip(event) {
    const tooltipRect = tooltip.getBoundingClientRect();
    const x = event.pageX + 15;
    const y = event.pageY - tooltipRect.height / 2;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}

function hideTooltip() {
    tooltip.classList.remove('visible');
}

// ===================================
// Interaction Handlers
// ===================================
function handleCountryClick(d) {
    const index = state.selectedCountries.indexOf(d.noc);
    if (index > -1) {
        // Already selected - remove it
        state.selectedCountries.splice(index, 1);
    } else {
        // Add to selection
        state.selectedCountries.push(d.noc);
    }

    updateVisualizations();
    updateInfoPanel();
}

function updateInfoPanel() {
    const container = document.getElementById('country-cards');
    if (!container) return;

    container.innerHTML = '';

    if (state.selectedCountries.length === 0) {
        container.innerHTML = '<p class="no-selection-message">Click countries in the scatter plot to add them here</p>';
        return;
    }

    const filteredData = getFilteredCountryData();

    // Create independent card for each selected country
    state.selectedCountries.forEach(noc => {
        const countryData = filteredData.find(d => d.noc === noc);
        const gold = countryData?.gold || 0;
        const silver = countryData?.silver || 0;
        const bronze = countryData?.bronze || 0;

        const card = document.createElement('div');
        card.className = 'country-card';
        card.innerHTML = `
            <div class="country-card-header">
                <span class="country-card-name">${getCountryName(noc)} (${noc})</span>
                <button class="country-card-remove" data-noc="${noc}" title="Remove">✕</button>
            </div>
            <div class="country-card-medals">
                <span class="country-card-medal"><span class="medal-icon gold"></span>${gold}</span>
                <span class="country-card-medal"><span class="medal-icon silver"></span>${silver}</span>
                <span class="country-card-medal"><span class="medal-icon bronze"></span>${bronze}</span>
                <span class="country-card-medal" style="font-weight: 600;">= ${gold + silver + bronze}</span>
            </div>
        `;

        // Add remove button handler
        card.querySelector('.country-card-remove').addEventListener('click', (e) => {
            const nocToRemove = e.target.dataset.noc;
            state.selectedCountries = state.selectedCountries.filter(n => n !== nocToRemove);
            updateVisualizations();
            updateInfoPanel();
        });

        container.appendChild(card);
    });
}

function updateVisualizations() {
    updateScatterPlot();
    updateBarChart();
    updateComparisonChart();
}

// ===================================
// Window Resize Handler
// ===================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize charts on resize
        document.getElementById('scatter-chart').innerHTML = '';
        document.getElementById('bar-chart').innerHTML = '';
        initScatterPlot();
        initBarChart();
    }, 250);
});
