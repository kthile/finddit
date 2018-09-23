import reddit from "./redditapi.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

//Click listener for form button
searchForm.addEventListener("submit", e => {
  //get search term from textfield
  const searchTerm = searchInput.value;
  //get sort value from radio input, grab checked value
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  //get limit
  const searchLimit = document.getElementById("limit").value;

  //Input field validators
  if (searchTerm === "") {
    showMessage("Please add a search term", "alert-danger");
  }

  //clear input after search
  searchInput.value = "";

  //search reddit
  reddit.search(searchTerm, searchLimit, sortBy).then(results => {
    let output = '<div class="card-columns">';
    //loop through posts
    results.forEach(post => {
      //check for image
      //if post.preview exists, use first image in stored in array, else use the reddit guy image
      let image = post.preview
        ? post.preview.images[0].source.url
        : "https://upload.wikimedia.org/wikipedia/fr/f/fc/Reddit-alien.png";

      output += `
        <div class="card">
            <img class="card-img-top" src="${image}" alt="Card image cap">
          <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${truncateString(post.selftext, 100)}</p>
                <a href="${
                  post.url
                }" target="_blank" class="btn btn-primary">Read More</a>
                <hr>
                <span class="badge badge-secondary">Sub: ${
                  post.subreddit
                }</span>
                <span class="badge badge-darjk">Score: ${post.score}</span>
          </div>
        </div> 
        `;
    });
    output += "</div>";
    document.getElementById("results").innerHTML = output;
  });
  e.preventDefault();
});

//show alert message
function showMessage(message, className) {
  //create div
  const div = document.createElement("div");
  //add classes
  div.className = `alert ${className}`;
  //add text
  div.appendChild(document.createTextNode(message));
  //get parent container
  const searchContainer = document.getElementById("search-container");
  //get search
  const search = document.getElementById("search");
  //insert Message
  searchContainer.insertBefore(div, search);
  //timeout
  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

// Truncate String Function
function truncateString(myString, limit) {
  const shortened = myString.indexOf(" ", limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened);
}
