function differenceChart() {
    var margin = {top: 3, right: 5, bottom: 10, left: 0},
        m_width = $("#sparklineThree").width(),
        width = 160,
        height = 55,
        xValue = function(d) { return d[0]; }, //these are being referenced actually in I think main.js
        yValue = function(d) { return d[1]; },
        zeroValue = function(d) { return d.zero}
        //yLineValue = function(d) { return d[1]; },
        //yCircleValue = function(d) { return d[3]; },
        //diffValue = function(d) {return d.zdifference; },
        //zeroValue = function(d) {return d.zero; },
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(3, 0),
        //area = d3.svg.area().x(X).y1(Yzero).interpolate("cardinal"),
        //line = d3.svg.line().x(X).y(Y).interpolate("cardinal");
        area = d3.svg.area().x(X).y1(Yzero).interpolate("basis"),
        line = d3.svg.line().x(X).y(Y).interpolate("basis");
        //circle = d3.selectAll('circle')//.cx(X).cy(Ycircle);

  function chart(selection) {
        selection.each(function(data) {
            console.log(data)
        // Convert data to standard representation greedily;
        // this is needed for nondeterministic accessors.
        data = data.map(function(d, i) {
            //return [xValue.call(data, d, i), yValue.call(data, d, i), yMinValue.call(data, d, i), yLineValue.call(data, d, i), diffValue.call(data, d, i)];
            //return [xValue.call(data, d, i), yValue.call(data, d, i), yMinValue.call(data, d, i), yLineValue.call(data, d, i)];
            //return [xValue.call(data, d, i), yValue.call(data, d, i), yMinValue.call(data, d, i), yLineValue.call(data, d, i), zeroValue.call(data, d, i)];
            
            return [xValue.call(data, d, i), yValue.call(data, d, i), zeroValue.call(data, d, i)];
            //return [xValue.call(data, d, i), yValue.call(data, d, i), zeroValue.call(data, d, i)];
        });
        console.log(' ---------- DATA FROM DIFFERENCE CHART JS FILE -----------')
        console.log(data)   

        // Update the x-scale.
        xScale
            .domain(d3.extent(data, function(d) { return d[0]; }))
            .range([0, width - margin.left - margin.right]);

        // Update the y-scale.
        //var areaLineMax = yValue.concat(yLineValue)
        console.log('cloooooooooooooning data')

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

        //var diffScale = d3.scale.linear()
        //    .domain([0, d3.max(data, function(d) { return d[4]}) ])
            //.range([2, 10]);
        //    .range([.3,2])

        //console.log('Max value: ')
        //console.log(maxValue)
        //console.log('Min value: ')
        //console.log(minValue)

        // Otherwise, create the skeletal chart.
        var gEnter = svg.enter().append("svg").append("g");
            //gEnter.append("path").attr("class", "area");
            gEnter.append("path").attr("class", "line");
            //gEnter.append("circle").attr("class", "dot");
            gEnter.append("g").attr("class", "x axis");

            gEnter.append("clipPath")
                .attr("id", "clip-below")
            .append("path")
                .attr("id", "clipPathBelow")
            //.attr("d", area.y0(height));

            gEnter.append("clipPath")
                .attr("id", "clip-above")
            .append("path")
                .attr("id", "clipPathAbove")
            //.attr("d", area.y0(0));

            gEnter.append("path")
                .attr("class", "area above")
                .attr("clip-path", "url(#clip-above)")
                //.attr("d", area.y0(function(d) { return yScale(d[1]); }));

            gEnter.append("path")
                .attr("class", "area below")
                .attr("clip-path", "url(#clip-below)")
            
        // Update the outer dimensions.
        svg 
            .attr("preserveAspectRatio", "xMidYMid")
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("width", m_width)
            .attr("height", m_width * (height) / width);

        // Update the inner dimensions.
        var g = svg.select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    /*
        var circles = g.selectAll('.dots')
            .data(data, function(d) {return d[0]})
        circles.enter()
            .append('circle').attr('class', 'dots')
        circles.transition().duration(1000)
            //.attr("r", 6)
            .attr("r", function(d) {return diffScale(d[4]); })
            //.attr("cx", function(d) { return x(d.date); })
            //.attr("cy", function(d) { return y(d.line); });
            .attr("cx", function(d) { return xScale(d[0]); })
            .attr("cy", function(d) { return yScale(d[3]); })
            .style("opacity", .9)
            .style('fill', 'transparent') */
            /*
            .style('fill', function(d) {
                if (d[3] >= d[1]) {
                    return "#2ECC40"
                }
                else if (d[3] <= d[2]) {
                    return "#FF4136"
                }
                else {
                    return "transparent"
                }
            });
            */
    /*    circles
            .exit()
            .remove();*/

        g.select("#clipPathBelow")
          .attr("d", area.y0(height));

        g.select("#clipPathAbove")
          .attr("d", area.y0(0));

        g.select(".area.above")
            .attr("d", area.y0(function(d) { return yScale(d[1]); }));

        g.select(".area.below")
            .attr("d", area)

        // Update the line path.
        g.select(".line")
            .transition().duration(1000)
            .attr("d", line);

/*
        g.select(".dot")
            //.attr("cx", function(d) {return xScale(X)})
            //.attr("cy", function(d) { return yScale(Yline); })
            //.attr("cx", circle.cx(X))
            //.attr("cy", 10)
            .attr("cx", function(d) {return xScale(X)})
            .attr("cy", function(d) { return yScale(Yline); })
            .attr("r", 7)
            .style('fill', 'red');
*/

        // Update the x-axis.
        g.select(".x.axis")
            .attr("transform", "translate(0," + yScale.range()[0] + ")")
            .call(xAxis);

            $(window).resize(function() {
                var w = $("#sparklineOne").width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            });

        });
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
/*
    function Ymin(d) {
        return yScale(d[2]);
    }

    function Yline(d) {
        //return yScale(d[3]);
        return yScale(d[1]);
    }

    function Ycircle(d) {
        return yScale(d[3]);
    }
*/
    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };
/*
     chart.diffValue = function(_) {
        if (!arguments.length) return diffValue;
        diffValue = _;
        return chart;
    };
*/
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
    /*
    chart.y1 = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    chart.y0 = function(_) {
        if (!arguments.length) return yMinValue;
        yMinValue = _;
        return chart;
    };
    */
     chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };
/*
    chart.y = function(_) {
        if (!arguments.length) return yLineValue;
        yLineValue = _;
        return chart;
    };

    chart.cx = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.cy = function(_) {
        if (!arguments.length) return yLineValue;
        yLineValue = _;
        return chart;
    };
*/
/*
    chart.diffValue = function(_) {
        if (!arguments.length) return diffValue;
        diffValue = _;
        return chart;
    }
*/
/*
    chart.zeroValue = function(_) {
        if (!arguments.length) return zeroValue;
        zeroValue = _;
        return chart;
    }
*/

    return chart;
}

// split charts
