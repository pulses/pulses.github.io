function append_retweets_html_to_dom(dom_id){
  var retweets_html = '<div class="total-main-number-container">' +
        '<span id="'+ dom_id +'_uniqueAuthorsTotal" class="total-main-number">' +
           '<!-- impressions data inserted here -->' +
        '</span>' +
        '<span id="'+ dom_id +'_prefixAuthorsSymbolSpan" class="total-main-number"></span>' +
      '</div>' +
      '<div class="row">' +
        '<div class="small-4 medium-4 large-4 columns">' +
          '<div class="average-container">' +
            '<span id="'+ dom_id +'_impressionsAvg" class="avg-header">&nbsp;</span>' +
            '<span id="'+ dom_id +'_avgprefixImprSymbolSpan" class="avg-header"></span>' +
            '<span id="'+ dom_id +'_avgDiffImpr"></span>' +
            '<span id="'+ dom_id +'_avgDiffImprPercentSign">%</span>' +
          '</div>' +
          '<div class="average-label-container">' +
            '<span class="average-label">' +
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
          
//  var retweets_html = '<div class="row">'+
//        '<div class="small-4 medium-4 large-4 columns">'+
//          '<div class="total-main-number-container">'+
//            '<span id="'+ dom_id +'_uniqueAuthorsTotal" class="total-main-number">'+
//            '</span>'+
//            '<span id="'+ dom_id +'_prefixAuthorsSymbolSpan" class="total-main-number"></span>'+
//          '</div>'+
//        '</div>'+
//          '<div class="small-8 medium-8 large-8 columns">'+
//            '<div id="'+ dom_id +'_sparklineTwo"></div>'+
//            '<span class="sparklineTimeLabel">'+
//              'last 2 hours'+
//            '</span>'+
//          '</div>'+
//      '</div>';

  $('#'+dom_id).html(retweets_html);
}

function handleUpdateRetweets(data, dom_id) {
  append_retweets_html_to_dom(dom_id);
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

  //unique authors or net sentiment
  var sentimentSparklineData = data.value.value.DocumentCounts.series;

  var chartSentiment = timeSeriesChart("#"+dom_id+"_sparklineTwo")
  .x(function(d) {return parseDate(moment(+d.time).format("DD-MMM-YY HH:mm:ss")) })
  .y(function(d) { return +d.shares; });

  function callSentimentSparkline(target_div) {
    d3.select(target_div)
      .datum(sentimentSparklineData)
      .call(chartSentiment);
  }
  callSentimentSparkline("#"+dom_id+"_sparklineTwo")

  // ++++++++++++ END of SPARKLINES ++++++++++++

  // %%%%%%%%%%%% TOTALS text %%%%%%%%%%%%
  
  // AVERAGES
  var avgSentiment = d3.mean(sentimentSparklineData, function(d) {
    return d.shares;
  })

  // two time periods ago (AVG)
  var previousSentimentAverage = sentimentSparklineData.slice(0,sentimentSparklineData.length-1)
  var avgSentimentPrevious = d3.mean(previousSentimentAverage, function(d) {
    return d.shares;
  })


  // LAST Element
  
  // total shares RETWEETS *****
  
  // SOOO Screwed up because have to get an hour; half the data
  //previous time period avg
  var previousRetweetTotalSlice = sentimentSparklineData.slice(sentimentSparklineData.length/2-1,sentimentSparklineData.length-1)
  var previousRetweetTotal = d3.sum(previousRetweetTotalSlice, function(d) {
    return d.shares;
  });

  //current time period
  var retweetTotalSlice = sentimentSparklineData.slice(sentimentSparklineData.length/2,sentimentSparklineData.length)
  var retweetTotal = d3.sum(retweetTotalSlice, function(d) {
    return d.shares;
  });

  var docsSharedData = data.value.value.contentSummary.documents.numShareDocs;

  //previous value for transition
  
  var prefix_LastAuthors = d3.formatPrefix(previousRetweetTotal); 
  var prefixScale_LastAuthors = prefix_LastAuthors.scale(previousRetweetTotal)

  var prefix_Authors = d3.formatPrefix(retweetTotal);
  var prefixSymbol_Authors = prefix_Authors.symbol;
  var prefixScale_Authors = prefix_Authors.scale(retweetTotal)

  $('#'+dom_id+'_prefixAuthorsSymbolSpan').html(prefixSymbol_Authors);

  function decimalPointHeader(data) {
    if (Math.round(data).toString().length < 4) { //then it's hundred or less, should have no decimal point
        //greeting = "Good day";
      return 0  
    } else {
        //greeting = "Good evening";
        return 1
    }
  } 

  var sharesTicker = new countUp(dom_id+"_uniqueAuthorsTotal", prefixScale_LastAuthors, prefixScale_Authors, decimalPointHeader(retweetTotal), 10);
  sharesTicker.start();

  // %%%%%%%%%%%% END of TOTALS text %%%%%%%%%%%%

}
