function mentions_datacall(client_id, dom_id) {
    var url = "https://app.netbase.com/cb/pulse/api/request"
	+ "?id=" + client_id 
	+ "&dataSpec=" + JSON.stringify(mentions_dataSpec);

	$.ajax({
		url: url, 
		dataType: "text",
	    success: function(data, textStatus, jqXHR) {
	        var jsResult = JSON.parse(data);
	        var currentValueTime = jsResult.value.valueTime;
	        
	        window.setTimeout(function() {
	            mentions_datacall(client_id, dom_id);
	        }, jsResult.waitTime);

	        // if (currentValueTime !== previousValueTime) {
	        	mentions_handleUpdate(jsResult, dom_id); //function to repeat rendering of charts
	        // }
	        console.log('**********************************************')
	        previousValueTime = jsResult.value.valueTime;
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        window.setTimeout(function() {
	            mentions_datacall(client_id, dom_id);
	            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
	        }, 5000);
	    }
	})
}