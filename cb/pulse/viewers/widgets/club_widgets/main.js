/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    if ($.browser.msie && $.browser.version < 10) {
        $('#ieModal').foundation('reveal', 'open');
    }
});

var mentionsWidget = (function() {    
  var _this = {
    init: function(dom_id, client_id) {
      showLoading(dom_id);
      $.getScript("./lib/mentions/mentions.js", function(){
        $.getScript("datacall.js", function(){
            datacall(client_id, dom_id, "mentions");
        });
        $.getScript("./lib/mentions/areaLineBandedChart.js");
      });
    }
  }
  return _this;
})();

var impressionsWidget = (function() {    
  var _this = {
    init: function(dom_id, client_id) {
      showLoading(dom_id);  
      $.getScript("./lib/impressions/impressions.js", function(){
        $.getScript("datacall.js", function(){
          datacall(client_id, dom_id, "impressions");
        });
        $.getScript("./lib/impressions/blocksBar.js");
      });
    }
  }
  return _this;
})();

var retweetsWidget = (function() {    
  var _this = {
    init: function(dom_id, client_id) {
      showLoading(dom_id);  
      $.getScript("./lib/retweets/retweets.js", function(){
        $.getScript("datacall.js", function(){
          datacall(client_id, dom_id, "retweets");
        });
        $.getScript("./lib/retweets/sparklineChart.js");
      });
    }
  }
  return _this;
})();

var emergingTopics = (function() {    
  var _this = {
    init: function(dom_id, client_id) {
    showLoading(dom_id);
    $.getScript("./lib/emerging_topics/emerging_topics.js", function(){
        initBars(dom_id);
        $.getScript("datacall.js", function(){
          datacall(client_id, dom_id, "emerging");
        });
      });         
    }
  }
  return _this;
})();

var netSentiment = (function() {    
  var _this = {
    init: function(dom_id, client_id) {
      showLoading(dom_id);  
      $.getScript("./lib/net_sentiment/differenceChart.js");
      $.getScript("./lib/net_sentiment/netSentiment.js", function(){ 
        $.getScript("datacall.js", function(){
          datacall(client_id, dom_id, "net_sentiment");
        });
      });            
    }
  }
  return _this;
})();

var mostRecent = (function() {    
  var _this = {
    init: function(dom_id, client_id) {
      showLoading(dom_id);  
      $.getScript("./lib/most_recent/brandPulseStreamOO.js");
      $.getScript("./lib/most_recent/most_recent.js", function(){ 
        $.getScript("datacall.js", function(){
            datacall(client_id, dom_id, "most_recent");
        });
      });            
    }
  }
  return _this;
})();

var mostImpressions = (function() {    
  var _this = {
    init: function(dom_id, client_id) {
      showLoading(dom_id);  
      $.getScript("./lib/most_impressions/streamPulseStreamImpressions.js");
      $.getScript("./lib/most_impressions/most_impressions.js", function(){ 
        $.getScript("datacall.js", function(){
          datacall(client_id, dom_id, "most_impressions");
        });
      });            
    }
  }
  return _this;
})();

var mostRetweets = (function() {    
  var _this = {
    init: function(dom_id, client_id) {
      showLoading(dom_id);  
      $.getScript("./lib/most_retweets/streamPulseStreamRetweets.js");
      $.getScript("./lib/most_retweets/most_retweets.js", function(){ 
        $.getScript("datacall.js", function(){
          datacall(client_id, dom_id, "most_retweets");
        });
      });            
    }
  }
  return _this;
})();

var geoHotspot = (function() {    
    var _this = {
        init: function(dom_id, client_id, geo) {
            showLoading(dom_id);
            $.getScript("./lib/geo_hotspot/geo_hotspot.js", function(){
                    $.getScript(getAllMap(geo), function(){
                        if(geo === 'US'){
                            initGeoUS(dom_id);
                        }else if(geo === 'BRAZIL'){
                            initGeoBrazil(dom_id);
                        }else if(geo === 'WORLD'){
                            initGeoWorld(dom_id);
                        }else if(geo === 'ASIA'){
                            initGeoAsia(dom_id);
                        }else if(geo === "EUROPE"){
                            initGeoEuro(dom_id);
                        }else if(geo === 'SOUTHAMERICA'){
                            initGeoSouthAmerica(dom_id);
                        }
                        $.getScript("datacall.js", function(){
                            datacall(client_id, dom_id, "geo", geo);
                        });
                    });
            });
        }
    }
    return _this;
})();
        
        function getAllMap(geo){
            if (geo === 'US'){
                return './lib/geo_hotspot/usStateMap.js'; 
                //return './lib/geo_hotspot/unitedStatesStateMap.js'; 
            } else if (geo === 'ASIA'){
                return './lib/geo_hotspot/asiaMap.js'; 
            } else if (geo ==='EUROPE'){
                return './lib/geo_hotspot/euroMap.js'; 
            } else if (geo === 'SOUTHAMERICA'){
                return './lib/geo_hotspot/southAmericaMap.js';
            }else if (geo === 'BRAZIL'){
                return './lib/geo_hotspot/brazilMap.js'; 
            }else if (geo === 'WORLD'){
                return './lib/geo_hotspot/worldMap.js'; 
            } else {
                // default to US
                return '../lib/geo_hotspot/unitedStatesStateMap.js'; 
            }            
        }
    
function getDataSpec(type, geo){
    if(type === "emerging"){
        return {
            data: [{ analysis: "TopPhrases"}]
        };
    }else if(type === "net_sentiment"){
        return {
            data: [
                { analysis: "MetricSeries", seriesName: "NetSentiment", resultTag: "MetricSeries_NetSentiment", timeSpan: 86400000 },
                { analysis: "MetricSeries", seriesName: "PositiveSentiment", resultTag: "MetricSeries_PositiveSentiment", timeSpan: 86400000 },
                { analysis: "MetricSeries", seriesName: "NegativeSentiment", resultTag: "MetricSeries_NegativeSentiment", timeSpan: 86400000 }
            ]
        };
    }else if(type === "geo"){
        if(geo === 'US'){
            return {data: [{ analysis: "PerCapitaTopGeos", timeSpan: 3600000 }]};
        } else if (geo === 'ASIA'){
            return {data: [{ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"Asia", timeSpan: 3600000 }]};
        } else if (geo === 'EUROPE'){
            return {data: [{ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"Europe", timeSpan: 3600000 }]};
        } else if (geo === 'SOUTHAMERICA'){
            return {data: [{ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", geoRegions:"South America", timeSpan: 3600000 }]};
        } else if (geo === 'WORLD'){
            return {data: [{ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "COUNTRY", timeSpan: 3600000 }]};
        } else if (geo === 'BRAZIL'){
            return {data: [{ analysis: "PerCapitaTopGeos", perCapitaUSAOnly:false, geoType: "STATE", geoRegions:"Brazil", timeSpan: 3600000 }]};
        } else {
            return {data: [{ analysis: "PerCapitaTopGeos", timeSpan: 3600000 }]};
        }
    }else if(type === "mentions"){
        return {data: [ { analysis: "BandedMetricSeries", bucketTimeSpanMins:60 } ]};
    }else if(type === "impressions"){
        return {data: [ { analysis: "MetricSeries", seriesName: "Impressions", resultTag: "MetricSeries_Impressions", timeSpan: 86400000 } ]};
    }else if(type === "net_sentiment"){
        return {
            data: [
                    { analysis: "MetricSeries", seriesName: "NetSentiment", resultTag: "MetricSeries_NetSentiment", timeSpan: 86400000 },
                    { analysis: "MetricSeries", seriesName: "PositiveSentiment", resultTag: "MetricSeries_PositiveSentiment", timeSpan: 86400000 },
                    { analysis: "MetricSeries", seriesName: "NegativeSentiment", resultTag: "MetricSeries_NegativeSentiment", timeSpan: 86400000 }
                  ]
                };        
    }else if(type === "retweets"){
        return {data: [ { analysis: "DocumentCounts", timeSpan: 7200000, bucketTimeSpan: 300000 } ]};
    }else if(type === "most_recent"){
        return {
            data: [
                { analysis: "TopPhrases"},
                { analysis: "TopDocuments", sort: "datetime", timeSpan: 3600000 },
            ]
        };
    }else if(type === "most_impressions"){
        return {
            data: [
                { analysis: "MetricSeries", seriesName: "Impressions", resultTag: "MetricSeries_Impressions", timeSpan: 86400000 },
                { analysis: "TopDocuments", sort: "impressions", resultTag: "TopOriginalDocumentsImpressions", timeSpan: 3600000 }
              ]
            };
    }else if(type === "most_retweets"){
        return {
            data: [
                { analysis: "DocumentCounts", timeSpan: 7200000, bucketTimeSpan: 300000 },
                { analysis: "TopDocuments", sort: "datetime", timeSpan: 3600000 },
                { analysis: "TopDocuments", sort: "impressions", resultTag: "TopOriginalDocumentsImpressions", timeSpan: 3600000 },
                { analysis: "TopDocuments", sort: "shares", resultTag: "TopOriginalDocumentsShares", timeSpan: 3600000 }
            ]
        };        
    }else{
        console.log("Widget Type not supported");
    }    
}

function showLoading(dom_id){
    $("#"+dom_id).html("<div class='loading-data'></div>");
}

function msieversion() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer, return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
        else                 // If another browser, return 0
            return 0;
}