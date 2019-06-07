function pivotBarChart() {
    let canvas;

    let width = 2000,
        height = 800,
        margin = {top: 10, right: 25, bottom: 10, left: 25},
        bar = {groupOffset: 10, offset: 2},
        xAxisLabels = {horizontalGap: 12},
        axis = {xTicks: true, xLabels: true, yTicks: true, yLabels: true};

    let chartWidth,
        chartHeight;

    let canvasWidth = 0,
        xAxisWidth = 0;

    let data = null,
        chartData = null,
        pivot = null,
        xLabels = null,
        yLabels = null;

    let y = undefined;

    let pointValue = function(point) {
        if (point.hasOwnProperty(pivot.value)) {
            return point[pivot.value];
        }
        return 0;
    };
    let colors = null;

    function chart(selection) {
        selection.each(function() {
            let indexed = indexData(data);
            chartData = prepareData(indexed);

            yLabels = getYAxisLabels(chartData);
            xLabels = getXAxisLabels(chartData);

            // Fit the chart with margins
            chartWidth = width - margin.left - margin.right;
            chartHeight = height - margin.top - margin.bottom + 15 - 2 * xLabels.length * xAxisLabels.horizontalGap;

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
        colors = getRandomColorPalette(chartData.length);
        let barOffset = 0;

        let tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        canvas.selectAll('.bar')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('class', function(d) {
                return getCategoryClass(d) + ' bar';
            })
            .attr('x', function(d, i) {
                let value = i * canvasWidth / chartData.length;

                let groupSize = yLabels.length;
                if (i % groupSize === 0) {
                    barOffset += bar.groupOffset;
                    xAxisWidth += bar.groupOffset;
                }

                return value + barOffset;
            })
            .attr('width', function() {
                let barWidth = Math.abs((canvasWidth / chartData.length) - bar.offset);
                xAxisWidth += (barWidth + bar.offset);

                return barWidth;
            })
            .attr('y', function(d) {
                return y(pointValue(d));
            })
            .attr('height', function(d) {
                return chartHeight - y(pointValue(d));
            })
            .attr('fill', function(d, i) {
                return colors[i % yLabels.length];
            })
            .on('mouseover', function(d) {
                // Hightlight
                d3.selectAll('.bar:not(.' + getCategoryClass(d) + ')')
                    .attr('opacity', 0.3);

                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9);
                tooltip.html(getTooltipHtml(d))
                    .style('left', (d3.event.pageX - tooltip.node().getBoundingClientRect().width) + 'px')
                    .style('top', (d3.event.pageY - tooltip.node().getBoundingClientRect().height) + 'px');
            })
            .on('mouseout', function() {
                // Remove highlight
                d3.selectAll('.bar')
                    .attr('opacity', 1);
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    function drawXAxis() {
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

        if (axis.xLabels) {    
            drawXAxisLabels();
        }
        
        if (axis.xTicks) {
            drawXAxisTicks();
        }
    }

    function drawXAxisLabels() {
        for (let i = 0; i < xLabels.length; ++i) {
            let label = 'x' + i;
            let className = 'text.' + label;
            let xAxis = xLabels[i];

            canvas.selectAll(className)
                .data(xAxis)
                .enter()
                .append('text')
                .attr('class', label)
                .attr('y', chartHeight + (xLabels.length - i) * xAxisLabels.horizontalGap)
                .attr('text-anchor', 'middle')
                .text(function(d) {
                    return d;
                })
                .attr('x', function(d, i) {
                    let container = d3.select('body').append('svg');
                    container.append('text').text(d).style('font-size', '12').style('font-family', 'Arial');
                    let size = container.node().getBBox();
                    container.remove();

                    return (i * xAxisWidth/xAxis.length) + ((xAxisWidth / xAxis.length)) / 2 + size.width / 8;
                })
                .style('font-size', '12')
                .style('font-family', 'Arial');
        }
    }

    function drawXAxisTicks() {
        let labelsReversed = xLabels;
        let xTickCoordinates = [];
        for (let i = 0; i < labelsReversed.length; ++i) {
            let xAxis = labelsReversed[i];
            
            for (let j = 1; j <= xAxis.length - 1; ++j) {
                let x1 = j * xAxisWidth / xAxis.length - bar.offset / 2 + bar.groupOffset / 2;
                let y1 = chartHeight;
                let x2 = j * xAxisWidth / xAxis.length - bar.offset / 2 + bar.groupOffset / 2;
                let y2 = chartHeight + (xLabels.length - i) * xAxisLabels.horizontalGap;
                // Prevent tick line overlap
                if (xTickCoordinates.includes(x1)) {
                    continue;
                }
                xTickCoordinates.push(x1);

                canvas.append('line')
                    .attr('x1', x1)
                    .attr('y1', y1)
                    .attr('x2', x2)
                    .attr('y2', y2)
                    .attr('class', xAxis[j])
                    .style('stroke-width', 1)
                    .style('stroke', '#000000');
            }    
        }
    }

    function drawYAxis() {
        let yAxis = d3.axisLeft().scale(y);

        if (!axis.yTicks) {
            yAxis.tickSize(0);
        }

        if (!axis.yLabels) {
            yAxis.tickFormat('');
        }

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
        let mappedData = data.map(point => pointValue(point));
        let maxPoint = _.max(mappedData, function(point) {
            return point;
        });

        return maxPoint;
    }

    function repeatArray(array, times) {
        return [].concat(...Array.from({ length: times }, () => array));
    }

    function cartesianProductOf(separator, ...arrays) {
        let product = _.reduce(arrays, function(a, b) {
            return _.flatten(_.map(a, function(x) {
                return _.map(b, function(y) {
                    return x.concat([y]);
                });
            }), true);
        }, [ [] ]);

        return product.map(p => p.join(separator));
    }

    function getUniqueXValues(data) {
        let unique = {};

        for (const group of pivot.columns) {
            unique[group] = _.unique(data, group).map(unique => unique[group]);
        }

        return unique;
    }

    function getUniqueXValuesSorted(data) {
        let unique = getUniqueXValues(data);

        for (let key in unique) {
            unique[key] = unique[key].sort();
        }

        return unique;
    }

    function getXAxisLabels(data) {
        let unique = getUniqueXValues(data);
        let xLabels = [];
        xLabels.push(unique[pivot.columns[0]]);
        for (let i = 1; i < pivot.columns.length - 1; ++i) {
            let group = pivot.columns[i];
            xLabels.push(repeatArray(unique[group], xLabels[i - 1].length));
        }
        xLabels.push(repeatArray(unique[pivot.columns[pivot.columns.length - 1]], data.length / unique[pivot.columns[pivot.columns.length - 1]].length / yLabels.length));

        return xLabels;
    }

    function getUniqueYValues(data) {
        let unique = {};

        for (const group of pivot.rows) {
            unique[group] = _.unique(data, group).map(unique => unique[group]);
        }

        return unique;
    }

    function getUniqueYValuesSorted(data) {
        let unique = getUniqueYValues(data);

        for (let key in unique) {
            unique[key] = unique[key].sort();
        }

        return unique;
    }

    function getYAxisLabels(data) {
        let unique = getUniqueYValues(data);
        let uniqueValues = Object.entries(unique).map(entry => entry[1]);

        return cartesianProductOf(' ', ...uniqueValues);
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

    function getCategoryClass(point) {
        let category = [];
        for (const row of pivot.rows) {
            category.push(point[row]);
        }

        return 'cls_' + category.join('_');
    }

    // #endregion 

    // #region Data Wrangling

    function indexData(data) {
        let indexed = [];

        for (let i = 0; i < data.length; ++i) {
            let original = data[i];
            let indexedPoint = {...original, key: getKey(original)};

            indexed.push(indexedPoint);
        }

        return indexed;
    }

    function getKey(point) {
        let keyArray = [];
        
        for (let columnKey of pivot.columns) {
            keyArray.push(point[columnKey]);
        }

        for (let rowKey of pivot.rows) {
            keyArray.push(point[rowKey]);
        }

        return keyArray.join('#');
    }

    function prepareData(indexedData) {
        let columnValues = _.values(getUniqueXValuesSorted(indexedData));
        let rowValues = _.values(getUniqueYValuesSorted(indexedData));

        let keys = cartesianProductOf('#', ...columnValues, ...rowValues);

        let objectProperties = pivot.columns.concat(pivot.rows);
        
        let result = [];
        for (const key of keys) {
            let original = _.find(indexedData, function(point) {
                return point.key === key;
            });

            let value = original ? pointValue(original) : 0;
            result.push(buildObject(objectProperties, key, value));
        }
        return result;
    }

    function buildObject(properties, key, value) {
        let point = {};
        let propertyValues = key.split('#');

        for (let i = 0; i < properties.length; ++i) {
            let property = properties[i];
            let propertyValue = propertyValues[i];

            point[property] = propertyValue;
        }
        point[pivot.value] = value;

        return point;
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

    chart.pivot = function(value) {
        if (!arguments.length) {
            return pivot;
        }
        pivot = value;
        return chart;
    };

    chart.colors = function(value) {
        if (!arguments.length) {
            return colors;
        }
        colors = value;
        return chart;
    };

    chart.axis = function(value) {
        if (!arguments.length) {
            return axis;
        }
        axis = value;
        return chart;
    };

    // #endregion

    return chart;
}

export {pivotBarChart as default};