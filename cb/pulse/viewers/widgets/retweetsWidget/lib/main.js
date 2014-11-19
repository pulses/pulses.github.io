$(window).load(function() {
  viewerSetup();
  datacall();
  
  $(function() {
    
  });

  //reload page to clean all if running for a certain time period
  setInterval("reload_page();", 1800000); // 30 min
  function reload_page(){
    window.location = location.href;
  };

  $(document).foundation();

  // Check to see if second image tag exists
  $(document).ready(function() {
    if($("#themeLogo").attr('src') == "") {
      $( "#themeLogo").remove();
    }
  });
    
});

var previousValueTime; //keep this just in limbo, need to assign old data to this at end of work, but maintain after ajax call
var viewerConfig;

var dataSpec = {
  data: [ { analysis: "DocumentCounts", timeSpan: 7200000, bucketTimeSpan: 300000 } ]
};



function datacall() {
    
  var url = "https://app.netbase.com/cb/pulse/api/request"
  + "?id=" + _id 
  + "&dataSpec=" + JSON.stringify(dataSpec);

  console.log('NEW URL')
  $.ajax({
    url: url, 
    dataType: "text",
    success: function(data, textStatus, jqXHR) {
      var jsResult = JSON.parse(data);
      var currentValueTime = jsResult.value.valueTime;
      
      window.setTimeout(function() {
          datacall();
      }, jsResult.waitTime);

      if (currentValueTime !== previousValueTime) {
          handleUpdate(jsResult); //function to repeat rendering of charts
      }
      
      previousValueTime = jsResult.value.valueTime;
    },
    error: function(jqXHR, textStatus, errorThrown) {
      window.setTimeout(function() {
        datacall();
      }, 5000);
    }
  })
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


  // ++++++++++++ SPARKLINES ++++++++++++

  // NEW
  var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

  //unique authors or net sentiment
  var sentimentSparklineData = data.value.value.DocumentCounts.series;
  console.log(sentimentSparklineData)

  var chartSentiment = timeSeriesChart()
  .x(function(d) {return parseDate(moment(+d.time).format("DD-MMM-YY HH:mm:ss")) })
  .y(function(d) { return +d.shares; });

  function callSentimentSparkline() {
    d3.select("#sparklineThree")
      .datum(sentimentSparklineData)
      .call(chartSentiment);
  }
  callSentimentSparkline()

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
  })
  console.log('++++++++++++++++++++++++++')
  console.log(previousRetweetTotal)

  //current time period
  var retweetTotalSlice = sentimentSparklineData.slice(sentimentSparklineData.length/2,sentimentSparklineData.length)
  var retweetTotal = d3.sum(retweetTotalSlice, function(d) {
    return d.shares;
  })
  console.log('++++++++++++++++++++++++++')
  console.log(retweetTotal)

  var docsSharedData = data.value.value.contentSummary.documents.numShareDocs;
  console.log('==========================')
  console.log(docsSharedData)

  //previous value for transition
  
  var prefix_LastAuthors = d3.formatPrefix(previousRetweetTotal); 
  var prefixScale_LastAuthors = prefix_LastAuthors.scale(previousRetweetTotal)

  var prefix_Authors = d3.formatPrefix(retweetTotal);
  var prefixSymbol_Authors = prefix_Authors.symbol;
  var prefixScale_Authors = prefix_Authors.scale(retweetTotal)

  $('#prefixAuthorsSymbolSpan').html(prefixSymbol_Authors);

  function decimalPointHeader(data) {
    //if (10 < 20) {
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

  var sharesTicker = new countUp("uniqueAuthorsTotal", prefixScale_LastAuthors, prefixScale_Authors, decimalPointHeader(retweetTotal), 10)//data.waitTime)//10);
  
  sharesTicker.start();

  // %%%%%%%%%%%% END of TOTALS text %%%%%%%%%%%%

}
