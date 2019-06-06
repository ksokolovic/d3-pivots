function pivotBarChart() {
    let canvas;

    let width = 2000,
        height = 800,
        margin = {top: 10, right: 25, bottom: 10, left: 25},
        bar = {groupOffset: 10, offset: 2};

    let chartWidth,
        chartHeight;

    let canvasWidth = 0,
        xAxisWidth = 0;

    let data = null,
        groupBy = null;

    let y = undefined;

    function chart(selection) {
        selection.each(function() {
            // Fit the chart with margins
            chartWidth = width - margin.left - margin.right;
            chartHeight = height - margin.top - margin.bottom;

            let xLabels = getXAxisLabels();
            for (let i = xLabels.length - 1; i >= 0; --i) {
                console.log(xLabels[i]);
            }

            canvasWidth = chartWidth - (xLabels[0].length - 1) * bar.groupOffset;
            y = d3.scaleLinear().range([chartHeight, 0]);
            y.domain([0, maxValue()]);

            let svg = d3.select(this)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            canvas = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            drawBars();
            drawXAxis();
            drawYAxis();
        });
    }

    // #region Chart drawing

    function drawBars() {
        let colors = getRandomColorPalette(data.length);

        canvas.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d, i) {
                let value = i * canvasWidth / data.length;

                return value + bar.offset;
            })
            .attr('width', function() {
                let barWidth = (canvasWidth / data.length) - bar.offset;
                xAxisWidth += (barWidth + bar.offset);

                return barWidth;
            })
            .attr('y', function(d) {
                return y(d.value);
            })
            .attr('height', function(d) {
                return chartHeight - y(d.value);
            })
            .attr('fill', function(d, i) {
                return colors[i];
            });
    }

    function drawXAxis() {

    }

    function drawYAxis() {
        let yAxis = d3.axisLeft().scale(y);

        canvas
            .append('g')
            .attr('class', 'y axis')
            .style('stroke-width', 1)
            .call(yAxis);
    }

    // #endregion

    // #region Helper functions

    function getRandomColorPalette(size) {
        let palette = [];
        
        let letters = '0123456789ABCDEF';
        for (let i = 0; i < size; ++i) {
            let color = '#';
            for (let j = 0; j < 6; ++j) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            palette.push(color);
        }

        return palette;
    }

    function maxValue() {
        let maxPoint = _.max(data, function(point) {
            return point.value;
        });

        return maxPoint.value;
    }

    function repeatArray(array, times) {
        return [].concat(...Array.from({ length: times }, () => array));
    }

    function getXAxisLabels() {
        let unique = {};

        for (const group of groupBy.x) {
            unique[group] = _.unique(data, group).map(unique => unique[group]);
        }

        let xLabels = [];
        xLabels.push(unique[groupBy.x[0]]);
        for (let i = 1; i < groupBy.x.length - 1; ++i) {
            let group = groupBy.x[i];
            xLabels.push(repeatArray(unique[group], xLabels[i - 1].length));
        }
        xLabels.push(repeatArray(unique[groupBy.x[groupBy.x.length - 1]], unique[groupBy.x[groupBy.x.length - 1]].length));

        return xLabels;
    }

    // #endregion

    // #region Getters and Setters

    chart.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) {
            return margin;
        }
        margin = value;
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) {
            return data;
        }
        data = value;
        return chart;
    };

    chart.groupBy = function(value) {
        if (!arguments.length) {
            return groupBy;
        }
        groupBy = value;
        return chart;
    };

    // #endregion

    return chart;
}

export {pivotBarChart as default};