 // javascript

d3.csv("PoliceBar.csv", function(d) {
  return {
    key : d["Hour of Incident Time"],
    value : +d["Number of Records"]
  };
}).then(function(data) {
  console.log(data)
  let margin = {
    top: 40,
    right: 10,
    bottom: 40,
    left: 55
  };

  var map = d3.map(data, function(d) { return d.key; });

  var svg = d3.select('svg');

  var dataset = [];
  var i = 0;
  for (i = 0; i < data.length; i++) {
    dataset[i] = data[i].value;
  }

  console.log(dataset);

  let bounds = svg.node().getBoundingClientRect();
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;

  let numMin = 0;
  let numMax = d3.max(dataset);

  console.log(numMax);

  let numScale = d3.scaleLinear()
    .domain([numMin, numMax])
    .range([plotHeight, 0])
    .nice();

  let hourScale = d3.scaleBand()
    .domain(map.keys().reverse())
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
      .data(data, function(d) { return d.key; });

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

  plot.append("text")
        .attr("x", 0 - (margin.left / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "left")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Number of Reports Per Hour");

  plot.append("text")
        .attr("x", (plotWidth / 2))           
        .attr("y", plotHeight + (margin.bottom / 1.2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px")   
        .text("Incident Time");

  plot.append("text")
        .attr("text-anchor", "middle") 
        .style("font-size", "16px")   
        .text("Number of Records")
        .attr("transform", "translate(" + (0 - (margin.left / 1.5)) + "," + (plotHeight/2) + ") rotate(270)");
});