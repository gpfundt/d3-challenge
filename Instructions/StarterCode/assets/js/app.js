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

    var circlesGroup = chartGroup.selectAll("stateCircle")
        .data(usdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "pink");


    var toolTip = d3.select("body").append("div")
        .attr("class", ".d3-tip");

  // Step 2: Add an onmouseover event to display a tooltip
  // ========================================================
  circlesGroup.on("mouseover", function(d, i) {
    toolTip.style("display", "block");
    toolTip.html(`<strong>${d.abbr}</strong>`);
  })
    // Step 3: Add an onmouseout event to make the tooltip invisible
    .on("mouseout", function() {
      toolTip.style("display", "none");
    });
});

