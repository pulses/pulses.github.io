$(window).load(function() {
	geoObject.initGeo();
	viewerSetup();
	datacall();

	setInterval(function() {
		window.location = location.href;
        console.log('PAGE REFRESHED REFRESH REEEEEEEFR ^^^^^^^^^^')
	//}, 5000)
	}, 1800000)

    $(document).foundation();

    });

    // Check to see if second image tag exists
    $(document).ready(function() {
        if($("#themeLogo").attr('src') == "") {
            $( "#themeLogo").remove();
        }
    });

    var previousValueTime; //keep this just in limbo, need to assign old data to this at end of work, but maintain after ajax call
    var viewerConfig;

    var dataSpec = {
       data: []
    };

    // maybe this should go in window.load
    var viewerConfigFilesDataSpec = JSON.parse(_viewerConfig);
    if ("geoMapType" in viewerConfigFilesDataSpec) {
        console.log(viewerConfigFilesDataSpec.geoMapType)
        var geoDS = viewerConfigFilesDataSpec.geoMapType;
        if(geoDS == 'US'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", timeSpan: 36000000 })
        } else if (geoDS == 'ASIA'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"Asia", timeSpan: 3600000 })
        } else if (geoDS =='EUROPE'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"Europe", timeSpan: 3600000 })
        } else if (geoDS == 'SOUTHAMERICA'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"South America", timeSpan: 3600000 })
        } else if (geoDS == 'WORLD'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", timeSpan: 3600000 })
        } else if (geoDS == 'BRAZIL'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "STATE", geoRegions:"Brazil", timeSpan: 36000000 }) 
        } else {
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", timeSpan: 3600000 })
        }
    } else {
        dataSpec.data.push({ analysis: "PerCapitaTopGeos", timeSpan: 3600000 })
    }

    function handleUpdate(data) {

        console.log('initial data loaded')
        console.log(data)

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        // valueTime will be zero if no data comes back
        var valueTime = data.value.valueTime;
        console.log('----------------------- VALUE TIME')
        console.log(data.value.valueTime)
        if (valueTime == 0){
            console.log('DATA IS EMPTY *****************************')

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
            $( "#mainPulseContentDiv" ).empty();

            $('#ieModal').foundation('reveal', 'open');

        } else {
                console.log('not using Internet Explorer')
                $('#myModal').foundation('reveal', 'open');
        }  

        } else {
                console.log('----------------------- there is data')

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
                $( "#mainPulseContentDiv" ).empty();

                $('#ieModal').foundation('reveal', 'open');
        } else {
                console.log('not using Internet Explorer')
                $('#myModal').foundation('reveal', 'close');
        }
        }


        // $$$$$$$$$$$$ GEO $$$$$$$$$$$$

        geoObject.redrawGeo(data);

        var sorted = _(data.value.value.PerCapitaTopGeos.geos).sortBy("name");

        var keys = _.range(1, 9)

        var values = _.pluck(sorted, "delta")

        var newCHstatedata = _.object(keys, values)
        console.log('CH DATA')
        console.log(newCHstatedata)

        // geo map
        d3.csv("../../lib/airports.csv", function(airports) {
            d3.json("../../lib/us-states.json", function(collection) {

            })
        }) 
        // $$$$$$$$$$$$ END of GEO $$$$$$$$$$$$

}// end of handleUpdate(data) function

