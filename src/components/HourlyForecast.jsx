import React from 'react';
import WeatherIcon from './WeatherIcons';

export default function HourlyForecast({ hourly = [], convertTemp, isDay = true }) {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="section-card hourly-forecast-card">
      <div className="section-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <h3>Hourly Forecast</h3>
        <span className="section-subtitle">Next 24 Hours</span>
      </div>

      <div className="hourly-scroll-container">
        {hourly.map((item, index) => {
          const displayTemp = convertTemp(item.temp);
          const isNow = index === 0;

          return (
            <div key={item.time} className={`hourly-item ${isNow ? 'is-now' : ''}`}>
              <span className="hourly-time">{isNow ? 'Now' : item.formattedTime}</span>
              <div className="hourly-icon-container">
                <WeatherIcon code={item.weatherCode} isDay={isDay} size={36} />
              </div>
              <span className="hourly-temp">{displayTemp}°</span>

              {item.pop > 0 && (
                <div className="hourly-pop" title="Precipitation Probability">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                  <span>{item.pop}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
