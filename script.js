"use-strict";

const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

  let store = null

async function displayData(data) {
  store = [...data];
  let tableContainer = document.getElementById("table-container");
  let table = document.createElement("table");

  let tableBody = document.createElement("tbody");

  data.forEach((element) => {
    let tableRow = document.createElement("tr");
    tableRow.innerHTML = `
              <td>
               <div>
                 <img src=${element.image} alt="student image">
                <span class="name">${element.name}</span>
               </div>
              </td>
              <td>
              <span class="symbol">${element.symbol}</span>
              </td>
              <td>$${element.current_price}</td>
              <td>$${element.total_volume}</td>
              <td class="${
                element.market_cap_change_percentage_24h > 0 ? "green" : "red"
              } percentage">${element.market_cap_change_percentage_24h}
              </td>
              <td class="mkt-cap">Mkt Cap:${element.market_cap}</td>
        `;

    tableBody.appendChild(tableRow);
    table.appendChild(tableBody);
  });
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}

function fetchDataThen(url) {
  fetch(url)
  .then(response => {
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => displayData(data)
  )
  .catch(error => console.log("Error: ", error)
  );
}

async function fetchDataAsync(url) {
  try {
    const response = await fetch(url);

    if(!response.ok) {
      console.log("here");
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json()
    displayData(data)
  } catch(error) {
    console.error("Error:", error);
  }
}


function search(event) {
  let searchInput = event.target;
  const filter = searchInput.value.toLowerCase();
  const elements = document.querySelectorAll("tr");

  for(const item of elements) {
    let name = item.querySelector(".name").textContent.toLocaleLowerCase();
    let symbol = item.querySelector(".symbol").textContent.toLocaleLowerCase();
    
    if(filter === "" || name.indexOf(filter) !== -1 || symbol.indexOf(filter) !== -1) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
}

function sort(key) {
  store.sort((a, b) => b[key] - a[key])
  displayData(store)
}

document.addEventListener("DOMContentLoaded", function() {
let searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", search);

let sortByMktCapBtn = document.getElementById("mkt-cap");
sortByMktCapBtn.addEventListener("click", function() {
  sort("market_cap")
})

let sortByPercentageBtn = document.getElementById("percentage");
sortByPercentageBtn.addEventListener("click", function () {
  sort("market_cap_change_percentage_24h");
});

  fetchDataAsync(url);
  searchInput.value = "";
  // fetchDataThen(url);
});