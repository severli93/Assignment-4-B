console.log("Assignment 4-B");

var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.canvas');
var plot = canvas
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var tooltip = d3.select("body")
    .append("div")
    .attr('class','Tooltip')
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text(function(d){return 10000000});


//Scales
var scaleX = d3.scale.linear().domain([1960,2015]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,11000000]).range([height,0]);

//line generator

var lineGenerator = d3.svg.line()
    .x(function(d){return scaleX(d.year)})
    .y(function(d){return scaleY(d.value)})
    .interpolate('step')

//Axis
var axisX = d3.svg.axis()
    .orient('bottom')
    .scale(scaleX)
    .tickFormat( d3.format('d') ); //https://github.com/mbostock/d3/wiki/Formatting
var axisY = d3.svg.axis()
    .orient('right')
    .tickSize(width)
    .scale(scaleY);

//Draw axes
plot.append('g').attr('class','axis axis-x')
    .attr('transform','translate(0,'+height+')')
    .call(axisX);
plot.append('g').attr('class','axis axis-y')
    .call(axisY);

//Start importing data
d3.csv('data/fao_combined_world_1963_2013.csv', parse, dataLoaded);
//.defer(d3.csv,'data/fao_coffee_world_1963_2013.csv',parse)
//d3.csv('data/olympic_medal_count.csv', parse, dataLoaded);
function parse(d){

    //Eliminate records for which gdp per capita isn't available

    //Check "primary completion" and "urban population" columns
    //if figure is unavailable and denoted as "..", replace it with undefined
    //otherwise, parse the figure into numbers
    return {
    item:d.ItemName,
    year: +d.Year,
    value: +d.Value
    };



}

function dataLoaded(error,data, rows){
 console.log(data)

 var nestedData=d3.nest()
     .key(function(d){return d.item})
     .entries(data)

    console.log(nestedData[0])
    console.log(nestedData[1])
    console.log(nestedData);

    //var Goods= plot.selectAll('g')
    //    .append('g')
    //    .attr('class','Goods');

    plot.append('path')
        .datum(nestedData[0].values)
        .attr('class','data-line tea-data-line')
        .attr('d',lineGenerator)
//tea
    var teaPoint=plot.selectAll('.coffee-data-point tea-data-point')
        .data(nestedData[0].values)

    var teaEnter=teaPoint.enter()//51 data
        .append('g')
        .attr('class','Tea')

        teaEnter
        .append('circle').attr('class','data-point tea-data-point')//see CSS
        .attr('cx',function(d){return scaleX(d.year)} )
        .attr('cy',function(d){return scaleY(d.value)})
        .attr('r',8)
        .style('opacity',0)
        .call(attachTooltip)

        teaEnter
            .append('circle').attr('class','data-point tea-data-point')//see CSS
            .attr('cx',function(d){return scaleX(d.year)} )
            .attr('cy',function(d){return scaleY(d.value)})
            .attr('r',2)
          .style('opacity',1)


    plot.append('path')
        .datum(nestedData[1].values)
        .attr('class','data-line coffee-data-line')
        .attr('d',lineGenerator)
//coffee
    var coffeePoint=plot.selectAll('.data-point coffee-data-point')
        .data(nestedData[1].values)
    var coffeeEnter=coffeePoint.enter()//51 data
        .append('g')
        .attr('class','Coffee')
        coffeeEnter
        .append('circle').attr('class','data-point tea-data-point')//see CSS
        .attr('cx',function(d){return scaleX(d.year)} )
        .attr('cy',function(d){return scaleY(d.value)})
        .attr('r',8)
        .style('opacity',0)
        .call(attachTooltip)

        coffeeEnter
            .append('circle').attr('class','data-point coffee-data-point')//see CSS
            .attr('cx',function(d){return scaleX(d.year)} )
            .attr('cy',function(d){return scaleY(d.value)})
            .attr('r',2)
            .style('opacity',1)



}
 function attachTooltip(selection){
     selection
         .on('mouseenter',function(d){
             var tooltip=d3.select('.custom-tooltip');
             tooltip
                 .transition()
                 .style('opacity',1);
             tooltip.select('#type').html(d.item);
             tooltip.select('#year').html(d.year);
             tooltip.select('#value').html(d.value);
         })
         .on('mousemove',function(){
             var xy=d3.mouse(canvas.node());
             var tooltip=d3.select('.custom-tooltip');
             tooltip
                 .style('left',xy[0]+50+'px')
                 .style('top',(xy[1]+50)+'px')
                 //.html('test');

         })
         .on('mouseleave',function(){
             var tooltip=d3.select('custom-tooltip')
                 .transition()
                 .style('opacity',0);
         }
             )
 }
