// This code is not refactored. I tried many things and commented code that didn't work or that I replaced with some other code to help prevent me from trying the same code over and over, especially if it didn't work. Being that I'm doing my best to learn and improve at coding, I am trying to do things from memory at first, but then I look at the documentation and tutorials if I can find any, but the the about d3 is that the tutorials use different versions of it and for some reason, I'm struggling to find what I need with the d3 documentation. 

//To Any Potential Empoloyer Who Looks At This:
// I know that I don't have everything memorized, and that I am not a perfect coder, but I'm doing my best to learn and improve at coding, and if I were to work on a real project I wouldn't leave some many commented out things in it if you didn't want me to.

// To FCC reviewer:
// Even after completing the challenges and my code working fine, I had to run the test several times to get it to pass. I don't know why. 

const width = 1200;
const height = 600;
const margin = {
  top: 40,
  right: 80,
  bottom: 120, 
  left: 80
};

const tooltip = d3.select("body").append("div");

  tooltip
    .attr("id", "tooltip");
    // .attr("data-year", "");
    // .append("div")
    // .attr("id", "tip")

const heatmap = d3.select("body").append("svg").attr("id", "heatmap");

heatmap
  // .attr("width", width)
  // .attr("height", height);
  .attr("viewBox", [0, 0, width, height]);

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"



d3.json(
  url, 
  function (error, data) {
    if (error) throw error;
    
    return data;
  }
)
.then(
  // I could have just used data for the paramter, but I wanted to go ahead and seperate the object of two properties, 2nd of which is an array of objects: 
 function ({baseTemperature: bT, monthlyVariance: mV}) {
   // test to see if it is working: 
   // heatmap.append("text").attr("fill", "black").text(mV[0].year + " Yep, I'm working.").attr("x", 100).attr("y", 100)  

   const years = mV.reduce((accumulator, obj) => {
     if (!accumulator.includes(obj["year"])) {
       accumulator.push(obj["year"]);
     }
     return accumulator;
   }, [])
   
   const months = mV.reduce((accumulator, obj) => {
     const mName = monthName(obj.month);
     if (!accumulator.includes(mName)) {
       accumulator.push(mName);
     }
     return accumulator;
   }, []);
   
   // console.log(months)
   
   const cellWidth = (width - margin.left - margin.right) / years.length;
   
   const cellHeight = (height - margin.top - margin.bottom) / 12;
   
   // console.log(years);
   
   // const cellWidth = (width - margin.left - margin.right) / mV.length
   
   // create x linear scale
   const xLinearScale = d3.scaleLinear();
   
  // d3.extent returns an array of the [minimumValue, maximumValue]
   xLinearScale
    // .domain(d3.extent(mV, d => d.year))
   .domain(d3.extent(years, d => d))
    .range([margin.left, width - margin.right]);
   
   const xAxis = d3.axisBottom(xLinearScale)
   .tickFormat(d3.format("d"))
   .ticks(27)
   .tickPadding(7);
   
  // heatmap
  //   .append("g")
  //   .attr("id", "x-axis")
  //   .attr("transform", `translate(${0}, ${height - margin.bottom})`)
  //   .call(xAxis);
   
   // modify properties, attributes of text and etc:
   
// testing to see if I can change the properties of the elements by giving them a class for CSS to target and modify them:   
   // this works: 
   // d3.selectAll(".tick text") 
    // .attr("fill", "red")

  // this works: 
  // d3.selectAll("#x-axis text")
    // .style("font-size", "14px")
   
   d3.selectAll("#x-axis text")
    .attr("class", "x-text");
   
   d3.selectAll('#x-axis line')
    .attr("class", "x-line");
   
   d3.selectAll("x-axis path")
    .attr("class", "x-path");
// end of test for x-axis
   
   // create  y Band for months
   
   // I'm going to just directly pass the domain and range within d3.scaleBand([domainMin, domainMax], [rangeMin, rangeMax]):
   const yBandScale = d3.scaleBand(
     // mV.map( obj => {return monthName(obj.month)}), 
     // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
     months,
     [height - margin.bottom, margin.top]);
   
   // const yBandScale = d3.scaleBand()
   //  .domain(mV.map(obj => monthName(obj.month)))
   //  .range([height - margin.bottom, margin.top]);
   
   const yBand = d3.axisLeft(yBandScale);
   yBand

   
   heatmap
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(yBand);
   
   d3.selectAll("#y-axis text")
   .attr("class", "y-text");
   
   const variance = mV.map(obj => obj.variance + bT);
   
   // console.log(variance
   // console.log(Math.max(...variance).toFixed(1)) // 13.888 // 13.9
  // console.log(Math.min(...variance).toFixed(1)) // 1.684  // 1.7
   
   // 13.888 - 1.684 = 12.204 
   // 12.204 / 5 = 2.4408 
   // 12.204 / 3 = 3.051 needed to get the 3 center values (I don't know if this is the right way to do it or not)
   // 1.684 + 3.051 = 4.735 rounded to 4.7
   const colorSchemeNumbers = [1.7, 4.7, 7.8, 10.8, 13.9];
         //[1.7, 5.8, 9.8, 9.0, 13.9]
   // 13.888 - 1.684 / 5
   // [1.684, 4.1248, 6.5656, 9.0064, 11.4472, 13.888]
   
   const colorScheme = ["blue", "lightblue", "yellow", "orange", "red"]
   

   
   // const colorScale = d3.scaleSequential();
   
   // colorScale
   //  .domain([d3.min(mV, d => d.variance), d3.mean(mV, d=> d.variance), d3.max(mV, d => d.variance)]);
   
   // d3.scaleSequential
   // colorScale
   //  .domain(d3.min(variance, d => d), d3.max(variance, d => d))
   //  .range("blue", "red")
   // .range(colorScheme)
   
   const yLinearScale = d3.scaleLinear().domain([0, 11]).range([height - margin.bottom, margin.top]);
   
   const yAxis = d3.axisLeft(yLinearScale).tickPadding(0);
   
   // heatmap
   //  .append("g")
   //  .attr("id", "y-axis")
   //  .attr("transform", `translate(${margin.left}, ${0})`)
   //  .call(yAxis);
   
const xBandScale = d3.scaleBand();
   
    xBandScale       
      // .domain([1760,1770,1780,1790,1800,1810,1820,1830,1840,1850,1860,1870,1880,1890,1900,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010])
   // .domain(mV.map(obj => obj.year))
    .domain(years)
    // .domain(mV)
      .range([margin.left, width - margin.right]);
   
   const xBand = d3.axisBottom(xBandScale)
   .tickValues([1760,1770,1780,1790,1800,1810,1820,1830,1840,1850,1860,1870,1880,1890,1900,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010]);
   // .ticks(27);
   
   heatmap
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xBand)
   
   d3.selectAll("#x-axis text")
    .attr("class", "x-axis-text")
   
   const divergingColorScale = d3.scaleDiverging();
   
   divergingColorScale
    .domain([d3.min(mV, d => d.variance), d3.mean(mV, d => d.variance), d3.max(mV, d => d.variance)])
   // .interpolator(d3.interpolateRdBu)
   // add a function to reverse the interpolateRdBu color scheme so that the colors go from cool (bluish) to warm (redish):
   .interpolator(t => d3.interpolateRdBu(1 - t));
   // create scale for the legend, resume here when ready
const legend = heatmap.append("g");
   
   legend
    .attr("id", "legend")
    // .style("stroke", "green")
    .attr("transform", `translate(${margin.left}, ${height - 75 })`);
   
   legend
    .selectAll("rect")
    .data(colorSchemeNumbers)
    .enter()
    .append("rect")
    .style("fill", (d, i) => cellColor(d))
    .style("stroke", "black")
    .style("height", 30)
    .style("width", 35)
    .attr("x", (d, i) => i * 35);
   
   const legendScale = d3.scaleLinear();
   
   legendScale
    .domain([-1.4, 13.9])
    .range([0, 175]); // rect 35px wide * 5
   
   const legendAxis = d3.axisBottom(legendScale)
    // .tickFormat(d3.format(".2")) works to get the numbers to show in decimal form
    .tickFormat(d3.format("~g")) // https://github.com/d3/d3-format#locale_formatPrefix //  ~g (with a default precision of 12 instead of 6)
    .tickValues([-1.4, 1.7, 4.7, 7.8, 10.8, 13.9])
    .tickSize(7);
   
   legend
    .append("g")
    .attr("id", "legend-axis")
    .attr("transform", `translate(0, 30)`)
    .call(legendAxis);
   
   d3.selectAll("#legend-axis text")
    .attr("class", "legend-text");
    // .style("font-size", 16);
   
   d3.select("#legend-axis path")
    // .attr("stroke", "yellow")
    .attr("stroke-width", 0)
   
     // create cells
  heatmap
    .append("g")
    .attr("id", "cellsContainer")
    .attr("transform", "translate(2, -1)")
    .selectAll("rect")
    // .data(mV, function (d) {
  //     return d.month + ":" + d.year;
  // })    
    .data(mV)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d, i) => d.month - 1)
    .attr("data-year", d => {
      // addProperty(tooltip, "data-year", +d.year);
      // addTooltipProperty("data-year", +d.year);
      return d.year;
    })
    .attr("data-temp", d => (d.variance + bT).toFixed(1))
    .attr("data-variance", d => (d.variance).toFixed(1))
    .style("fill", d => cellColor(d.variance, bT)) // using the five colors I picked
   .style("stroke", d=> cellColor(d.variance, bT)) // using the five colors I picked
   // This color scheme interpolator works for fill and stroke for each cell: 
   // .style("fill", d =>  divergingColorScale(d.variance))
   // .style("stroke", d => divergingColorScale(d.variance))
    // .attr("height", (d, i) => yLinearScale(d.month))
   .attr("height", yBandScale.bandwidth())
   // .attr("height", (d, i) => cellHeight)
   // .attr("width", cellWidth)
   .attr("width", xBandScale.bandwidth())
   // .attr("width", xBandScale.bandwidth() / 10) // divide by 10 because because there are 10 years between each of the main ticks
   .attr("x", (d, i) => xBandScale(d.year))
   .attr("y", (d, i) => yBandScale(monthName(d.month))) // in order for the ordinal scale band to work, the value of the current property has to match the value of the appropriate band value. d.month produces a number (1 through 12) and the band is an array of months by name.

   
   .on("mouseover", 
      function (d, i) { // if you use an arrow function here, d3.select(this) doesn't work and etc. The only thing that was working was the left and top properties being changed.
    
          
    tooltip.style("opacity", 1)
    
    tooltip
      // .attr("data-year", d.year);
      // .attr("day-year", d3.select(this).attr("data-year")) // this works too
    .attr("data-year", d3.select(".cell").attr("data-year"))
    .attr("data-month", d3.select(".cell").attr("data-month"))
    .attr("data-temp", d3.select(".cell").attr("data-temp"))
    .attr("data-variance", d3.select(".cell").attr("data-variance"))
        
    tooltip
      .html(`${monthName(+d3.select(this).attr("data-month") + 1)} ${d3.select(this).attr("data-year")}<br/>Temp: ${d3.select(this).attr("data-temp")}<br/>Variance: ${d3.select(this).attr("data-variance")}`)
      // .html(`${tooltip.attr("data-year")}`);
      // .append("text")
      // .attr("fill", "black")
      // .text("I'm working.")
    
      // tooltip
      //   // .transition()
      //   // .duration(200)
      //   .style("left", event.pageX - 15 + "px")
      //   .style("top", event.pageY + 2 + "px");
    
    d3.select(this) // selects current rectangle
      // .style("stroke", "black")
      // .style("stroke-width", 1)
      .style("fill", "purple")
      .style("stroke", "purple")
    })

  

   // putting the left and top properties in mouseover and mousemove seem to make the the tooltip move much smoother, seems to reduce jerkiness. 
   .on("mousemove", 
      function (d) {
      tooltip
        .style("left", event.pageX - 15 + "px")
        .style("top", event.pageY + 2 + "px")
  })
   
  .on("mouseout",
      function () {
        d3.select(this)
          .style("fill", d => cellColor(d["variance"], bT))
          .style("stroke", d => cellColor(d.variance, bT))
   }) 
   
d3.select("#cellsContainer")
 .on("mouseout",
   function (d) {
    tooltip.style("opacity", 0);
 });
   
   // console.log(Math.min(...mV.map(obj => (obj.variance + bT))))
   
 }
);


// Helper Functions:
function monthName(number) {
  switch(number) {
    case 1: return "January";
    case 2: return "February";
    case 3: return "March";
    case 4: return "April";
    case 5: return "May";
    case 6: return "June";
    case 7: return "July";
    case 8: return "August";
    case 9: return "September";
    case 10: return "October";
    case 11: return "November";
    case 12: return "December";
    default: return "Error";
  }
}

function cellColor (variance, baseTemp = 0) {
  const monthTemp = variance + baseTemp;
  // switch(monthTemp) {
  //     // 1.7, 4.75, 7.8, 10.85, 13.9
  //     // "blue", "lightblue", "yellow", "orange", "red"
  //   case monthTemp < 1.7: 
  //     return "blue";
  //   case monthTemp < 4.8:
  //     return "lightblue";
  //   case monthTemp < 7.8:
  //     return "yellow";
  //   case monthTemp < 10.9:
  //     return "orange";
  //   case monthTemp < 13.9:
  //     return "red";
  //   default: return;
  // }
// 1.7, 4.7, 7.8, 10.8, 13.9  
  if (parseFloat(monthTemp) <= 1.7) return "blue"
  else if (parseFloat(monthTemp) <= 4.7) return "lightblue"
  else if (parseFloat(monthTemp) <= 7.8) return "yellow"
  else if (parseFloat(monthTemp) <= 10.8) return "orange"
  else if (parseFloat(monthTemp) <= 13.9) return "red"
 
  
}

// function addProperty(target, attribute, value) {
//   return target.append(attribute, value);
// }

// function addTooltipProperty(attribute, value) {
//   tooltip.append(attribute, `${value}`);
// }

