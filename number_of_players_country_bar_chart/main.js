// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    console.log(category);
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

    asia1 = [];
    all1 = [];
    eur1 = [];
    northAm1 = [];
    southAm1 = [];
    var continentSet = { 
        asia : {}, 
        eur : {}, 
        northAm : {}, 
        southAm : {}, 
        all : {}
    }
   

d3.csv('chart_data_new.csv').then(function(dataset) { 

    var nestedData = d3.nest()
    .key(function(c){
        //console.log(c.nationality);
        return c.nationality;
    })
    .rollup(function(leaves) {
        //var numPlayers = d3.count(leaves, d => d.sofifa_id); 
        //console.log(leaves[0].continent);
        var totalRating = d3.sum(leaves, function(c) { 
            return c.overall;
        })
        //console.log(totalRating);
        var avg = Math.round(totalRating/(leaves.length));
        console.log(avg);
        //console.log(leaves[0].nationality + ', ' + leaves.length);
        return {players: leaves.length, continent: leaves[0].continent, avgRating : avg};
        
    })
    .entries(dataset);  

    //console.log(typeof nestedData);
    //console.log(nestedData[0]);
    
   for (let i = 0; i < nestedData.length; i++) { 
       all1.push(nestedData[i]);
        if (nestedData[i].value.continent == 'Asia') { 
            asia1.push(nestedData[i])
        } else if (nestedData[i].value.continent == 'Europe') {
            eur1.push(nestedData[i]);
        } else if (nestedData[i].value.continent == 'North America') {
            northAm1.push(nestedData[i]);
        } else if (nestedData[i].value.continent == 'South America') {
            southAm1.push(nestedData[i]);
        }
    }
    continentSet.all = all1;
    continentSet.asia = asia1;
    continentSet.eur = eur1;
   continentSet.southAm = southAm1;
   continentSet.northAm = northAm1;
   // console.log(continentSet.southAm);


    xScale.domain(nestedData.map(function(d) { return d.key}));
    yScale.domain([0, d3.max(nestedData, function(d){return d.value.players;})]);

    //outside the d3 csv, initialize var dataset outside of it and assign it later 

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

    //updateChart(nestedData);

    //console.log(continentSet['southAm']);
   
    updateChart('all')

    
})

function updateChart(filterKey) { 
    console.log('line 69 ' + filterKey);
    /*
    var filteredContinents = {};
    if (filterKey == 'all') {
        filteredContinents = continentSet.all;
    } else if (filterKey == 'asia') {
        filteredContinents = continentSet.asia;
    } else if (filterKey == 'eur') {
        filteredContinents = continentSet.eur;
    } else if (filterKey == 'northAm') {
        filteredContinents = continentSet.northAm;
    } else if (filterKey == 'southAm') {
        filteredContinents = continentSet.southAm;
    }
    console.log(filteredContinents);*/
    
   
    var filteredContinents = continentSet[filterKey];
    console.log(filteredContinents);
    //var filters = nestedData.filter(function(d) { 
    //    return nestedData
   // })
    //console.log(nestedData);

    //bind
    var bars = g.selectAll(".bar")
    .data(filteredContinents, function(d) { 
        return d.key;
    })

    //console.log(filteredContinents[0].value.players)

    //enter
   var barsEnter = bars.enter().append("g")
    .attr("class", "bar")

    barsEnter.append('rect')
    .attr('id', function(d){return d.value.continent;})
    .attr("x", function(d) { return xScale(d.key); })
    .attr("y", function(d) { return yScale(d.value.players); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d.value.players); })

  barsEnter
  .append("text")
  .attr("id","qlabel")
 // .attr('id', function(d){return d.key;} )
  .attr("x", (function(d) { return xScale(d.key) - xScale(d.key)/20 + 2; }  ))
  .attr("y", function(d) { return yScale(d.value.players) - 14; })
  .attr("dy", ".75em")
  .text(function(d) { return ('Num players: ' + d.value.players +  ", \nAvg rating: " +  d.value.avgRating); }); 
  console.log(filteredContinents);

  // update 
  var playerBar = d3.select('g').selectAll('.bar rect') 
  playerBar.attr('height', function(d) { 
      return height - yScale(d.value.players);
  })
  .attr('width', xScale.bandwidth());

  //exit
  var bars = d3.select('g').selectAll('.bar')
    .data(filteredContinents, function(d) { 
        return d.key;
    })
    bars.exit().remove();
    console.log(filteredContinents);

}


svg.append('text')
    .attr('class', 'title')
    .attr('transform','translate(620,30)')
    .text('Top 20 Countries with Most Players - FIFA 2020');

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