import React from 'react';
import WeatherIcon from './WeatherIcons';
import { getWeatherDetails } from '../services/weatherService';

export default function WeeklyForecast({ daily = [], convertTemp }) {
  if (!daily || daily.length === 0) return null;

  // Calculate overall min & max across the 7 days for range bar rendering
  const allMins = daily.map((d) => d.minTemp);
  const allMaxs = daily.map((d) => d.maxTemp);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalRange = globalMax - globalMin || 1;

  return (
    <div className="section-card weekly-forecast-card">
      <div className="section-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <h3>7-Day Forecast</h3>
      </div>

      <div className="weekly-list">
        {daily.map((day) => {
          const info = getWeatherDetails(day.weatherCode, true);
          const minDisp = convertTemp(day.minTemp);
          const maxDisp = convertTemp(day.maxTemp);

          // Calculate bar percentage offsets relative to week's range
          const leftPercent = ((day.minTemp - globalMin) / globalRange) * 100;
          const widthPercent = Math.max(((day.maxTemp - day.minTemp) / globalRange) * 100, 12);

          return (
            <div key={day.time} className={`weekly-item ${day.dayName === 'Today' ? 'is-today' : ''}`}>
              <div className="day-info">
                <span className="day-name">{day.dayName}</span>
                <span className="day-date">{day.formattedDate}</span>
              </div>

              <div className="day-condition">
                <WeatherIcon code={day.weatherCode} size={28} />
                <span className="condition-text">{info.label}</span>
              </div>

              <div className="temp-bar-container">
                <span className="temp-min">{minDisp}°</span>
                <div className="range-bar-track">
                  <div
                    className="range-bar-fill"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  ></div>
                </div>
                <span className="temp-max">{maxDisp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
