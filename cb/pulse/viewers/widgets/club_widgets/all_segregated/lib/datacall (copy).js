function datacall() {
	//var url = "https://streamserver.netbase.com/walmart-query.jsp"
	//var url = "data-query.jsp"
	//var url = "https://w402.netbase.com/streamserver/pulse/request"
	
	//var url = "https://app.netbase.com/cb/pulse/api/request" 
	/*
	var url = "https://dev-app.netbase.com/cb/pulse/api/request"
    //+ "?id=" + _id 
    + "?id=df6ea4c5-127a-4608-881a-30e7abfd9874"
	+ "&dataSpec=" + JSON.stringify(dataSpec);
	*/

	var url = "https://app.netbase.com/cb/pulse/api/request"
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
	        console.log('**********************************************')
	        /*
	        window.setTimeout(function() {
	            datacall();
	        }, jsResult.waitTime);
			*/
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