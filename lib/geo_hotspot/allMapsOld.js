if ("geoMapType" in viewerConfigFiles) { 
    //console.log(geo)
    if (geo == 'US'){

        console.log('united states')

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

            //console.log('US DATA BITCH, DATA DATA DATA BITCH')

        d3.json("../lib/us-states.json", function(collection) {

            console.log('GEO DATA')
                        var geoData = originaldata.value.value.PerCapitaTopGeos.geos;
                        console.log(geoData)
                        //console.log('LOOKUP DATA')
                        var geoPolygonFile = collection.features; //.properties.name 
                        //console.log(geoPolygonFile[0].properties.name) //Alabama

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
                            //console.log(elemName + ': ' + elemValue + ', ID: ' + obj.id)
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
                        console.log('heyaheyaheyah')
                        console.log(missingStates);
                        console.log('XXXXXXXXX')
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
                        console.log(arr2Obj)

                        _.extend(originalStateDataLookup, arr2Obj)
                        console.log(originalStateDataLookup)

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

                        var dataNoDC = _.omit(originalStateDataLookup, '9') //Washington DC
                        var dataNoDCHawaii = _.omit(dataNoDC, '12') //Hawaii
                        var geoDataNoDCHawaiiAlaska = _.omit(dataNoDCHawaii, '2') //Alaska
                        console.log(geoDataNoDCHawaiiAlaska)

                    console.log('-x-x-x-x-x-x-x-x')
                    console.log(data)
                    var data = geoDataNoDCHawaiiAlaska;
                    console.log('-x-x-x-x-x-x-x-x')
                    console.log(data)

            //********* find max value for scale
            var vals = [];
            for (x in data) {
                vals.push(data[x]);
            }
            //console.log(vals)
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
            var color = d3.scale.threshold()
                //.domain([0, 750, 1250, 2250, 2750, 5000, 15000, 30000, 70000])
                .domain(scaleDomain)
                .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"]);
                //.range(['#FFEDA0','#FED976','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026'])

            //d3.csv("geo/airports.csv", function(airports) {
            //  d3.json("geo/CHstatedata116.json", function(data) {
            //      d3.json("geo/us-states.json", function(collection) {
                        
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

            setTimeout(function(){
                //states.selectAll("path")
                statePaths
                    .transition()
                    .duration(3000)
                    .style("fill", function(d) { return color(data[d.id]); })

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

    } else if (geo == 'ASIA'){

        console.log('asia')


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
        /*
            projection = d3.geo.mercator()
                .scale((width + 1) / 2 / Math.PI)
                .translate([width / 2, height / 2 + 100])
                .precision(.1);
        */
            
            var projection = d3.geo.mercator()
                //.scale(200)
                //.translate([-20, height / 2])
                //.scale(150)
                //.translate([15, 400])
                .scale(170)
                .translate([5, 440])
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

            //console.log('!!!!!!!!!! lookup Asia data')
            //console.log(data)

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
            console.log('!!!!!!!!!! lookup asia data')
            console.log(data)

            //d3.json("./lib/worldGeo.json", function(error, world) {
            d3.json("./lib/asiaGeo.json", function(error, world) {
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
                var color = d3.scale.threshold()
                    .domain(scaleDomain)
                    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"]);

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


    } else if (geo =='EUROPE'){

        console.log('europe')



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

            projection = d3.geo.azimuthalEqualArea()
                //.center([0, 55.4])
                //.rotate([4.4, 0])
                .scale(550)
                //.scale(450)
                //.scale(780)
                //.translate([width/2 - 100, height/2 + 350]);
                .translate([width/2 - 105, height/2 + 460]);
                //.translate([width/2, height/2]);

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

            console.log('XXXXXX VVVVVVVVVV XXXXXXX ++++++++++++++++')
            var geoData = originaldata.value.value.PerCapitaTopGeos.geos;
            console.log(geoData)    

            var data = {};

            geoData.forEach(function(d){
                data[d.name] = +d.count;
            })

            //console.log('name by count')
            //console.log(data)
            //var data = nameByCount;
            console.log('!!!!!!!!!! lookup Europe data')
            console.log(data)

            d3.json("./lib/euroTopo.json", function(error, euro) {
                if (error) return console.error(error);
                console.log(euro);
                //console.log(euro.features);
                //console.log(euro.objects);
                console.log('toposon data file bahlow')
                console.log(euro.objects.europe);
                console.log(euro.objects.europe.geometries);
                var topojsonEuroData = euro.objects.europe.geometries;
            /*
                function emmaWatson(){
                    if(data[d.country]){
                        return data[d.country]
                    } else {
                        return 'na'
                    };
                }
            */
                // get european countries
                var EuroCountries = _.pluck(topojsonEuroData, "country")
                // return only object of European countries
                //var annaK = _.pick(data, ['Germany'])
                var annaK = _.pick(data, EuroCountries)
                console.log('object of euro countries and value')
                console.log(annaK)

                var countryByID = []

                topojsonEuroData.forEach(function(d){
                    //countryByID[d.id] = d.country;
                    newObj = {}
                    newObj['id'] = d.id;
                    newObj['name'] = d.country;
                    newObj['value'] = annaK[d.country];
                                        /*    //function(){
                                                if(EuroCountries[d.country] == undefined){
                                                    return 0
                                                } else {
                                                    return EuroCountries[d.country]
                                                }
                                            //} */
                    //'placeholder'//if(EuroCountries[d.country]){ return 'yay'};
                    countryByID.push(newObj)
                })
                console.log('COME ON')
                console.log(countryByID)

                var colorScale = d3.scale.linear()
                    //.domain([0, 40])
                    //.range(["#c6dbef", "#08306b"]);
                    .domain([0, d3.max(countryByID, function(d) {return d.value}) ])
                    .range(["#e0f3db", "#0868ac"]);

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

                /* 
                ------
                LEGEND COLOR WORK
                ------
                */

                var colorMax = d3.max(countryByID, function(d) {return d.value})
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
                var color = d3.scale.threshold()
                    .domain(scaleDomain)
                    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"]);

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
                console.log('--------*******^^^^^%%%%%%%%%%%%--')
                console.log(euro.objects.europe)

                var countryPaths = countries.selectAll(".subunit")
                    //.datum(topojson.feature(euro, euro.objects.subunits)) //geometries -> 5 countries
                    .data(topojson.feature(euro, euro.objects.europe).features)
                
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
                    //.attr("fill", function(d) { return colorScale(valueByIdTwo[d.id]) })
            
                setTimeout(function(){
                    countryPaths
                        .transition()
                        .duration(3000)
                        //.style("fill", "red")
                        .style("fill", function(d) { return color(valueByIdTwo[d.id]) })
                },1000);
            

                svg.append("path")
                    .datum(topojson.mesh(euro, euro.objects.europe))
                    .attr("d", path)
                    .attr("class", "subunit-boundary IRL");

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


    } else if (geo == 'SOUTHAMERICA'){

        console.log('south america')

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
                //.center([0, 55.4])
                //.rotate([4.4, 0])
                .scale(250)
                .translate([width/2 + 250, height/2 - 120]);

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
            console.log('!!!!!!!!!! lookup asia data')
            console.log(data)

            d3.json("./lib/southAmericaTopo.json", function(error, soAmerica) {
                if (error) return console.error(error);
                console.log(soAmerica);
                //console.log(euro.features);
                console.log(soAmerica.objects);
                console.log(soAmerica.objects.southAmerica);
                //console.log(euro.features[0].geometry.coordinates[0]);
                topojsonSAData = soAmerica.objects.southAmerica.geometries;
                console.log('EUEeeeeeeKA')
                console.log(topojsonSAData)
                console.log(data)

            
                var southAmericaCountries = _.pluck(topojsonSAData, "name") 
                console.log('south america countries')
                console.log(southAmericaCountries)
                console.log('data')
                console.log(data)
                var existingSACountries = _.pick(data, southAmericaCountries) 
                console.log('object of SA countries and value')
                console.log(existingSACountries)
            
                var countryByID = []
            
                topojsonSAData.forEach(function(d){
                    var i = undefined;
                    //countryByID[d.id] = d.country;
                    newObj = {}
                    newObj['id'] = d.id;
                    //newObj['name'] = d.country;
                    //newObj['value'] = existingSACountries[d.country];
                    newObj['name'] = d.name;
                    newObj['value'] = existingSACountries[d.name];
                    //newObj['value'] = i ? 0 existingSACountries[d.name];
                    countryByID.push(newObj)
                })
                console.log('COME ON')
                console.log(countryByID)

                var colorScale = d3.scale.linear()
                    //.domain([0, 40])
                    //.range(["#c6dbef", "#08306b"]);
                    .domain([0, d3.max(countryByID, function(d) {return d.value}) ])
                    .range(["#e0f3db", "#0868ac"]);
            
            
                valueByIdTwo = {}
                countryByID.forEach(function(d){
                    var i = undefined;
                    //valueByIdTwo[d.id] = i || d.value;
                    valueByIdTwo[d.id] = i ? 0 : d.value;
                })

                console.log('value by ID, WITH ternary')
                console.log(valueByIdTwo)

                /* 
                ------
                LEGEND COLOR WORK
                ------
                */

                var colorMax = d3.max(countryByID, function(d) {return d.value})
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
                var color = d3.scale.threshold()
                    .domain(scaleDomain)
                    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"]);

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


                var countryPaths = svg.selectAll(".subunit")
                    //.datum(topojson.feature(euro, euro.objects.subunits)) //geometries -> 5 countries
                    .data(topojson.feature(soAmerica, soAmerica.objects.southAmerica).features)
                
                countryPaths
                .enter().append("path")
                    .attr("fill", "gray")
                    //.attr("d", d3.geo.path().projection(d3.geo.mercator()));
                    .attr("class", function(d,i) { return "subunit " + i; })
                    .attr("id", function(d,i) { return d.id; })
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
                    .datum(topojson.mesh(soAmerica, soAmerica.objects.southAmerica))
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
                /* 
                ------
                END OF LEGEND 
                ------
                */


                /*
                svg.selectAll(".subunit-label")
                    .data(topojson.feature(soAmerica, soAmerica.objects.southAmerica).features)
                    .enter().append("text")
                    .attr("class", function(d) { return "subunit-label " + d.id; })
                    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    //.text(function(d) { return d.properties.name; });
                    .text(function(d) { return d.id; });
                */

            }); // end of d3.json

        } // end of redrawGeo
    } // end of _this
    return _this;
})(); // end of geoObject


    } else if (geo == 'WORLD'){

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
                var color = d3.scale.threshold()
                    .domain(scaleDomain)
                    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"]);

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


    } else {
        // default to US
        console.log('NONE, so U.S. is called')


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

            console.log('US DATA BITCH, DATA DATA DATA BITCH')

        d3.json("../lib/us-states.json", function(collection) {

            console.log('GEO DATA')
                        var geoData = originaldata.value.value.PerCapitaTopGeos.geos;
                        console.log(geoData)
                        //console.log('LOOKUP DATA')
                        var geoPolygonFile = collection.features; //.properties.name 
                        //console.log(geoPolygonFile[0].properties.name) //Alabama

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
                            //console.log(elemName + ': ' + elemValue + ', ID: ' + obj.id)
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
                        console.log('heyaheyaheyah')
                        console.log(missingStates);
                        console.log('XXXXXXXXX')
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
                        console.log(arr2Obj)

                        _.extend(originalStateDataLookup, arr2Obj)
                        console.log(originalStateDataLookup)

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

                        var dataNoDC = _.omit(originalStateDataLookup, '9') //Washington DC
                        var dataNoDCHawaii = _.omit(dataNoDC, '12') //Hawaii
                        var geoDataNoDCHawaiiAlaska = _.omit(dataNoDCHawaii, '2') //Alaska
                        console.log(geoDataNoDCHawaiiAlaska)

                    console.log('-x-x-x-x-x-x-x-x')
                    console.log(data)
                    var data = geoDataNoDCHawaiiAlaska;
                    console.log('-x-x-x-x-x-x-x-x')
                    console.log(data)

            //********* find max value for scale
            var vals = [];
            for (x in data) {
                vals.push(data[x]);
            }
            //console.log(vals)
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
            var color = d3.scale.threshold()
                //.domain([0, 750, 1250, 2250, 2750, 5000, 15000, 30000, 70000])
                .domain(scaleDomain)
                .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"]);
                //.range(['#FFEDA0','#FED976','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026'])

            //d3.csv("geo/airports.csv", function(airports) {
            //  d3.json("geo/CHstatedata116.json", function(data) {
            //      d3.json("geo/us-states.json", function(collection) {
                        
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

            setTimeout(function(){
                //states.selectAll("path")
                statePaths
                    .transition()
                    .duration(3000)
                    .style("fill", function(d) { return color(data[d.id]); })

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
    
    }

} else {

    console.log('NONE, so U.S. is called')


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

            console.log('US DATA BITCH, DATA DATA DATA BITCH')

        d3.json("../lib/us-states.json", function(collection) {

            console.log('GEO DATA')
                        var geoData = originaldata.value.value.PerCapitaTopGeos.geos;
                        console.log(geoData)
                        //console.log('LOOKUP DATA')
                        var geoPolygonFile = collection.features; //.properties.name 
                        //console.log(geoPolygonFile[0].properties.name) //Alabama

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
                            //console.log(elemName + ': ' + elemValue + ', ID: ' + obj.id)
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
                        console.log('heyaheyaheyah')
                        console.log(missingStates);
                        console.log('XXXXXXXXX')
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
                        console.log(arr2Obj)

                        _.extend(originalStateDataLookup, arr2Obj)
                        console.log(originalStateDataLookup)

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

                        var dataNoDC = _.omit(originalStateDataLookup, '9') //Washington DC
                        var dataNoDCHawaii = _.omit(dataNoDC, '12') //Hawaii
                        var geoDataNoDCHawaiiAlaska = _.omit(dataNoDCHawaii, '2') //Alaska
                        console.log(geoDataNoDCHawaiiAlaska)

                    console.log('-x-x-x-x-x-x-x-x')
                    console.log(data)
                    var data = geoDataNoDCHawaiiAlaska;
                    console.log('-x-x-x-x-x-x-x-x')
                    console.log(data)

            //********* find max value for scale
            var vals = [];
            for (x in data) {
                vals.push(data[x]);
            }
            //console.log(vals)
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
            var color = d3.scale.threshold()
                //.domain([0, 750, 1250, 2250, 2750, 5000, 15000, 30000, 70000])
                .domain(scaleDomain)
                .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(8,48,107)"]);
                //.range(['#FFEDA0','#FED976','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026'])

            //d3.csv("geo/airports.csv", function(airports) {
            //  d3.json("geo/CHstatedata116.json", function(data) {
            //      d3.json("geo/us-states.json", function(collection) {
                        
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

            setTimeout(function(){
                //states.selectAll("path")
                statePaths
                    .transition()
                    .duration(3000)
                    .style("fill", function(d) { return color(data[d.id]); })

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

} //end of else function