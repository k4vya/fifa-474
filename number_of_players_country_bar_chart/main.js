// test data 

//const { array } = require("yargs");

/*d3.csv('chart_data.csv').then(function(dataset) { 
    console.log(dataset);
    var svg = d3.select('svg');
    var g = svg.selectAll('g')
    .data(dataset)
    .enter()
    .append('g')
    .attr("transform", function(d) {
        return "translate(" + scaleAge(d.age) + ',' + scaleRating(d.overall)+")"
    });

    g
    .append('circle')
    .attr("r", "2px")

    g
    .append('text')
    .attr('id', 'name-label')
    .text(function(d) {return (d.long_name + ',' + d.age + ',' + d.overall);})
    
})


function scaleAge(age) {
    return ageScale(age);
}

function scaleRating(rateOverall) {
    return ratingScale(rateOverall);
}

// **** Code for creating scales, axes and labels ****

var ageScale = d3.scaleLinear()
    .domain([15,45]).range([60,700]);

var ratingScale = d3.scaleLinear()
    .domain([40,100]).range([350,20]);

var svg = d3.select('svg');

svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(ageScale).tickFormat(function(d){return d;}));

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(360,390)')
    .text('Age');

svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(ratingScale));

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(15,200) rotate(90)')
    .text('FIFA Overall Rating');

svg.append('text')
    .attr('class', 'title')
    .attr('transform','translate(360,30)')
    .text('Age and Rating'); */



var svg = d3.select("svg"),
margin = 150,
width = svg.attr("width") - margin,
height = svg.attr("height") - margin;

var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
yScale = d3.scaleLinear().range ([height, 0]);

    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

d3.csv('chart_data.csv').then(function(dataset) { 
//console.log(dataset);
    var nestedData = d3.nest()
    .key(function(c){
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


    g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }).ticks(10))
         .append("text")
         .attr("id", "vibes")
         .attr("y", 6)
         .attr("dy", "0.71em")
         .attr("text-anchor", "end")
         .text("value");

         g.selectAll(".bar")
         .data(nestedData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.key); })
         .attr("y", function(d) { return yScale(d.value); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d.value); });

})