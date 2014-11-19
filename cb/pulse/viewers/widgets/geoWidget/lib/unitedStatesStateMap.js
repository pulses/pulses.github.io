console.log('US STATE MAP LOADED')

var geoObject = (function() {
    var decimalFormat,
        m_width,
        w,
        h,
        projection,
        path,
        svg,
        states,
        circles;
//just do a transition, duration right before coloring in redraw
    var _this = {
        initGeo: function() {
            decimalFormat = d3.format(".2f");

            m_width = $("#mapVisual").width(),
                w = 600,
                h = 420;

            projection = d3.geo.azimuthal()
                .mode("equidistant")
                .origin([-98, 38])
                .scale(780)
                .translate([w/2.1, h/2]);

            path = d3.geo.path()
                .projection(projection);

            svg = d3.select("#mapVisual").insert("svg:svg", "h2")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + w + " " + h)
                .attr("width", m_width)
                .attr("height", m_width * h / w);
                //.attr("width", w)
                //.attr("height", h);

            states = svg.append("svg:g")
                .attr("id", "states");

            circles = svg.append("svg:g")
                .attr("id", "circles");

        },
        //redrawGeo: function(airports, data, collection) {
        redrawGeo: function(originaldata) {

            console.log(originaldata.x + '....US DATA BITCH, DATA DATA DATA BITCH')
            console.log(originaldata);
        d3.json("../../lib/us-states.json", function(collection) {

            console.log('GEO DATA')
                        var geoData = originaldata.value.value.PerCapitaTopGeos.geos;
                        //console.log(geoData)
                        //console.log('LOOKUP DATA')
                        var geoPolygonFile = collection.features; //.properties.name 
                        //console.log(geoPolygonFile[0].properties.name) //Alabama
                        
                        console.log("==sdadpoly-----");
                        console.log(geoPolygonFile);
                        
                        var originalStateDataLookup = {}
                        //originalStateDataLookup.name = 'dan'
                        for (var n in geoData) {
                            //console.log(geoData[n].name)
                            elemName = geoData[n].name
                            elemValue = geoData[n].now
                            elemDelta = geoData[n].perCapitaCount
                            //var result = $.grep(geoData, function(e){ return e.name == elemName; });
                            obj = _.find(geoPolygonFile, function(obj) { return obj.properties.name == elemName })
                            //console.log(obj)
                            //console.log(obj.id)
                            //console.log(elemName + ': ' + elemDelta + ', ID: ' + obj.id)
                            //console.log(obj.id + ': ' + elemValue)
                            //originalStateDataLookup[obj.id] = elemValue;
                            originalStateDataLookup[obj.id] = elemDelta;
                        }
                        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
                        console.log(originalStateDataLookup)
                        //need to remove DC because cant show it
                        //always will be #9 in data originalStateDataLookup
                        //may need to also remove Alaska and Hawaii as well
                        //originalStateDataLookup.splice(9,1)

                        var keysWithValues = _.keys(originalStateDataLookup)
                        console.log(keysWithValues)

                        allStates = _.range(1,52)
                        missingStates = []
//                        console.log(allStates);
                        /*
                        for (var val in allStates) {
                            console.log(allStates[val])
                            curVal = parseInt(allStates[val])//.toString()
                            if (_.has(keysWithValues, curVal)) {
                                console.log('has value')
                            } else {
                                missingStates.push(curVal)
                            }
                        }
                        console.log(missingStates)
                        */
                        
                        //$.inArray(value, array)
                        for (var val in allStates) {
                            curVal = allStates[val].toString()
                            //console.log(curVal)
                            if ($.inArray(curVal, keysWithValues) === -1) {
                                missingStates.push(curVal)
                            }
                        }
                        //console.log('heyaheyaheyah')
//                        console.log(curVal);
                        //console.log('XXXXXXXXX')
                        /*
                        var missingValuesObject = new Object();
                        //originalStateDataLookup.name = 'dan'
                        for (var mv in missingStates) {
                            var missingKey = parseInt(missingStates[mv])
                            console.log(missingKey)
                            missingValuesObject.missingKey=0;
                        }
                        console.log(missingValuesObject)
                        */
                        var arr2Obj = {};
                        for (var i=0; i<missingStates.length; i=i+1){
                            arr2Obj[missingStates[i]] = 0;
                        }
                        //console.log(arr2Obj)

                        _.extend(originalStateDataLookup, arr2Obj)
                        //console.log(originalStateDataLookup)

                        /*
                        person=new Object();
                        person.firstname="John";
                        person.lastname="Doe";
                        person.age=50;

                        var arr = [1,2,3,4,'some'], arr2Obj = {};
                        for (var i=0;i<arr.length;i=i+1){
                           arr2Obj[arr[i]] = i;
                        }
                        */
                        console.log("---extend here tyu===");
                        console.log(originalStateDataLookup);
                        var dataNoDC = _.omit(originalStateDataLookup, '9') //Washington DC
//                        console.log(dataNoDC);
                        var dataNoDCHawaii = _.omit(dataNoDC, '12') //Hawaii
                        var geoDataNoDCHawaiiAlaska = _.omit(dataNoDCHawaii, '2') //Alaska
                        //console.log(geoDataNoDCHawaiiAlaska)

                    //console.log('-x-x-x-ASDFDYFUT5YUTx-x-x-x-x')
                    //console.log(data)
                    var data = geoDataNoDCHawaiiAlaska;
                    console.log('-x-x-x-x-x-x-x-x-FINAL')
                    console.log(data)

            //********* find max value for scale
            var vals = [];
            for (x in data) {
                vals.push(data[x]);
            }
            console.log("----vals here======");
            console.log(vals)
            var maxVal = d3.max(vals, function(d) {return d})
            console.log('MAX VALUE OF MAP')
            console.log(maxVal)

            var increment = maxVal/8
            var ran = _.range(1,10)
            //var increment = maxVal/7
            //var ran = _.range(1,8)
            var scaleDomain = []
            for (i in ran) {
                var incrVal = i*increment
                //console.log(incrVal)
                scaleDomain.push(incrVal)
            }
            console.log('SCALE DOMAIN')
            console.log(scaleDomain)

            //scaleDomain = [];
            //scaleDomain = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];

            var firstElLegendScale = scaleDomain[0];
                // need to make global, because need to change in conditional
                // if don't change, the rectangles are all blue instead of gray
                var legendRangeColor; 
                if (isNaN(firstElLegendScale)) {
                    //console.log('Empty')
                    scaleDomain = [];
                    scaleDomain = [0,0,0,0,0,0,0,0,0];
                    legendRangeColor = ["rgb(128, 128, 128)", "rgb(128, 128, 128)", "rgb(128, 128, 128)", "rgb(128, 128, 128)", "rgb(128, 128, 128)", "rgb(128, 128, 128)", "rgb(128, 128, 128)", "rgb(128, 128, 128)", "rgb(128, 128, 128)"];
                } else {
                    legendRangeColor = ["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"];
                }

            var color = d3.scale.threshold()
                //.domain([0, 750, 1250, 2250, 2750, 5000, 15000, 30000, 70000])
                .domain(scaleDomain)
                //.range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"]);
                .range(legendRangeColor);

            //d3.csv("geo/airports.csv", function(airports) {
            //  d3.json("geo/CHstatedata116.json", function(data) {
            //      d3.json("geo/us-states.json", function(collection) {
                        
//               console.log("===afsana likh rahi hu======");
//               collection.features.forEach(function(t){
//                   console.log(t.id+" - " + t.properties.name );
//               });
                var statePaths = states.selectAll("path")
                            .data(collection.features)

                    statePaths
                        .enter().append("svg:path")
                            .attr("d", path)
                            //.style("fill", function(d) { return color(data[d.id]); })
                            //.style("fill", "red")
                            //.append("title")
                            //.text(function(d) { return d.properties.name + ": " + data[d.id] + " per 1MM posts"; });

                        //svg.selectAll("circle")
                  /*
                        circles.selectAll("circle")
                            .data(airports)
                            .enter()
                            .append("circle")
                            //.attr("cx", function(d,i) {return projection(d.longitude) })
                            .attr("cx", function(d,i) {
                                return projection([d.longitude, d.latitude])[0];
                            })
                            //.attr("cx", 300)
                            .attr("cy", function(d,i) {
                                //return projection(d.latitude) 
                                return projection([d.longitude, d.latitude])[1];
                            })
                            .attr("r", function(d) {return d.latitude})
                            .style("fill", "red")
                            .style("fill-opacity", 0.5);
                        */
            //      });
            //  });
            //});

            /*
            states.selectAll("path")
                .transition()
                .duration(2000)
                .style('fill', 'black')

            states.selectAll("path")
                .transition()
                .duration(4000)
                .style("fill", function(d) { return color(data[d.id]); })

            svg.on('click', function() {
                console.log('CLICK')
                states.selectAll("path")
                    .transition()
                    .duration(1000)
                    .style('fill', 'red')
            })
            */
             //states.selectAll("path")
                statePaths
                    .transition()
                    .duration(1000)
                    //.style("fill", function(d) { return color(data[d.id]); })
                    .style("fill", "black")

                    //console.log("----xsdafewfer---------");
                    //console.log(data);
            setTimeout(function(){
                //states.selectAll("path")
                statePaths
                    .transition()
                    .duration(3000)
                    .style("fill", function(d) { 
                            console.log(d);
//                        console.log(d.properties.name + " : " + d.id + " : color " + color(data[d.id]));
                        return color(data[d.id]); 
                    });

                //legendText.remove()
            },1000);
/*
             setTimeout(function(){
                    var legendText = legend.append("text")
                    .attr("x", 40)
                    .attr("y", function(d, i){ return h - (i*ls_h) - ls_h - 1;})
                    .text(function(d, i){ return legend_labels[i]; });
            },4000);
*/

            //legend
            //var ext_color_domain = [0, 1250, 2250, 2750, 5000, 10000, 15000, 30000, 70000]
            //var legend_labels = ["0+", "1250+", "2250+", "5000+", "10000+", "15000+", "30000+","70000+"]
            //console.log('+++++++++++++++++++++++')
            var legendFormat = d3.format(".1f");

            var legendLabels = [];
            var nwval;
            for (s in scaleDomain) {
                //console.log(scaleDomain[s])
                nwval = legendFormat(scaleDomain[s])
                legendLabels.push(nwval + '+')
            }
            //console.log(legendLabels)
            var legend_labels = legendLabels
            //var color_domain = [50, 150, 350, 750, 1500]

            var emma = scaleDomain;
            emma.shift();
            //console.log('EEEMMMMAMAA')
            //console.log(emma)

                //svg.selectAll("g.legend").selectAll("text").remove()
                //svg.selectAll('.legendtext').remove()
                //svg.selectAll("g.legend").remove()
                svg.selectAll(".legend").remove();

                var legend = svg.selectAll("g.legend")
                    .data(emma)

                legend
                    .enter().append("g")
                    .attr("class", "legend");

                    var ls_w = 15, ls_h = 15;

                legend.append("rect")
                    .attr("x", 20)
                    .attr("y", function(d, i){ return h - (i*ls_h) - 2*ls_h;})
                    .attr("width", ls_w)
                    .attr("height", ls_h)
                    .style("fill", function(d, i) { return color(d); })
                    //.style("fill", function(d) { return color(data[d.id]); })
                    //.style("opacity", 0.8);

                //remove text of legend
                //legend.selectAll("text").remove()

                var legendText = legend.append("text")
                //legend.append("text")
                    .attr("x", 40)
                    .attr("y", function(d, i){ return h - (i*ls_h) - ls_h - 1;})
                    .attr("class", "legendtext")
                    .text(function(d, i){ return legend_labels[i]; });

                //legend.exit()
                /*
                var labelText = d3.selectAll('g.legend')
                function redrawLabels() {
                    var items = labelText.selectAll('text').data(emma);
                    items.enter().append('text')
                }
                */
/*
                legend
                    .transition()
                    .duration(1000)
                    .text(function(d, i){ return legend_labels[i]; });

                legend
                    .exit()
                    .text(function(d, i){ return legend_labels[i]; })
                    .remove();
*/
/*
                setTimeout(function(){
                    legendText
                        //.text(function(d, i){ return legend_labels[i]; });
                        .text(function(d, i){ return 'hi' });
                }, 3000);
*/
/*
                setTimeout(function(){
                   
                    legend.append("text")
                        .attr("x", 40)
                        .attr("y", function(d, i){ return h - (i*ls_h) - ls_h - 1;})
                        .attr("class", "legendtext")
                        .text(function(d, i){ return legend_labels[i]; });
                }, 4000);
*/
            }); // end of d3.json

            $(window).resize(function() {
                var width = $("#mapVisual").width();
                svg.attr("width", width);
                svg.attr("height", width * h / w);
            });

        } //end of redraw geo
    } // end of _this
    return _this;
})(); // end of geoObject
/*
function geomap(airports, data, collection) {

} //wrapper function 
*/
