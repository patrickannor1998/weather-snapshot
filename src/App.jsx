import { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import WeatherHero from './components/WeatherHero';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import WeatherMetrics from './components/WeatherMetrics';
import SavedCities from './components/SavedCities';
import { fetchWeatherData, getWeatherDetails } from './services/weatherService';

const DEFAULT_LOCATION = {
  name: 'London',
  country: 'United Kingdom',
  lat: 51.5074,
  lon: -0.1278,
};

function App() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Load saved favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('weather_snapshot_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weather_snapshot_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage:', e);
    }
  }, [favorites]);

  // Temperature unit conversion helper
  const convertTemp = useCallback(
    (celsius) => {
      if (celsius === null || celsius === undefined) return 0;
      if (unit === 'F') {
        return Math.round((celsius * 9) / 5 + 32);
      }
      return Math.round(celsius);
    },
    [unit]
  );

  // Fetch weather data for target coordinates
  const loadWeather = useCallback(async (lat, lon, name, country) => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchWeatherData(lat, lon, name, country);
      setWeatherData(data);
      setLocation({ name: data.current.locationName, country: data.current.country, lat, lon });

      // Update dynamic background theme according to weather condition
      const condition = getWeatherDetails(data.current.weatherCode, data.current.isDay);
      document.body.className = `theme-${condition.category}`;
    } catch (err) {
      setError(err.message || 'Unable to retrieve forecast data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name, DEFAULT_LOCATION.country);
  }, [loadWeather]);

  // Handle location selection from search or favorites
  const handleSelectLocation = (lat, lon, name, country) => {
    loadWeather(lat, lon, name, country);
  };

  // Handle HTML5 Geolocation API
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await loadWeather(latitude, longitude, 'Your Location', '');
      },
      () => {
        setLoading(false);
        alert('Unable to access your location. Please check your browser permissions.');
      }
    );
  };

  // Toggle favorite bookmark for current location
  const isCurrentFavorite = favorites.some(
    (f) => Math.abs(f.lat - location.lat) < 0.01 && Math.abs(f.lon - location.lon) < 0.01
  );

  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      setFavorites(
        favorites.filter(
          (f) => !(Math.abs(f.lat - location.lat) < 0.01 && Math.abs(f.lon - location.lon) < 0.01)
        )
      );
    } else {
      setFavorites([
        ...favorites,
        { name: location.name, country: location.country, lat: location.lat, lon: location.lon },
      ]);
    }
  };

  const handleRemoveFavorite = (lat, lon) => {
    setFavorites(favorites.filter((f) => !(f.lat === lat && f.lon === lon)));
  };

  return (
    <div className="app-container">
      <div className="ambient-glow-orb" aria-hidden="true" />

      {/* Navigation Header */}
      <Navbar
        onSelectLocation={handleSelectLocation}
        onUseMyLocation={handleUseMyLocation}
        unit={unit}
        onToggleUnit={() => setUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
        onToggleFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Saved Cities Drawer */}
      <SavedCities
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectCity={handleSelectLocation}
        onRemoveFavorite={handleRemoveFavorite}
      />

      {/* Main Dashboard Layout */}
      {loading ? (
        <div className="state-container">
          <div className="main-spinner" aria-hidden="true" />
          <p className="state-title">Loading forecast data...</p>
        </div>
      ) : error ? (
        <div className="state-container error-state">
          <svg className="error-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="state-title">{error}</p>
          <button
            className="btn-retry"
            onClick={() => loadWeather(location.lat, location.lon, location.name, location.country)}
          >
            Try Again
          </button>
        </div>
      ) : (
        weatherData && (
          <main className="main-content">
            {/* Top Weather Hero */}
            <WeatherHero
              current={weatherData.current}
              unit={unit}
              convertTemp={convertTemp}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Two-Column Grid for Forecasts & Detailed Metrics */}
            <div className="content-grid-two-col">
              <div className="main-column">
                <HourlyForecast
                  hourly={weatherData.hourly}
                  convertTemp={convertTemp}
                  isDay={weatherData.current.isDay}
                />
                <WeatherMetrics current={weatherData.current} />
              </div>

              <div className="side-column">
                <WeeklyForecast daily={weatherData.daily} convertTemp={convertTemp} />
              </div>
            </div>
          </main>
        )
      )}
    </div>
  );
}

export default App;
