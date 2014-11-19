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
			scrollTime: 9800000,
			//fadeTime: 2000,
			mouseOffTimeout: 5000
			//fixContainer: true
		});
		$("#tweet-stream-three").ticker({
			scrollTime: 9800000,
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
       { analysis: "DocumentCounts", timeSpan: 7200000, bucketTimeSpan: 300000 },
       { analysis: "MetricSeries", seriesName: "Impressions", resultTag: "MetricSeries_Impressions", timeSpan: 86400000 },
       { analysis: "MetricSeries", seriesName: "NetSentiment", resultTag: "MetricSeries_NetSentiment" },
       { analysis: "TopDocuments", sort: "datetime", timeSpan: 3600000 },
       { analysis: "TopDocuments", sort: "impressions", resultTag: "TopOriginalDocumentsImpressions", timeSpan: 3600000 },
       { analysis: "TopDocuments", sort: "shares", resultTag: "TopOriginalDocumentsShares", timeSpan: 3600000 }
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
	//var url = "data-query.jsp"
	//var url = "dataOne.json"
	//var url = "https://w402.netbase.com/streamserver/pulse/request?id=a2ec76bb-556e-40da-bf65-3ec2f99c112b&dataSpec={data:[{analysis:%20%22TopUrls%22}]}"
	//var url = "https://w402.netbase.com/streamserver/pulse/request?id=a2ec76bb-556e-40da-bf65-3ec2f99c112b"
	//var url = "https://w402.netbase.com/streamserver/pulse/request?id=a2ec76bb-556e-40da-bf65-3ec2f99c112b&dataSpec={data:[{analysis:%22BandedMetricSeries%22},{analysis:%22MetricSeries_NetSentiment%22},{analysis:%22MetricSeries_Impressions%22},{analysis:%22TopOriginalDocuments%22,sorted:%22datetime%22},{analysis:%22TopOriginalDocuments%22,sorted:%22impressions%22,resultTag:%22TopOriginalDocumentsImpressions%22},{analysis:%22TopOriginalDocuments%22,sorted:%22shares%22,resultTag:%22TopOriginalDocumentsShares%22}]}"
	//var url = "https://w402.netbase.com/streamserver/pulse/request?id=a2ec76bb-556e-40da-bf65-3ec2f99c112b&dataSpec={data:[{analysis:%22BandedMetricSeries%22},{analysis:%22MetricSeries_Impressions%22},{analysis:%22MetricSeries_NetSentiment%22},{analysis:%22TopOriginalDocuments%22,sorted:%22datetime%22},{analysis:%22TopOriginalDocuments%22,sorted:%22impressions%22,resultTag:%22TopOriginalDocumentsImpressions%22},{analysis:%22TopOriginalDocuments%22,sorted:%22shares%22,resultTag:%22TopOriginalDocumentsShares%22}]}"
	//var url = "https://w402.netbase.com/streamserver/pulse/request?id=a2ec76bb-556e-40da-bf65-3ec2f99c112b&dataSpec={data:[{analysis:%22BandedMetricSeries%22},{analysis:%22MetricSeries%22,seriesName:%22Impressions%22},{analysis:%22MetricSeries%22,seriesName:%22NetSentiment%22},{analysis:%22TopOriginalDocuments%22,sorted:%22datetime%22},{analysis:%22TopOriginalDocuments%22,sorted:%22impressions%22,resultTag:%22TopOriginalDocumentsImpressions%22},{analysis:%22TopOriginalDocuments%22,sorted:%22shares%22,resultTag:%22TopOriginalDocumentsShares%22}]}"
	//var url = "https://w402.netbase.com/streamserver/pulse/request?id=a2ec76bb-556e-40da-bf65-3ec2f99c112b&dataSpec={data:[{analysis:%22BandedMetricSeries%22},{analysis:%22MetricSeries%22,seriesName:%22Impressions%22,%22resultTag%22:%22MetricSeries_Impressions%22},{analysis:%22MetricSeries%22,seriesName:%22NetSentiment%22,%22resultTag%22:%22MetricSeries_NetSentiment%22},{analysis:%22TopOriginalDocuments%22,sorted:%22datetime%22},{analysis:%22TopOriginalDocuments%22,sorted:%22impressions%22,resultTag:%22TopOriginalDocumentsImpressions%22},{analysis:%22TopOriginalDocuments%22,sorted:%22shares%22,resultTag:%22TopOriginalDocumentsShares%22}]}"
	// working url below
	//var url = "https://w402.netbase.com/streamserver/pulse/request?id=a2ec76bb-556e-40da-bf65-3ec2f99c112b&dataSpec={data:[{analysis:%22BandedMetricSeries%22,bucketTimeSpanMins:60},{analysis:%22DocumentCounts%22},{analysis:%22MetricSeries%22,seriesName:%22Impressions%22,%22resultTag%22:%22MetricSeries_Impressions%22},{analysis:%22MetricSeries%22,seriesName:%22NetSentiment%22,%22resultTag%22:%22MetricSeries_NetSentiment%22},{analysis:%22TopDocuments%22,sorted:%22datetime%22},{analysis:%22TopDocuments%22,sorted:%22impressions%22,resultTag:%22TopOriginalDocumentsImpressions%22},{analysis:%22TopDocuments%22,sorted:%22shares%22,resultTag:%22TopOriginalDocumentsShares%22}]}"
	//var url = "https://w402.netbase.com/streamserver/pulse/request"
	
	var url = "https://app.netbase.com/cb/pulse/api/request"
	+ "?id=" + _id 
	+ "&dataSpec=" + JSON.stringify(dataSpec);
	
	/*
	var url = "https://dev-app.netbase.com/cb/pulse/api/request"
    //+ "?id=" + _id 
    + "?id=df6ea4c5-127a-4608-881a-30e7abfd9874"
	+ "&dataSpec=" + JSON.stringify(dataSpec);
	*/
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
	        //console.log(jsResult)
	        
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
	/*
		window.ds = new Miso.Dataset({
	        importer : Miso.Dataset.Importers.GoogleSpreadsheet,
	        parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
	        //key : "0Asnl0xYK7V16dFpFVmZUUy1taXdFbUJGdGtVdFBXbFE",
	        key: "0AlyjyLvh1CejdENKNTNvUEc4TkwyMF83d3JxRW5yWWc",
	        worksheet : "1"
	    });
		window.ds.fetch({ 
	        success : function() {
	        //console.log(ds.columnNames());
	            console.log('google docs successfully connected');
	            data = [];
	            this.each(function(row) { data.push(row); });
	            console.log(data)
	            var firstStory = data[0].storyOne
		        var secondStory = data[0].storyTwo
		        var thirdStory = data[0].storyThree
		        
		        //$( "#storyOne" ).html('')// + "<br>");
		        //$( "#storyTwo" ).html('')// + "<br>");
		        //$( "#storyThree" ).html('');
		        
		        //$( "#storyOne" ).append(firstStory)// + "<br>");
		        //$( "#storyTwo" ).append(secondStory)// + "<br>");
		        //$( "#storyThree" ).append(thirdStory );
		        
		        $( ".storyOne" ).html(firstStory)
		        $( ".storyTwo" ).html(secondStory)
		        $( ".storyThree" ).html(thirdStory)
	        },
	        error : function() {
	            console.log("Are you sure you are connected to the internet?");
	        }
	    }); //end of ds fetch
	*/
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

			newBarData = data.value.value.TopPhrases.phrases;
			//newBarData01 = data.value.phrases;
			//newBarData02 = dataTwo.value.phrases;
			//newBarData03 = dataThree.value.phrases;
			console.log('$$$$$$$$$$$$$$$$$$$$$$$$ BAR DATA')
			console.log(newBarData)

			renderTopicBarChart();

			function renderTopicBarChart() {
				barChartObject.redrawBars(newBarData);
			}

			// ************ End of BAR ************  
		*/

			// ++++++++++++ SPARKLINES ++++++++++++
	
			// NEW
			var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;
		/*
			// mentions, sparkline
			var mentionsSparklineData = data.value.value.MetricSeries.set;

			var chart = timeSeriesChartMentions()
    			//.x(function(d) { return formatDate.parse(d.date); })
    			.x(function(d) {return parseDate(moment(+d.date).format("DD-MMM-YY HH:mm:ss")) })
    			.y(function(d) { return +d.value; });

    		function callMentionsSparkline() {
				d3.select("#sparklineOne")
	      			.datum(mentionsSparklineData)
	      			.call(chart);
      		}
      		callMentionsSparkline();
		*/
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

			/*
			var metrics = data.value.value.BandedMetricSeries.set.map(function(item){
				return {
					zdifference: 'pone'
				};
			});
			*/
			/*
			var metrics = mentionsSparklineData.forEach(function() {
				mentionsSparklineData.zdifference = function() { 
					if mentionsSparklineData.value > mentionsSparklineData.high
		      			if (valueMetric[i] > highMetric[i]) {
				  			return valueMetric[i] - highMetric[i] 
				  		} 
				  		else if (valueMetric[i] < lowMetric[i]) {
				  			return lowMetric[i] - valueMetric[i]
				  		}
				  		else {
				  			return 0
				  		}
				}
			})
			console.log(metrics);
			*/

			/*
			var dataey = [{'name':'dan', 'high':10, 'low':2},{'name':'ruthie', 'high':20, 'low':17}]
			//var data = data.value.value.BandedMetricSeries.set
			for (var i=0; i < dataey.length; i++) {
				//console.log(data[i])
				dataey[i].difference = dataey[i].high - dataey[i].low
			}
			console.log(dataey)
			*/

			var chart = timeSeriesBandedChart()
	    		.x(function(d) {return parseDate(moment(d.date).format("DD-MMM-YY HH:mm:ss")) })
	    		.y1(function(d) { return +d.high; })
	    		.y0(function(d) {return +d.low; })
	    		.y(function(d) {return +d.value; })
	    		.cx(function(d) {return parseDate(moment(+d.date).format("DD-MMM-YY HH:mm:ss")) })
	    		.cy(function(d) {return +d.value; });

	    	function callMentionsBandedLine() {
				d3.select("#sparklineOne")
	      			.datum(mentionsSparklineData)
	      			.call(chart);
      		}
      		callMentionsBandedLine();

			// impressions
			var impressionSparklineData = data.value.value.MetricSeries_Impressions.set;
			//impressions block visual
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
      		//var sentimentSparklineData = data.value.value.MetricSeries_NetSentiment.set;
      		var sentimentSparklineData = data.value.value.DocumentCounts.series;
      		console.log(sentimentSparklineData)

      		var chartSentiment = timeSeriesChart()
    			//.x(function(d) { return formatDate.parse(d.date); })
    			//.x(function(d) {return parseDate(moment(+d.date).format("DD-MMM-YY HH:mm:ss")) })
    			.x(function(d) {return parseDate(moment(+d.time).format("DD-MMM-YY HH:mm:ss")) })
    			//.y(function(d) { return +d.value; });
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

			// last time period
			/*
			var avgBuzz = d3.mean(mentionsSparklineData, function(d) {
				return d.value;
			})
			//console.log(avgBuzz)
			*/
			var lastBandedDataPoint = bandedData[bandedData.length - 1]
			var avgBuzz = lastBandedDataPoint.average;

			var avgImpressions = d3.mean(impressionSparklineData, function(d) {
				return d.value;
			})
			//console.log(avgImpressions)

			var avgSentiment = d3.mean(sentimentSparklineData, function(d) {
				return d.shares;
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
				return d.shares;
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

			// LAST Element
			// mentions
			var lastElementBuzz = mentionsSparklineData[mentionsSparklineData.length - 1];
			console.log('^^^^^^^^^^^^^')
			console.log(lastElementBuzz)

			// impressions
			var lastElementImpressions = impressionSparklineData[impressionSparklineData.length - 1];
			console.log('^^^^^^^^^^^^^')
			console.log(lastElementImpressions)
		
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

			// total shares RETWEETS *****
			//var docsOriginalData = data.value.value.contentSummary.documents.numOrigDocs;
			//var docsSharedData = data.value.value.contentSummary.documents.numShareDocs;
			//console.log(docsOriginalData)
			//console.log(docsSharedData)

				// SOOO Screwed up because have to get an hour; half the data
				//previous time period avg
				var previousRetweetTotalSlice = sentimentSparklineData.slice(sentimentSparklineData.length/2-1,sentimentSparklineData.length-1)
				//console.log(previousBuzzAverage)
				var previousRetweetTotal = d3.sum(previousRetweetTotalSlice, function(d) {
					return d.shares;
				})
				console.log('++++++++++++++++++++++++++')
				console.log(previousRetweetTotal)

				//current time period
				var retweetTotalSlice = sentimentSparklineData.slice(sentimentSparklineData.length/2,sentimentSparklineData.length)
				//console.log(previousBuzzAverage)
				var retweetTotal = d3.sum(retweetTotalSlice, function(d) {
					return d.shares;
				})
				console.log('++++++++++++++++++++++++++')
				console.log(retweetTotal)

				var docsSharedData = data.value.value.contentSummary.documents.numShareDocs;
				console.log('==========================')
				console.log(docsSharedData)

			//previous value for transition
			/*
			var prefix_LastAuthors = d3.formatPrefix(docsOriginalData);
			var prefixScale_LastAuthors = prefix_LastAuthors.scale(docsOriginalData)

			var prefix_Authors = d3.formatPrefix(docsSharedData);
			var prefixSymbol_Authors = prefix_Authors.symbol;
			var prefixScale_Authors = prefix_Authors.scale(docsSharedData)
			*/
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

			//var mentionTicker = new countUp("mentionsTotal", secondLastElementBuzz.buzz, lastElementBuzz.buzz, 0, 10)//data.waitTime);
			//var imprTicker = new countUp("impressionsTotal", secondLastElementHours.impressions, lastElementHours.impressions, 0, 10);
			var mentionTicker = new countUp("mentionsTotal", prefixScale_SecondLastMentions, prefixScale_LastMentions, decimalPointHeader(lastElementBuzz.value), 10)//data.waitTime)//10);
			var imprTicker = new countUp("impressionsTotal", prefixScale_SecondLastImpr, prefixScale_LastImpr, 0, 10)//data.waitTime)// 10);
			//var sharesTicker = new countUp("uniqueAuthorsTotal", docsOriginalData, docsSharedData, 0, 10);
			var sharesTicker = new countUp("uniqueAuthorsTotal", prefixScale_LastAuthors, prefixScale_Authors, decimalPointHeader(retweetTotal), 10)//data.waitTime)//10);
			mentionTicker.start();
			imprTicker.start();
			sharesTicker.start();

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

			//Shares
			var avgprefix_lastShares = d3.formatPrefix(avgSentimentPrevious);
			var avgprefixSymbol_lastShares = avgprefix_lastShares.symbol;
			var avgprefixScale_lastShares = avgprefix_lastShares.scale(avgSentimentPrevious);

			var avgprefix_Shares = d3.formatPrefix(avgSentiment);
			var avgprefixSymbol_Shares = avgprefix_Shares.symbol;
			var avgprefixScale_Shares = avgprefix_Shares.scale(avgSentiment);

			//$('#avgprefixSentimentSymbolSpan').html(avgprefixSymbol_Shares);

			// total shares
			var docsOriginalData = data.value.value.contentSummary.documents.numOrigDocs;
			var docsSharedData = data.value.value.contentSummary.documents.numShareDocs;

			//var mentionTicker = new countUp("mentionsTotal", secondLastElementBuzz.buzz, lastElementBuzz.buzz, 0, 10)//data.waitTime);
			//var imprTicker = new countUp("impressionsTotal", secondLastElementHours.impressions, lastElementHours.impressions, 0, 10);
			var avgmentionTicker = new countUp("mentionsAvg", avgprefixScale_lastMentions, avgprefixScale_Mentions, decimalPointHeader(avgBuzz), 10);
			var avgimprTicker = new countUp("impressionsAvg", avgprefixScale_lastImpr, avgprefixScale_Impr, 0, 10);
			//var avgsharesTicker = new countUp("uniqueAuthorsAvg", avgprefixScale_lastShares, avgprefixScale_Shares, 0, 10);
			avgmentionTicker.start();
			avgimprTicker.start();
			//avgsharesTicker.start();

			// %%%%%%%%%%%% END of TOTALS text %%%%%%%%%%%%




      	/*
			// OLD
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

			// ++++++++++++ END of SPARKLINES ++++++++++++
		*/

		/*
			// $$$$$$$$$$$$ GEO $$$$$$$$$$$$

			var sorted = _(data.value.geos).sortBy("name");
			//console.log(sorted)

			//var keys = _.range(1, 51)
			var keys = _.range(1, 9)
			//console.log(keys)

			var values = _.pluck(sorted, "delta")
			//console.log(values)

			var newCHstatedata = _.object(keys, values)
			console.log('CH DATA')
			console.log(newCHstatedata)

			// geo map
			d3.csv("../lib/geo/airports.csv", function(airports) {
				//d3.json("geo/CHstatedata116.json", function(data) {
					d3.json("../lib/geo/us-states.json", function(collection) {

						console.log('GEO DATA')
						var geoData = data.value.geos;
						console.log(geoData)
						//console.log('LOOKUP DATA')
						var geoPolygonFile = collection.features; //.properties.name 
						//console.log(geoPolygonFile[0].properties.name) //Alabama

						var originalStateDataLookup = {}
						//originalStateDataLookup.name = 'dan'
						for (var n in geoData) {
							//console.log(geoData[n].name)
							elemName = geoData[n].name
							elemValue = geoData[n].now
							elemDelta = geoData[n].perCapitaCount
							//var result = $.grep(geoData, function(e){ return e.name == elemName; });
							obj = _.find(geoPolygonFile, function(obj) { return obj.properties.name == elemName })
							//console.log(obj)
							//console.log(obj.id)
							//console.log(elemName + ': ' + elemValue + ', ID: ' + obj.id)
							//console.log(obj.id + ': ' + elemValue)
							//originalStateDataLookup[obj.id] = elemValue;
							originalStateDataLookup[obj.id] = elemDelta;
						}
						console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
						console.log(originalStateDataLookup)
						//need to remove DC because cant show it
						//always will be #9 in data originalStateDataLookup
						//may need to also remove Alaska and Hawaii as well
						//originalStateDataLookup.splice(9,1)

						var keysWithValues = _.keys(originalStateDataLookup)
						console.log(keysWithValues)

						allStates = _.range(1,52)
						missingStates = []
						
						//$.inArray(value, array)
						for (var val in allStates) {
							curVal = allStates[val].toString()
							console.log(curVal)
							if ($.inArray(curVal, keysWithValues) === -1) {
								missingStates.push(curVal)
							}
						}
						console.log(missingStates);

						var arr2Obj = {};
						for (var i=0; i<missingStates.length; i=i+1){
							arr2Obj[missingStates[i]] = 0;
						}
						console.log(arr2Obj)

						_.extend(originalStateDataLookup, arr2Obj)
						console.log(originalStateDataLookup)

						var dataNoDC = _.omit(originalStateDataLookup, '9') //Washington DC
						var dataNoDCHawaii = _.omit(dataNoDC, '12') //Hawaii
						var geoDataNoDCHawaiiAlaska = _.omit(dataNoDCHawaii, '2') //Alaska
						console.log(geoDataNoDCHawaiiAlaska)

						renderGeoMap();

						function renderGeoMap() {
							//geomap(airports, originalStateDataLookup, collection);
							//geoObject.redrawGeo(airports, geoDataNoDc, collection);
							geoObject.redrawGeo(airports, geoDataNoDCHawaiiAlaska, collection);
						}
					})
				//})
			}) 
		*/
		/*
			// Geo Magnitude Text

			topStateData = data.value.geos[0]
			secondStateData = data.value.geos[1]
			thirdStateData = data.value.geos[2]

			topStates(topStateData, secondStateData, thirdStateData);
			*/
			// $$$$$$$$$$$$ END of GEO $$$$$$$$$$$$

		/*
			// %%%%%%%%%%%% TOTALS text %%%%%%%%%%%%
			
			//find averages
			var avgBuzz = d3.mean(mentionsSparklineData, function(d) {
				return d.buzz;
			})
			//console.log(avgBuzz)

			var avgImpressions = d3.mean(resultHours, function(d) {
				return d.impressions;
			})
			//console.log(avgImpressions)

			var avgSentiment = d3.mean(resultHours, function(d) {
				return d.netsentiment;
			})

			// Find second to last element
			//minutes, buzz
			var secondLastElementBuzz = resultMinutes[resultMinutes.length - 2];
			console.log('^^^^^^^^^^^^^')
			console.log(secondLastElementBuzz)

			//hours, impr and sentiment
			var secondLastElementHours = resultHours[resultHours.length - 2];
			console.log('^^^^^^^^^^^^^')
			console.log(secondLastElementHours)

			// Last Element for hours and minutes
			//minutes, buzz
			var lastElementBuzz = resultMinutes[resultMinutes.length - 1];
			console.log('^^^^^^^^^^^^^')
			console.log(lastElementBuzz)

			//hours, impr and sentiment
			var lastElementHours = resultHours[resultHours.length - 1];
			console.log('^^^^^^^^^^^^^')
			console.log(lastElementHours)

			//previous time period avg
			var previousBuzzAverage = resultMinutes.slice(0,resultMinutes.length-1)
			//console.log(previousBuzzAverage)
			var avgBuzzPrevious = d3.mean(previousBuzzAverage, function(d) {
				return d.buzz;
			})

			var previousImprAverage = resultHours.slice(0,resultHours.length-1)
			//console.log(previousBuzzAverage)
			var avgImprPrevious = d3.mean(previousImprAverage, function(d) {
				return d.impressions;
			})

			var previousSentimentAverage = resultHours.slice(0,resultHours.length-1)
			//console.log(previousBuzzAverage)
			var avgSentimentPrevious = d3.mean(previousSentimentAverage, function(d) {
				return d.netsentiment;
			})

			var prefix_lastMentions = d3.formatPrefix(secondLastElementBuzz.buzz);
			var prefixSymbol_lastMentions = prefix_lastMentions.symbol;
			var prefixScale_lastMentions = prefix_lastMentions.scale(secondLastElementBuzz.buzz);

			var prefix_Mentions = d3.formatPrefix(lastElementBuzz.buzz)
			var prefixSymbol_Mentions = prefix_Mentions.symbol;
			var prefixScale_Mentions = prefix_Mentions.scale(lastElementBuzz.buzz)

			$('#prefixMentionsSymbolSpan').html(prefixSymbol_Mentions);

			var prefix_lastImpr = d3.formatPrefix(secondLastElementHours.impressions);
			var prefixSymbol_lastImpr = prefix_lastImpr.symbol;
			var prefixScale_lastImpr = prefix_lastImpr.scale(secondLastElementHours.impressions);

			var prefix_Impr = d3.formatPrefix(lastElementHours.impressions)
			var prefixSymbol_Impr = prefix_Impr.symbol;
			var prefixScale_Impr = prefix_Impr.scale(lastElementHours.impressions)

			$('#prefixImprSymbolSpan').html(prefixSymbol_Impr);

			//var mentionTicker = new countUp("mentionsTotal", secondLastElementBuzz.buzz, lastElementBuzz.buzz, 0, 10)//data.waitTime);
			//var imprTicker = new countUp("impressionsTotal", secondLastElementHours.impressions, lastElementHours.impressions, 0, 10);
			var mentionTicker = new countUp("mentionsTotal", prefixScale_lastMentions, prefixScale_Mentions, 0, 10)//data.waitTime);
			var imprTicker = new countUp("impressionsTotal", prefixScale_lastImpr, prefixScale_Impr, 2, 10);
			var sentimentTicker = new countUp("uniqueAuthorsTotal", secondLastElementHours.netsentiment, lastElementHours.netsentiment, 0, 10);
			mentionTicker.start();
			imprTicker.start();
			sentimentTicker.start();

			//Averages

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

			//var avgmentionTicker = new countUp("mentionsAvg", avgBuzzPrevious, avgBuzz, 0, 10);
			//var avgimprTicker = new countUp("impressionsAvg", avgImprPrevious, avgImpressions, 0, 10);
			var avgmentionTicker = new countUp("mentionsAvg", avgprefixScale_lastMentions, avgprefixScale_Mentions, 0, 10);
			var avgimprTicker = new countUp("impressionsAvg", avgprefixScale_lastImpr, avgprefixScale_Impr, 1, 10);
			var avgsentimentTicker = new countUp("uniqueAuthorsAvg", avgSentimentPrevious, avgSentiment, 0, 10);
			avgmentionTicker.start();
			avgimprTicker.start();
			avgsentimentTicker.start();

			// %%%%%%%%%%%% END of TOTALS text %%%%%%%%%%%%
		*/


			// @@@@@@@@@@@@ STREAM @@@@@@@@@@@@

			//clear out ul
			//$("#tweet-stream").empty()
			//$("#tweet-stream").html("");

			// Need to combine currentSentences and geoPhraseSentences

		/*
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
		*/
			$("#tweet-stream").empty()
			$("#tweet-stream").html("");
			$("#tweet-stream-two").empty()
			$("#tweet-stream-two").html("");
			$("#tweet-stream-three").empty()
			$("#tweet-stream-three").html("");

			console.log('$$$$$$$$$$$$$$$$$$$')
			var sentenceDataWhole = data.value.value.TopDocuments.docs 

			function replaceURLWithHTMLLinks(text) {
                var exp = /(\b(www\.|http\:\/\/)\S+\b)/ig;
                return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
            }

            var sentenceData = sentenceDataWhole.map(function(item) {
				var	usernameID = item.doc.properties.author;
				var imgUrl = item.doc.properties.authorAvatarUrl;
				if(!imgUrl){
					imgUrl = "../lib/profile-default.jpg";
				}
				return {
					//id: parseInt(item.doc.properties.docID),
					id: item.doc.properties.docID,
					authorid: parseInt(item.doc.properties.authorID),
					datetime: item.doc.properties.datetime,
					displayname: item.doc.properties.authorName,
					username: item.doc.properties.author,
					//text: replaceURLWithHTMLLinks(item.html),
					text: item.html,
					//imgsrc: "https://pbs.twimg.com/profile_images/" + imgAuthorID + "/profilePic_bigger.jpg",
					imgsrc: imgUrl,
					location: item.doc.properties.authorGeoInfo,
					klout: item.doc.properties.klout,
					followerCount: item.doc.properties.authorFollower,
					profileUrl: item.doc.properties.authorLink,
					tweetUrl: item.doc.properties.url,
					// added for twitter compliance
					mentionedUrls: item.doc.properties.mentionedUrls,
					lastRetweetAuthor: item.lastRetweetAuthor
				}
			})
			console.log('SENTENCEDATA !!!!!!!')
			console.log(sentenceData)
		/*
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
		*/
			
			// Shuffle data bc aggregating two data sets ( data.value.currentSentences AND data.value.geoPhraseSentences)
			//var shuffledSentenceData = _.shuffle(sentenceData)
			var shuffledSentenceData = _(sentenceData).sortBy("authorid")
			//var shuffledSentenceData = _(sentenceData).sortBy("datetime")

			//render stream
			/*
			renderStream();

			function renderStream() {
				streamText();
			}
			*/

			var sentenceDataWholeImpr = data.value.value.TopOriginalDocumentsImpressions.docs 
            var sentenceDataImpr = sentenceDataWholeImpr.map(function(item) {
				var	usernameID = item.doc.properties.author;
				var imgUrl = item.doc.properties.authorAvatarUrl;
				if(!imgUrl){
					imgUrl = "../lib/profile-default.jpg";
				}
				return {
					//id: parseInt(item.doc.properties.docID),
					id: item.doc.properties.docID,
					authorid: parseInt(item.doc.properties.authorID),
					datetime: item.doc.properties.datetime,
					displayname: item.doc.properties.authorName,
					username: item.doc.properties.author,
					//text: replaceURLWithHTMLLinks(item.html),
					text: item.html,
					//imgsrc: "https://pbs.twimg.com/profile_images/" + imgAuthorID + "/profilePic_bigger.jpg",
					imgsrc: imgUrl,
					location: item.doc.properties.authorGeoInfo,
					klout: item.doc.properties.klout,
					followerCount: item.doc.properties.authorFollower,
					impressions: item.totalImpressions,
					shares: item.totalShares,
					profileUrl: item.doc.properties.authorLink,
					tweetUrl: item.doc.properties.url,
					// added for twitter compliance
					mentionedUrls: item.doc.properties.mentionedUrls,
					lastRetweetAuthor: item.lastRetweetAuthor
				}
			})
			console.log('SENTENCEDATA !!!!!!!')
			console.log(sentenceDataImpr)
			var shuffledSentenceDataImpr = _(sentenceDataImpr).sortBy("authorid")


			var sentenceDataWholeShares = data.value.value.TopOriginalDocumentsShares.docs 
			var sentenceDataShares = sentenceDataWholeShares.map(function(item) {
				var	usernameID = item.doc.properties.author;
				var imgUrl = item.doc.properties.authorAvatarUrl;
				if(!imgUrl){
					imgUrl = "../lib/profile-default.jpg";
				}
				return {
					//id: parseInt(item.doc.properties.docID),
					id: item.doc.properties.docID,
					authorid: parseInt(item.doc.properties.authorID),
					datetime: item.doc.properties.datetime,
					displayname: item.doc.properties.authorName,
					username: item.doc.properties.author,
					//text: replaceURLWithHTMLLinks(item.html),
					text: item.html,
					//imgsrc: "https://pbs.twimg.com/profile_images/" + imgAuthorID + "/profilePic_bigger.jpg",
					imgsrc: imgUrl,
					location: item.doc.properties.authorGeoInfo,
					klout: item.doc.properties.klout,
					followerCount: item.doc.properties.authorFollower,
					impressions: item.totalImpressions,
					shares: item.totalShares,
					profileUrl: item.doc.properties.authorLink,
					tweetUrl: item.doc.properties.url,
					// added for twitter compliance
					mentionedUrls: item.doc.properties.mentionedUrls,
					lastRetweetAuthor: item.lastRetweetAuthor
				}
			})
			console.log('SENTENCEDATA !!!!!!!')
			console.log(sentenceDataShares)
			var shuffledSentenceDataShares = _(sentenceDataShares).sortBy("authorid")


			kickoffStream();
			function kickoffStream() {
				streamingdata(sentenceData);
				//streamingdata(shuffledSentenceData);
			};

			kickoffStreamTwo();
			function kickoffStreamTwo() {
				streamingdataTwo(sentenceDataImpr);
				//streamingdataTwo(shuffledSentenceDataImpr);
			};

			kickoffStreamThree();
			function kickoffStreamThree() {
				streamingdataThree(sentenceDataShares);
				//streamingdataThree(shuffledSentenceDataShares);
			};
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

