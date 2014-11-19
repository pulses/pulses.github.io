/* 
 * JS functions and events for most_recent widget
 * @author Lareb Nawab
 * @date 08 Oct 2014
 */


$(window).load(function() {
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
            { analysis: "TopPhrases"},
            { analysis: "TopDocuments", sort: "datetime", timeSpan: 3600000 },
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
            var usernameID = item.doc.properties.author;
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

