function pivotBarChart() {
    var width = 600,
        height = 800,
        margin = {top: 0, right: 0, bottom: 0, left: 0};

    function chart(selection) {
        selection.each(function(d, i) {
            // Fit the chart with margins
            var chartWidth = width - margin.left - margin.right;
            var chartHeight = height - margin.top - margin.bottom;

            var svg = d3.select(this)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            var chart = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // Dummy line to test module
            chart.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', chartWidth)
                .attr('y2', chartHeight)
                .style('stroke-width', 1)
                .style('stroke', 'black')
                .style('fill', 'none');
        });
    }

    chart.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    }

    chart.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    }

    chart.margin = function(value) {
        if (!arguments.length) {
            return margin;
        }
        margin = value;
        return chart;
    }

    return chart;
}

export {pivotBarChart as default};