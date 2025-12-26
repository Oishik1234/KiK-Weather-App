/* This is the JavaScript File which fetches the weather data using an API_KEY from the url mentioned below, and
also displays it on the web interface. */

const API_KEY = "5a4028d402064558869212359250512";
const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";

const searchBox = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-button");
const weatherIcon = document.getElementById("weather-icon");
const weatherCard = document.querySelector(".middle-section1");
const search1 = document.querySelector(".search");
const Weathernavbar1 =document.querySelector(".Weather-navbar");
const about1=document.querySelector(".About");
let isCelsius = true;
let data=null;

window.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('user-greeting');
    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));
    const sessionActive = localStorage.getItem('isLoggedIn');

    if (sessionActive === 'true' && savedUser) {
        const hour = new Date().getHours();
        let timeGreeting = "Good Morning";

        if (hour >= 12 && hour < 17) timeGreeting = "Good Afternoon";
        else if (hour >= 17) timeGreeting = "Good Evening";

        // Set the content and make it visible
        greetingElement.innerHTML = `${timeGreeting}, <span class="user-name">${savedUser.firstname}</span>`;
        greetingElement.style.display = 'inline-block';
    } else {
        // Keep it hidden for guest users (Optional Auth requirement)
        greetingElement.style.display = 'none';
    }
});

function checkAuthStatus() {
    const sessionActive = localStorage.getItem('isLoggedIn');
    const logoutBtn = document.getElementById('logout-btn');
    const signupLink = document.querySelector('.signup-link');

    if (sessionActive === 'true') {
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (signupLink) signupLink.style.display = 'none'; // Hide signup if already logged in
    } else {
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (signupLink) signupLink.style.display = 'block';
    }
}
checkAuthStatus();

document.getElementById("unit-toggle").onclick = function () {
        if (isCelsius) {
            isCelsius = !isCelsius;
            document.getElementById("unit-toggle").innerHTML = "Switch to °C";
        } else {
            isCelsius = !isCelsius;
            document.getElementById("unit-toggle").innerHTML = "Switch to °F";
        }

        checkWeather(searchBox.value);
    }
async function checkWeather(city) {
    // If no city is entered
    if (!city) {
        window.alert("Please enter a city name");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&days=7`);

        if (!response.ok) {
            weatherCard.style.display = "block";
            document.querySelector(".error").style.display = "block";
            document.querySelector(".Weather").style.display= "none";

        } else {
            data = await response.json();
            console.log(data);
            console.log(data.forecast.forecastday);

            // is_day: 1 = Day, 0 = Night
            if (data.current.is_day === 1) {
                document.body.className = 'day-theme';
            } else {
                document.body.className = 'night-theme';
            }

            weatherCard.style.display = "block";

            weatherCard.scrollIntoView({ behavior: "smooth", block: "center" });


            // Display City, Country, Date and Time
            document.querySelector(".city").innerHTML = data.location.name + ", " + data.location.country;
            document.querySelector(".date_time").innerHTML=data.location.localtime;

            // Display Temp
            if(isCelsius)
                document.querySelector(".temp").innerHTML = Math.round(data.current.temp_c) + "°C"; // Use temp_c for standard temp
            else
                document.querySelector(".temp").innerHTML = Math.round(data.current.temp_f) + "°F";

            // Display Weather Details
            document.querySelector(".weather_name_text").innerHTML = data.current.condition.text;
            document.querySelector(".Humidity").innerHTML=data.current.humidity+"%";
            document.querySelector(".wind").innerHTML=data.current.wind_kph+" kph";
            document.querySelector(".pressure").innerHTML=data.current.pressure_mb+" mb";

            weatherIcon.src = "https:" + data.current.condition.icon;

            document.querySelector(".Weather").style.display="block";
            document.querySelector(".error").style.display = "none";

            const forecastGrid = document.getElementById('forecast-grid');
            forecastGrid.innerHTML = "";

            data.forecast.forecastday.forEach(function(day){

                const date = new Date(day.date).toDateString().split(' ').slice(0,3).join(' ');

                let temp;

                if(isCelsius)
                    temp = Math.round(day.day.avgtemp_c) + "°C";
                else
                    temp = Math.round(day.day.avgtemp_f) + "°F";

                const icon = "https:" + day.day.condition.icon;

                const card = `
                    <div>
                        <p 
                            style="font-weight: bold;
                        ">
                            ${date}
                        </p>
                        
                        <img src="${icon}" alt="icon" style="width: 50px;">
                        <p>${temp}</p>
                        <p style="font-size: 12px; color: #777;">${day.day.condition.text}</p>
                    </div>
                `;
                forecastGrid.innerHTML += card;
            });
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}


// Hamburger Menu (on reducing screen size)
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.right-section').classList.toggle('active');
});


// Allow pressing "Enter" key to search
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Allow pressing "search button" to search
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

console.log(searchBox);

// Navigation Bar Functionality

const navSearchBtn = document.querySelector(".search");
const navWeatherBtn = document.querySelector(".Weather-navbar");
const navAboutBtn = document.querySelector(".About");

const searchSection = document.querySelector(".search-box");
const aboutSection = document.getElementById("about");

// Scroll to Search
navSearchBtn.addEventListener("click", () => {
    searchSection.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("input-box").focus();
});

// Scroll to About
navAboutBtn.addEventListener("click", () => {
    aboutSection.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Scroll to Weather
navWeatherBtn.addEventListener("click", () => {
    // Scroll to the weather card smoothly
    if (window.getComputedStyle(weatherCard).display !== "none") {
        weatherCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    else {
        // If the weather card hasnt been displayed yet
        alert("Please search for a city first to see the weather.");
        searchSection.scrollIntoView({ behavior: "smooth", block: "center" });
        document.getElementById("input-box").focus();
    }
});

// Back To Top Button
const backToTopButton = document.getElementById("back-to-top");

backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
});

// --- AUTHENTICATION & UI LOGIC ---

// 1. Define the UI Refresh Function
function refreshAuthUI() {
    const sessionActive = localStorage.getItem('isLoggedIn');
    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

    const logoutBtn = document.getElementById('logout-btn');
    const signupLink = document.querySelector('.signup-link'); // Ensure your HTML has this class
    const greetingElement = document.getElementById('user-greeting');

    if (sessionActive === 'true') {
        // User is logged in: Show logout, hide signup
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (signupLink) signupLink.style.display = 'none';

        // Populate and show the personalized greeting
        if (greetingElement && savedUser) {
            const hour = new Date().getHours();
            let timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

            greetingElement.innerHTML = `${timeGreeting}, <span class="user-name">${savedUser.firstname}</span>`;
            greetingElement.style.display = 'inline-block';
        }
    } else {
        // Guest mode: Hide logout & greeting, show signup
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (signupLink) signupLink.style.display = 'block';
        if (greetingElement) {
            greetingElement.style.display = 'none';
            greetingElement.innerHTML = '';
        }
    }
}

// 2. Add the Silent Logout Event Listener
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn'); // Clear login flag
        refreshAuthUI(); // Update interface immediately
        alert("Logged out! You are now in Guest Mode.");
    });
}

// 3. Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', refreshAuthUI);