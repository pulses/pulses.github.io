$(window).load(function() {
	
	imageVisual.initImages();
	viewerSetup();
	datacall();

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
   	data: [
   		{ analysis: "TopImages" }
       	//{ analysis: "BandedMetricSeries", bucketTimeSpanMins:60 },
       	//{ analysis: "DocumentCounts" },
       	//{ analysis: "MetricSeries", seriesName: "Impressions", resultTag: "MetricSeries_Impressions", timeSpan: 86400000 },
       	//{ analysis: "MetricSeries", seriesName: "NetSentiment", resultTag: "MetricSeries_NetSentiment", timeSpan: 86400000 }
       	//{ analysis: "TopDocuments", sort: "datetime" },
       	//{ analysis: "TopDocuments", sort: "impressions", resultTag: "TopOriginalDocumentsImpressions" },
       	//{ analysis: "TopDocuments", sort: "shares", resultTag: "TopOriginalDocumentsShares" }
   ]
};

function datacall() {
	//var url = "https://streamserver.netbase.com/walmart-query.jsp"
	//var url = "dataOne.json"
	//var url = "https://w402.netbase.com/streamserver/pulse/request?id=a2ec76bb-556e-40da-bf65-3ec2f99c112b"
	//var url = "https://w402.netbase.com/streamserver/pulse/request"
	var url = "/cb/pulse/api/request"
		+ "?id=" + _id
		//+ "?id=" + "a2ec76bb-556e-40da-bf65-3ec2f99c112b"
		+ "&dataSpec=" + JSON.stringify(dataSpec);
	
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


	// ************ IMAGES  ************ 

	var imageData = data.value.value.TopImages.images;
	console.log('image data:')
	console.log(imageData)

	renderImageVisual();

	function renderImageVisual() {
		imageVisual.redrawImages(imageData);
	}




}// end of handleUpdate(data) function
