import axios from "axios";
import { useState, useEffect } from "react";
import WeatherIcon from "./WeatherIcon";

const CountryList = ({ countriesToDisplay, setCountriesToDisplay }) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const [weatherData, setWeatherData] = useState(null);

  const iconCode = weatherData ? weatherData.weather[0].icon : null;
  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null;

  useEffect(() => {
    if (countriesToDisplay.length !== 1) return;
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${countriesToDisplay[0].capital[0]}&appid=${apiKey}&units=metric`,
        );
        // console.log("Weather data:", response.data);
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();
  }, [countriesToDisplay]);

  try {
    if (countriesToDisplay.length === 0) return;
    else if (countriesToDisplay.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (
      countriesToDisplay.length > 1 &&
      countriesToDisplay.length <= 10
    ) {
      return (
        <div>
          {countriesToDisplay.map((country) => (
            <p key={country.name.common}>
              {country.name.common}
              <button onClick={() => setCountriesToDisplay([country])}>
                show
              </button>
            </p>
          ))}
        </div>
      );
    } else if (countriesToDisplay.length === 1) {
      return (
        <>
          <div>
            <h1>{countriesToDisplay[0].name.common}</h1>
            <p>Capital: {countriesToDisplay[0].capital}</p>
            <p>Area: {countriesToDisplay[0].area}</p>
          </div>
          <div>
            <h2>languages</h2>
            <ul>
              {Object.values(countriesToDisplay[0].languages).map(
                (language) => (
                  <li key={language}>{language}</li>
                ),
              )}
            </ul>
          </div>
          <div>
            <img
              src={countriesToDisplay[0].flags.png}
              alt={countriesToDisplay[0].flags.alt}
              style={{ width: "200px", height: "auto" }}
            />
          </div>
          {weatherData && (
            <div>
              <h2>Weather in {countriesToDisplay[0].capital[0]}</h2>
              <p>Temperature: {weatherData.main.temp} °C</p>
              <div>
                {/* <img src={iconUrl} alt={weatherData.weather[0].description} /> */}
                <WeatherIcon weatherData={weatherData} />
              </div>
              <p>wind: {weatherData.wind.speed} m/s</p>
            </div>
          )}
        </>
      );
    }
  } catch (error) {
    console.error("Error rendering CountryList:", error);
    return <p>Error rendering country list.</p>;
  }
};

export default CountryList;
