function pivotBarChart() {
    let width = 600,
        height = 800,
        margin = {top: 0, right: 0, bottom: 0, left: 0};

    let data = null;

    console.log(repeatArray([1, 2, 3], 3));

    function chart(selection) {
        selection.each(function(d, i) {
            console.log(d + i);
            console.log(_.unique([1, 2, 1, 1, 3]));
            // Fit the chart with margins
            let chartWidth = width - margin.left - margin.right;
            let chartHeight = height - margin.top - margin.bottom;

            let svg = d3.select(this)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            let chart = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // Dummy line to test module
            drawXAxis();
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

    // #region Chart drawing

    function drawXAxis() {

    }

    // #endregion

    // #region Helper functions

    function repeatArray(array, times) {
        return [].concat(...Array.from({ length: times }, () => array));
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

    // #endregion

    return chart;
}

export {pivotBarChart as default};