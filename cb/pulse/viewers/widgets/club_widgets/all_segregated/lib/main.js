function initX(dom_id, client_id){
    $.getScript("./lib/differenceChart.js");
    $.getScript("./lib/blocksBar.js");
    $.getScript("./lib/netSentiment.js", function(){ 
        $.getScript("./lib/datacall.js", function(){
            datacall(client_id, dom_id);      
        });
    });
}
