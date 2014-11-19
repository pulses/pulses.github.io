/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//console.log('US MAP LOADED')

function initGeoUS(dom_id) {   
        //console.log("--- US New map initialisation");
            var m_width = $("#"+dom_id).width(),
            width = 600,
            height = 420;


        var projection = d3.geo.albersUsa() 
          //.origin([-98, 38])
          .scale(780)
          .translate([width / 2.1, height / 2])
          .precision(.1);

        var path = d3.geo.path()  
          .projection(projection);  

            var svg = d3.select("#"+dom_id).insert("svg:svg", "h2")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + width + " " + height)
                .attr("width", m_width)
                .attr("height", m_width * height / width);

        var states = svg.append("svg:g")
             .attr("id", "states");

        var circles = svg.append("svg:g")
             .attr("id", "circles");

        }
        
function redrawGeoUS(originaldata, dom_id) {
            //console.log(originaldata.x + "--- New US map redraw");
            
            var m_width = $("#"+dom_id).width(),
            width = 600,
            height = 420;

            var projection = d3.geo.albersUsa() 
              //.origin([-98, 38])
              .scale(780)
              .translate([width / 2.1, height / 2])
              .precision(.1);

            var path = d3.geo.path()  
              .projection(projection);  

            var svg = d3.select("#"+dom_id+" svg");

           var states = svg.append("svg:g")
                .attr("id", "states");

           var circles = svg.append("svg:g")
                .attr("id", "circles");
        

            //console.log('US DATA BITCH, DATA DATA DATA BITCH')

        d3.json("./lib/geo_hotspot/us-state.json", function(collection) {

            //console.log('GEO DATA')
                       

                var topojsonSAData = collection.objects.usGeo.geometries;
                
                topojsonSAData = topojsonSAData.sort(function (a, b) {
                    return a.name.localeCompare( b.name );
                });
                
            var geoData = originaldata.value.value.PerCapitaTopGeos.geos;
            var data = {};

            geoData.forEach(function(d,i){
                data[d.name] = +d.count;
            });                

                for(var i=0; i < topojsonSAData.length; i++){
                    topojsonSAData[i].id = i+1;
                }
                ////console.log('EUEeeeeeeKA again')

                
                ////console.log("=====xxxc=======");
                ////console.log(topojsonSAData);
                var southAmericaCountries = _.pluck(topojsonSAData, "name") 
                var existingSACountries = _.pick(data, southAmericaCountries) 
                ////console.log('object of Brazil states and value')
                ////console.log(existingSACountries)
                var countryByID = []
                        //console.log("----topojson=====");
                        //console.log(topojsonSAData);
                        topojsonSAData.forEach(function(d,i){
                            //var i = undefined;
                            //countryByID[d.id] = d.country;
                            var newObj = {}
                            newObj['id'] = d.id;
                            //newObj['id'] = i;
                            //newObj['name'] = d.country;
                            //newObj['value'] = existingSACountries[d.country];
                            ////console.log(d.name +" : " + d.id);
                            newObj['name'] = d.name;
                            newObj['value'] = existingSACountries[d.name];
                            //newObj['value'] = existingSACountries[d.country];
                            //newObj['value'] = i ? 0 existingSACountries[d.name];
                            countryByID.push(newObj)
                        });
                       
                        var originalStateDataLookup = {}

                        for (var n in geoData) {
                            var elemName = geoData[n].name
                            var elemValue = geoData[n].now
                            var elemDelta = geoData[n].perCapitaCount
                            //var result = $.grep(geoData, function(e){ return e.name == elemName; });
                            //console.log("--x--=sad"+elemName);
                            var obj = _.find(topojsonSAData, function(ref) { 
//                                //console.log(ref);
                                return ref.name == elemName 
                            });

                            if(typeof obj !== 'undefined'){
                                originalStateDataLookup[obj.id] = elemDelta;
                            }                            
                        }
                        //console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
                        //console.log(originalStateDataLookup)

                        var keysWithValues = _.keys(originalStateDataLookup)
                        ////console.log(keysWithValues)

                        allStates = _.range(1,52)
                        var missingStates = []
                        
                        //$.inArray(value, array)
                        for (var val in allStates) {
                            curVal = allStates[val].toString()
                            ////console.log(curVal)
                            if ($.inArray(curVal, keysWithValues) === -1) {
                                missingStates.push(curVal)
                            }
                        }

                        var arr2Obj = {};
                        for (var i=0; i<missingStates.length; i=i+1){
                            arr2Obj[missingStates[i]] = 0;
                        }
                        ////console.log(arr2Obj)

                        _.extend(originalStateDataLookup, arr2Obj)
                        ////console.log(originalStateDataLookup)


                        var dataNoDC = _.omit(originalStateDataLookup, '48') //Washington DC
                        var dataNoDCHawaii = _.omit(originalStateDataLookup, '12') //Hawaii = 4
                        var geoDataNoDCHawaiiAlaska = _.omit(dataNoDCHawaii, '2') //Alaska
                        
                    var data = geoDataNoDCHawaiiAlaska;
                    ////console.log('-x-x-x-x-x-x-x-x----FINAL')
                    ////console.log(data)

            //********* find max value for scale
            var valueByIdTwo = {}
            countryByID.forEach(function(d){
                var i = undefined;
                //valueByIdTwo[d.id] = i || d.value;
                valueByIdTwo[d.id] = i ? 0 : d.value;
            });
           
            var vals = [];
            for (x in data) {
                vals.push(data[x]);
            }

            var maxVal = d3.max(vals, function(d) {return d})
            //console.log('MAX VALUE OF MAP')
            //console.log(maxVal)

            var increment = maxVal/8
            var ran = _.range(1,10)
            //var increment = maxVal/7
            //var ran = _.range(1,8)
            var scaleDomain = []
            for (i in ran) {
                var incrVal = i*increment
                ////console.log(incrVal)
                scaleDomain.push(incrVal)
            }
            //console.log('SCALE DOMAIN');
            //console.log(scaleDomain)

            //scaleDomain = [];
            //scaleDomain = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];

            var firstElLegendScale = scaleDomain[0];
                // need to make global, because need to change in conditional
                // if don't change, the rectangles are all blue instead of gray
                var legendRangeColor; 
                if (isNaN(firstElLegendScale)) {
                    ////console.log('Empty')
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

        var statePaths = states.selectAll("path")
                    .data(topojson.feature(collection, collection.objects.usGeo).features);

                    statePaths
                        .enter().append("svg:path")
                            .attr("d", path);
                            
                statePaths
                    .transition()
                    .duration(1000)
                    //.style("fill", function(d) { return color(data[d.id]); })
                    .style("fill", "black")

            setTimeout(function(){
                //states.selectAll("path")
                statePaths
                    .transition()
                    .duration(3000)
                    .style("fill", function(d) { 
//                            //console.log(d);
//                        //console.log(d.properties.name + " : " + d.id + " : color " + color(data[d.id]));
                        return color(data[d.id]); 
                    })

                //legendText.remove()
            },1000);

            var legendFormat = d3.format(".1f");

            var legendLabels = [];
            var nwval;
            for (s in scaleDomain) {
                ////console.log(scaleDomain[s])
                nwval = legendFormat(scaleDomain[s])
                legendLabels.push(nwval + '+')
            }
            ////console.log(legendLabels)
            var legend_labels = legendLabels
            //var color_domain = [50, 150, 350, 750, 1500]

            var emma = scaleDomain;
            emma.shift();

                svg.selectAll(".legend").remove();

                var legend = svg.selectAll("g.legend")
                    .data(emma)

                legend
                    .enter().append("g")
                    .attr("class", "legend");

                    var ls_w = 15, ls_h = 15;

                legend.append("rect")
                    .attr("x", 20)
                    .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
                    .attr("width", ls_w)
                    .attr("height", ls_h)
                    .style("fill", function(d, i) { return color(d); })

                var legendText = legend.append("text")
                //legend.append("text")
                    .attr("x", 40)
                    .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 1;})
                    .attr("class", "legendtext")
                    .text(function(d, i){ return legend_labels[i]; });

            }); // end of d3.json
            $(window).resize(function() {
                var width = $("#"+dom_id).width();
                svg.attr("width", width);
                svg.attr("height", width * height / width);
            });           
        } // end of redrawGeo   
        