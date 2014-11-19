$(window).load(function() {
	//geoObject.initGeo();
	//barChartObject.initBars();
	viewerSetup();
	datacall();
	//initBars();
	//sparklineOneObject.initSparklineOne();
	//sparklineTwoObject.initSparklineTwo();
	//sparklineThreeObject.initSparklineThree();
	
	$(function() {
		//$("#tweet-stream").ticker("start");
		$("#tweet-stream").ticker({
			//scrollTime: 4000,
			//fadeTime: 2000,
			mouseOffTimeout: 5000
			//fixContainer: true
		});
		$("#tweet-stream-two").ticker({
			//scrollTime: 4000,
			//fadeTime: 2000,
			mouseOffTimeout: 5000
			//fixContainer: true
		});
		$("#tweet-stream-three").ticker({
			//scrollTime: 4000,
			//fadeTime: 2000,
			mouseOffTimeout: 5000
			//fixContainer: true
		});
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

	//news ticker
	/*
	$(function(){
		$("#webticker").webTicker({speed: 40});
	});
	*/
});

var previousValueTime; //keep this just in limbo, need to assign old data to this at end of work, but maintain after ajax call
var viewerConfig;

var dataSpec = {
   	data: [
       { analysis: "BandedMetricSeries", bucketTimeSpanMins:60 },
       { analysis: "DocumentCounts" },
       { analysis: "MetricSeries", seriesName: "Impressions", resultTag: "MetricSeries_Impressions", timeSpan: 86400000 },
       { analysis: "MetricSeries", seriesName: "NetSentiment", resultTag: "MetricSeries_NetSentiment", timeSpan: 86400000 },
       { analysis: "MetricSeries", seriesName: "PositiveSentiment", resultTag: "MetricSeries_PositiveSentiment", timeSpan: 86400000 },
       { analysis: "MetricSeries", seriesName: "NegativeSentiment", resultTag: "MetricSeries_NegativeSentiment", timeSpan: 86400000 }
       //{ analysis: "TopDocuments", sort: "datetime" },
       //{ analysis: "TopDocuments", sort: "impressions", resultTag: "TopOriginalDocumentsImpressions" },
       //{ analysis: "TopDocuments", sort: "shares", resultTag: "TopOriginalDocumentsShares" }
   ]
};
/*
function viewerSetup() {
    viewerConfig = JSON.parse(_viewerConfig);

	// install the topic logo 
	if ("topicLogo" in viewerConfig) {
		var logoUrl = viewerConfig.topicLogo;
		console.log("topic logo = " + logoUrl);
		document.getElementById("topicLogo").src = logoUrl;
	}
	
	// and the theme logo, if any.  if not, delete the node
	if ("themeLogo" in viewerConfig) {
		var logoUrl = viewerConfig.themeLogo;
		console.log("theme logo = " + logoUrl);
		document.getElementById("themeLogo").src = logoUrl;
	}
	else {
		var img = document.getElementById("themeLogo");
		img.parentNode.removeChild(img);
	}

	// and the service logo (to override NB logo)
	if ("serviceLogo" in viewerConfig) {
		var logoUrl = viewerConfig.serviceLogo;
		console.log("service logo = " + logoUrl);
		document.getElementById("serviceLogo").src = logoUrl;
	}
}
*/
function datacall() {
	//var url = "https://streamserver.netbase.com/walmart-query.jsp"
	//var url = "dataOne.json"
	//var url = "https://w402.netbase.com/streamserver/pulse/request?id=a2ec76bb-556e-40da-bf65-3ec2f99c112b"
	//var url = "https://w402.netbase.com/streamserver/pulse/request"
	var url = "/cb/pulse/api/request"
		+ "?id=" + _id
		//+ "?id=" + "a2ec76bb-556e-40da-bf65-3ec2f99c112b"
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
	        //console.log('**********************************************')
	        
	        //handleUpdate(jsResult); //function to repeat rendering of charts
	        previousValueTime = jsResult.value.valueTime;
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        window.setTimeout(function() {
	            datacall();
	            //console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
	        }, 5000);
	    }
	})
}

//d3.json("walmart6.json", function(data) {
//	d3.json("walmart6b.json", function(dataTwo) {
//		d3.json("walmart6c.json", function(dataThree) {
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
				//$('#myModal').foundation('reveal', 'open');
				
				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
		        	$( "#mainPulseContentDiv" ).empty();

		        	//$('#myModal').foundation('reveal', 'close');
		        	$('#ieModal').foundation('reveal', 'open');
		        } else {
		        	console.log('not using Internet Explorer')
		        	$('#myModal').foundation('reveal', 'open');
		        }  

			} else {
				console.log('----------------------- there is data')
				/*
				$('#myModal').foundation('reveal', 'open');
				setTimeout(function(){
					$('#myModal').foundation('reveal', 'close');
				}, 3000);
				*/

				//$('#myModal').foundation('reveal', 'close');

				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
		        	$( "#mainPulseContentDiv" ).empty();

		        	//$('#myModal').foundation('reveal', 'close');
		        	$('#ieModal').foundation('reveal', 'open');
		        } else {
		        	console.log('not using Internet Explorer')
		        	$('#myModal').foundation('reveal', 'close');
		        }
			}

		/*
			function msieversion() {

		        var ua = window.navigator.userAgent;
		        var msie = ua.indexOf("MSIE ");

		        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
		        	$( "#mainPulseContentDiv" ).empty();

		        	$('#myModal').foundation('reveal', 'close');
		        	$('#ieModal').foundation('reveal', 'open');
		        } else {
		        	console.log('not using Internet Explorer')
		        }      // If Internet Explorer, return version number	
			}
			msieversion()
		*/

		/*
			// ************ BAR (topics) ************ 

			newBarData = data.value.phrases;
			//newBarData01 = data.value.phrases;
			//newBarData02 = dataTwo.value.phrases;
			//newBarData03 = dataThree.value.phrases;
			//console.log(newBarData)

			renderTopicBarChart();

			function renderTopicBarChart() {
				barChartObject.redrawBars(newBarData);
			}

			// ************ End of BAR ************  
		*/

			// ++++++++++++ SPARKLINES ++++++++++++

	
		/*
			// array of time periods
			console.log('!!!!!!!!!!!!!!!!!!!!!!!!!')
			var minuteDataBase = data.value.minuteMetrics.metrics[0]
			console.log(minuteDataBase)

			// ### MINUTES ###
			var timeColumnMinutes = minuteDataBase.columns

			// array of BUZZ values 
			var buzzValuesMinutes = minuteDataBase.dataset[0].set

			var resultMinutes = timeColumnMinutes.map(function(_,i) {
			  	return {
				  	time: timeColumnMinutes[i],
				  	buzz: buzzValuesMinutes[i],
				  	//impressions: imprValues[i],
				  	//netsentiment: netsentimentValues[i],
				  	//passion: passionValues[i],
				  	index: i 
			  	}
			});
			console.log('@@@@@@ minute sparkline data')
			console.log(resultMinutes)
			
			//sparklineOneObject.redrawSparklineOne(resultMinutes);
			var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;
			//d.date = parseDate(moment(+d.time).format("DD-MMM-YY HH:mm:ss"));

			//sparklineOneObject.redrawSparklineOne(resultMinutes);
			//var formatDate = d3.time.format("%d-%b-%y %H:%M:%S");

  			var chart = timeSeriesChartMentions()
    			//.x(function(d) { return formatDate.parse(d.date); })
    			.x(function(d) {return parseDate(moment(+d.time).format("DD-MMM-YY HH:mm:ss")) })
    			.y(function(d) { return +d.buzz; });

    		function callMentionsSparkline() {
				d3.select("#sparklineOne")
	      			.datum(resultMinutes)
	      			.call(chart);
      		}
      		callMentionsSparkline()

			// ### HOURS ###
			
			var hourDataBase = data.value.hourMetrics.metrics[0]
			var timeColumnHours = hourDataBase.columns

			// array of IMPRESSIONS values 
			var imprValuesHours = hourDataBase.dataset[0].set

			// array of NET SENTIMENT values 
			var netsentimentValuesHours = hourDataBase.dataset[1].set

			// array of PASSION values 
			var passionValuesHours = hourDataBase.dataset[2].set

			var resultHours = timeColumnHours.map(function(_,i) {
			  	return {
				  	time: timeColumnHours[i],
				  	//buzz: buzzValues[i],
				  	impressions: imprValuesHours[i],
				  	netsentiment: netsentimentValuesHours[i],
				  	passion: passionValuesHours[i],
				  	index: i 
			  	}
			});
			console.log('@@@@@@ hour sparkline data')
			console.log(resultHours)

			//sparklineTwo(resultHours)
			//sparklineTwoObject.redrawSparklineTwo(resultHours);
			//sparklineThreeObject.redrawSparklineThree(resultHours);
			//sparklineThree(resultHours)

			var chartImpr = timeSeriesChartImpressions()
    			//.x(function(d) { return formatDate.parse(d.date); })
    			.x(function(d) {return parseDate(moment(+d.time).format("DD-MMM-YY HH:mm:ss")) })
    			.y(function(d) { return +d.impressions; });

			function callImprSparkline() {
				d3.select("#sparklineTwo")
	      			.datum(resultHours)
	      			.call(chartImpr);
      		}
      		callImprSparkline()

      		var chartSentiment = timeSeriesChartSentiment()
    			//.x(function(d) { return formatDate.parse(d.date); })
    			.x(function(d) {return parseDate(moment(+d.time).format("DD-MMM-YY HH:mm:ss")) })
    			.y(function(d) { return +d.netsentiment; });

      		function callSentimentSparkline() {
				d3.select("#sparklineThree")
	      			.datum(resultHours)
	      			.call(chartSentiment);
      		}
      		callSentimentSparkline()
      	*/

      		var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

      		// mentions
      		
			var mentionsSparklineData = data.value.value.BandedMetricSeries.set;
			for (var i=0; i < data.length; i++) {
				//console.log(data[i])
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
		  	} //end of differenceInBand function

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

	    	function callMentionsBandedLine() {
				d3.select("#sparklineOne")
	      			.datum(bandedData)
	      			.call(chart);
      		}
      		callMentionsBandedLine();




      		//impressions for blocks bar chart instead of line chart
      		var impressionBarChartData = data.value.value.MetricSeries_Impressions.set;
      		console.log('/////////////////////////////////')
      		console.log('Bar Chart Data')
      		console.log(impressionBarChartData)

      		console.log('array from _.pluck heya emma')
      		var valBlocksArray = _.pluck(impressionBarChartData, 'value')
      		console.log(valBlocksArray)

      		//now have data in an array, plug it into the chart
      		//var data1 = [10, 20, 30, 40];
      		var poneBars = imprBarChart()
                //.width(400)
                .height(100);

            // now call chart below
            d3.select("#sparklineTwo")
                //.datum(data1)
                .datum(valBlocksArray)
                .call(poneBars)


        
			// impressions
			var impressionSparklineData = data.value.value.MetricSeries_Impressions.set;
		/*
			var chartImpr = timeSeriesChart()
    			//.x(function(d) { return formatDate.parse(d.date); })
    			.x(function(d) {return parseDate(moment(+d.date).format("DD-MMM-YY HH:mm:ss")) })
    			.y(function(d) { return +d.value; });

			function callImprSparkline() {
				d3.select("#sparklineTwo")
	      			.datum(impressionSparklineData)
	      			.call(chartImpr);
      		}
      		callImprSparkline();
      	*/









      		//unique authors or net sentiment
      		var sentimentSparklineData = data.value.value.MetricSeries_NetSentiment.set;
      		//console.log(sentimentSparklineData)
      		var avgSentiment = d3.mean(sentimentSparklineData, function(d) {return d.value})
      		//console.log(avgSentiment)

      		// dual area chart for net sentiment

      		//functions for difference values
      		function differenceInPositiveSentiment() { 
      			if (sentimentSparklineData[i].value - avgSentiment > 0) {
		  			return sentimentSparklineData[i].value - avgSentiment 
		  		}
		  		else {
		  			return 0
		  		}
		  	} //end of differenceInBand function
		  	function differenceInNegativeSentiment() { 
      			if (sentimentSparklineData[i].value - avgSentiment < 0) {
		  			return Math.abs(sentimentSparklineData[i].value - avgSentiment)
		  		}
		  		else {
		  			return 0
		  		}
		  	} //end of differenceInPositive function
      		/*
      		function differenceInPositiveSentiment() { 
      			if (positiveSentimentData[i].value - avgSentiment > 0) {
		  			return positiveSentimentData[i].value - avgSentiment 
		  		}
		  		else {
		  			return 0
		  		}
		  	} //end of differenceInBand function
		  	function differenceInNegativeSentiment() { 
      			if (-negativeSentimentData[i].value + avgSentiment > 0) {
		  			return -negativeSentimentData[i].value - -avgSentiment 
		  		}
		  		else {
		  			return 0
		  		}
		  	} //end of differenceInPositive function
			*/
      		// first start with positive sentiment, then add negative value to it
      		//var dualSentimentData = [];
      		//var positiveSentimentData = data.value.value.MetricSeries_PositiveSentiment.set;
      		//var negativeSentimentData = data.value.value.MetricSeries_NegativeSentiment.set;
      		for(var i=0; i<sentimentSparklineData.length; i++){
      			//for(var j=0; j<positiveSentimentData.length; j++){
      				//dualSentimentData.date = positiveSentimentData[i].date
      				//dualSentimentData.positiveValue = positiveSentimentData[i].value
      				//dualSentimentData.negativeValue = negativeSentimentData[i].value
      				//dualSentimentData.push(dualSentimentData.date = positiveSentimentData[i].date)
      				//dualSentimentData.push(dualSentimentData.positiveValue = positiveSentimentData[i].value)
      				//dualSentimentData.push(dualSentimentData.negativeValue = negativeSentimentData[i].value)
      				
      				//positiveSentimentData[i].negativeValue = negativeSentimentData[i].value
      				//positiveSentimentData[i].sumValues = positiveSentimentData[i].value + negativeSentimentData[i].value
      				
      				//positiveSentimentData[i].avgSentiment = avgSentiment
      				//positiveSentimentData[i].positiveSentimentNormalized = differenceInPositiveSentiment()
      				//positiveSentimentData[i].negativeSentimentNormalized = differenceInNegativeSentiment()
      				sentimentSparklineData[i].avgSentiment = avgSentiment
      				sentimentSparklineData[i].positiveSentiment = differenceInPositiveSentiment()
      				sentimentSparklineData[i].negativeSentiment = differenceInNegativeSentiment()
      			//}
      		}
      		//console.log('DUAL SENTIMENT DUAL SENTIMENT DATA PONING')
      		//console.log(sentimentSparklineData)

      		var sentimentDifferenceChartData = data.value.value.MetricSeries_NetSentiment.set;
      		// look at sentimentSparklineData above
			for (var i=0; i<sentimentDifferenceChartData.length; i++){
				//bandedData[i].zdifference = differenceInBand()
				//bandedData[i].average = averageInBand()
				sentimentDifferenceChartData[i].zero = 0
			}

			console.log('XXXXXXXXXXXXXXXXX')
			console.log('Trend Pulse Data')
			console.log(sentimentDifferenceChartData)

      		//var chartSentiment = timeSeriesChart()
      		//var chartSentiment = timeSentimentSeriesChart()
      		var chartSentiment = differenceChart()
    			//.x(function(d) { return formatDate.parse(d.date); })
    			.x(function(d) {return parseDate(moment(+d.date).format("DD-MMM-YY HH:mm:ss")) })
    			.y(function(d) { return +d.value; });
    			//.y1(function(d) { return +d.value; })
    			//.y(function(d) { return +d.negativeValue; });
    			
    			//.y1(function(d) { return +d.positiveSentiment; })
    			//.y(function(d) { return +d.negativeSentiment; });

      		function callSentimentSparkline() {
				d3.select("#sparklineThree")
	      			//.datum(sentimentSparklineData)
	      			.datum(sentimentDifferenceChartData)
	      			.call(chartSentiment);
      		}
      		callSentimentSparkline()

			// ++++++++++++ END of SPARKLINES ++++++++++++

			// %%%%%%%%%%%% TOTALS text %%%%%%%%%%%%
			
			// last time period
			/*
			var avgBuzz = d3.mean(mentionsSparklineData, function(d) {
				return d.value;
			})
			*/
			var lastBandedDataPoint = bandedData[bandedData.length - 1]
			var avgBuzz = lastBandedDataPoint.average;
			//console.log(avgBuzz)

			var avgImpressions = d3.mean(impressionSparklineData, function(d) {
				return d.value;
			})
			//console.log(avgImpressions)

			var avgSentiment = d3.mean(sentimentSparklineData, function(d) {
				return d.value;
			})

			// two time periods ago (AVG)
			/*
			var previousBuzzAverage = mentionsSparklineData.slice(0,mentionsSparklineData.length-1)
			//console.log(previousBuzzAverage)
			var avgBuzzPrevious = d3.mean(previousBuzzAverage, function(d) {
				return d.value;
			})
			*/
			var secondLastBandedDataPoint = bandedData[bandedData.length - 2]
			var avgBuzzPrevious = secondLastBandedDataPoint.average;

			var previousImprAverage = impressionSparklineData.slice(0,impressionSparklineData.length-1)
			//console.log(previousBuzzAverage)
			var avgImprPrevious = d3.mean(previousImprAverage, function(d) {
				return d.value;
			})

			var previousSentimentAverage = sentimentSparklineData.slice(0,sentimentSparklineData.length-1)
			//console.log(previousBuzzAverage)
			var avgSentimentPrevious = d3.mean(previousSentimentAverage, function(d) {
				return d.value;
			})

			// SECOND to Last Elements
			// mentions
			var secondLastElementBuzz = mentionsSparklineData[mentionsSparklineData.length - 2];
			console.log('^^^^^^^^^^^^^')
			console.log(secondLastElementBuzz)

			// impressions
			var secondLastElementImpressions = impressionSparklineData[impressionSparklineData.length - 2];
			console.log('^^^^^^^^^^^^^')
			console.log(secondLastElementImpressions)

			// sentiment
			var secondLastElementSentiment = sentimentSparklineData[sentimentSparklineData.length - 2];
			console.log('^^^^^^^^^^^^^')
			console.log(secondLastElementSentiment)

			// LAST Element
			// mentions
			var lastElementBuzz = mentionsSparklineData[mentionsSparklineData.length - 1];
			console.log('^^^^^^^^^^^^^')
			console.log(lastElementBuzz)

			// impressions
			var lastElementImpressions = impressionSparklineData[impressionSparklineData.length - 1];
			console.log('^^^^^^^^^^^^^')
			console.log(lastElementImpressions)

			//sentiment
			var lastElementSentiment = sentimentSparklineData[sentimentSparklineData.length - 1];
			console.log('^^^^^^^^^^^^^')
			console.log(lastElementSentiment)
		
			var prefix_SecondLastMentions = d3.formatPrefix(secondLastElementBuzz.value);
			var prefixSymbol_SecondLastMentions = prefix_SecondLastMentions.symbol;
			var prefixScale_SecondLastMentions = prefix_SecondLastMentions.scale(secondLastElementBuzz.value);

			var prefix_LastMentions = d3.formatPrefix(lastElementBuzz.value)
			var prefixSymbol_LastMentions = prefix_LastMentions.symbol;
			var prefixScale_LastMentions = prefix_LastMentions.scale(lastElementBuzz.value)

			$('#prefixMentionsSymbolSpan').html(prefixSymbol_LastMentions);

			var prefix_SecondLastImpr = d3.formatPrefix(secondLastElementImpressions.value);
			var prefixSymbol_SecondLastImpr = prefix_SecondLastImpr.symbol;
			var prefixScale_SecondLastImpr = prefix_SecondLastImpr.scale(secondLastElementImpressions.value);

			var prefix_LastImpr = d3.formatPrefix(lastElementImpressions.value)
			var prefixSymbol_LastImpr = prefix_LastImpr.symbol;
			var prefixScale_LastImpr = prefix_LastImpr.scale(lastElementImpressions.value)

			$('#prefixImprSymbolSpan').html(prefixSymbol_LastImpr);
	
			var prefix_SecondLastSentiment = d3.formatPrefix(secondLastElementSentiment.value);
			var prefixSymbol_SecondLastSentiment = prefix_SecondLastSentiment.symbol;
			var prefixScale_SecondLastSentiment = prefix_SecondLastSentiment.scale(secondLastElementSentiment.value);

			var prefix_LastSentiment = d3.formatPrefix(lastElementSentiment.value)
			var prefixSymbol_LastSentiment = prefix_LastSentiment.symbol;
			var prefixScale_LastSentiment = prefix_LastSentiment.scale(lastElementSentiment.value)

			$('#prefixImprSymbolSpan').html(prefixSymbol_LastImpr);

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
			
			//var mentionTicker = new countUp("mentionsTotal", secondLastElementBuzz.buzz, lastElementBuzz.buzz, 0, 10)//data.waitTime);
			//var imprTicker = new countUp("impressionsTotal", secondLastElementHours.impressions, lastElementHours.impressions, 0, 10);
			//var mentionTicker = new countUp("mentionsTotal", prefixScale_SecondLastMentions, prefixScale_LastMentions, 1, 10)//data.waitTime);
		var mentionTicker = new countUp("mentionsTotal", prefixScale_SecondLastMentions, prefixScale_LastMentions, decimalPointHeader(lastElementBuzz.value), 10)//data.waitTime);
			var imprTicker = new countUp("impressionsTotal", prefixScale_SecondLastImpr, prefixScale_LastImpr, 0, 10);
			var sentimentTicker = new countUp("uniqueAuthorsTotal", prefixScale_SecondLastSentiment, prefixScale_LastSentiment, 0, 10);
			mentionTicker.start();
			imprTicker.start();
			sentimentTicker.start();

			//AVERAGES

			//Mentions
			var avgprefix_lastMentions = d3.formatPrefix(avgBuzzPrevious);
			var avgprefixSymbol_lastMentions = avgprefix_lastMentions.symbol;
			var avgprefixScale_lastMentions = avgprefix_lastMentions.scale(avgBuzzPrevious);

			var avgprefix_Mentions = d3.formatPrefix(avgBuzz);
			var avgprefixSymbol_Mentions = avgprefix_Mentions.symbol;
			var avgprefixScale_Mentions = avgprefix_Mentions.scale(avgBuzz);

			$('#avgprefixMentionsSymbolSpan').html(avgprefixSymbol_Mentions);

			//Impressions
			var avgprefix_lastImpr = d3.formatPrefix(avgImprPrevious);
			var avgprefixSymbol_lastImpr = avgprefix_lastImpr.symbol;
			var avgprefixScale_lastImpr = avgprefix_lastImpr.scale(avgImprPrevious);

			var avgprefix_Impr = d3.formatPrefix(avgImpressions);
			var avgprefixSymbol_Impr = avgprefix_Impr.symbol;
			var avgprefixScale_Impr = avgprefix_Impr.scale(avgImpressions);

			$('#avgprefixImprSymbolSpan').html(avgprefixSymbol_Impr);

			//Sentiment
			var avgprefix_lastSentiment = d3.formatPrefix(avgSentimentPrevious);
			var avgprefixSymbol_lastSentiment = avgprefix_lastSentiment.symbol;
			var avgprefixScale_lastSentiment = avgprefix_lastSentiment.scale(avgSentimentPrevious);

			var avgprefix_Sentiment = d3.formatPrefix(avgSentiment);
			var avgprefixSymbol_Sentiment = avgprefix_Sentiment.symbol;
			var avgprefixScale_Sentiment = avgprefix_Sentiment.scale(avgSentiment);

			//$('#avgprefixImprSymbolSpan').html(avgprefixSymbol_Impr);

			//var avgmentionTicker = new countUp("mentionsAvg", avgBuzzPrevious, avgBuzz, 0, 10);
			//var avgimprTicker = new countUp("impressionsAvg", avgImprPrevious, avgImpressions, 0, 10);
			//var avgmentionTicker = new countUp("mentionsAvg", avgprefixScale_lastMentions, avgprefixScale_Mentions, 1, 10);
			var avgmentionTicker = new countUp("mentionsAvg", avgprefixScale_lastMentions, avgprefixScale_Mentions, decimalPointHeader(avgBuzz), 10);
			var avgimprTicker = new countUp("impressionsAvg", avgprefixScale_lastImpr, avgprefixScale_Impr, 0, 10);
			var avgsentimentTicker = new countUp("uniqueAuthorsAvg", avgSentimentPrevious, avgSentiment, 0, 10);
			avgmentionTicker.start();
			avgimprTicker.start();
			avgsentimentTicker.start();

			// Differences
			// now, have countup transition to
			console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
			var percentFormat = d3.format("%");
			
			//var buzzAvgDifferenceNow = percentFormat((lastElementBuzz.value-avgBuzz)/avgBuzz)
			//var buzzAvgDifferenceNow = (lastElementBuzz.value-avgBuzz)/avgBuzz
			var buzzAvgDifferenceNow = d3.round(((lastElementBuzz.value-avgBuzz)/avgBuzz)*100)
			console.log(buzzAvgDifferenceNow)

			var imprAvgDifferenceNow = d3.round(((lastElementImpressions.value-avgImpressions)/avgImpressions)*100)
			console.log(imprAvgDifferenceNow)

			var sentimentAvgDifferenceNow = d3.round(lastElementSentiment.value)-d3.round(avgSentiment)
			console.log(sentimentAvgDifferenceNow)

			// before, what value is countup transitioning from
			//var buzzAvgDifferenceBefore = percentFormat((secondLastElementBuzz.value-avgBuzzPrevious)/avgBuzzPrevious)
			var buzzAvgDifferenceBefore = d3.round(((secondLastElementBuzz.value-avgBuzzPrevious)/avgBuzzPrevious)*100)
			//console.log(secondLastElementBuzz.value)
			//console.log(avgBuzzPrevious)
			console.log(buzzAvgDifferenceBefore)

			var imprAvgDifferenceBefore = d3.round(((secondLastElementImpressions.value-avgImprPrevious)/avgImprPrevious)*100)
			console.log(imprAvgDifferenceBefore)

			var sentimentAvgDifferenceBefore = d3.round(secondLastElementSentiment.value)-d3.round(avgSentimentPrevious)
			console.log(sentimentAvgDifferenceBefore)

			var avgDiffMentionTicker = new countUp("avgDiffMentions", buzzAvgDifferenceBefore, buzzAvgDifferenceNow, 0, 10);
			var avgDiffImprTicker = new countUp("avgDiffImpr", imprAvgDifferenceBefore, imprAvgDifferenceNow, 0, 10);
			var avgDiffSentimentTicker = new countUp("avgDiffSentiment", sentimentAvgDifferenceBefore, sentimentAvgDifferenceNow, 0, 10);
			avgDiffMentionTicker.start();
			avgDiffImprTicker.start();
			avgDiffSentimentTicker.start();

			// manage colors of % differences, toggle between red and green
			$('#avgDiffMentions').css('color', function(){
			    //if( $( "#avgDiffMentions" ).html() > 0) {
				if( buzzAvgDifferenceNow > 0) {
				    return "#2ECC40"
				} else if( buzzAvgDifferenceNow < 0) {
				    return "#FF4136"
				} else {
					return "#848484"
				}
			});

			$('#avgDiffImpr').css('color', function(){
			    //if( $( "#avgDiffMentions" ).html() > 0) {
				if( imprAvgDifferenceNow > 0) {
				    return "#2ECC40"
				} else if( imprAvgDifferenceNow < 0) {
				    return "#FF4136"
				} else {
					return "#848484"
				}
			});

			$('#avgDiffSentiment').css('color', function(){
			    //if( $( "#avgDiffMentions" ).html() > 0) {
				if( sentimentAvgDifferenceNow > 0) {
				    return "#2ECC40"
				} else if( sentimentAvgDifferenceNow < 0) {
				    return "#FF4136"
				} else {
					return "#848484"
				}
			});

			// sync up color of percent signs
			$('#avgDiffMentionPercentSign').css('color', function(){
				if( buzzAvgDifferenceNow > 0) {
				    return "#2ECC40"
				} else if( buzzAvgDifferenceNow < 0) {
				    return "#FF4136"
				} else {
					return "#848484"
				}
			});

			$('#avgDiffImprPercentSign').css('color', function(){
				if( imprAvgDifferenceNow > 0) {
				    return "#2ECC40"
				} else if( imprAvgDifferenceNow < 0) {
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

			// %%%%%%%%%%%% END of TOTALS text %%%%%%%%%%%%


			// @@@@@@@@@@@@ STREAM @@@@@@@@@@@@
		/*
			//clear out ul
			//$("#tweet-stream").empty()
			//$("#tweet-stream").html("");

			// Need to combine currentSentences and geoPhraseSentences

			var currentSentencesDocs = data.value.currentSentences.documents
			var currentGeoPhrasesDocs = data.value.geoPhraseSentences.documents

			var docs = currentSentencesDocs.concat(currentGeoPhrasesDocs)

			var currentSentencesSentences = data.value.currentSentences.sentences
			var currentGeoPhrasesSentences = data.value.geoPhraseSentences.sentences
			
			var sents = currentSentencesSentences.concat(currentGeoPhrasesSentences)

			//var docs = data.value.currentSentences.documents
			//var docs = data.value.geoPhraseSentences.documents
			console.log(docs)
			//var sents = data.value.currentSentences.sentences
			//var sents = data.value.geoPhraseSentences.sentences
			console.log(sents)

			var sentenceDataWhole = docs.map(function(_,i) {
			  	return {
				  	documents: docs[i],
				  	sentences: sents[i]
			  	}
			});
			console.log('stream stream stream')
			console.log(sentenceDataWhole)

			function replaceURLWithHTMLLinks(text) {
                var exp = /(\b(www\.|http\:\/\/)\S+\b)/ig;
                return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
            }

			var sentenceData = sentenceDataWhole.map(function(item) {
				var imgAuthorID = item.documents.properties.authorID
				var	usernameID = item.documents.properties.author
				return {
					id: parseInt(item.documents.properties.docID),
					authorid: parseInt(item.documents.properties.authorID),
					datetime: item.documents.properties.datetime,
					displayname: item.documents.properties.authorName,
					username: item.documents.properties.author,
					text: replaceURLWithHTMLLinks(item.sentences.properties.text),
					//imgsrc: "https://pbs.twimg.com/profile_images/" + imgAuthorID + "/profilePic_bigger.jpg",
					imgsrc: "http://twitter.com/api/users/profile_image/" + usernameID + "?size=bigger",
					location: item.documents.properties.authorGeoInfo,
					klout: item.documents.properties.klout,
					followerCount: item.documents.properties.authorFollower

				}
			})
			console.log('SENTENCEDATA !!!!!!!')
			console.log(sentenceData)
			
			// Shuffle data bc aggregating two data sets ( data.value.currentSentences AND data.value.geoPhraseSentences)
			//var shuffledSentenceData = _.shuffle(sentenceData)
			var shuffledSentenceData = _(sentenceData).sortBy("authorid")
			//var shuffledSentenceData = _(sentenceData).sortBy("datetime")

			//render stream

			kickoffStream();
			function kickoffStream() {
				//console.log('hi')
				//streamingdata(sentenceData);
				streamingdata(shuffledSentenceData);
			};

			kickoffStreamTwo();
			function kickoffStreamTwo() {
				//console.log('hi')
				//streamingdata(sentenceData);
				streamingdataTwo(shuffledSentenceData);
			};

			kickoffStreamThree();
			function kickoffStreamThree() {
				//console.log('hi')
				//streamingdata(sentenceData);
				streamingdataThree(shuffledSentenceData);
			};
		*/
/*
			$("#tweet-stream").ticker("stop");
			//setTimeout(function(){
				$(function() {
					$("#tweet-stream").ticker("start");
					$("#tweet-stream").ticker({
						//scrollTime: 4000,
						//fadeTime: 2000,
						mouseOffTimeout: 5000
						//fixContainer: true
					})
				})
			//}, 2000);
*/
/* vticker lib
			$(function(){
		        $('#news-container').vTicker({ 
		            //speed: 700,
		            //pause: 4000,
		            speed: 1500,
		            pause: 5000,
		            animation: 'fade',
		            mousePause: true,
		            showItems: 6
		        });
		    });
*/
/*
		    $(function() {
				var i = 0;
				$("#news-container").ticker({
					initialTimeout: 1000,
					mouseOnTimeout: 4000,
					mouseOffTimeout: 3000,
					scrollTime: 1200,
					fadeTime: 1000,
                    fixContainer: true,
					nextItem: function(lastItem) {
						return lastItem;
					}
				});
			})
*/		    
		         //OR MAYBE PUT IN THE poneStream function ??

			// @@@@@@@@@@@@ END of STREAM @@@@@@@@@@@@


}// end of handleUpdate(data) function

