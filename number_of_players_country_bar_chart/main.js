// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
}

//overall canvas
var svg = d3.select("svg"),
margin = 150,
width = svg.attr("width") - margin,
height = svg.attr("height") - margin;

var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
yScale = d3.scaleLinear().range ([height, 0]);

//actual bar chart
    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

d3.csv('chart_data_new.csv').then(function(dataset) { 

    var nestedData = d3.nest()
    .key(function(c){
        //console.log(c.nationality);
        return c.nationality;
    })
    .rollup(function(leaves) {
        //var numPlayers = d3.count(leaves, d => d.sofifa_id); 
        
        //console.log(leaves[0].nationality + ', ' + leaves.length);
        return leaves.length;
        
    })
    .entries(dataset);  

    console.log(nestedData);


    xScale.domain(nestedData.map(function(d) { return d.key}));
    yScale.domain([0, d3.max(nestedData, function(d){return d.value;})]);


    // add x axis
    g.append("g")
    .attr("id", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

    // add y axis
    g.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
    }).ticks(10))
    .append("text")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("value");

    //bind data 
      

    
})

function updateChart(filterKey) { 
    
    var bars = g.selectAll(".bar")
    .data(nestedData)

    var barsEnter = bars.enter().append("rect")
    .attr("class", "bar")
    .attr('id', function(d){return d.key;})
    .attr("x", function(d) { return xScale(d.key); })
    .attr("y", function(d) { return yScale(d.value); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d.value); })

  svg.selectAll(".text")        
  .data(nestedData)
  .enter()
  .append("text")
  .attr("class","qlabel")
 // .attr('id', function(d){return d.key;} )
  .attr("x", (function(d) { return xScale(d.key) + 101; }  ))
  .attr("y", function(d) { return yScale(d.value) + 105; })
  .attr("dy", ".75em")
  .text(function(d) { return d.value; });  
}

svg.append('text')
    .attr('class', 'title')
    .attr('transform','translate(620,30)')
    .text('Top Countries with Most Players - FIFA 2020');

    svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(25,400) rotate(90)')
    .text('Number of Players');

    svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(620,790)')
    .text('Country');

   svg.select("#legend")

    // Handmade legend
    svg.append("circle").attr("cx",1000).attr("cy",130).attr("r", 6).style("fill", "#B29BCF")
    svg.append("circle").attr("cx",1000).attr("cy",160).attr("r", 6).style("fill", "#FEB326")
    svg.append("circle").attr("cx",1000).attr("cy",190).attr("r", 6).style("fill", "#E84d8a")
    svg.append("circle").attr("cx",1000).attr("cy",220).attr("r", 6).style("fill", "#64c5eb")
    svg.append("text").attr("x", 1020).attr("y", 130).text("South America").style("font-size", "12px").attr("alignment-baseline","middle").style("font-family", 'sans-serif')
    svg.append("text").attr("x", 1020).attr("y", 160).text("Europe").style("font-size", "12px").attr("alignment-baseline","middle").style("font-family", 'sans-serif')
    svg.append("text").attr("x", 1020).attr("y", 190).text("Asia").style("font-size", "12px").attr("alignment-baseline","middle").style("font-family", 'sans-serif')
    svg.append("text").attr("x", 1020).attr("y", 220).text("North America").style("font-size", "12px").attr("alignment-baseline","middle").style("font-family", 'sans-serif')