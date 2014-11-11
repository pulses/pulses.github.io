function imprBarChart(dom_id){
    //var margin = {top: 10, right: 5, bottom: 5, left: 5},
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        m_width = $("#"+dom_id+"_sparklineTwo").width(),
        width = 400,
        height,
        y = d3.scale.linear(),
        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(6, 0);

    //function chart(){
    function chart(selection){ //i think selection is like g in Ians example
        selection.each(function(data){

            var average = function(a) {
                var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
                for(var m, s = 0, l = t; l--; s += a[l]);
                for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
                return r.deviation = Math.sqrt(r.variance = s / t), r;
                ////console.log(r.deviation)
            }

            var x = average(data);
            //console.log('average:')
            //console.log(x.mean)
            //console.log('std dev:')
            //console.log(x.deviation)


            // generate chart here
            var barW = width / data.length,
            //var barW = width / data.length-2,
                scaling = height / d3.max(data);

            // Update the y-scale.
            y
                .domain([0, d3.max(data, function(d) { return d; })])
                .range([height, 0]);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            // just append the svg once
            var svg = d3.select(this)
                .selectAll("svg")
                .data([data])

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g")

            gEnter.append("path").attr("class", "line");
            gEnter.append("g").attr("class", "y axis");

            /*
            svg.enter().append("svg")
                .classed("chart", true);
            */

            // Update the outer dimensions.
            svg
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + width + " " + height)
                .attr("width", m_width)
                .attr("height", m_width * height / width);
        /*
            svg.transition().duration(1000)
                .attr({
                    width: width,
                    height: height
                })
        */

            var g = svg.select("g")
                //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        /*
            g.select('.y.axis')
                .transition()
                .duration(1000)
                .ease('linear')
                .call(yAxis);
        */

            // enter, update, exit on bars
            var bars = g.selectAll(".bar")
                .data(function(d,i){ return d; });

            bars.enter().append("rect")
                .classed("bar", true)
                //.style("fill", "steelblue")
                .style("fill", "#1f1f1f")
                .attr({
                    x: width,
                    width: barW,
                    y: function(d,i){ return height - d*scaling },
                    height: function(d,i){ return d*scaling }
                })

            bars.transition().duration(1000)
                //.style("fill", "red")
                .style("fill", function(d){
                    //var x = average(d);
                    ////console.log('--------')
                    ////console.log(x.mean + x.deviation)
                    //if (d < x.mean + x.deviation) {return "#DDDDDD"}
                    //if (d < x.mean + x.deviation) {return "#AAAAAA"}
                    if (d < x.mean + x.deviation) {return "#848484"}
                        //else {return "#2ECC40"}
                        //else {return "#83c94c"}
                        else {return "white"}
                })
                .attr({
                    x: function(d,i){ return i * barW }, 
                    width: barW-1,
                    y: function(d,i){ return height - d*scaling },
                    height: function(d,i){ return d*scaling }
                })

            bars.exit().transition().duration(1000)
                .style("fill", "purple")
                .style({
                    opacity: 0
                })
                .remove();

            var gridlines = svg.selectAll("line.horizontalGrid").data(y.ticks(8))
            //console.log(" '''''''''' 8 ticks ")

            gridlines.enter().append("line")
                .attr(
                    {
                        "class":"horizontalGrid",
                        //"id":"gridlineID_" + i,
                        "id": function(d,i) {return 'gridlineID_' + i},
                        //"x1":1,
                        "x1" : width,
                        "x2" : width,
                        "y1" : function(d){ return y(d);},
                        "y2" : function(d){ return y(d);},
                        //"y1" : function(d){ return y(d) - 5;},
                        //"y2" : function(d){ return y(d) - 5;},
                        "fill" : "none",
                        "shape-rendering" : "crispEdges"
                    });

            gridlines.transition().duration(1000)
                .attr(
                    {
                        "x1":1,
                        //"x1":width,
                        "x2" : width,
                        "y1" : function(d){ return y(d);},
                        "y2" : function(d){ return y(d);}
                        //"y1" : function(d){ return y(d) - 5;},
                        //"y2" : function(d){ return y(d) - 5;},
                    });

            gridlines.exit().transition().duration(1000)
                .style({
                    opacity: 0
                })
                .remove();

            $(window).resize(function() {
                var w = $("#"+dom_id+"_sparklineTwo").width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            })

        }) // end of selection.each(function(data))
    } // end of chart(selection)

    // UPDATES HAPPEN BELOW

    /*
    chart.width = function(_){
        if (!arguments.length) return width;
        width = _;
        return chart;
    }
    */

    chart.height = function(_){
        if (!arguments.length) return height;
        height = _;
        return chart;
    }

    return chart;
}