function differenceChart(selected_dom_id) {
    var margin = {top: 3, right: 5, bottom: 3, left: 0},
        m_width = $(selected_dom_id).width(),
        width = 160,
        height = 40,
        xValue = function(d) { return d[0]; }, //these are being referenced actually in I think main.js
        yValue = function(d) { return d[1]; },
        zeroValue = function(d) { return d.zero}
        //yLineValue = function(d) { return d[1]; },
        //yCircleValue = function(d) { return d[3]; },
        //diffValue = function(d) {return d.zdifference; },
        //zeroValue = function(d) {return d.zero; },
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        //xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
        //area = d3.svg.area().x(X).y1(Y).interpolate("cardinal"),
        //area = d3.svg.area().x(X).y1(Yzero).interpolate("cardinal"),
        //line = d3.svg.line().x(X).y(Y).interpolate("cardinal");
        area = d3.svg.area().x(X).y1(Yzero).interpolate("basis"),
        line = d3.svg.line().x(X).y(Y).interpolate("basis");
        //circle = d3.selectAll('circle')//.cx(X).cy(Ycircle);

  function chart(selection) {
        selection.each(function(data) {
        // Convert data to standard representation greedily;
        // this is needed for nondeterministic accessors.
        data = data.map(function(d, i) {
            //return [xValue.call(data, d, i), yValue.call(data, d, i), yMinValue.call(data, d, i), yLineValue.call(data, d, i), diffValue.call(data, d, i)];
            //return [xValue.call(data, d, i), yValue.call(data, d, i), yMinValue.call(data, d, i), yLineValue.call(data, d, i)];
            //return [xValue.call(data, d, i), yValue.call(data, d, i), yMinValue.call(data, d, i), yLineValue.call(data, d, i), zeroValue.call(data, d, i)];
            
            return [xValue.call(data, d, i), yValue.call(data, d, i), zeroValue.call(data, d, i)];
            //return [xValue.call(data, d, i), yValue.call(data, d, i), zeroValue.call(data, d, i)];
        });

        // Update the x-scale.
        xScale
            .domain(d3.extent(data, function(d) { return d[0]; }))
            .range([0, width - margin.left - margin.right]);

        // Update the y-scale.
        //var areaLineMax = yValue.concat(yLineValue)

        yScale
            //.domain([0, d3.max(data, function(d) { return d[1]; })])
            //.domain([0, d3.max(allValuesForMax, function(d) { return d; })])
            .domain([
                //d3.min(data, function(d) {return d[1]; }), 
                d3.min(data, function(d) { return Math.min(d[2], d[1]); }),
                //d3.max(data, function(d) { return d[1]; }) ])
                d3.max(data, function(d) { return Math.max(d[2], d[1]); })
                ])
            .range([height - margin.top - margin.bottom, 0]);

        // Select the svg element, if it exists.
        var svg = d3.select(this).selectAll("svg").data([data]);

        var randomNumberForAbovePath = Math.round(Math.random()*Math.random()*100*Math.random()*100*Math.random()*100*Math.random());
        //console.log('Random 1')
        //console.log(randomNumberForAbovePath)

        //console.log('Random 2')
        var randomNumberForBelowPath = Math.round(Math.random()*Math.random()*100*Math.random()*100*Math.random()*100*Math.random());
        //console.log(randomNumberForBelowPath)

        //console.log('------')
        //console.log(typeof randomNumberForAbovePath)
        var pppositive = randomNumberForAbovePath.toString()
        //console.log(typeof pppositive)
        var nnnegative = randomNumberForBelowPath.toString()
        //console.log(typeof nnnegative)

        // Otherwise, create the skeletal chart.
        var gEnter = svg.enter().append("svg").append("g");
            //gEnter.append("path").attr("class", "area");
            gEnter.append("path").attr("class", "line");
            //gEnter.append("circle").attr("class", "dot");
            //gEnter.append("g").attr("class", "x axis");

            gEnter.append("clipPath")
                .attr("id", "clip-below" + nnnegative)
            .append("path")
                .attr("id", "clipPathBelow" + nnnegative)
            //.attr("d", area.y0(height));

            gEnter.append("clipPath")
                .attr("id", "clip-above" + pppositive)
            .append("path")
                .attr("id", "clipPathAbove" + pppositive)
            //.attr("d", area.y0(0));

            gEnter.append("path")
                .attr("class", "area above" + pppositive)
                .attr("clip-path", "url(#clip-above" + pppositive + ")")
                //.attr("d", area.y0(function(d) { return yScale(d[1]); }));
                //.style("fill", "green");
                .style("fill", "#83c94c");

            gEnter.append("path")
                .attr("class", "area below" + nnnegative)
                .attr("clip-path", "url(#clip-below" + nnnegative + ")")
                //.style("fill", "red");
                .style("fill", "rgb(252,141,89)");
            
        // Update the outer dimensions.
        svg 
            .attr("preserveAspectRatio", "xMidYMid")
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("width", m_width)
            .attr("height", m_width * (height) / width);

        // Update the inner dimensions.
        var g = svg.select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        g.select("#clipPathBelow" + nnnegative)
          .attr("d", area.y0(height));

        g.select("#clipPathAbove" + pppositive)
          .attr("d", area.y0(0));

        g.select(".area.above" + pppositive)
            .attr("d", area.y0(function(d) { return yScale(d[1]); }));

        g.select(".area.below" + nnnegative)
            .attr("d", area);

        // Update the line path.
        g.select(".line")
            .transition().duration(1000)
            .attr("d", line);

            $(window).resize(function() {
                var w = $(selected_dom_id).width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            });

        });

        // enter css here ??
        //document.getElementById(".area").style.fill = "blue";
    }

    // The x-accessor for the path generator; xScale âˆ˜ xValue.
    function X(d) {
        return xScale(d[0]);
    }

    // The x-accessor for the path generator; yScale âˆ˜ yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    function Yzero(d) {
    return yScale(d[2]);
  }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

     chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };
    return chart;
}