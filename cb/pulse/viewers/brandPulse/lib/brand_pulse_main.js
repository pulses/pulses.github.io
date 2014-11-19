/*
 * clone of main.js file
 * removed unwanted code and useless console prints
 */

$(window).load(function() {
	geoObject.initGeo();
	barChartObject.initBars();
	viewerSetup();
	datacall();

	
	$(function() {
		$("#tweet-stream").ticker({
			mouseOffTimeout: 5000
		});
	});

	// reload page to clean all if running for a certain time period
	//setInterval("reload_page();", 1800000); // 30 min
	setInterval(function() {
		window.location = location.href;
        console.log('PAGE REFRESHED REFRESH REEEEEEEFR ^^^^^^^^^^')
	//}, 5000)
	}, 1800000)

        $(document).foundation();

    });

    // Check to see if second image tag exists
    $(document).ready(function() {
            //if($("div#leftLogoContainer img").attr('src') == "") {
            if($("#themeLogo").attr('src') == "") {
            //if($("div#leftLogoContainer img[src=='']") {
                    //alert('img is empty')
                    $( "#themeLogo").remove();

            }
    });

    var previousValueTime; //keep this just in limbo, need to assign old data to this at end of work, but maintain after ajax call
    var viewerConfig;

    var dataSpec = {
       data: [
            { analysis: "BandedMetricSeries", bucketTimeSpanMins:60 },
            //{ analysis: "DocumentCounts", timeSpan: 7200000, bucketTimeSpan: 300000 },
            { analysis: "MetricSeries", seriesName: "Impressions", resultTag: "MetricSeries_Impressions", timeSpan: 86400000 },
            { analysis: "MetricSeries", seriesName: "NetSentiment", resultTag: "MetricSeries_NetSentiment", timeSpan: 86400000 },
            { analysis: "TopPhrases"},
            { analysis: "TopDocuments", sort: "datetime", timeSpan: 3600000 },
        //  { analysis: "PerCapitaTopGeos", timeSpan: 3600000 },
        //  { analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"Asia", timeSpan: 3600000 },
        //   { analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"Europe", timeSpan: 3600000 },
        //	{ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"South America", timeSpan: 3600000 },
        //	{ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", timeSpan: 3600000 }, //WORLD
            { analysis: "MetricSeries", seriesName: "PositiveSentiment", resultTag: "MetricSeries_PositiveSentiment", timeSpan: 86400000 },
            { analysis: "MetricSeries", seriesName: "NegativeSentiment", resultTag: "MetricSeries_NegativeSentiment", timeSpan: 86400000 }
            ]
    };

    // maybe this should go in window.load
    var viewerConfigFilesDataSpec = JSON.parse(_viewerConfig);
    if ("geoMapType" in viewerConfigFilesDataSpec) {
        console.log(viewerConfigFilesDataSpec.geoMapType)
        var geoDS = viewerConfigFilesDataSpec.geoMapType;
        if(geoDS == 'US'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", timeSpan: 3600000 })
        } else if (geoDS == 'ASIA'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"Asia", timeSpan: 3600000 })
        } else if (geoDS =='EUROPE'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"Europe", timeSpan: 3600000 })
        } else if (geoDS == 'SOUTHAMERICA'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"South America", timeSpan: 3600000 })
        } else if (geoDS == 'WORLD'){
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", timeSpan: 3600000 })
        } else {
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", timeSpan: 3600000 })
        }
    } else {
            dataSpec.data.push({ analysis: "PerCapitaTopGeos", timeSpan: 3600000 })
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

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
                $( "#mainPulseContentDiv" ).empty();

                //$('#myModal').foundation('reveal', 'close');
                $('#ieModal').foundation('reveal', 'open');
        } else {
                console.log('not using Internet Explorer')
                $('#myModal').foundation('reveal', 'close');
        }
        }

        // ************ BAR (EMERGING topics) ************ 

        newBarData = data.value.value.TopPhrases.phrases;
        //newBarData01 = data.value.phrases;
        //newBarData02 = dataTwo.value.phrases;
        //newBarData03 = dataThree.value.phrases;
        //console.log(newBarData)

        renderTopicBarChart();

        function renderTopicBarChart() {
                barChartObject.redrawBars(newBarData);
        }


        // ************ End of BAR ************  


        // ++++++++++++ SPARKLINES ++++++++++++

        // NEW
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
                //bandedData[i].zero = 0
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


        //unique authors or net sentiment
        var sentimentSparklineData = data.value.value.MetricSeries_NetSentiment.set;

        // dual area chart for net sentiment
        // first start with positive sentiment, then add negative value to it
        var dualSentimentData = [];
        var positiveSentimentData = data.value.value.MetricSeries_PositiveSentiment.set;
        var negativeSentimentData = data.value.value.MetricSeries_NegativeSentiment.set;
        for(var i=0; i<positiveSentimentData.length; i++){
        for(var j=0; j<positiveSentimentData.length; j++){
                //dualSentimentData.date = positiveSentimentData[i].date
                //dualSentimentData.positiveValue = positiveSentimentData[i].value
                //dualSentimentData.negativeValue = negativeSentimentData[i].value
                //dualSentimentData.push(dualSentimentData.date = positiveSentimentData[i].date)
                //dualSentimentData.push(dualSentimentData.positiveValue = positiveSentimentData[i].value)
                //dualSentimentData.push(dualSentimentData.negativeValue = negativeSentimentData[i].value)
                positiveSentimentData[i].negativeValue = negativeSentimentData[i].value
                positiveSentimentData[i].sumValues = positiveSentimentData[i].value + negativeSentimentData[i].value

        }
        }
        console.log('DUAL SENTIMENT DUAL SENTIMENT DATA PONING')
        console.log(positiveSentimentData)


        // look at sentimentSparklineData above
        for (var i=0; i<sentimentSparklineData.length; i++){
                //bandedData[i].zdifference = differenceInBand()
                //bandedData[i].average = averageInBand()
                sentimentSparklineData[i].zero = 0
        }

        var chartSentiment = differenceChart()
        .x(function(d) {return parseDate(moment(d.date).format("DD-MMM-YY HH:mm:ss")) })
        //.y1(function(d) { return +d.high; })
        //.y0(function(d) {return +d.low; })
        .y(function(d) {return +d.value; })
        //.cx(function(d) {return parseDate(moment(+d.date).format("DD-MMM-YY HH:mm:ss")) })
        //.cy(function(d) {return +d.value; });


        function callSentimentSparkline() {
                d3.select("#sparklineThree")
                .datum(sentimentSparklineData)
                .call(chartSentiment);
        }


        callSentimentSparkline()


        // ++++++++++++ END of SPARKLINES ++++++++++++

        // $$$$$$$$$$$$ GEO $$$$$$$$$$$$

        geoObject.redrawGeo(data);

        // $$$$$$$$$$$$$$$$$$$

        var sorted = _(data.value.value.PerCapitaTopGeos.geos).sortBy("name");
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
        d3.csv("../lib/airports.csv", function(airports) {
        //d3.csv("/streamserver/projects/lib/airports.csv", function(airports) {
                //d3.json("geo/CHstatedata116.json", function(data) {
                        d3.json("../lib/us-states.json", function(collection) {

                        })
                //})
        }) 

        /*
        // Geo Magnitude Text

        topStateData = data.value.geos[0]
        secondStateData = data.value.geos[1]
        thirdStateData = data.value.geos[2]

        topStates(topStateData, secondStateData, thirdStateData);
        */
        // $$$$$$$$$$$$ END of GEO $$$$$$$$$$$$


        // %%%%%%%%%%%% TOTALS text %%%%%%%%%%%%

        //find averages
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
        //var mentionTicker = new countUp("mentionsTotal", prefixScale_SecondLastMentions, prefixScale_LastMentions, 1, 15)//data.waitTime)//10)//data.waitTime);
        var mentionTicker = new countUp("mentionsTotal", prefixScale_SecondLastMentions, prefixScale_LastMentions, decimalPointHeader(lastElementBuzz.value), 15)//data.waitTime)//10)//data.waitTime);
        var imprTicker = new countUp("impressionsTotal", prefixScale_SecondLastImpr, prefixScale_LastImpr, 0, 15)//data.waitTime)//10);
        var sentimentTicker = new countUp("uniqueAuthorsTotal", prefixScale_SecondLastSentiment, prefixScale_LastSentiment, 0, 15)//data.waitTime)//10);
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
        //var avgmentionTicker = new countUp("mentionsAvg", avgprefixScale_lastMentions, avgprefixScale_Mentions, 1, 15)//10);
        var avgmentionTicker = new countUp("mentionsAvg", avgprefixScale_lastMentions, avgprefixScale_Mentions, decimalPointHeader(avgBuzz), 15)//10);
        var avgimprTicker = new countUp("impressionsAvg", avgprefixScale_lastImpr, avgprefixScale_Impr, 0, 15)//10);
        var avgsentimentTicker = new countUp("uniqueAuthorsAvg", avgSentimentPrevious, avgSentiment, 0, 15)//10);
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

        //var sentimentAvgDifferenceNow = d3.round(((lastElementSentiment.value-avgSentiment)/avgSentiment)*100)
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

        var avgDiffMentionTicker = new countUp("avgDiffMentions", buzzAvgDifferenceBefore, buzzAvgDifferenceNow, 0, 15);
        var avgDiffImprTicker = new countUp("avgDiffImpr", imprAvgDifferenceBefore, imprAvgDifferenceNow, 0, 15);
        var avgDiffSentimentTicker = new countUp("avgDiffSentiment", sentimentAvgDifferenceBefore, sentimentAvgDifferenceNow, 0, 15);
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

        //clear out ul
        // SOLVE memory leak, detached DOM elements
        $("#tweet-stream").empty()
        $("#tweet-stream").html("");

        var sentenceDataWhole = data.value.value.TopDocuments.docs 

        function replaceURLWithHTMLLinks(text) {
        var exp = /(\b(www\.|http\:\/\/)\S+\b)/ig;
        return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
        }

        var sentenceData = sentenceDataWhole.map(function(item) {
                var	usernameID = item.doc.properties.author
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
                        imgsrc: "http://twitter.com/api/users/profile_image/" + usernameID + "?size=bigger",
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

        $("#tweet-stream").empty()

        var poneStream = streamChart()

        .leftLabel(function(d) {
                p = d.location
        //for (var i in p) { if (p[i].geoType == "STATE") { console.log(p[i].name) }}
        for (var i in p) { 
                if (p[i].geoType == "STATE") { 
                return p[i].name;
                }
        }

        })

        function kickoffStream() {
            d3.select("#tweet-stream")
            .datum(sentenceData)
            .call(poneStream);
        }
        kickoffStream();

}// end of handleUpdate(data) function

