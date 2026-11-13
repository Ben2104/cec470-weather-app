import React, { useState } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

function GetWeather() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({ loading: false, data: {}, error: false });

  const currentDateFunction = () => new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const fetchWeather = async (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const city = input.trim();
    if (!city || weather.loading) return;
    setWeather({ loading: true, data: {}, error: false });

    try {
      const { data } = await axios.get(weatherUrl, {
        params: { q: city, units: 'imperial', appid: apiKey },
      });
      setWeather({ data, loading: false, error: false });
      setInput('');
    } catch {
      setWeather({ loading: false, data: {}, error: true });
    }
  };

  return (
    <div className="App">
      <h1 className="app-name">Weather App</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Enter city name..."
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={fetchWeather}
        />
      </div>
      {weather.loading && (
        <div className="Loader"><Oval height={100} width={100} color="black" ariaLabel="Loading weather" /></div>
      )}
      {weather.error && (
        <span className="error-message">
          <FontAwesomeIcon icon={faFrown} /> <span style={{ fontSize: '20px' }}>City not found</span>
        </span>
      )}
      {weather.data.main && (
        <div>
          <div className="city-name">
            <h2>{weather.data.name}, <span>{weather.data.sys.country}</span></h2>
          </div>
          <div className="date"><span>{currentDateFunction()}</span></div>
          <div className="icon-temp">
            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
              alt={weather.data.weather[0].description}
            />
            {Math.round(weather.data.main.temp)}
            <sup className="deg">°F</sup>
          </div>
          <div className="des-wind">
            <p>{weather.data.weather[0].description}</p>
            <p>Wind Speed: {Math.round(weather.data.wind.speed)} mph</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetWeather;
