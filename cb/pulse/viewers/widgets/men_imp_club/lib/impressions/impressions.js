//var impressionsWidget = (function() {    
//  var _this = {
//    showImpressions: function(client_id, dom_id) {
//      //this values should be change as per client Id change
//      _name = 'Netflix';
//      _viewerConfig = '{"topicLogo":"https://netbase-user-images.s3.amazonaws.com/images/12431/0b6866db-7bdc-461d-b748-257c9de2b087/netflix.png","themeLogo":"https://netbase-user-images.s3.amazonaws.com/images/27/8c5b73c6-d885-4429-a98e-ee6859de27cf/transparent.png","serviceLogo":"https://netbase-user-images.s3.amazonaws.com/images/12431/51a1f60d-a52e-49e5-ac2b-387d88f79149/NetBasePadding.png","geoMapType":"US"}';
//      $.getScript("./lib/impressions/datacall_impressions.js", function(){
//        impressions_datacall(clientid, dom_id);
//      });
//      $.getScript("./lib/impressions/areaLineBandedChart.js");
//      $.getScript("./lib/impressions/blocksBar.js");
//    }
//  }
//  return _this;
//})();
//$(window).load(function() {
//
//  // reload page to clean all if running for a certain time period
//  //setInterval("reload_page();", 1800000); // 30 min
//  // setInterval(function() {
//  //   window.location = location.href;
//  //       // console.log('PAGE REFRESHED REFRESH REEEEEEEFR ^^^^^^^^^^')
//  // }, 1800000)
//
//  $(document).foundation();
//  
//});
//
//// Check to see if second image tag exists
//$(document).ready(function() {
//  if($("#themeLogo").attr('src') == "") {
//    $( "#themeLogo").remove();
//  }
//})
//
//var previousValueTime; //keep this just in limbo, need to assign old data to this at end of work, but maintain after ajax call
//var viewerConfig;
//
//var impressions_dataSpec = {
//  data: [ { analysis: "MetricSeries", seriesName: "Impressions", resultTag: "MetricSeries_Impressions", timeSpan: 86400000 } ]
//};

function impressions_handleUpdate(data, dom_id) {

  // console.log('initial data loaded')
  // console.log(data)

  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  // valueTime will be zero if no data comes back
  var valueTime = data.value.valueTime;
  // console.log('----------------------- VALUE TIME')
  // console.log(data.value.valueTime)
  if (valueTime == 0){
    // console.log('DATA IS EMPTY *****************************')
    
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
      $( "#mainPulseContentDiv" ).empty();
      $('#ieModal').foundation('reveal', 'open');
    } else {
      // console.log('not using Internet Explorer')
      $('#myModal').foundation('reveal', 'open');
    }  

  }
  else {
    // console.log('----------------------- there is data')

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
      $( "#mainPulseContentDiv" ).empty();
      $('#ieModal').foundation('reveal', 'open');
    }
    else {
      // console.log('not using Internet Explorer')
      $('#myModal').foundation('reveal', 'close');
    }
  }

  // ++++++++++++ SPARKLINES ++++++++++++

  // NEW
  var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

  // impressions
  var impressionSparklineData = data.value.value.MetricSeries_Impressions.set;

  //impressions block visual
  var impressionBarChartData = data.value.value.MetricSeries_Impressions.set;
  // console.log('/////////////////////////////////')
  // console.log('Bar Chart Data')
  // console.log(impressionBarChartData)

  // console.log('array from _.pluck heya emma')
  var valBlocksArray = _.pluck(impressionBarChartData, 'value')
  // console.log(valBlocksArray)

  //now have data in an array, plug it into the chart
  //var data1 = [10, 20, 30, 40];
  var poneBars = imprBarChart()
    .height(100);

    // now call chart below
    d3.select("#sparklineTwo")
      .datum(valBlocksArray)
      .call(poneBars)

  // ++++++++++++ END of SPARKLINES ++++++++++++

  // %%%%%%%%%%%% TOTALS text %%%%%%%%%%%%
      
  //find averages
  var avgImpressions = d3.mean(impressionSparklineData, function(d) {
    return d.value;
  })

  // two time periods ago (AVG)
  var previousImprAverage = impressionSparklineData.slice(0,impressionSparklineData.length-1)
  var avgImprPrevious = d3.mean(previousImprAverage, function(d) {
    return d.value;
  })
      
  // SECOND to Last Elements
  // impressions
  var secondLastElementImpressions = impressionSparklineData[impressionSparklineData.length - 2];
  // console.log('^^^^^^^^^^^^^')
  // console.log(secondLastElementImpressions)

  // LAST Element
  // impressions
  var lastElementImpressions = impressionSparklineData[impressionSparklineData.length - 1];
  // console.log('^^^^^^^^^^^^^')
  // console.log(lastElementImpressions)
      
    
  var prefix_SecondLastImpr = d3.formatPrefix(secondLastElementImpressions.value);
  var prefixSymbol_SecondLastImpr = prefix_SecondLastImpr.symbol;
  var prefixScale_SecondLastImpr = prefix_SecondLastImpr.scale(secondLastElementImpressions.value);

  var prefix_LastImpr = d3.formatPrefix(lastElementImpressions.value)
  var prefixSymbol_LastImpr = prefix_LastImpr.symbol;
  var prefixScale_LastImpr = prefix_LastImpr.scale(lastElementImpressions.value)

  $('#'+dom_id+'_prefixImprSymbolSpan').html(prefixSymbol_LastImpr);


  function decimalPointHeader(data) {
      // console.log('ROUNDING numbas')
      // console.log(Math.round(data))
      // console.log(Math.round(data).toString().length)
    if (Math.round(data).toString().length < 4) { //then it's hundred or less, should have no decimal point
        //greeting = "Good day";
      return 0  
    } else {
        //greeting = "Good evening";
        return 1
    }
  } 
      
  var imprTicker = new countUp(dom_id+"_impressionsTotal", prefixScale_SecondLastImpr, prefixScale_LastImpr, 0, 15)//data.waitTime)//10);
  imprTicker.start();

  //AVERAGES

  //Impressions
  var avgprefix_lastImpr = d3.formatPrefix(avgImprPrevious);
  var avgprefixSymbol_lastImpr = avgprefix_lastImpr.symbol;
  var avgprefixScale_lastImpr = avgprefix_lastImpr.scale(avgImprPrevious);

  var avgprefix_Impr = d3.formatPrefix(avgImpressions);
  var avgprefixSymbol_Impr = avgprefix_Impr.symbol;
  var avgprefixScale_Impr = avgprefix_Impr.scale(avgImpressions);

  $('#'+dom_id+'_avgprefixImprSymbolSpan').html(avgprefixSymbol_Impr);

  var avgimprTicker = new countUp(dom_id+"_impressionsAvg", avgprefixScale_lastImpr, avgprefixScale_Impr, 0, 15)//10);
  avgimprTicker.start();

  // Differences
  // now, have countup transition to
  // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  var percentFormat = d3.format("%");
  
  var imprAvgDifferenceNow = d3.round(((lastElementImpressions.value-avgImpressions)/avgImpressions)*100)
  // console.log(imprAvgDifferenceNow)

  // before, what value is countup transitioning from
  //var buzzAvgDifferenceBefore = percentFormat((secondLastElementBuzz.value-avgBuzzPrevious)/avgBuzzPrevious)
  var imprAvgDifferenceBefore = d3.round(((secondLastElementImpressions.value-avgImprPrevious)/avgImprPrevious)*100)
  // console.log(imprAvgDifferenceBefore)

  var avgDiffImprTicker = new countUp(dom_id+"_avgDiffImpr", imprAvgDifferenceBefore, imprAvgDifferenceNow, 0, 15);
  avgDiffImprTicker.start();

  // manage colors of % differences, toggle between red and green
  $('#'+dom_id+'_avgDiffImpr').css('color', function(){
    if( imprAvgDifferenceNow > 0) {
      return "#2ECC40"
    } else if( imprAvgDifferenceNow < 0) {
      return "#FF4136"
    } else {
      return "#848484"
    }
  });
      
  // sync up color of percent signs
  $('#'+dom_id+'_avgDiffImprPercentSign').css('color', function(){
    if( imprAvgDifferenceNow > 0) {
      return "#2ECC40"
    } else if( imprAvgDifferenceNow < 0) {
      return "#FF4136"
    } else {
      return "#848484"
    }
  });
    
  // %%%%%%%%%%%% END of TOTALS text %%%%%%%%%%%%

}// end of handleUpdate(data) function

