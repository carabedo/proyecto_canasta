function loadCSVFromGitHub() {
    // Replace the following URL with the raw URL of your CSV file on GitHub.
    const githubRawURL = './data_canasta.csv';
    
    // Fetch the CSV file from GitHub
    fetch(githubRawURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.text();
        })
        .then(csvContent => {
            // Display the CSV content
            document.getElementById('output').innerText = csvContent;
        })
        .catch(error => {
            console.error('Error fetching CSV:', error.message);
            document.getElementById('output').innerText = 'Error fetching CSV from GitHub.';
        });
}