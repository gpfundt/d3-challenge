// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .classed("chart", true)
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(usdata, err) {
  if (err) throw err;

  // parse data
  usdata.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.abbr = data.abbr;
  });

    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(usdata, d => d.healthcare))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(usdata, d => d.poverty)])
        .range([height, 0]);

  // Create initial axis functions
    var xAxis = d3.axisBottom(xLinearScale).ticks(10);
    var yAxis = d3.axisLeft(yLinearScale).ticks(10);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
  

    chartGroup.append("g")
        .call(yAxis);

    chartGroup.append("text")
      .attr('class','aText')
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .text("Poverty");

    chartGroup.append("text")
        .attr('class','aText')
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .text("Healthcare");

    var circlesGroup = chartGroup.selectAll("circle")
        .data(usdata)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        
        var circleLabels = chartGroup.selectAll(null)
        .data(usdata)
        .enter()
        .append("text")
        .classed("stateText", true)
        .html(function(d) {
             return (`${d.abbr}`)})
        .attr("x", d => xLinearScale(d.healthcare))
        .attr("y", d => yLinearScale(d.poverty));
});