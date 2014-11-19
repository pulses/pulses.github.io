
        console.log('world')



var geoObject = (function() {
    var m_width,
        width,
        height,
        projection,
        path,
        svg,
        countries;

    var _this = {
        initGeo: function() {
            
            m_width = $("#mapVisual").width(),
            width = 600,
            height = 420;

            projection = d3.geo.mercator()
                .scale((width + 1) / 2 / Math.PI)
                .translate([width / 2, height / 2 + 100])
                .precision(.1);

            path = d3.geo.path()
                .projection(projection);

            svg = d3.select("#mapVisual").insert("svg:svg", "h2")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + width + " " + height)
                .attr("width", m_width)
                .attr("height", m_width * height / width);

            countries = svg.append("svg:g")
                .attr("id", "countries");

        }, // end of initGeo
        redrawGeo: function(originaldata) {

            //console.log('XXXXXX VVVVVVVVVV XXXXXXX ++++++++++++++++')
            var geoData = originaldata.value.value.PerCapitaTopGeos.geos;
            console.log(geoData)    

            var data = {};

            geoData.forEach(function(d){
                data[d.name] = +d.count;
            })

            //console.log('name by count')
            //console.log(data)
            //var data = nameByCount;
   
            console.log('!!!!!!!!!! lookup World data')
            console.log(data)

            //d3.json("./lib/worldGeo.json", function(error, world) {
            d3.json("./lib/worldGeoLookup.json", function(error, world) {
                if (error) return console.error(error);

                //console.log(euro.features);
                //console.log(euro.objects);
                console.log('toposon data file bahlow')
        
                console.log(world);
                console.log(world.features);
                topojsonWorldData = world.features;
        
                // get european countries
                //var WorldCountries = _.pluck(topojsonWorldData, "id")
                //var WorldCountries = []
                var worldCountries = _.keys(data)
                console.log(worldCountries)

                for(var i=0; i<topojsonWorldData.length; i++){
                    //console.log(topojsonWorldData[i])
                    //console.log(topojsonWorldData[i].properties.name)
                    
                    countryName = topojsonWorldData[i].properties.name
                    //WorldCountries.push(countryName)
                    if(_.contains(worldCountries, countryName)==true){
                        topojsonWorldData[i].value = data[countryName]
                    } /*
                    else {
                        topojsonWorldData[i].value = 0
                    }
                    */
                }

                console.log('$$$$ daTA below $$$$')    
                console.log(topojsonWorldData)

                    //newObj = {}
                    //newObj['id'] = topojsonWorldData[i].id;
                    //newObj['name'] = countryName;
                    //newObj['value'] = annaK[countryName];
                    //countryByID.push(newObj)

                //}
                //console.log(WorldCountries)
                // return only object of European countries
                //var annaK = _.pick(data, ['Germany'])

                //var annaK = _.pick(data, WorldCountries)
                //console.log('object of euro countries and value')
                //console.log(annaK)
            /*
                var countryByID = []
            
                topojsonWorldData.forEach(function(d){
                    //countryByID[d.id] = d.country;
                    newObj = {}
                    newObj['id'] = d.id;
                    newObj['name'] = d.properties.name;
                    //newObj['value'] = annaK[d.country];
                    newObj['value'] = annaK[d.properties.name];
                    countryByID.push(newObj)
                })
            */

                var colorScale = d3.scale.linear()
                    //.domain([0, 40])
                    //.range(["#c6dbef", "#08306b"]);
                    .domain([0, d3.max(worldCountries, function(d) {return d.value}) ])
                    .range(["#e0f3db", "#0868ac"]);
        /*
                valueById = {}
                countryByID.forEach(function(d){
                    valueById[d.id] = d.value;
                })
                
                valueByIdTwo = {}
                countryByID.forEach(function(d){
                    var i = undefined;
                    //valueByIdTwo[d.id] = i || d.value;
                    valueByIdTwo[d.id] = i ? 0 : d.value;
                })
                

                console.log('value by ID, without function')
                console.log(valueById)
                console.log('value by ID, WITH ternary')
                console.log(valueByIdTwo)
        */

                /* 
                ------
                LEGEND COLOR WORK
                ------
                */

                
                var colorMax = d3.max(topojsonWorldData, function(d) {return d.value})
                console.log(colorMax)
                
                var increment = colorMax/8
                var ran = _.range(1,10)
                var scaleDomain = []
                for(var i in ran){
                    var incrVal=i*increment
                    scaleDomain.push(incrVal)
                }
                console.log('SCALE DOMAIN')
                console.log(scaleDomain)

                var firstElLegendScale = scaleDomain[0];
                // need to make global, because need to change in conditional
                // if don't change, the rectangles are all blue instead of gray
                var legendRangeColor; 
                if (isNaN(firstElLegendScale)) {
                    console.log('Empty')
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
                    //console.log(scaleDomain[s])
                    nwval = legendFormat(scaleDomain[s])
                    legendLabels.push(nwval + '+')
                }
                

                /* 
                ------
                END OF LEGEND WORK
                ------
                */

                // then want to do forEAch, create a key of id: value
                // then can use it to say id[value] or whatever

                //console.log(euro.features[0].geometry.coordinates[0]);

                var countryPaths = countries.selectAll(".subunit")
                    //.datum(topojson.feature(euro, euro.objects.subunits)) //geometries -> 5 countries
                    //.data(topojson.feature(euro, euro.objects.europe).features)
                    .data(world.features)
                
                countryPaths
                    .enter().append("path")
                    .attr("fill", "gray")
                    //.attr("d", d3.geo.path().projection(d3.geo.mercator()));
                    .attr("class", function(d,i) { return "subunit " + i; })
                    .attr("id", function(d,i) { return d.id; })
                    //.attr("fill", function(d) { return colorScale(d.id)})
                    //.attr("fill", function(d) { return colorScale(valueByIdTwo[d.id]) })
                    .attr("d", path);

                countryPaths
                    .transition()
                    .duration(1000)
                    .style("fill", "black")
                    //.style("fill", "steelblue")
                    //.attr("fill", function(d) { return colorScale(valueByIdTwo[d.id]) })
            
                setTimeout(function(){
                    countryPaths
                        .transition()
                        .duration(3000)
                        //.style("fill", "red")
                        //.style("fill", function(d) { return color(valueByIdTwo[d.id]) })
                        //.style("fill", function(d) { return colorScale(d.value) })
                        .style("fill", function(d) { return color(d.value) })
                },1000);
            
                /*
                svg.append("path")
                    .datum(topojson.mesh(euro, euro.objects.europe))
                    .attr("d", path)
                    .attr("class", "subunit-boundary IRL");
                */

                /*
                svg.selectAll(".subunit-label")
                    .data(topojson.feature(euro, euro.objects.europe).features)
                    .enter().append("text")
                    .attr("class", function(d) { return "subunit-label " + d.id; })
                    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    //.text(function(d) { return d.properties.name; });
                    //.text(function(d) { return d.id; });
                */

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
                

                /* 
                ------
                END OF LEGEND 
                ------
                */



            }); // end of d3.json

            $(window).resize(function() {
                var width = $("#mapVisual").width();
                svg.attr("width", width);
                svg.attr("height", width * height / width);
            });

        } // end of redrawGeo
    } // end of _this
    return _this;
})(); // end of geoObject