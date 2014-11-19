function append_sentiment_html_to_dom(dom_id){
    var sentiment_html= '<div class="total-main-number-container">'+
        '<span id="'+ dom_id +'_uniqueAuthorsTotal" class="total-main-number">'+
        '</span>'+
      '</div>'+
      '<div class="row">'+
        '<div class="small-4 medium-4 large-4 columns">'+
          '<div class="average-container">'+
            '<span id="'+ dom_id +'_uniqueAuthorsAvg" class="avg-header"></span>'+
            '<span id="'+ dom_id +'_avgDiffSentiment"></span>'+
          '</div>'+
          '<div class="average-label-container">'+
            '<span class="average-label">'+
              'avg '+
            '</span>'+
            '<br>'+
            '<span class="sentiment-explanation-label">'+
              'range: <br> -100 to 100 '+
            '</span>'+
          '</div>'+
        '</div>'+
        '<div class="small-8 medium-8 large-8 columns">'+
          '<div id="'+ dom_id +'_sparkline"></div>'+
          '<span class="sparklineTimeLabel">'+
            'last 24 hours'+
          '</span>'+
        '</div>'+
      '</div>';
    $('#'+dom_id).html(sentiment_html);
}

function handleUpdateNetSentiment(data, dom_id) {
  append_sentiment_html_to_dom(dom_id);
  // valueTime will be zero if no data comes back
  var valueTime = data.value.valueTime;
  if(valueTime === 0){
    $('#myModal').foundation('reveal', 'open');
  }
  else {
    $('#myModal').foundation('reveal', 'close');
  }

  // NEW
  var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

  //unique authors or net sentiment
  var sentimentSparklineData = data.value.value.MetricSeries_NetSentiment.set;
  var dualSentimentData = [];
  var positiveSentimentData = data.value.value.MetricSeries_PositiveSentiment.set;
  var negativeSentimentData = data.value.value.MetricSeries_NegativeSentiment.set;
  for(var i=0; i<positiveSentimentData.length; i++){
    for(var j=0; j<positiveSentimentData.length; j++){
      positiveSentimentData[i].negativeValue = negativeSentimentData[i].value
      positiveSentimentData[i].sumValues = positiveSentimentData[i].value + negativeSentimentData[i].value
    }
  }

  // look at sentimentSparklineData above
  for (var i=0; i<sentimentSparklineData.length; i++){
    sentimentSparklineData[i].zero = 0
  }

  var chartSentiment = differenceChart("#"+dom_id+"_sparkline")
    .x(function(d) {return parseDate(moment(d.date).format("DD-MMM-YY HH:mm:ss")) })
    .y(function(d) {return +d.value; })

  function callSentimentSparkline(dom_element) {
    d3.select(dom_element)
      .datum(sentimentSparklineData)
      .call(chartSentiment);
  }
  callSentimentSparkline("#"+dom_id+"_sparkline");

  // %%%%%%%%%%%% TOTALS text %%%%%%%%%%%%

  var avgSentiment = d3.mean(sentimentSparklineData, function(d) {
    return d.value;
  })

  var previousSentimentAverage = sentimentSparklineData.slice(0,sentimentSparklineData.length-1)
  var avgSentimentPrevious = d3.mean(previousSentimentAverage, function(d) {
    return d.value;
  })

  // sentiment
  var secondLastElementSentiment = sentimentSparklineData[sentimentSparklineData.length - 2];

  //sentiment
  var lastElementSentiment = sentimentSparklineData[sentimentSparklineData.length - 1];
  
  var prefix_SecondLastSentiment = d3.formatPrefix(secondLastElementSentiment.value);
  var prefixSymbol_SecondLastSentiment = prefix_SecondLastSentiment.symbol;
  var prefixScale_SecondLastSentiment = prefix_SecondLastSentiment.scale(secondLastElementSentiment.value);

  var prefix_LastSentiment = d3.formatPrefix(lastElementSentiment.value)
  var prefixSymbol_LastSentiment = prefix_LastSentiment.symbol;
  var prefixScale_LastSentiment = prefix_LastSentiment.scale(lastElementSentiment.value)


  function decimalPointHeader(data) {
    if (Math.round(data).toString().length < 4) { //then it's hundred or less, should have no decimal point
      //greeting = "Good day";
      return 0  
    }
    else {
      //greeting = "Good evening";
      return 1
    }
  } 
      
  var sentimentTicker = new countUp(dom_id+"_uniqueAuthorsTotal", prefixScale_SecondLastSentiment, prefixScale_LastSentiment, 0, 15)//data.waitTime)//10);
  sentimentTicker.start();

  //Sentiment
  var avgprefix_lastSentiment = d3.formatPrefix(avgSentimentPrevious);
  var avgprefixSymbol_lastSentiment = avgprefix_lastSentiment.symbol;
  var avgprefixScale_lastSentiment = avgprefix_lastSentiment.scale(avgSentimentPrevious);

  var avgprefix_Sentiment = d3.formatPrefix(avgSentiment);
  var avgprefixSymbol_Sentiment = avgprefix_Sentiment.symbol;
  var avgprefixScale_Sentiment = avgprefix_Sentiment.scale(avgSentiment);

  var avgsentimentTicker = new countUp(dom_id+"_uniqueAuthorsAvg", avgSentimentPrevious, avgSentiment, 0, 15)//10);
  avgsentimentTicker.start();

  var sentimentAvgDifferenceNow = d3.round(lastElementSentiment.value)-d3.round(avgSentiment)
  var sentimentAvgDifferenceBefore = d3.round(secondLastElementSentiment.value)-d3.round(avgSentimentPrevious)

  var avgDiffSentimentTicker = new countUp(dom_id+"_avgDiffSentiment", sentimentAvgDifferenceBefore, sentimentAvgDifferenceNow, 0, 15);
  avgDiffSentimentTicker.start();

  $('#'+dom_id+'_avgDiffSentiment').css('color', function(){
    if( sentimentAvgDifferenceNow > 0) {
      return "#2ECC40"
    } else if( sentimentAvgDifferenceNow < 0) {
      return "#FF4136"
    } else {
      return "#848484"
    }
  });

  $('#'+dom_id+'_1avgDiffSentimentPercentSign').css('color', function(){
    if( sentimentAvgDifferenceNow > 0) {
      return "#2ECC40"
    } else if( sentimentAvgDifferenceNow < 0) {
      return "#FF4136"
    } else {
      return "#848484"
    }
  });

}// end of handleUpdate(data) function