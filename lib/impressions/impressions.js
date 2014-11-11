function append_impressions_html_to_dom(dom_id){
  var impressions_html = '<div class="total-main-number-container">' +
        '<span id="'+ dom_id +'_impressionsTotal" class="total-main-number">' +
           '<!-- impressions data inserted here -->' +
        '</span>' +
        '<span id="'+ dom_id +'_prefixImprSymbolSpan" class="total-main-number"></span>' +
      '</div>' +
      '<div class="row">' +
        '<div class="small-4 medium-4 large-4 columns">' +
          '<div class="average-container">' +
            '<span id="'+ dom_id +'_impressionsAvg" class="avg-header"></span>' +
            '<span id="'+ dom_id +'_avgprefixImprSymbolSpan" class="avg-header"></span>' +
            '<span id="'+ dom_id +'_avgDiffImpr"></span>' +
            '<span id="'+ dom_id +'_avgDiffImprPercentSign">%</span>' +
          '</div>' +
          '<div class="average-label-container">' +
            '<span class="average-label">' +
              'avg ' +
            '</span>' +
          '</div>' +
        '</div>' +
        '<div class="small-8 medium-8 large-8 columns">' +
            '<div id="'+ dom_id +'_sparklineTwo"></div>' +
            '<span class="sparklineTimeLabel">' +
              'last 24 hours' +
            '</span>' +
        '</div>' +
      '</div>';

  $('#'+dom_id).html(impressions_html);
}

function handleUpdateImpressions(data, dom_id) {
  append_impressions_html_to_dom(dom_id);
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

  // impressions
  var impressionSparklineData = data.value.value.MetricSeries_Impressions.set;

  //impressions block visual
  var impressionBarChartData = data.value.value.MetricSeries_Impressions.set;

  var valBlocksArray = _.pluck(impressionBarChartData, 'value')

  //now have data in an array, plug it into the chart
  //var data1 = [10, 20, 30, 40];
  var poneBars = imprBarChart(dom_id)
    .height(100);

    // now call chart below
    d3.select("#"+dom_id+"_sparklineTwo")
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
  var lastElementImpressions = impressionSparklineData[impressionSparklineData.length - 1];

  var prefix_SecondLastImpr = d3.formatPrefix(secondLastElementImpressions.value);
  var prefixSymbol_SecondLastImpr = prefix_SecondLastImpr.symbol;
  var prefixScale_SecondLastImpr = prefix_SecondLastImpr.scale(secondLastElementImpressions.value);

  var prefix_LastImpr = d3.formatPrefix(lastElementImpressions.value)
  var prefixSymbol_LastImpr = prefix_LastImpr.symbol;
  var prefixScale_LastImpr = prefix_LastImpr.scale(lastElementImpressions.value)

  $('#'+dom_id+'_prefixImprSymbolSpan').html(prefixSymbol_LastImpr);


  function decimalPointHeader(data) {
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

