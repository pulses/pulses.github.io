function datacall(client_id, dom_id, type, geo) {
	//var url = "https://streamserver.netbase.com/walmart-query.jsp"
	//var url = "data-query.jsp"
	//var url = "https://w402.netbase.com/streamserver/pulse/request"
	
	//var url = "https://app.netbase.com/cb/pulse/api/request" 
	/*
	var url = "https://dev-app.netbase.com/cb/pulse/api/request"
    + "?id=" + _id 
    //+ "?id=df6ea4c5-127a-4608-881a-30e7abfd9874"
	+ "&dataSpec=" + JSON.stringify(dataSpec);
	*/
       
        
        var url = "https://app.netbase.com/cb/pulse/api/request"
	+ "?id=" + client_id 
	+ "&dataSpec=" + JSON.stringify(getDataSpec(type, geo));

        $.ajax({
		url: url, 
		dataType: "text",
	    success: function(data, textStatus, jqXHR) {
	        var jsResult = JSON.parse(data);
	        var currentValueTime = jsResult.value.valueTime;
	        
	        window.setTimeout(function() {
	            datacall(client_id, dom_id, type, geo);
	        }, jsResult.waitTime);

                //TODO::turn off multiple call one time, inspect and check is this code neccesory ?
	        //if (currentValueTime !== previousValueTime) {
                        if(type === "emerging"){
                            handleUpdateEmerging(jsResult, dom_id);
                        }else if(type === "net_sentiment"){
                            handleUpdateNetSentiment(jsResult, dom_id);
                        }else if(type === "geo"){
                            handleUpdateGeoHotspot(jsResult, dom_id, geo);
                        }else if(type === "mentions"){
                            handleUpdateMentions(jsResult, dom_id);
                        }else if(type === "impressions"){
                            handleUpdateImpressions(jsResult, dom_id);
                        }else if(type === "retweets"){
                            handleUpdateRetweets(jsResult, dom_id);
                        }else if(type === "most_recent"){
                            handleUpdateMostRecent(jsResult, dom_id);
                        }else if(type === "most_impressions"){
                            handleUpdateMostImpressions(jsResult, dom_id);
                        }else if(type === "most_retweets"){
                            handleUpdateMostRetweets(jsResult, dom_id);
                        }else{
                            console.log("Widget Type not supported");
                        }
	        	
	        //}
	        
	        $("#"+dom_id+" .loading-data").remove();
                /*
	        window.setTimeout(function() {
	            datacall(client_id);
	        }, jsResult.waitTime);
			*/
	        //handleUpdate(jsResult); //function to repeat rendering of charts
	        previousValueTime = jsResult.value.valueTime;
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        window.setTimeout(function() {
	            datacall(client_id, dom_id, type, geo);
	        }, 5000);
	    }
	});
}