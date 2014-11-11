/* 
 * JS functions and events for emerging_topics widget
 * @author Lareb Nawab
 * @date 08 Oct 2014
 */

function handleUpdateEmerging(data, dom_id) {
  // valueTime will be zero if no data comes back
  var valueTime = data.value.valueTime;
  if(valueTime === 0){
    $('#myModal').foundation('reveal', 'open');
  }
  else {
    $('#myModal').foundation('reveal', 'close');
  }

  // ************ BAR (EMERGING topics) ************ 
  
  var newBarData = data.value.value.TopPhrases.phrases;
  renderTopicBarChart(dom_id);

  function renderTopicBarChart(dom_id) {
    redrawBars(newBarData, dom_id);
  }
  // ************ End of BAR ************  

}



/*--------HorizontalBarChart------------ */
function initBars(t_id){
  //content here
  var target_div = t_id
  var margin = {top: 20, right: 40, bottom: 10, left: 0}
  var m_width = $("#"+target_div).width()
  var width = 320
  var height = 500 - margin.top - margin.bottom

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.ordinal()
      .rangeRoundBands([0, height], .05);

  var svg = d3.select("#"+target_div).append("svg")
      .attr("preserveAspectRatio", "xMidYMid")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("width", m_width)
      .attr("height", m_width * height / width);    
}

function redrawBars(data, target_div) {
  var topics = data;
  var margin = {top: 20, right: 40, bottom: 10, left: 0}
  var m_width = $("#"+target_div).width()
  var width = 320
  var height = 500 - margin.top - margin.bottom            
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.ordinal().rangeRoundBands([0, height], .05);
                 
  change();
  
  function change() {
    d3.transition()
        .duration(4000)
        .each(redraw);
  }

  function redraw() {
    var topTopics = topics.sort(function(a, b){ return d3.descending(a.now, b.now); }).slice(0, 15);

    y.domain(topTopics.map(function(d) { return d.name; }));
    //x.domain([0, top[0][d.topic])
    x.domain([0, d3.max(topTopics, function(d) { return d.now; })]);
    
    var svg = d3.select("#"+target_div+" svg");
    var bar = svg.selectAll(".bar").data(topTopics, function(d) { return d.name; });

    var barEnter = bar.enter().insert("g", ".axis")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; })
        .style("fill-opacity", 0);

    barEnter.append("rect")
        .attr("width", function(d) { return x(d.now); })
        .attr("id", function(d,i) {return 'phrase' + i})
        .attr("height", y.rangeBand())
    
    barEnter.append("text")
        .attr("class", "name")
        .attr("x", 5)
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "start");

    barEnter.append("text")
        .attr("class", "value")
        .attr("x", width - 32)
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "start");

    var barUpdate = d3.transition(bar)
        .attr("transform", function(d) { return "translate(0," + (d.y0 = y(d.name)) + ")"; })
        //.attr("id", function(d,i) {return 'phrase' + i})
        .style("fill-opacity", 1);

    barUpdate.select("rect")
        .attr("id", function(d,i) {return 'phrase' + i})
        .attr("width", function(d) {return x(d.now); })
        .attr("height", y.rangeBand()) //added this for transition

    barUpdate.select(".name")
        .attr("x", 5)
        //.attr("y", y.rangeBand() / 2) //ADDED THIS TO FIX THE NAME OF BARS ISSUE
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".35em")
        .text(function(d) {return d.name; });


    barUpdate.select(".value")
        .attr("x", width - 32)
        //.attr("y", y.rangeBand() / 2) //ADDED THIS TO FIX THE NAME OF BARS ISSUE
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".35em")
        .text(function(d) {return d.now; });

    var barExit = d3.transition(bar.exit())
        .attr("transform", function(d) {return "translate(0," + (d.y0 + height) + ")"; })
        .style("fill-opacity", 0)
        //.attr("id", function(d,i) {return 'phrase' + i})
        .remove();

    barExit.select("rect")
        .attr("width", function(d) {return x(d.now); })
        .attr("id", function(d,i) {return 'phrase' + i})
        //.attr("height", y.rangeBand())

    barExit.select(".name")
        .attr("x", 5)
        .text(function(d) {return d.name; });

    barExit.select(".value")
        .attr("x", width - 32)
        .text(function(d) {return d.now; });
  } //end of redraw function

  $(window).resize(function() {
      var w = $("#"+target_div).width();
      svg.attr("width", w);
      svg.attr("height", w * height / width);
  });
}