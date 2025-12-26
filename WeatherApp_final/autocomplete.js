/* This JavaScript File Targets the recommendation feature of the Search Bar. I used a youtube video to achieve this.
I have added comments both for my own understanding and also to make it easily readable. */

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");


let availableKeywords = []; // This will hold the data of all cities
let currentFocus = -1;

// Fetch all cities immediately when page loads
async function loadAllCities() {
    try {
        console.log("Loading city data...");
        const response = await fetch("https://countriesnow.space/api/v0.1/countries");
        const data = await response.json();
        console.log(data);// list of all cities along with their countries
        console.log(data.data.length);// 227 countries

        data.data.forEach(function(countryObj){ // iterating through each country
            countryObj.cities.forEach(function(city) { //Iterating through the cities of the country in the mother loop
                availableKeywords.push(`${city}, ${countryObj.country}`); // Adding the cities and countries to the list
            });
        });

        console.log("Database loaded:", availableKeywords.length, "cities."); // 76182 cities
        console.log("All cities:", availableKeywords);

    }

    catch (error) {
        console.error("Error loading cities:", error);

    }
}

loadAllCities();


// Typing

inputBox.onkeyup = function(e) {
    // Ignore navigation keys
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")
        return;

    let result = [];
    let input = inputBox.value;

    if (input.length >= 3) { // Show the recommendations when the length of the input is >=3
        result = availableKeywords.filter(function(keyword) {
            return keyword.toLowerCase().startsWith(input.toLowerCase());
        });
    }
    display(result);
    console.log(result);
}


// Navigation using Arrow Keys
inputBox.addEventListener("keydown", // action of physically pushing any key down.
    function(e) {

    let listItems = resultsBox.querySelectorAll("li");
    // querySelectorAll is a DOM that allows you to search for elements using CSS selectors(here, list)
    // It finds all elements that match the selector
    // This is the CSS selector you are passing to the method. It tells JavaScript to look for all List Item elements (<li>).

    console.log(listItems); // The output is a NodeList, which is an array of all these li type objects
    console.log(listItems.length);

    if (e.key === "ArrowDown") {
        currentFocus++;
        addActive(listItems);
    }
    else if (e.key === "ArrowUp") {
        currentFocus--;
        addActive(listItems);
    }
    else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFocus > -1) { // Checks if currently an item is highlighted
            if (listItems)
                listItems[currentFocus].click();

        } else { // If no element is highlighted

            // Search typed text directly
            checkWeather(inputBox.value);
            resultsBox.innerHTML = '';

        }
    }
});


// Display
function display(result) {
    currentFocus = -1; // Reset focus

    // If result is too huge, slice it. Showing 100 matches is usually enough
    const limitedResult = result.slice(0, 100);

    if (!limitedResult.length) {
        resultsBox.innerHTML = '';
        return;
    }

    const content = limitedResult.map((list) => {
        return `<li onclick="selectInput(this)">${list}</li>`;
    });

    resultsBox.innerHTML = "<ul>" + content.join("") + "</ul>";
}

// addActive func
function addActive(listItems) {

    if (!listItems || listItems.length === 0)
        return;

    if (currentFocus >= listItems.length)
        currentFocus = 0; // move to the first element of the list upon clicking down on the last element

    if (currentFocus < 0)
        currentFocus = listItems.length - 1; // move to the last element of the list upon clicking up on the first element

    // Remove active class from all
    listItems.forEach(function(item){
        item.classList.remove("active");
    });


    // Add active class to current
    listItems[currentFocus].classList.add("active");


    // Auto-scroll (we do not need to manually scroll down)
    listItems[currentFocus].scrollIntoView({ block: "nearest" });
}

// This function will be called after the onclick attribute
window.selectInput = function(element) { // element is the specific list item that was clicked
    let selectUserData = element.textContent;
    inputBox.value = selectUserData;
    resultsBox.innerHTML = '';

    // Now fetch the weather for this city
    checkWeather(selectUserData);
}

