data=[]
dataGrouped=[]
function handleKeyPress(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
}

function handleSearch() {
    // Add your search logic here
    var searchTerm = document.getElementById("searchInput").value;

    console.log("Searching for: " + searchTerm);
    getItems(searchTerm)
    // Replace the alert with your actual search functionality
}

function getItems(searchTerm){    
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    try {
    let q = searchTerm
    let url = "https://7pyngmccwa.execute-api.us-east-1.amazonaws.com/default/apitest?q="+q
      

    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => renderlist(result))
    .catch(error => console.log('error', error));
        
    } catch (error) {
      
     alert(error)
    
    }
    }
    
    function renderlist(notarrayItems){
    const arrayItems = Object.entries(notarrayItems);
    data=arrayItems.map( x=>x[1])

    groupBy(data,'id')
    // renderTable(arrayItems)

    }


function renderTable(data) {
    var tableBody = document.getElementById('dataBody');
    tableBody.innerHTML = ''; // Clear previous data

    data.forEach(item => {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        // Add more cells based on your API response structure

        cell1.textContent = item.id;

        var link = document.createElement('a');
        link.href = 'http://'+item.url;
        link.textContent = item.name;
        cell2.appendChild(link);

        // cell2.textContent = item.name;
        cell3.textContent = item.price;
        cell4.textContent = item.super;


        // Populate additional cells with corresponding data
    });
}



function groupBy(dataArray) {
    // Group the data by the specified key (e.g., 'id')
    let groupByCategory = (arr, key) => {
        return arr.reduce((result, obj) => {
          let category = obj[key];
          let existingGroup = result.find(group => group[0][key] === category);
      
          if (existingGroup) {
            existingGroup.push(obj);
          } else {
            result.push([obj]);
          }
      
          return result;
        }, []);
      };

    groupedArray = groupByCategory(dataArray, 'id');
    groupedArray.sort((a, b) => b.length - a.length)
    dataGrouped=groupedArray.flat()
    renderTable(dataGrouped);
}