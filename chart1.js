 // javascript
var dataset = [614, 353, 249, 175, 148, 141, 191, 298, 413, 476, 531, 601, 775, 705, 662, 720, 685];

d3.csv("PoliceBar.csv", function(d) {
  return {
    key : d["Hour of Incident Time"],
    value : +d["Number of Records"]
  };
}).then(function(data) {
  console.log(data)
  let margin = {
    top: 15,
    right: 10,
    bottom: 30,
    left: 35
  };

  var svg = d3.select('svg');

  let bounds = svg.node().getBoundingClientRect();
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;

  let numMin = 0;
  let numMax = d3.max(data.values());

  let numScale = d3.scaleLinear()
    .domain([numMin, numMax])
    .range([plotHeight, 0])
    .nice();

  var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

  let hourScale = d3.scaleBand()
    .domain(hours)
    .rangeRound([0, plotWidth])
    .paddingInner(0.1);

  let plot = svg.select("g#plot");

  if (plot.size() < 1) {
    plot = svg.append("g").attr("id", "plot");

    plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  let xGroup = plot.append("g").attr("id", "x-axis");

  let yAxis = d3.axisLeft(numScale);
  let xAxis = d3.axisBottom(hourScale);

  if (plot.select("g#y-axis").size() < 1) {
      let xGroup = plot.append("g").attr("id", "x-axis");

      xGroup.call(xAxis);

      xGroup.attr("transform", "translate(0," + plotHeight + ")");

      let yGroup = plot.append("g").attr("id", "y-axis");
      yGroup.call(yAxis);
      yGroup.attr("transform", "translate(" + 0 + ",0)");
    }
    else {
      plot.select("g#y-axis").call(yAxis);
    }

   let bars = plot.selectAll("rect")
      .data(data.entries(), function(d) { return d.key; });

  bars.enter().append("rect")

      .attr("class", "bar")

      .attr("width", hourScale.bandwidth())

      .attr("x", function(d) {
        return hourScale(d.key);
      })

      .attr("y", function(d) {
        return numScale(d.value);
      })

      .attr("height", function(d) {
        return plotHeight - numScale(d.value);
      })
      .each(function(d, i, nodes) {
        console.log("Added bar for:", d.key);
      });

  bars.transition()
      .attr("y", function(d) { return countScale(d.value); })
      .attr("height", function(d) { return plotHeight - countScale(d.value); });

    bars.exit()
      .each(function(d, i, nodes) {
        console.log("Removing bar for:", d.key);
      })
      .transition()
      .attr("y", function(d) { return countScale(countMin); })
      .attr("height", function(d) { return plotHeight - countScale(countMin); })
      .remove();
});