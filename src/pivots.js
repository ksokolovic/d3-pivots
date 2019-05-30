function pivotBarChart() {
    var width,
        height;

    function chart(selection) {
        selection.each(function(d, i) {
            // Generate chart here, `d` is the data, `this` is the element
        });
        // Generate chart here, using `width` and `height`
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

    return chart;
}

export {pivotBarChart as default};