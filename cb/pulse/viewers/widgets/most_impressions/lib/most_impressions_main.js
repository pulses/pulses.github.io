/*
 * clone of main.js file
 * removed unwanted code and useless console prints
 */

$(window).load(function() {
    datacall();
	
    $(function() {
            $("#tweet-stream-two").ticker({
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
            if($("#themeLogo").attr('src') === "") {
                    $( "#themeLogo").remove();
            }
    });

});

var previousValueTime; //keep this just in limbo, need to assign old data to this at end of work, but maintain after ajax call
var viewerConfig;

var dataSpec = {
   data: [
       { analysis: "MetricSeries", seriesName: "Impressions", resultTag: "MetricSeries_Impressions", timeSpan: 86400000 },
       { analysis: "TopDocuments", sort: "impressions", resultTag: "TopOriginalDocumentsImpressions", timeSpan: 3600000 }
   ]
};

function datacall() {
	var url = "https://app.netbase.com/cb/pulse/api/request"
	+ "?id=" + _id 
	+ "&dataSpec=" + JSON.stringify(dataSpec);
	
	/*
	var url = "https://dev-app.netbase.com/cb/pulse/api/request"
        //+ "?id=" + _id 
        + "?id=df6ea4c5-127a-4608-881a-30e7abfd9874"
	+ "&dataSpec=" + JSON.stringify(dataSpec);
	*/
	
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
                    }, 5000);
                }
            });
        }

        function handleUpdate(data) {
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
            //var mentionsSparklineData = data.value.value.BandedMetricSeries.set;
            for (var i=0; i < data.length; i++) {
                    //console.log(data[i])
                    data[i].difference = data[i].high - data[i].low
            }
            
            function differenceInBand() { 
                if (data.value.value.BandedMetricSeries.set[i].value > data.value.value.BandedMetricSeries.set[i].high) {
                            return data.value.value.BandedMetricSeries.set[i].value - data.value.value.BandedMetricSeries.set[i].high;
                    } 
                    else if (data.value.value.BandedMetricSeries.set[i].value < data.value.value.BandedMetricSeries.set[i].low) {
                            return data.value.value.BandedMetricSeries.set[i].low - data.value.value.BandedMetricSeries.set[i].value;
                    }
                    else {
                            return 0;
                    }
            } //end of differenceInBand function

            function averageInBand() { 
                return (data.value.value.BandedMetricSeries.set[i].high + data.value.value.BandedMetricSeries.set[i].low) / 2;
            } //end of averageInBand function

            // impressions
            var impressionSparklineData = data.value.value.MetricSeries_Impressions.set;
            //impressions block visual
            var impressionBarChartData = data.value.value.MetricSeries_Impressions.set;


            $("#tweet-stream-two").empty()
            $("#tweet-stream-two").html("");

            function replaceURLWithHTMLLinks(text) {
                var exp = /(\b(www\.|http\:\/\/)\S+\b)/ig;
                return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
            }

            var sentenceDataWholeImpr = data.value.value.TopOriginalDocumentsImpressions.docs; 
            var sentenceDataImpr = sentenceDataWholeImpr.map(function(item) {
                    var	usernameID = item.doc.properties.author;
                    var imgUrl = item.doc.properties.authorAvatarUrl;
                    if(!imgUrl){
                            imgUrl = "../../lib/profile-default.jpg";
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
            });


            kickoffStreamTwo();
            function kickoffStreamTwo() {
                    streamingdataTwo(sentenceDataImpr);
            };


}


