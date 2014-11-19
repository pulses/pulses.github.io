function timeSeriesChart(dom_id) {
  var margin = {top: 3, right: 5, bottom: 3, left: 0},
  //var margin = {top: 3, right: 5, bottom: 13, left: 0},
      m_width = $(dom_id).width(),
      width = 160,
      height = 40,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      xScale = d3.time.scale(),
      yScale = d3.scale.linear(),
      //xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
      //area = d3.svg.area().x(X).y1(Y),
      avgline = d3.svg.line().x(X).y(Yavg),
      line = d3.svg.line().interpolate("cardinal").x(X).y(Y);

  function chart(selection) {
    selection.each(function(data) {

      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      // Update the x-scale.
      xScale
          .domain(d3.extent(data, function(d) { return d[0]; }))
          .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      yScale
          //.domain([0, d3.max(data, function(d) { return d[1]; })])
          .domain([d3.min(data, function(d) { return d[1]; }), d3.max(data, function(d) { return d[1]; })])
          .range([height - margin.top - margin.bottom, 0]);

      avgOfLine = d3.mean(data, function(d) { return d[1]; })

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      //gEnter.append("path").attr("class", "area");
      //gEnter.append("path").attr("class", "line");
      gEnter.append("path").attr("class", "sparkline");
      //gEnter.append("g").attr("class", "x axis");
      gEnter.append("path").attr("class", "averageline");

      // Update the outer dimensions.
      //svg .attr("width", width)
      //    .attr("height", height);
      svg
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", m_width)
        .attr("height", m_width * (height) / width);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the area path.
      //g.select(".area")
          //.attr("d", area.y0(yScale.range()[0]));

      // Update the line path.
      g.select(".sparkline")
          .attr("d", line);

      // update avg line
      g.select(".averageline")
        .attr("d", avgline)

      // Update the x-axis.
      //g.select(".x.axis")
        //  .attr("transform", "translate(0," + yScale.range()[0] + ")")
          //.call(xAxis);
    $(window).resize(function() {
        var w = $(dom_id).width();
          svg.attr("width", w);
          svg.attr("height", w * height / width);
        });
    });
  }

  // The x-accessor for the path generator; xScale âˆ˜ xValue.
  function X(d) {
    return xScale(d[0]);
  }

  // The x-accessor for the path generator; yScale âˆ˜ yValue.
  function Y(d) {
    return yScale(d[1]);
  }

  function Yavg(d) {
    return yScale(avgOfLine);
    //return yScale(0);
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  return chart;
}
