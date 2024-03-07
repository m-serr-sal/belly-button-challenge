//store URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

    //use d3 library to read in samples.json
    d3.json(url).then(function(data) {
        console.log(data);
    });

    function init() {
        //dropdown menu selection using d3
        let dropdownMenu = d3.select("#selDataset");

        //get sample names using d3
        d3.json(url).then((data) => {

            //variable for sample samples
            let names = data.names;

            //add samples to dropdown menu
            names.forEach((id) => {
                // log the value of id for each iteration of the loop
                console.log(id);

                dropdownMenu.append("option")
                .text(id)
                .property("value",id);
            });

            //set the first sample from list
            let sample_one = names[0];
            console.log(sample_one);

            //build initial plots
            buildMetadata(sample_one);
            buildBarChart(sample_one);
            buildBubbleChart(sample_one);

        });
    };
    
// function to populate metadata info
function buildMetadata(sample) {
    // retrieve data with d3
    d3.json(url).then((data)=> {
        // retrieve all metadata
        let metadata = data.metadata;

        //filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);
        console.log(value)

        //get the first index from the array
        let valueData = value[0];

        //clear metadata
        d3.select("#sample-metadata").html("");

        Object.entries(valueData).forEach(([key,value]) => {
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}:${value}`);
        });

    });
    
};

//build the bar chart
function buildBarChart(sample){

    // retrieve all of data with d3
    d3.json(url).then((data) => {

        //retrieve all sample data
        let sampleInfo = data.samples;

        //filter data
        let value = sampleInfo.filter(result => result.id == sample);

        // get first index from the array
        let valueData = value[0];

        //get the otu_ids, labels, sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //log the data to the console
        console.log(otu_ids, otu_labels, sample_values);

        //set in descending order top 10 samples
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        //layout
        let layout = {
            title: "Top 10 OTU Present"
        };

        // Plot chart with plotly
        Plotly.newPlot("bar", [trace], layout)
    });
};

//build the bubble chart
function buildBubbleChart(sample){

    // retrieve all of data with d3
    d3.json(url).then((data) => {

        //retrieve all sample data
        let sampleInfo = data.samples;

        //filter data
        let value = sampleInfo.filter(result => result.id == sample);

        // get first index from the array
        let valueData = value[0];

        //get the otu_ids, labels, sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //log the data to the console
        console.log(otu_ids, otu_labels, sample_values);

        //set up the trace for bubblr chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        //layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Plot chart with plotly
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

init();