import { useEffect, useState } from 'react';

const DEFAULT_CITY = 'London';

function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [submittedCity, setSubmittedCity] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = async (place) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error('Unable to fetch location data.');
      }

      const geoData = await response.json();

      if (!geoData.results?.length) {
        throw new Error(`No weather data found for ${place}.`);
      }

      const { latitude, longitude } = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error('Unable to fetch weather data.');
      }

      const weatherData = await weatherResponse.json();
      setWeather({
        city: place,
        temperature: weatherData.current.temperature_2m,
        unit: '°C',
        description: getWeatherDescription(weatherData.current.weathercode),
      });
    } catch (err) {
      setWeather(null);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialWeather = async () => {
      if (!isMounted) return;
      await fetchWeather(DEFAULT_CITY);
    };

    loadInitialWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedCity(city.trim() || DEFAULT_CITY);
    fetchWeather(city.trim() || DEFAULT_CITY);
  };

  const handleRefresh = () => {
    fetchWeather(submittedCity);
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1>Weather Snapshot</h1>
        <p className="subtitle">Check the latest forecast from Open-Meteo.</p>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Enter a city"
          />
          <button type="submit">Search</button>
        </form>

        <div className="actions">
          <button type="button" onClick={handleRefresh} disabled={loading}>
            Refresh
          </button>
        </div>

        {loading && <div className="status">Loading weather...</div>}
        {error && <div className="status error">{error}</div>}

        {!loading && !error && weather && (
          <div className="weather-card">
            <h2>{weather.city}</h2>
            <p className="temp">{weather.temperature} {weather.unit}</p>
            <p>{weather.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail',
  };

  return descriptions[code] || 'Weather conditions available';
}

export default App;
