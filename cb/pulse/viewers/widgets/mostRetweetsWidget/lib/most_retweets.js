$(window).load(function() {
	viewerSetup();
	datacall();
	
	$(function() {
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

});

// Check to see if second image tag exists
$(document).ready(function() {
	if($("#themeLogo").attr('src') == "") {
		$( "#themeLogo").remove();

	}
})

var previousValueTime; //keep this just in limbo, need to assign old data to this at end of work, but maintain after ajax call
var viewerConfig;

var dataSpec = {
	data: [
	{ analysis: "DocumentCounts", timeSpan: 7200000, bucketTimeSpan: 300000 },
	{ analysis: "TopDocuments", sort: "datetime", timeSpan: 3600000 },
	{ analysis: "TopDocuments", sort: "impressions", resultTag: "TopOriginalDocumentsImpressions", timeSpan: 3600000 },
	{ analysis: "TopDocuments", sort: "shares", resultTag: "TopOriginalDocumentsShares", timeSpan: 3600000 }
	]
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
	        console.log('**********************************************')
	        //console.log(jsResult)
	        
	        //handleUpdate(jsResult); //function to repeat rendering of charts
	        previousValueTime = jsResult.value.valueTime;
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	    	window.setTimeout(function() {
	    		datacall();
	    		console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
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

			// NEW
			var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

			$("#tweet-stream-three").empty()
			$("#tweet-stream-three").html("");

			console.log('$$$$$$$$$$$$$$$$$$$')
			var sentenceDataWhole = data.value.value.TopDocuments.docs 

			function replaceURLWithHTMLLinks(text) {
				var exp = /(\b(www\.|http\:\/\/)\S+\b)/ig;
				return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
			}

			var sentenceDataWholeShares = data.value.value.TopOriginalDocumentsShares.docs 
			var sentenceDataShares = sentenceDataWholeShares.map(function(item) {
				var	usernameID = item.doc.properties.author
				var imgUrl = item.doc.properties.authorAvatarUrl;
				if(!imgUrl){imgUrl = "../../lib/profile-default.jpg";}
				return {
					id: item.doc.properties.docID,
					authorid: parseInt(item.doc.properties.authorID),
					datetime: item.doc.properties.datetime,
					displayname: item.doc.properties.authorName,
					username: item.doc.properties.author,
					text: item.html,
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

			kickoffStreamThree();
			function kickoffStreamThree() {
				streamingdataThree(sentenceDataShares);
			};

}// end of handleUpdate(data) function

