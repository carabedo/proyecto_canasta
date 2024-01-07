let df = []
const outputDiv = document.getElementById('output');

d3.csv('./data_canasta.csv').then(function(data) {
    console.log(data.length)
    document.getElementById('output').innerText = '' + data.length + ' registros'
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
    title: df_f[0].name,
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
