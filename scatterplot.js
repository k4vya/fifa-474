d3.csv("chart_data_new.csv").then(function(data){ 
    var svg = d3.select("svg");
    var groups = svg.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr("transform", function(d){
            return "translate(" + scaleAge(d.age) + "," + scaleRating(d.overall)+")"
         });
    
        groups.append('circle')
        .attr("r", "2px")
        .style("fill", function(d) { 
            if (d.age <= "30") { 
                return "orange";
            } else { 
                return "DarkTurquoise";
            }
        });
        
        groups.append('text')
        .attr('id', 'label')
        .text(function(d) { return d.long_name; })
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold');
    });
    
    // **** Functions to call for scaled values ****
    
    function scaleAge(age) {
        return ageScale(age);
    }
    
    function scaleRating(overall) {
        return ratingScale(overall);
    }
    
    // **** Code for creating scales, axes and labels ****
    
    var ageScale = d3.scaleLinear()
        .domain([16,42]).range([60,700]);
    
    var ratingScale = d3.scaleLinear()
        .domain([45,96]).range([340,20]);
    
    var svg = d3.select('svg');
    
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,345)')
        .call(d3.axisBottom(ageScale).tickFormat(function(d){return d;}));
    
    svg.append('text')
        .attr('class', 'label')
        .attr('transform','translate(360,390)')
        .text('Age (Years)');
    
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(55,0)')
        .call(d3.axisLeft(ratingScale));
    
    svg.append('text')
        .attr('class', 'label')
        .attr('transform','translate(15,200) rotate(90)')
        .text('Overall Rating');
    
    svg.append('text')
        .attr('class', 'title')
        .attr('transform','translate(360,30)')
        .style('font-weight', 'bold')
        .text('FIFA 2020 Player Age and Overall Rating');

    svg.append("circle")
        .attr("cx",830)
        .attr("cy",130)
        .attr("r", 6)
        .style("fill", "#FFA500")
    svg.append("circle")
        .attr("cx",830)
        .attr("cy",160)
        .attr("r", 6)
        .style("fill", "#30D5C8")
    svg.append("text")
        .attr("x", 850)
        .attr("y", 130)
        .text("Players Under 30")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle")
        .style("font-family", 'sans-serif')
    svg.append("text")
        .attr("x", 850)
        .attr("y", 160)
        .text("Players Over 30")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle")
        .style("font-family", 'sans-serif')
        