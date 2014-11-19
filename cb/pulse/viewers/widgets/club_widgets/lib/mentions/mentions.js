function append_mentions_html_to_dom(dom_id){
  var mentions_html = '<div class="total-main-number-container">' +
          '<span id="'+ dom_id +'_mentionsTotal" class="total-main-number">' +
             '<!-- mentions data inserted here -->' +
          '</span>' +
          '<span id="'+ dom_id +'_prefixMentionsSymbolSpan" class="total-main-number"></span>' +
        '</div>' +
        '<div class="row">' +
          '<div class="small-4 medium-4 large-4 columns">' +
            '<div class="average-container">' +
              '<span id="'+ dom_id +'_mentionsAvg" class="avg-header"></span>' +
              '<span id="'+ dom_id +'_avgprefixMentionsSymbolSpan" class="avg-header"></span>' +
              '<span id="'+ dom_id +'_avgDiffMentions"></span>' +
              '<span id="'+ dom_id +'_avgDiffMentionPercentSign">%</span>' +
            '</div>' +
            '<div class="average-label-container">' +
              '<span class="average-label">' +
                 'avg ' +
              '</span>' +
            '</div>' +
          '</div>' +
          '<div class="small-8 medium-8 large-8 columns">' +
            '<div id="'+ dom_id +'_sparklineOne"></div>' +
            '<span class="sparklineTimeLabel">' +
                'last 24 hours' +
            '</span>' +
          '</div>' +
        '</div>';

    $('#'+dom_id).html(mentions_html);
}

function handleUpdateMentions(data, dom_id) {
  append_mentions_html_to_dom(dom_id);
  // valueTime will be zero if no data comes back
  var valueTime = data.value.valueTime;
  if(valueTime === 0){
    $('#myModal').foundation('reveal', 'open');
  }
  else {
    $('#myModal').foundation('reveal', 'close');
  }

  // ++++++++++++ SPARKLINES ++++++++++++

  // NEW
  var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

  // mentions
  var mentionsSparklineData = data.value.value.BandedMetricSeries.set;
  for (var i=0; i < data.length; i++) {
    data[i].difference = data[i].high - data[i].low
  }

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

  var chart = mentions_timeSeriesBandedChart(dom_id)
    .x(function(d) {return parseDate(moment(d.date).format("DD-MMM-YY HH:mm:ss")) })
    .y1(function(d) { return +d.high; })
    .y0(function(d) {return +d.low; })
    .y(function(d) {return +d.value; })
    .cx(function(d) {return parseDate(moment(+d.date).format("DD-MMM-YY HH:mm:ss")) })
    .cy(function(d) {return +d.value; });

  function callMentionsBandedLine(target_div) {
    d3.select(target_div)
      .datum(mentionsSparklineData)
      .call(chart);
  }
  callMentionsBandedLine("#"+dom_id+"_sparklineOne");

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

  // LAST Element
  // mentions
  var lastElementBuzz = mentionsSparklineData[mentionsSparklineData.length - 1];
 
  var prefix_SecondLastMentions = d3.formatPrefix(secondLastElementBuzz.value);
  var prefixSymbol_SecondLastMentions = prefix_SecondLastMentions.symbol;
  var prefixScale_SecondLastMentions = prefix_SecondLastMentions.scale(secondLastElementBuzz.value);

  var prefix_LastMentions = d3.formatPrefix(lastElementBuzz.value)
  var prefixSymbol_LastMentions = prefix_LastMentions.symbol;
  var prefixScale_LastMentions = prefix_LastMentions.scale(lastElementBuzz.value)

  $('#'+dom_id+'_prefixMentionsSymbolSpan').html(prefixSymbol_LastMentions);

      
  function decimalPointHeader(data) {
    if (Math.round(data).toString().length < 4) { //then it's hundred or less, should have no decimal point
        //greeting = "Good day";
      return 0  
    } else {
        //greeting = "Good evening";
        return 1
    }
  } 
      
  function mentions_total(target_div){
   var mentionTicker = new countUp(target_div, prefixScale_SecondLastMentions, prefixScale_LastMentions, decimalPointHeader(lastElementBuzz.value), 15)//data.waitTime)//10)//data.waitTime);
    mentionTicker.start();
  }
  mentions_total(dom_id+"_mentionsTotal");

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

  prefix_symbol(dom_id+"_prefixMentionsSymbolSpan");

  function mentions_avg(target_div){
    var avgmentionTicker = new countUp(target_div, avgprefixScale_lastMentions, avgprefixScale_Mentions, decimalPointHeader(avgBuzz), 15)//10);
    avgmentionTicker.start();
  }
  mentions_avg(dom_id+"_mentionsAvg");

  // Differences
  // now, have countup transition to
  //var percentFormat = d3.format("%");
  
  var buzzAvgDifferenceNow = d3.round(((lastElementBuzz.value-avgBuzz)/avgBuzz)*100)

  // before, what value is countup transitioning from
  //var buzzAvgDifferenceBefore = percentFormat((secondLastElementBuzz.value-avgBuzzPrevious)/avgBuzzPrevious)
  var buzzAvgDifferenceBefore = d3.round(((secondLastElementBuzz.value-avgBuzzPrevious)/avgBuzzPrevious)*100)

  function avgDiffMentions(target_div){
    var avgDiffMentionTicker = new countUp(target_div, buzzAvgDifferenceBefore, buzzAvgDifferenceNow, 0, 15);
    avgDiffMentionTicker.start();
  }

  avgDiffMentions(dom_id+"_avgDiffMentions");

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

