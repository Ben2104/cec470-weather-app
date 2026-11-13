import { useState } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faFrown, faMagnifyingGlass, faWind } from '@fortawesome/free-solid-svg-icons';

const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default function GetWeather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function search(event) {
    event.preventDefault();
    const query = city.trim();
    if (!query || loading) return;
    if (!apiKey) {
      setError('Add your OpenWeatherMap API key to .env.local to search.');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const { data } = await axios.get(weatherUrl, {
        params: { q: query, units: 'imperial', appid: apiKey },
      });
      setWeather(data);
      setCity('');
    } catch (err) {
      setError(err.response?.status === 404 ? 'City not found. Check the spelling and try again.' : 'Weather could not be loaded. Try again shortly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="weather-app" aria-label="City weather search">
        <header className="topline">
          <span className="brand-mark"><FontAwesomeIcon icon={faCloud} /></span>
          <span>FIELD NOTES <i>/</i> WEATHER</span>
          <span className="live-label"><span /> LIVE CONDITIONS</span>
        </header>

        <div className="intro">
          <p className="eyebrow">A little closer to outside</p>
          <h1>Weather,<br /><em>where you are.</em></h1>
          <p className="lede">Current conditions for any city around the world.</p>
        </div>

        <form className="search" onSubmit={search}>
          <label htmlFor="city">CITY OR PLACE</label>
          <div className="search-row">
            <input
              id="city"
              type="search"
              placeholder="Try San Francisco"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              autoComplete="off"
              required
            />
            <button type="submit" disabled={loading} aria-label="Search weather">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <span>{loading ? 'Searching' : 'Search'}</span>
            </button>
          </div>
        </form>

        <div className="result" aria-live="polite" aria-busy={loading}>
          {loading && <div className="loading"><Oval height={34} width={34} color="#315f4c" secondaryColor="#dce5dc" strokeWidth={4} ariaLabel="Loading weather" /><span>Finding current conditions</span></div>}
          {error && <p className="message error"><FontAwesomeIcon icon={faFrown} /> {error}</p>}
          {weather && (
            <article className="forecast">
              <div className="forecast-heading">
                <div>
                  <p className="eyebrow">CURRENT CONDITIONS</p>
                  <h2>{weather.name}<span>, {weather.sys.country}</span></h2>
                  <p className="date">{formatDate(new Date())}</p>
                </div>
                <img
                  className="weather-icon"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              </div>
              <div className="conditions">
                <div className="temperature">{Math.round(weather.main.temp)}<sup>°F</sup></div>
                <div className="condition-detail">
                  <p className="sky">{weather.weather[0].description}</p>
                  <p><FontAwesomeIcon icon={faWind} /> Wind <strong>{Math.round(weather.wind.speed)} mph</strong></p>
                  <p><FontAwesomeIcon icon={faCloud} /> Cloud cover <strong>{weather.clouds.all}%</strong></p>
                </div>
              </div>
            </article>
          )}
          {!loading && !weather && !error && <p className="hint">Search a city to see its weather.</p>}
        </div>

        <footer><span>OPENWEATHERMAP DATA</span><span>MEASURED IN °F <i>·</i> WIND IN MPH</span></footer>
      </section>
    </main>
  );
}
