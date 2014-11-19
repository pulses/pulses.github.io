$(window).load(function() {
  viewerSetup();
  datacall(clientid, "widget1");
  datacall(clientid1, "widget2");

  // reload page to clean all if running for a certain time period
  //setInterval("reload_page();", 1800000); // 30 min
  setInterval(function() {
    window.location = location.href;
        console.log('PAGE REFRESHED REFRESH REEEEEEEFR ^^^^^^^^^^')
  }, 1800000)

  $(document).foundation();
  
});

// Check to see if second image tag exists
$(document).ready(function() {
  if($("#themeLogo").attr('src') == "") {
    $( "#themeLogo").remove();
  }
})

var previousValueTime; //keep this just in limbo, need to assign old data to this at end of work, but maintain after ajax call
var viewerConfig;

var dataSpec = {
  data: [ { analysis: "BandedMetricSeries", bucketTimeSpanMins:60 } ]
};

function handleUpdate(data, dom_id) {

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

  }
  else {
    console.log('----------------------- there is data')

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
      $( "#mainPulseContentDiv" ).empty();
      $('#ieModal').foundation('reveal', 'open');
    }
    else {
      console.log('not using Internet Explorer')
      $('#myModal').foundation('reveal', 'close');
    }
  }

  // ++++++++++++ SPARKLINES ++++++++++++

  // NEW
  var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

  // mentions
  var mentionsSparklineData = data.value.value.BandedMetricSeries.set;
  for (var i=0; i < data.length; i++) {
    data[i].difference = data[i].high - data[i].low
  }
  console.log(data)

  function differenceInBand() { 
    if (data.value.value.BandedMetricSeries.set[i].value > data.value.value.BandedMetricSeries.set[i].high) {
      return data.value.value.BandedMetricSeries.set[i].value - data.value.value.BandedMetricSeries.set[i].high 
    } 
    else if (data.value.value.BandedMetricSeries.set[i].value < data.value.value.BandedMetricSeries.set[i].low) {
      return data.value.value.BandedMetricSeries.set[i].low - data.value.value.BandedMetricSeries.set[i].value
    }
    else {
      return 0
    }
  } //end of differenceInBand functio3n

  function averageInBand() { 
    return (data.value.value.BandedMetricSeries.set[i].high + data.value.value.BandedMetricSeries.set[i].low) / 2;
  } //end of averageInBand function

  var bandedData = data.value.value.BandedMetricSeries.set;
  for (var i=0; i<bandedData.length; i++){
    bandedData[i].zdifference = differenceInBand()
    bandedData[i].average = averageInBand()
  }

  var chart = timeSeriesBandedChart()
    .x(function(d) {return parseDate(moment(d.date).format("DD-MMM-YY HH:mm:ss")) })
    .y1(function(d) { return +d.high; })
    .y0(function(d) {return +d.low; })
    .y(function(d) {return +d.value; })
    .cx(function(d) {return parseDate(moment(+d.date).format("DD-MMM-YY HH:mm:ss")) })
    .cy(function(d) {return +d.value; });

  function callMentionsBandedLine(target_div) {
    d3.select("#sparklineOne")//+target_div)
      .datum(mentionsSparklineData)
      .call(chart);
  }
  callMentionsBandedLine(dom_id+"sparklineOne");
  // callMentionsBandedLine(dom_id+"_sparklineOne_2");

  // ++++++++++++ END of SPARKLINES ++++++++++++

  // %%%%%%%%%%%% TOTALS text %%%%%%%%%%%%
      
  //find averages
  var lastBandedDataPoint = bandedData[bandedData.length - 1]
  var avgBuzz = lastBandedDataPoint.average;
   

  // two time periods ago (AVG)
  var secondLastBandedDataPoint = bandedData[bandedData.length - 2]
  var avgBuzzPrevious = secondLastBandedDataPoint.average;
      

  // SECOND to Last Elements
  // mentions
  var secondLastElementBuzz = mentionsSparklineData[mentionsSparklineData.length - 2];
  console.log('^^^^^^^^^^^^^')
  console.log(secondLastElementBuzz)

  // LAST Element
  // mentions
  var lastElementBuzz = mentionsSparklineData[mentionsSparklineData.length - 1];
  console.log('^^^^^^^^^^^^^')
  console.log(lastElementBuzz)
      
    
  var prefix_SecondLastMentions = d3.formatPrefix(secondLastElementBuzz.value);
  var prefixSymbol_SecondLastMentions = prefix_SecondLastMentions.symbol;
  var prefixScale_SecondLastMentions = prefix_SecondLastMentions.scale(secondLastElementBuzz.value);

  var prefix_LastMentions = d3.formatPrefix(lastElementBuzz.value)
  var prefixSymbol_LastMentions = prefix_LastMentions.symbol;
  var prefixScale_LastMentions = prefix_LastMentions.scale(lastElementBuzz.value)

  $('#'+dom_id+'_prefixMentionsSymbolSpan').html(prefixSymbol_LastMentions);

      
  function decimalPointHeader(data) {
      console.log('ROUNDING numbas')
      console.log(Math.round(data))
      console.log(Math.round(data).toString().length)
    if (Math.round(data).toString().length < 4) { //then it's hundred or less, should have no decimal point
        //greeting = "Good day";
      return 0  
    } else {
        //greeting = "Good evening";
        return 1
    }
  } 
      
  function mentions_total(target_div){
    console.log("i'me here ");
    console.log([target_div, prefixScale_SecondLastMentions, prefixScale_LastMentions, decimalPointHeader(lastElementBuzz.value)])
    var mentionTicker = new countUp(target_div, prefixScale_SecondLastMentions, prefixScale_LastMentions, decimalPointHeader(lastElementBuzz.value), 15)//data.waitTime)//10)//data.waitTime);
    mentionTicker.start();
  }
  mentions_total(dom_id+"_mentionsTotal");
  // mentions_total(dom_id+"_mentionsTotal_2");

  //AVERAGES

  //Mentions

    var avgprefix_lastMentions = d3.formatPrefix(avgBuzzPrevious);
    var avgprefixSymbol_lastMentions = avgprefix_lastMentions.symbol;
    var avgprefixScale_lastMentions = avgprefix_lastMentions.scale(avgBuzzPrevious);

    var avgprefix_Mentions = d3.formatPrefix(avgBuzz);
    var avgprefixSymbol_Mentions = avgprefix_Mentions.symbol;
    var avgprefixScale_Mentions = avgprefix_Mentions.scale(avgBuzz);

  function prefix_symbol(target_div){
    $('#'+target_div).html(avgprefixSymbol_Mentions);
  }

  // prefix_symbol(dom_id+"_prefixMentionsSymbolSpan");
  prefix_symbol(dom_id+"_prefixMentionsSymbolSpan");

  function mentions_avg(target_div){
    var avgmentionTicker = new countUp(target_div, avgprefixScale_lastMentions, avgprefixScale_Mentions, decimalPointHeader(avgBuzz), 15)//10);
    avgmentionTicker.start();
  }
  mentions_avg(dom_id+"_mentionsAvg");
  // mentions_avg(dom_id+"_mentionsAvg_2");

  // Differences
  // now, have countup transition to
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  var percentFormat = d3.format("%");
  
  var buzzAvgDifferenceNow = d3.round(((lastElementBuzz.value-avgBuzz)/avgBuzz)*100)
  console.log(buzzAvgDifferenceNow)

  // before, what value is countup transitioning from
  //var buzzAvgDifferenceBefore = percentFormat((secondLastElementBuzz.value-avgBuzzPrevious)/avgBuzzPrevious)
  var buzzAvgDifferenceBefore = d3.round(((secondLastElementBuzz.value-avgBuzzPrevious)/avgBuzzPrevious)*100)
  console.log(buzzAvgDifferenceBefore)

  function avgDiffMentions(target_div){
    var avgDiffMentionTicker = new countUp(target_div, buzzAvgDifferenceBefore, buzzAvgDifferenceNow, 0, 15);
    avgDiffMentionTicker.start();
  }

  avgDiffMentions(dom_id+"_avgDiffMentions");
  // avgDiffMentions(dom_id+"_avgDiffMentions2");

  // manage colors of % differences, toggle between red and green
  $('#'+dom_id+'_avgDiffMentions').css('color', function(){
      //if( $( "#avgDiffMentions" ).html() > 0) {
    if( buzzAvgDifferenceNow > 0) {
        return "#2ECC40"
    } else if( buzzAvgDifferenceNow < 0) {
        return "#FF4136"
    } else {
      return "#848484"
    }
  });

      
  // sync up color of percent signs
  $('#'+dom_id+'_avgDiffMentionPercentSign').css('color', function(){
    if( buzzAvgDifferenceNow > 0) {
        return "#2ECC40"
    } else if( buzzAvgDifferenceNow < 0) {
        return "#FF4136"
    } else {
      return "#848484"
    }
  });


  // %%%%%%%%%%%% END of TOTALS text %%%%%%%%%%%%

}// end of handleUpdate(data) function

