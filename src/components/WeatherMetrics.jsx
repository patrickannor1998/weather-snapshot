import React from 'react';

export default function WeatherMetrics({ current }) {
  if (!current) return null;

  // Convert wind degrees to cardinal direction
  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(deg / 45) % 8;
    return directions[idx];
  };

  // Humidity rating
  const getHumidityDesc = (val) => {
    if (val < 30) return 'Dry Air';
    if (val <= 60) return 'Optimal Comfort';
    if (val <= 80) return 'Humid';
    return 'Very High Humidity';
  };

  // UV rating & badge color class
  const getUVRating = (uv) => {
    if (uv <= 2) return { text: 'Low', colorClass: 'uv-low' };
    if (uv <= 5) return { text: 'Moderate', colorClass: 'uv-mod' };
    if (uv <= 7) return { text: 'High', colorClass: 'uv-high' };
    if (uv <= 10) return { text: 'Very High', colorClass: 'uv-vhigh' };
    return { text: 'Extreme', colorClass: 'uv-extreme' };
  };

  const windDir = getWindDirection(current.windDirection);
  const humidityDesc = getHumidityDesc(current.humidity);
  const uvInfo = getUVRating(current.uvIndex);

  return (
    <div className="metrics-grid">
      {/* Wind Card */}
      <div className="metric-card">
        <div className="metric-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
          </svg>
          <h4>Wind</h4>
        </div>
        <div className="metric-main">
          <span className="metric-value">{current.windSpeed}</span>
          <span className="metric-unit">km/h</span>
        </div>
        <div className="metric-footer">
          <div className="compass-badge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            >
              <polygon points="12 2 19 21 12 17 5 21 12 2" fill="currentColor" />
            </svg>
            <span>{windDir} ({current.windDirection}°)</span>
          </div>
        </div>
      </div>

      {/* Humidity Card */}
      <div className="metric-card">
        <div className="metric-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <h4>Humidity</h4>
        </div>
        <div className="metric-main">
          <span className="metric-value">{current.humidity}</span>
          <span className="metric-unit">%</span>
        </div>
        <div className="metric-footer">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${current.humidity}%` }}></div>
          </div>
          <span className="sub-desc">{humidityDesc}</span>
        </div>
      </div>

      {/* UV Index Card */}
      <div className="metric-card">
        <div className="metric-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <h4>UV Index</h4>
        </div>
        <div className="metric-main">
          <span className="metric-value">{current.uvIndex}</span>
          <span className={`uv-tag ${uvInfo.colorClass}`}>{uvInfo.text}</span>
        </div>
        <div className="metric-footer">
          <div className="uv-meter">
            <div className="uv-meter-fill" style={{ width: `${Math.min((current.uvIndex / 12) * 100, 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Sunrise & Sunset Card */}
      <div className="metric-card sun-cycle-card">
        <div className="metric-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 18a5 5 0 0 0-10 0" />
            <line x1="12" y1="2" x2="12" y2="9" />
            <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
            <line x1="1" y1="18" x2="3" y2="18" />
            <line x1="21" y1="18" x2="23" y2="18" />
            <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
            <line x1="23" y1="22" x2="1" y2="22" />
          </svg>
          <h4>Sunrise & Sunset</h4>
        </div>
        <div className="sun-times-row">
          <div className="sun-time-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <div>
              <span className="sun-label">Sunrise</span>
              <span className="sun-value">{current.sunrise}</span>
            </div>
          </div>
          <div className="sun-time-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            <div>
              <span className="sun-label">Sunset</span>
              <span className="sun-value">{current.sunset}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Air Pressure Card */}
      <div className="metric-card">
        <div className="metric-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <h4>Pressure</h4>
        </div>
        <div className="metric-main">
          <span className="metric-value">{current.pressure}</span>
          <span className="metric-unit">hPa</span>
        </div>
        <div className="metric-footer">
          <span className="sub-desc">
            {current.pressure > 1013 ? 'High Pressure System' : 'Standard Atmospheric Pressure'}
          </span>
        </div>
      </div>

      {/* Daylight / Air Feel Card */}
      <div className="metric-card">
        <div className="metric-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <h4>Visibility & Mode</h4>
        </div>
        <div className="metric-main">
          <span className="metric-value">{current.isDay ? 'Daytime' : 'Nighttime'}</span>
        </div>
        <div className="metric-footer">
          <span className="sub-desc">
            {current.isDay ? 'Clear solar radiation' : 'Starlight ambient visibility'}
          </span>
        </div>
      </div>
    </div>
  );
}
