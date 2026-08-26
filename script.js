async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "";
  
  if (searchInput == "") {
    weatherDataSection.innerHTML = `
    <div>
      <h2>Empty Input!</h2>
      <p>Please try again with a valid <u>city name</u>.</p>
    </div>
    `;
    return;
  }
async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")}&limit=1&appid=${apiKey}`;
    
    const response = await fetch(geocodeURL);
    
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }
    const data = await response.json();
    
    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherDataSection.innerHTML = `
      <div>
        <h2>Invalid Input: "${searchInput}"</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    } else {
      return data[0];
    }
  }

async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(weatherURL);

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastURL);
    
    if (!response.ok || !forecastResponse.ok) {
      console.log("Bad response!");
      return;
    }

    const data = await response.json();
    const forecastData = await forecastResponse.json();

    // Sacamos el clima aproximado de mañana y pasado mañana
    const manana = forecastData.list[7]; 
    const pasado = forecastData.list[15];

    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
    <div>
      <h2>${data.name}</h2>
      <p><strong>Temperatura:</strong> ${Math.round(data.main.temp)}°C</p>
      <p><strong>Humedad:</strong> ${data.main.humidity}%</p>
      <p><strong>Viento:</strong> ${data.wind.speed} m/s</p>
      <p><strong>Descripción:</strong> ${data.weather[0].description}</p>
      
      <hr style="margin: 15px 0; border: 1px solid #ccc;">
      
      <h3>Pronóstico Extendido</h3>
      <p style="display: flex; align-items: center; justify-content: center; gap: 8px; margin: 5px 0;">
        <img src="https://openweathermap.org/img/wn/${manana.weather[0].icon}.png" width="40" />
        <strong>Mañana:</strong> ${Math.round(manana.main.temp)}°C, ${manana.weather[0].description}
      </p>
      <p style="display: flex; align-items: center; justify-content: center; gap: 8px; margin: 5px 0;">
        <img src="https://openweathermap.org/img/wn/${pasado.weather[0].icon}.png" width="40" />
        <strong>Pasado:</strong> ${Math.round(pasado.main.temp)}°C, ${pasado.weather[0].description}
      </p>
    </div>
    `;
  }

  document.getElementById("search").value = "";
  
  const geocodeData = await getLonAndLat();
  
  if (geocodeData) {
    getWeatherData(geocodeData.lon, geocodeData.lat);
  }

}
const searchInput = document.getElementById("search");

searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    // Si es Enter, ejecutamos la función del clima
    fetchWeather();
  }
});