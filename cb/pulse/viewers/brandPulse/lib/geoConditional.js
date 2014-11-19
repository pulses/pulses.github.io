function getScript(filename) {
   //$.getScript( "script01.js" )
   $.getScript( filename )
        .done(function( script, textStatus ) {
            //console.log( script );
            console.log('worked')
            //console.log( textStatus );
            //callFunc();
            //scriptOne()
        })
        .fail(function( jqxhr, settings, exception ) {
            //$( "div#scriptOne" ).text( "Triggered ajaxError handler." );
            console.log('fail')
    }); 
}

if(_geo == 'usa') {
    //console.log('call script 01, usa')
    //getScript("../lib/datacall.js") 
    //getScript("./lib/main.js")
   // getScript("/cb/pulse/lib/d3/d3.geo.js")
    //getScript("./lib/unitedStatesStateMap.js")
    getScript("/cb/pulse/lib/d3/d3.geo.js")
    
/*
    getScript("/cb/pulse/lib/d3/d3.geo.js")
    getScript("/cb/pulse/lib/viewerSetup.js")
    getScript("../lib/differenceChart.js")
    getScript("../lib/areaLineBandedChart.js")
    getScript("../lib/blocksBar.js")
    getScript("../lib/brandPulseStreamOO.js")
    getScript("./lib/unitedStatesStateMap.js")
    getScript("./lib/horizontalBarChart.js")
    getScript("./lib/main.js")
    getScript("../lib/datacall.js") 
*/
    //renderGeoMap();
    //getScript("script01.js")
} else if (_geo == 'asia') {
    console.log('called asia script')
    getScript("../../lib/topojson.v1.min.js")
    //getScript("./lib/euroMap.js")
    // scriptTwo()
} else if (_geo == 'europe') {
    console.log('call script 02, europe')
    getScript("../../lib/topojson.v1.min.js")
    //getScript("./lib/euroMap.js")
    // scriptTwo()
} else {
    getScript("/cb/pulse/lib/d3/d3.geo.js")
    //getScript("./lib/unitedStatesStateMap.js")
    //renderGeoMap();
    //console.log('-')
/*
    getScript("./lib/main.js")
    getScript("/cb/pulse/lib/viewerSetup.js")
    getScript("../lib/differenceChart.js")
    getScript("../lib/areaLineBandedChart.js")
getScript("../lib/blocksBar.js")
getScript("../lib/brandPulseStreamOO.js")
getScript("./lib/horizontalBarChart.js")
getScript("../lib/datacall.js")
*/
}

/*
function getScript(filename, callFunc) {
   //$.getScript( "script01.js" )
   $.getScript( filename )
        .done(function( script, textStatus ) {
            //console.log( script );
            //console.log( textStatus );
            callFunc();
            //scriptOne()
        })
        .fail(function( jqxhr, settings, exception ) {
            $( "div#scriptOne" ).text( "Triggered ajaxError handler." );
    }); 
}

if(_geo == 'usa') {
    //console.log('call script 01, usa')
    getScript("./lib/unitedStatesStateMap.js", scriptOne)
    //getScript("script01.js")
} else if (_geo == 'asia') {
    console.log('call script 02, asia')
    getScript("script01.js", scriptTwo)
    // scriptTwo()
} else {
    console.log('none')
}
*/