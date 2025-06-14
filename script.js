// Autocomplete city names using GeoDB Cities API
const cityInput = document.getElementById("cityInput");
const datalist = document.getElementById("citySuggestions");

cityInput.addEventListener("input", async () => {
    const query = cityInput.value.trim();
    if (query.length < 2) return;

    const geoUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '6205d2f407msh45a5e77f3e8b26bp1499e5jsndd78c4e48ad1',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(geoUrl, options);
        const result = await response.json();
        datalist.innerHTML = "";
        result.data.forEach(city => {
            const option = document.createElement("option");
            option.value = `${city.city}, ${city.country}`;
            datalist.appendChild(option);
        });
    } catch (error) {
        console.error("Autocomplete error:", error);
    }
});

// Main weather fetch function
async function getWeather(city = null) {
    const apiKey = "26fb1c52cda924bcb5e2f02ba7b8a0b8";
    const resultDiv = document.getElementById("result");

    if (!city) {
        city = cityInput.value;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        resultDiv.innerHTML = `
            <h3>🌍 Weather in ${data.name}, ${data.sys.country}</h3>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
            🌡 Temperature: ${data.main.temp}°C<br>
            🥵 Feels Like: ${data.main.feels_like}°C<br>
            🌥 Condition: ${data.weather[0].description}<br>
            💧 Humidity: ${data.main.humidity}%<br>
            🧭 Pressure: ${data.main.pressure} hPa<br>
            💨 Wind: ${data.wind.speed} m/s<br>
            ☁️ Cloudiness: ${data.clouds.all}%<br>
            🌄 Sunrise: ${sunrise}<br>
            🌇 Sunset: ${sunset}<br>
        `;

        alert(`✅ Successfully shown weather of ${data.name} ,thank you for using this weather app made by Mikasal Marak.. `);
    } catch (error) {
        resultDiv.innerHTML = `<span style="color: yellow;">${error.message}</span>`;
    }
}

// Detect current location
function getLocationWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        const apiKey = "26fb1c52cda924bcb5e2f02ba7b8a0b8";
        const reverseUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(reverseUrl);
            const data = await response.json();
            const confirmUse = confirm(`📍 You are currently in ${data.name}. Do you want to get weather for this location?`);
            if (confirmUse) getWeather(data.name);
        } catch (error) {
            alert("Unable to detect location weather.");
        }
    });
}

// UI interaction handlers
document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector('input[type="text"]');
    const container = document.querySelector('.weather-container');
    const footer = document.querySelector('.footer');
    const useLocationButton = document.querySelector('#use-location');

    if (input && container && footer) {
        input.addEventListener('focus', () => {
            container.classList.add('expand');
            footer.classList.add('hide');
        });

        input.addEventListener('blur', () => {
            container.classList.remove('expand');
            footer.classList.remove('hide');
        });
    }

    if (useLocationButton) {
        useLocationButton.addEventListener('click', () => {
            if (container && footer) {
                container.classList.add('expand');
                footer.classList.add('hide');

                setTimeout(() => {
                    container.classList.remove('expand');
                    footer.classList.remove('hide');
                }, 4000);
            }

            getLocationWeather(); // Also trigger location fetch here
        });
    }
});

const weatherContainer = document.querySelector('.weather-container');
const searchBtn = document.querySelector('#search-btn');
const locationBtn = document.querySelector('#location-btn');
const footer = document.querySelector('.footer');

function expandContainer() {
    weatherContainer.classList.add('expand');
    footer?.classList.add('hide');
}

searchBtn?.addEventListener('click', () => {
    expandContainer();
    // Your weather fetch logic here
});

locationBtn?.addEventListener('click', () => {
    expandContainer();
    // Your location fetch logic here
});
