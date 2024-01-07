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

    displayCSVContent(filteredData);
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