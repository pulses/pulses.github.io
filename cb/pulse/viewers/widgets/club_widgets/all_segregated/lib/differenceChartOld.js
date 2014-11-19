function differenceChart() {
    var margin = {top: 3, right: 5, bottom: 3, left: 0},
        m_width = $("#sparklineThree").width(),
        width = 160,
        height = 40,
        xValue = function(d) { return d[0]; }, //these are being referenced actually in data = data.map
        //yValue = function(d) { return d[1]; },
        //yMinValue = function(d) { return d[2]; },
        //yLineValue = function(d) { return d[3]; },
        

        yLineValue = function(d) { return d[1]; },
        //yCircleValue = function(d) { return d[3]; },
        //diffValue = function(d) {return d.zdifference; },
        zeroValue = function(d) {return d.zero; },
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        //xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
        area = d3.svg.area().x(X).y1(Y).interpolate("cardinal"),
        line = d3.svg.line().x(X).y(Yline).interpolate("cardinal") 
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
            
            return [xValue.call(data, d, i), yLineValue.call(data, d, i), zeroValue.call(data, d, i)];
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
        
        var cloneData = data.slice(0);
        var flatData = [];

        for (var i=0;i<cloneData.length;i++){ 
            //console.log(cloneData[i]);
            var f = cloneData[i].slice(1,5);
            flatData.push(f)
        }

        //console.log('FLAT FLAT')
        //console.log(flatData)
        
        //console.log('DATA FROM JS FILE')
        //console.log(data)   

        var allValuesForMax = _.flatten(flatData);

        yScale
            //.domain([0, d3.max(data, function(d) { return d[1]; })])
            //.domain([0, d3.max(allValuesForMax, function(d) { return d; })])
            .domain([
                //d3.min(data, function(d) {return d[1]; }), 
                d3.min(data, function(d) { return Math.min(d[1], d[2]); }),
                //d3.max(data, function(d) { return d[1]; }) ])
                d3.max(data, function(d) { return Math.max(d[1], d[2]); })
                ])
            .range([height - margin.top - margin.bottom, 0]);

        // Select the svg element, if it exists.
        var svg = d3.select(this).selectAll("svg").data([data]);

        var maxValue = d3.max(data, function(d) { return d[1]});
        var minValue = d3.min(data, function(d) { return d[2]});

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
            

            gEnter.append("clipPath")
                .attr("id", "clip-below")
            .append("path")
                .attr("d", area.y0(height));

            gEnter.append("clipPath")
                .attr("id", "clip-above")
            .append("path")
                .attr("d", area.y0(0));

            gEnter.append("path")
                .attr("class", "area above")
                .attr("clip-path", "url(#clip-above)")
                .attr("d", area.y0(function(d) { return yScale(d[2]); }));

            gEnter.append("path")
                .attr("class", "area below")
                .attr("clip-path", "url(#clip-below)")
                .attr("d", area);


            //gEnter.append("path").attr("class", "area");
            gEnter.append("path").attr("class", "line");
            //gEnter.append("circle").attr("class", "dot");
            //gEnter.append("g").attr("class", "x axis");
            
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

        g.select("#clip-below")
            .transition().duration(1000)
            .attr("d", area.y0(height));

        g.select("#clip-above")
            .transition().duration(1000)
            .attr("d", area.y0(0));

        // Update the area path.
        g.select(".area.above")
            .transition().duration(1000)
            .attr("d", area.y0(function(d) { return yScale(d[2]); }));
            //.attr("d", area.y0(yScale.range()[0]));
            //.attr("d", area.y0(Ymin))

        g.select(".area.below")
            .transition().duration(1000)
            .attr("d", area);

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
        //g.select(".x.axis")
        //  .attr("transform", "translate(0," + yScale.range()[0] + ")")
          //.call(xAxis);

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

    chart.y = function(_) {
        if (!arguments.length) return yLineValue;
        yLineValue = _;
        return chart;
    };
/*
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
    chart.zeroValue = function(_) {
        if (!arguments.length) return zeroValue;
        zeroValue = _;
        return chart;
    }

    return chart;
}

// split charts
