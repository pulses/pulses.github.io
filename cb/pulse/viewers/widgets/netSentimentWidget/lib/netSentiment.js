$(window).load(function() {
	
	viewerSetup();
	datacall();
	
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

var dataSpec = {
	data: [
	{ analysis: "MetricSeries", seriesName: "NetSentiment", resultTag: "MetricSeries_NetSentiment", timeSpan: 86400000 },
	{ analysis: "MetricSeries", seriesName: "PositiveSentiment", resultTag: "MetricSeries_PositiveSentiment", timeSpan: 86400000 },
	{ analysis: "MetricSeries", seriesName: "NegativeSentiment", resultTag: "MetricSeries_NegativeSentiment", timeSpan: 86400000 }
	]
};

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

			// NEW
			var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;
			
      		//now have data in an array, plug it into the chart
      		var poneBars = imprBarChart()
      		.height(100);

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
      		console.log('DUAL SENTIMENT DUAL SENTIMENT DATA PONING')
      		console.log(positiveSentimentData)

    		// look at sentimentSparklineData above
    		for (var i=0; i<sentimentSparklineData.length; i++){
    			sentimentSparklineData[i].zero = 0
    		}

    		var chartSentiment = differenceChart()
    		.x(function(d) {return parseDate(moment(d.date).format("DD-MMM-YY HH:mm:ss")) })
    		.y(function(d) {return +d.value; })

    		function callSentimentSparkline() {
    			d3.select("#sparklineThree")
    			.datum(sentimentSparklineData)
    			.call(chartSentiment);
    		}
    		
    		
    		callSentimentSparkline()

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
			console.log('^^^^^^^^^^^^^')
			console.log(secondLastElementSentiment)

			//sentiment
			var lastElementSentiment = sentimentSparklineData[sentimentSparklineData.length - 1];
			console.log('^^^^^^^^^^^^^')
			console.log(lastElementSentiment)
			
			var prefix_SecondLastSentiment = d3.formatPrefix(secondLastElementSentiment.value);
			var prefixSymbol_SecondLastSentiment = prefix_SecondLastSentiment.symbol;
			var prefixScale_SecondLastSentiment = prefix_SecondLastSentiment.scale(secondLastElementSentiment.value);

			var prefix_LastSentiment = d3.formatPrefix(lastElementSentiment.value)
			var prefixSymbol_LastSentiment = prefix_LastSentiment.symbol;
			var prefixScale_LastSentiment = prefix_LastSentiment.scale(lastElementSentiment.value)


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
			
			var sentimentTicker = new countUp("uniqueAuthorsTotal", prefixScale_SecondLastSentiment, prefixScale_LastSentiment, 0, 15)//data.waitTime)//10);

sentimentTicker.start();

			//Sentiment
			var avgprefix_lastSentiment = d3.formatPrefix(avgSentimentPrevious);
			var avgprefixSymbol_lastSentiment = avgprefix_lastSentiment.symbol;
			var avgprefixScale_lastSentiment = avgprefix_lastSentiment.scale(avgSentimentPrevious);

			var avgprefix_Sentiment = d3.formatPrefix(avgSentiment);
			var avgprefixSymbol_Sentiment = avgprefix_Sentiment.symbol;
			var avgprefixScale_Sentiment = avgprefix_Sentiment.scale(avgSentiment);

			var avgsentimentTicker = new countUp("uniqueAuthorsAvg", avgSentimentPrevious, avgSentiment, 0, 15)//10);
avgsentimentTicker.start();

var sentimentAvgDifferenceNow = d3.round(lastElementSentiment.value)-d3.round(avgSentiment)
console.log(sentimentAvgDifferenceNow)

var sentimentAvgDifferenceBefore = d3.round(secondLastElementSentiment.value)-d3.round(avgSentimentPrevious)
console.log(sentimentAvgDifferenceBefore)

var avgDiffSentimentTicker = new countUp("avgDiffSentiment", sentimentAvgDifferenceBefore, sentimentAvgDifferenceNow, 0, 15);

avgDiffSentimentTicker.start();

$('#avgDiffSentiment').css('color', function(){
	if( sentimentAvgDifferenceNow > 0) {
		return "#2ECC40"
	} else if( sentimentAvgDifferenceNow < 0) {
		return "#FF4136"
	} else {
		return "#848484"
	}
});

$('#avgDiffSentimentPercentSign').css('color', function(){
	if( sentimentAvgDifferenceNow > 0) {
		return "#2ECC40"
	} else if( sentimentAvgDifferenceNow < 0) {
		return "#FF4136"
	} else {
		return "#848484"
	}
});

}// end of handleUpdate(data) function