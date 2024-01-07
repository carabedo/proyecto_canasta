let df = []
const outputDiv = document.getElementById('output');

d3.csv('./data_canasta.csv').then(function(data) {
    console.log(data.length)
    document.getElementById('output').innerText = 'Cargados: ' + data.length + ' items.'
    df=data
    ;
  });

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    if (df.length === 0) {
        outputDiv.innerText = 'No CSV data available.';
        return;
    }

    // Filter the data based on the user's search input
    const filteredData = df.filter(row => {
        // Customize this based on your data structure
        return Object.values(row).some(value => value.toLowerCase().includes(searchTerm));
    });

    // Display the filtered data
    // outputDiv.innerText = JSON.stringify(filteredData, null, 2);

    // displayCSVContent(filteredData);
    populateDropdown(filteredData);

}


function populateDropdown(filteredData) {
    const dropdown = document.getElementById('filterDropdown');
    dropdown.innerHTML = '<option value="">Select Filter</option>';

    if (filteredData.length > 0) {
        const key = 'id'
        const uniqueValues = [...new Set(filteredData.map(row => row[key]))];
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = `${key}:${value}`;
            option.textContent = `${key}: ${value}`;
            dropdown.appendChild(option);
        });

    }

}

function handleDropdownChange() {
    const dropdown = document.getElementById('filterDropdown');
    const selectedValue = dropdown.value;
    if (selectedValue) {
        const [key, value] = selectedValue.split(':');
        const searchTerm = value.trim().toLowerCase();

        const filteredData = df.filter(row => row[key].toLowerCase() === searchTerm);
        miChart(filteredData);

    }
}

function displayCSVContent(dataToDisplay) {
    const outputDiv = document.getElementById('output');

    if (dataToDisplay.length === 0) {
        outputDiv.innerText = 'No CSV data available.';
        return;
    }

    // Display the data in a table
    const table = document.createElement('table');
    const headerRow = table.insertRow(0);

    // Create table headers based on the keys in the first data row
    Object.keys(dataToDisplay[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    // Populate the table with data
    dataToDisplay.forEach(rowData => {
        const row = table.insertRow();
        Object.values(rowData).forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
    });

    // Replace existing content with the new table
    outputDiv.innerHTML = '';
    outputDiv.appendChild(table);
}



function miChart(df_f){
// Parse date strings into JavaScript Date objects
var parseDate = d3.timeParse('%Y-%m-%d');

df_f.forEach(function(d) {
    d.fecha = parseDate(d.fecha);
    d.price = +d.price;
});

// Group the data by the 'super' key
var groupedData = {};
df_f.forEach(function(d) {
    if (!groupedData[d.super]) {
        groupedData[d.super] = { x: [], y: [], type: 'scatter', mode: 'lines', name: d.super };
    }
    groupedData[d.super].x.push(d.fecha);
    groupedData[d.super].y.push(d.price);
});

// Convert the grouped data to an array
var plotData = Object.values(groupedData);

// Set up the layout
var layout = {
    title: 'Price vs Time',
    xaxis: {
        title: 'Time'
    },
    yaxis: {
        title: 'Price'
    }
};

// Plot the chart
Plotly.newPlot('chart-container', plotData, layout);
}


function createChart(dataToChart) {
    const chartDiv = document.getElementById('chart');

    if (dataToChart.length === 0) {
        chartDiv.innerHTML = 'No data available for chart.';
        return;
    }

    // Extract datetime values
    const datetimeValues = dataToChart.map(row => row.fecha);

    // Create a simple line chart using D3
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select('#chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Parse the datetime values
    const parseTime = d3.timeParse('%Y-%m-%d');
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(parseTime(d.datetime)))
        .y(d => y(d.yourNumericDataField));

    dataToChart.forEach(d => {
        d.datetime = parseTime(d.datetime);
        // Add your numeric data field here
        d.yourNumericDataField = +d.yourNumericDataField;
    });

    x.domain(d3.extent(dataToChart, d => d.datetime));
    y.domain([0, d3.max(dataToChart, d => d.yourNumericDataField)]);

    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y));

    svg.append('path')
        .data([dataToChart])
        .attr('class', 'line')
        .attr('d', line);
}

// function loadCSVFromGitHub() {
//     // Replace the following URL with the raw URL of your CSV file on GitHub.
//     const githubRawURL = './data_canasta.csv';
    
//     // Fetch the CSV file from GitHub
//     fetch(githubRawURL)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Network response was not ok: ${response.status}`);
//             }
//             return response.text();
//         })
//         .then(csvContent => {
//             // Display the CSV content
//             document.getElementById('output').innerText = csvContent;
//         })
//         .catch(error => {
//             console.error('Error fetching CSV:', error.message);
//             document.getElementById('output').innerText = 'Error fetching CSV from GitHub.';
//         });
// }