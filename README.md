# CECS 470 Weather App

A React app that looks up current weather by city using the OpenWeatherMap API. It shows the city and country, weekday and date, Fahrenheit temperature, cloud conditions, and wind speed in miles per hour.

## Run locally

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env.local`.
3. Add your OpenWeatherMap API key to `VITE_OPENWEATHER_API_KEY` in `.env.local`.
4. Run `npm install`, then `npm run dev`.
5. Open the local URL printed by Vite.

Press Enter or select Search to look up a city. Invalid city names display an error. API keys are read from the local environment and excluded from Git.
