function timeSentimentSeriesChart() {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        //currentEl = $(this).attr('id'),
        m_width = $("#sparklineThree").width(),
        //m_width = $(this).width(),
        //m_width,// = d3.select(this),
        //m_width = currentEl.width(),
        width = 760,
        height = 220,
        xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; },
        //yMinValue = function(d) { return d[2]; },
        //sumValues = function(d) {return d[2]; },
        yLineValue = function(d) { return d[3]; },
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        yScaleNEG = d3.scale.linear(),
        //xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
        area = d3.svg.area().x(X).y1(Y).interpolate("cardinal"),
        line = d3.svg.line().x(X).y(Yline),
        areaNEG = d3.svg.area().x(X).y1(YNEG).interpolate("cardinal");

  function chart(selection) {
        selection.each(function(data) {

        var currentEl = d3.select(this)//.offsetWidth;//clientWidth
        //var weedth = $(currentEl).width();
        console.log(currentEl)
        console.log(data)

        // Convert data to standard representation greedily;
        // this is needed for nondeterministic accessors.
        data = data.map(function(d, i) {
            return [xValue.call(data, d, i), yValue.call(data, d, i), yValue.call(data, d, i)+yLineValue.call(data, d, i), yLineValue.call(data, d, i)];
        });
        console.log('^^^^^^$$$$$#####@@@@@@@@@@@&&&&&&&&&&&&')
        console.log(data) 

        var cloneData = data.slice(0);
        var flatData = [];

        for (var i=0;i<cloneData.length;i++){ 
            console.log(cloneData[i]);
            var negVal = cloneData[i].slice(1,2);
            var posVal = cloneData[i].slice(3,4);
            flatData.push(negVal)
            flatData.push(posVal)
        }

        var allValuesForMax = _.flatten(flatData);  
        console.log(allValuesForMax)
        // Update the x-scale.
        xScale
            .domain(d3.extent(data, function(d) { return d[0]; }))
            .range([0, width - margin.left - margin.right]);

        // Update the y-scale.
        yScale
            //.domain([0, d3.max(data, function(d) { return d[3]; })])
            //.range([height/2 - margin.top - margin.bottom, 0]);
            .domain([0, d3.max(allValuesForMax, function(d) { return d; })])
            .range([height/2, 0]);

        yScaleNEG
            //.domain([0, d3.max(data, function(d) { return d[3]; })])
            //.range([0, height/2 - margin.top - margin.bottom]);
            .domain([0, d3.max(allValuesForMax, function(d) { return d; })])
            .range([0, height/2]);

        // Select the svg element, if it exists.
        var svg = d3.select(this).selectAll("svg").data([data]);

        // Otherwise, create the skeletal chart.
        var gEnter = svg.enter().append("svg").append("g");
        gEnter.append("path").attr("class", "areaPOS");
        //gEnter.append("path").attr("class", "line");
        gEnter.append("path").attr("class", "areaNEG");
        //gEnter.append("g").attr("class", "x axis");

        /*
        var currentEl = $(this).attr('id')
        console.log(currentEl)
        m_width = $(currentEl).width();
        console.log(m_width)
        */

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
        g.select(".areaPOS")
            .attr("d", area.y0(yScale.range()[0]));
            //.attr("d", area.y0(Ymin))

        g.select(".areaNEG")
            .attr("d", areaNEG.y0(0))
            .attr("transform", "translate(" + 0 + "," + 110 + ")");;

        // Update the line path.
        //g.select(".line")
        //    .attr("d", line);

        $(window).resize(function() {
            var w = $("#sparklineThree").width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            });

        // Update the x-axis.
        //g.select(".x.axis")
        //  .attr("transform", "translate(0," + yScale.range()[0] + ")")
          //.call(xAxis);
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

     function YNEG(d) {
        //return yScaleNEG(d[1]);
        return yScaleNEG(d[3]);
    }

    function Ymin(d) {
        return yScale(d[2]);
    }

    function Yline(d) {
        return yScale(d[3]);
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

    chart.y1 = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    chart.y0 = function(_) {
        if (!arguments.length) return yMinValue;
        yMinValue = _;
        return chart;
    };

     chart.y = function(_) {
        if (!arguments.length) return yLineValue;
        yLineValue = _;
        return chart;
    };

    return chart;
}
