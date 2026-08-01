import React from 'react';
import WeatherIcon from './WeatherIcons';
import { getWeatherDetails } from '../services/weatherService';

export default function WeatherHero({
  current,
  unit,
  convertTemp,
  isFavorite,
  onToggleFavorite,
}) {
  if (!current) return null;

  const weatherInfo = getWeatherDetails(current.weatherCode, current.isDay);

  const displayTemp = convertTemp(current.temperature);
  const displayFeelsLike = convertTemp(current.feelsLike);
  const displayMax = convertTemp(current.maxTemp);
  const displayMin = convertTemp(current.minTemp);

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="weather-hero-card">
      <div className="hero-top">
        <div className="hero-location-info">
          <div className="location-title">
            <h2>{current.locationName}</h2>
            <button
              className={`bookmark-btn ${isFavorite ? 'bookmarked' : ''}`}
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-label="Save to favorites"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
          {current.country && <p className="hero-country">{current.country}</p>}
          <p className="hero-date">{todayDateStr}</p>
        </div>

        <div className="hero-condition-badge">
          <span className="condition-dot"></span>
          <span>{weatherInfo.label}</span>
        </div>
      </div>

      <div className="hero-main-content">
        <div className="hero-temp-section">
          <div className="main-temp-display">
            <span className="temp-number">{displayTemp}</span>
            <span className="temp-unit">°{unit}</span>
          </div>

          <div className="temp-range-badge">
            <span className="high-temp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              {displayMax}°
            </span>
            <span className="temp-sep">•</span>
            <span className="low-temp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
              {displayMin}°
            </span>
          </div>
        </div>

        <div className="hero-icon-wrapper">
          <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={110} />
        </div>
      </div>

      <div className="hero-quick-stats">
        <div className="quick-stat-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>
          <div>
            <span className="stat-label">Feels Like</span>
            <span className="stat-value">{displayFeelsLike}°{unit}</span>
          </div>
        </div>

        <div className="quick-stat-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <div>
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{current.humidity}%</span>
          </div>
        </div>

        <div className="quick-stat-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
          </svg>
          <div>
            <span className="stat-label">Wind</span>
            <span className="stat-value">{current.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
