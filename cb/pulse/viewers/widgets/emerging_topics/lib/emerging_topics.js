/* 
 * JS functions and events for emerging_topics widget
 * @author Lareb Nawab
 * @date 08 Oct 2014
 */


$(window).load(function() {
	barChartObject.initBars();
	datacall();
    });

    // Check to see if second image tag exists
    $(document).ready(function() {
            //if($("div#leftLogoContainer img").attr('src') == "") {
            if($("#themeLogo").attr('src') == "") {
                    $( "#themeLogo").remove();

            }
    });

    var previousValueTime; //keep this just in limbo, need to assign old data to this at end of work, but maintain after ajax call
    var viewerConfig;

    var dataSpec = {
       data: [{ analysis: "TopPhrases"}]
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

        // ************ BAR (EMERGING topics) ************ 

        newBarData = data.value.value.TopPhrases.phrases;

        renderTopicBarChart();

        function renderTopicBarChart() {
                barChartObject.redrawBars(newBarData);
        }
        // ************ End of BAR ************  

}

