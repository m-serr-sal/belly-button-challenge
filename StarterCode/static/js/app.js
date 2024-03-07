// Store URL
let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    dataPromise.then(function(data) {
        console.log(data);

        // Store variable for names data
        let names = data.names;
        
        // Assign the first name to name variable
        let name = names[0];

        // Iterate through the names Array
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });
   
        // Call the functions to make the demographic panel, bar chart, and bubble chart
        bar(name);
        bubble(name);
        demo(name);
        gauge(name);
    });

    // Make the bar chart
    function bar(selectedValue) {
        // Fetch the JSON data and console log it
        d3.json(url).then((data) => {
            console.log(`Data: ${data}`);
    
            // An array of sample objects
            let samples = data.samples;
    
            // Filter data where id = selected value 
            let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
            // Assign the first object to obj variable
            let obj = filteredData[0];
    
            console.log("obj:", obj);
    
            // Check if obj.sample_values is defined before using slice
            if (obj && obj.sample_values) {
                // Trace for the data for the horizontal bar chart
                let trace = [{
                    // Slice the top 10 otus
                    x: obj.sample_values.slice(0, 10).reverse(),
                    y: obj.otu_ids.slice(0, 10).map((otu_id) => `OTU ${otu_id}`).reverse(),
                    text: obj.otu_labels.slice(0, 10).reverse(),
                    type: "bar",
                    marker: {
                        color: "rgb(153, 22, 114)"
                    },
                    orientation: "h"
                }];
    
                // Use Plotly to plot the data in a bar chart
                Plotly.newPlot("bar", trace);
            } else {
                console.error("obj.sample_values is undefined or null");
            }
        });
    }
    
    // Make the bubble chart
    function bubble(selectedValue) {
        // Fetch the JSON data and console log it
        d3.json(url).then((data) => {
    
            // Add array of sample objects
            let samples = data.samples;
        
            // Filter data where id = selected value 
            let filteredData = samples.filter((sample) => sample.id === selectedValue);
        
            // Assign the first object to obj variable
            let obj = filteredData[0];
            
            // Trace for the data for the bubble chart
            let trace = [{
                x: obj.otu_ids,
                y: obj.sample_values,
                text: obj.otu_labels,
                mode: "markers",
                marker: {
                    size: obj.sample_values,
                    color: obj.otu_ids,
                    colorscale: "Sunset"
                }
            }];
        
            // Apply the x-axis lengend to the layout
            let layout = {
                xaxis: {title: "OTU ID"}
            };
        
            // Use Plotly to plot the data in a bubble chart
            Plotly.newPlot("bubble", trace, layout);
        });
    }
    
    function demo(selectedValue) {
        // Fetch the JSON data and console log it
        dataPromise.then(function(data) {
        console.log(data);
            
            let metadata = data.metadata;

            let dataFiltered = metadata.filter((meta) => meta.id == selectedValue);
            
            let object = dataFiltered[0]

            // Clear the child elements in div with id sample-metadata
            d3.select("#sample-metadata").html("");
  
            // Object.entries() is a built-in method in JavaScript 
            // This returns an array of a given object's own enumerable property [key, value]
            let entries = Object.entries(object);
            
            // Iterate through the entries array
            // Add a h5 child element for each key-value pair to the div with id sample-metadata
            entries.forEach(([key,value]) => {
                d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
            });
    
            // Log the entries Array
            console.log(entries);
        });
      }
      

    // Make the gauge chart 
    function gauge(selectedValue) {
        // Fetch the JSON data and console log it 
        d3.json(url).then((data) => {
            // An array of metadata objects
            let metadata = data.metadata;
            
            // Filter data where id = selected value 
            let filteredData = metadata.filter((meta) => meta.id == selectedValue);
          
            // Assign the first object to obj variable
            let obj = filteredData[0]
    
            // Trace for the data for the gauge chart
            let trace = [{
                domain: { x: [0, 1], y: [0, 1] },
                value: obj.wfreq,
                title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
                type: "indicator", 
                mode: "gauge+number",
                gauge: {
                    axis: {range: [null, 10]}, 
                    bar: {color: "rgb(187,255,51)"},
                    steps: [
                        { range: [0, 1], color: "rgb(233,245,248)" },
                        { range: [1, 2], color: "rgb(218,237,244)" },
                        { range: [2, 3], color: "rgb(203,230,239)" },
                        { range: [3, 4], color: "rgb(188,223,235)" },
                        { range: [4, 5], color: "rgb(173,216,230)" },
                        { range: [5, 6], color: "rgb(158,209,22)" },
                        { range: [6, 7], color: "rgb(143,202,221)" },
                        { range: [7, 8], color: "rgb(128,195,216)" },
                        { range: [8, 9], color: "rgb(113,187,212)" },
                        { range: [9, 10], color: "rgb(98,180,207)" }
                    ]
                }
            }];
    
             // Use Plotly to plot the data in a gauge chart
             Plotly.newPlot("gauge", trace);
        });
    }
    
    // Toggle to new plots when option changed
    function optionChanged(selectedValue) {
        bar(selectedValue);
        bubble(selectedValue);
         demo(selectedValue);
        gauge(selectedValue)
    }
    d3.select("#selDataset").on("change", function() {
        // Get the selected value
        var selectedValue = d3.select(this).property("value");

        // Call the function to update charts based on the selected value
        optionChanged(selectedValue);
    });

}
init();
