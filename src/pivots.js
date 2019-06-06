function pivotBarChart() {
    let canvas;

    let width = 2000,
        height = 800,
        margin = {top: 10, right: 25, bottom: 10, left: 25},
        bar = {groupOffset: 10, offset: 2},
        xAxisLabels = {horizontalGap: 22};

    let chartWidth,
        chartHeight;

    let canvasWidth = 0,
        xAxisWidth = 0;

    let data = null,
        groupBy = null,
        xLabels = null,
        yLabels = null;

    let y = undefined;

    function chart(selection) {
        selection.each(function() {
            yLabels = getYAxisLabels();
            xLabels = getXAxisLabels();

            // Fit the chart with margins
            chartWidth = width - margin.left - margin.right;
            chartHeight = height - margin.top - margin.bottom + 15 - xLabels.length * xAxisLabels.horizontalGap;

            canvasWidth = chartWidth - (xLabels[xLabels.length - 1].length - 1) * bar.groupOffset;
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
        let barOffset = 0;

        let tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        canvas.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d, i) {
                let value = i * canvasWidth / data.length;

                let groupSize = yLabels.length;
                if (i % groupSize === 0) {
                    barOffset += bar.groupOffset;
                    xAxisWidth += bar.groupOffset;
                }

                return value + barOffset;
            })
            .attr('width', function() {
                let barWidth = Math.abs((canvasWidth / data.length) - bar.offset);
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
                return colors[i % yLabels.length];
            })
            .on('mouseover', function(d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9);
                tooltip.html(getTooltipHtml(d))
                    .style('left', (d3.event.pageX - tooltip.node().getBoundingClientRect().width) + 'px')
                    .style('top', (d3.event.pageY - tooltip.node().getBoundingClientRect().height) + 'px');
            })
            .on('mouseout', function() {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    function drawXAxis() {
        for (let i = 0; i < xLabels.length; ++i) {
            let label = 'x' + i;
            let className = 'text.' + label;
            let xAxis = xLabels[i];

            canvas.selectAll(className)
                .data(xAxis)
                .enter()
                .append('text')
                .attr('class', label)
                .attr('y', height - 15 - i * xAxisLabels.horizontalGap)
                .attr('text-anchor', 'middle')
                .text(function(d) {
                    return d;
                })
                .attr('x', function(d, i) {
                    let container = d3.select('body').append('svg');
                    container.append('text').text(d).style('font-size', '12');
                    let size = container.node().getBBox();
                    container.remove();

                    return (i * xAxisWidth/xAxis.length) + ((xAxisWidth / xAxis.length)) / 2 + size.width / 8;
                })
                .style('font-size', '12');
        }

        // X-Axis pivot ticks
        canvas.append('line')
            .attr('x1', 0 + 0.5)
            .attr('y1', chartHeight)
            .attr('x2', 0 + 0.5)
            .attr('y2', chartHeight + xLabels.length * xAxisLabels.horizontalGap)
            .style('stroke-width', 1)
            .style('stroke', '#000000');

        canvas.append('line')
            .attr('x1', xAxisWidth - 0.5 + 2 * bar.offset)
            .attr('y1', chartHeight)
            .attr('x2', xAxisWidth - 0.5 + 2 * bar.offset)
            .attr('y2', chartHeight + xLabels.length * xAxisLabels.horizontalGap)
            .style('stroke-width', 1)
            .style('stroke', '#000000');

        // Add additional 0.5 pixels to the y-coordinate of the axis line
        // to match the left y-axis tick
        canvas.append('line')
            .attr('x1', 0)
            .attr('y1', chartHeight + 0.5)
            .attr('x2', xAxisWidth + 2 * bar.offset)
            .attr('y2', chartHeight + 0.5)
            .style('stroke-width', 1)
            .style('stroke', '#000000');

        let labelsReversed = xLabels.reverse();
        for (let i = 0; i < labelsReversed.length; ++i) {
            let xAxis = labelsReversed[i];
            
            for (let j = 1; j <= xAxis.length - 1; ++j) {
                canvas.append('line')
                    .attr('x1', j * xAxisWidth / xAxis.length - bar.offset / 2 + bar.groupOffset / 2)
                    .attr('y1', chartHeight)
                    .attr('x2', j * xAxisWidth / xAxis.length - bar.offset / 2 + bar.groupOffset / 2)
                    .attr('y2', chartHeight + (i + 1) * xAxisLabels.horizontalGap)
                    .attr('class', xAxis[j])
                    .style('stroke-width', 1)
                    .style('stroke', '#000000');
            }    
        }
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

    function cartesianProductOf() {
        let product = _.reduce(arguments, function(a, b) {
            return _.flatten(_.map(a, function(x) {
                return _.map(b, function(y) {
                    return x.concat([y]);
                });
            }), true);
        }, [ [] ]);

        return product.map(p => p.join(' '));
    }

    function getUniqueXValues() {
        let unique = {};

        for (const group of groupBy.columns) {
            unique[group] = _.unique(data, group).map(unique => unique[group]);
        }

        return unique;
    }

    function getXAxisLabels() {
        let unique = getUniqueXValues();
        let xLabels = [];
        xLabels.push(unique[groupBy.columns[0]]);
        for (let i = 1; i < groupBy.columns.length - 1; ++i) {
            let group = groupBy.columns[i];
            xLabels.push(repeatArray(unique[group], xLabels[i - 1].length));
        }
        xLabels.push(repeatArray(unique[groupBy.columns[groupBy.columns.length - 1]], data.length / unique[groupBy.columns[groupBy.columns.length - 1]].length / yLabels.length));

        return xLabels;
    }

    function getUniqueYValues() {
        let unique = {};

        for (const group of groupBy.rows) {
            unique[group] = _.unique(data, group).map(unique => unique[group]);
        }

        return unique;
    }

    function getYAxisLabels() {
        let unique = getUniqueYValues();
        let uniqueValues = Object.entries(unique).map(entry => entry[1]);

        return cartesianProductOf(...uniqueValues);
    }

    function getTooltipHtml(point) {
        let tooltip = '<table class="table table-bordered m-b-none"><tbody>';
        for (let key in point) {
            if (key.startsWith('$')) {
                continue;
            }

            let capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

            tooltip += '<tr><td>' + capitalizedKey + ':</td><td>' + point[key] + '</td></tr>';
        }

        tooltip += '</tbody></table>';

        return tooltip;
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