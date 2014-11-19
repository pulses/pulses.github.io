//console.log('BRAZIL MAP LOADED')

function initGeoBrazil(dom_id) {   
        //console.log("--- Brazil map initialisation");
            var m_width = $("#"+dom_id).width(),
            width = 600,
            height = 420;

            var projection = d3.geo.mercator()
                //.center([0, 55.4])
                //.rotate([4.4, 0])
                .scale(520)
                .translate([width/2 + 475, height/2 - 135]);
                //.translate([0, height/2 - 135]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select("#"+dom_id).insert("svg:svg", "h2")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + width + " " + height)
                .attr("width", m_width)
                .attr("height", m_width * height / width);

            var countries = svg.append("svg:g")
                .attr("id", "countries");

        }
        
function redrawGeoBrazil(originaldata, dom_id) {
            //console.log("--- Brazil map redraw");
            
            var m_width = $("#"+dom_id).width(),
            width = 600,
            height = 420;

            var projection = d3.geo.mercator()
                //.center([0, 55.4])
                //.rotate([4.4, 0])
                .scale(520)
                .translate([width/2 + 475, height/2 - 135]);
                //.translate([0, height/2 - 135]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select("#"+dom_id+" svg");

            var countries = svg.append("svg:g")
                .attr("id", "countries");
        
            var geoData = originaldata.value.value.PerCapitaTopGeos.geos;

            var data = {};

            geoData.forEach(function(d,i){
                data[d.name] = +d.count;
            });

            d3.json("./lib/geo_hotspot/brazilNameTopo.json", function(error, soAmerica) {
                if (error) return console.error(error);
                var topojsonSAData = soAmerica.objects.brazilGeo.geometries;
                for(var i=0; i < topojsonSAData.length; i++){
                    topojsonSAData[i].id = i;
                }
                ////console.log('EUEeeeeeeKA again')

            
                var southAmericaCountries = _.pluck(topojsonSAData, "name") 
                var existingSACountries = _.pick(data, southAmericaCountries);            
                var countryByID = [];
            
                topojsonSAData.forEach(function(d,i){
                    //var i = undefined;
                    //countryByID[d.id] = d.country;
                    var newObj = {}
                    newObj['id'] = d.id;
                    newObj['name'] = d.name;
                    newObj['value'] = existingSACountries[d.name];
                    countryByID.push(newObj)
                });

                var colorScale = d3.scale.linear()
                    //.domain([0, 40])
                    //.range(["#c6dbef", "#08306b"]);
                    .domain([0, d3.max(countryByID, function(d) {return d.value}) ])
                    .range(["#e0f3db", "#0868ac"]);
            
            
                var valueByIdTwo = {}
                countryByID.forEach(function(d){
                    var i = undefined;
                    //valueByIdTwo[d.id] = i || d.value;
                    valueByIdTwo[d.id] = i ? 0 : d.value;
                })

                ////console.log('value by ID, WITH ternary')
                ////console.log(valueByIdTwo)

                /* 
                ------
                LEGEND COLOR WORK
                ------
                */

                var colorMax = d3.max(countryByID, function(d) {return d.value})
                ////console.log(colorMax)

                var increment = colorMax/8
                var ran = _.range(1,10)
                var scaleDomain = []
                for(var i in ran){
                    var incrVal=i*increment
                    scaleDomain.push(incrVal)
                }
                ////console.log('SCALE DOMAIN - brazil')
                ////console.log(scaleDomain)

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
                    .domain(scaleDomain)
                    //.range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"]);
                    .range(legendRangeColor);

                var legendFormat = d3.format(".1f");

                var legendLabels = [];
                var nwval;
                for (s in scaleDomain) {
                    ////console.log(scaleDomain[s])
                    nwval = legendFormat(scaleDomain[s])
                    legendLabels.push(nwval + '+')
                }
                
                /* 
                ------
                END OF LEGEND WORK
                ------
                */
                var countryPaths = svg.selectAll(".subunit")
                    //.datum(topojson.feature(euro, euro.objects.subunits)) //geometries -> 5 countries
                    .data(topojson.feature(soAmerica, soAmerica.objects.brazilGeo).features)
                
                countryPaths
                .enter().append("path")
                    .attr("fill", "gray")
                    //.attr("d", d3.geo.path().projection(d3.geo.mercator()));
                    .attr("class", function(d,i) { return "subunit " + i; })
                    .attr("id", function(d,i) { return d.id; })
                    //.attr("id", function(d,i) { return i; })
                    //.attr("fill", function(d) { return colorScale(d.id)})
                    .attr("d", path);

                countryPaths
                    .transition()
                    .duration(1000)
                    .style("fill", "black")
                    //.attr("fill", function(d) { return colorScale(valueByIdTwo[d.id]) })
                
                setTimeout(function(){
                    countryPaths
                        .transition()
                        .duration(3000)
                        //.style("fill", "red")
                        .style("fill", function(d) { return color(valueByIdTwo[d.id]) })
                },1000);

                svg.append("path")
                    .datum(topojson.mesh(soAmerica, soAmerica.objects.brazilGeo))
                    .attr("d", path)
                    .attr("class", "subunit-boundary IRL");

                /* 
                ------
                LEGEND 
                ------
                */
                var legend_labels = legendLabels

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