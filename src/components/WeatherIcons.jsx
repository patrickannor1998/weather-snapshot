import React from 'react';

/**
 * Animated SVG Weather Icons Component
 */
export default function WeatherIcon({ code = 0, isDay = true, size = 48, className = '' }) {
  const codeNum = Number(code);

  // Clear Sky
  if (codeNum === 0 || codeNum === 1) {
    if (isDay) {
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={`weather-icon sun-icon ${className}`}>
          <circle cx="32" cy="32" r="14" fill="url(#sunGradient)" />
          <g className="sun-rays" stroke="url(#sunGradient)" strokeWidth="3" strokeLinecap="round">
            <line x1="32" y1="6" x2="32" y2="12" />
            <line x1="32" y1="52" x2="32" y2="58" />
            <line x1="6" y1="32" x2="12" y2="32" />
            <line x1="52" y1="32" x2="58" y2="32" />
            <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
            <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
            <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
            <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
          </g>
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD000" />
              <stop offset="100%" stopColor="#FF8800" />
            </linearGradient>
          </defs>
        </svg>
      );
    } else {
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={`weather-icon moon-icon ${className}`}>
          <path
            d="M44 32C44 43.0457 35.0457 52 24 52C20.697 52 17.6046 51.1963 14.887 47.7801C24.085 46.8528 31.2857 39.1171 31.2857 29.7143C31.2857 22.8466 27.2407 16.9242 21.4 14.2C22.2533 14.068 23.1189 14 24 14C35.0457 14 44 22.9543 44 32Z"
            fill="url(#moonGradient)"
          />
          <circle cx="48" cy="18" r="1.5" fill="#FFF" className="star-pulse" />
          <circle cx="16" cy="18" r="1" fill="#FFF" className="star-pulse" />
          <defs>
            <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
  }

  // Partly Cloudy / Overcast
  if (codeNum === 2 || codeNum === 3) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={`weather-icon cloud-icon ${className}`}>
        {isDay && (
          <circle cx="24" cy="24" r="10" fill="#FFB703" className="behind-sun" />
        )}
        <path
          d="M46 44C51.5228 44 56 39.5228 56 34C56 28.7563 51.9664 24.4578 46.8402 24.0416C45.2443 17.1594 39.1197 12 31.8 12C23.1844 12 16.2 18.9844 16.2 27.6C16.2 28.2435 16.2415 28.877 16.3218 29.5C11.6664 30.5982 8.2 34.7951 8.2 39.8C8.2 45.654 12.946 50.4 18.8 50.4H46C50.4183 50.4 54 46.8183 54 42.4"
          fill="url(#cloudGrad)"
        />
        <defs>
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Drizzle / Rain
  if (
    (codeNum >= 51 && codeNum <= 67) ||
    (codeNum >= 80 && codeNum <= 82)
  ) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={`weather-icon rain-icon ${className}`}>
        <path
          d="M44 34C48.4183 34 52 30.4183 52 26C52 21.8055 48.7758 18.3645 44.6721 18.0333C43.3954 12.5275 38.4958 8.4 32.64 8.4C25.7475 8.4 20.16 13.9875 20.16 20.88C20.16 21.3948 20.1932 21.9016 20.2575 22.4C16.5331 23.2786 13.76 26.6361 13.76 30.64C13.76 35.3234 17.5566 39.12 22.24 39.12H44Z"
          fill="url(#rainCloudGrad)"
        />
        <g className="rain-drops" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round">
          <line x1="22" y1="44" x2="18" y2="54" />
          <line x1="32" y1="44" x2="28" y2="54" />
          <line x1="42" y1="44" x2="38" y2="54" />
        </g>
        <defs>
          <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Thunderstorm
  if (codeNum >= 95) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={`weather-icon thunder-icon ${className}`}>
        <path
          d="M44 32C48.4183 32 52 28.4183 52 24C52 19.8055 48.7758 16.3645 44.6721 16.0333C43.3954 10.5275 38.4958 6.4 32.64 6.4C25.7475 6.4 20.16 11.9875 20.16 18.88C20.16 19.3948 20.1932 19.9016 20.2575 20.4C16.5331 21.2786 13.76 24.6361 13.76 28.64C13.76 33.3234 17.5566 37.12 22.24 37.12H44Z"
          fill="url(#thunderCloudGrad)"
        />
        <polygon points="34,34 26,46 32,46 28,58 40,42 34,42" fill="#FACC15" className="lightning-bolt" />
        <defs>
          <linearGradient id="thunderCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Snow
  if ((codeNum >= 71 && codeNum <= 77) || (codeNum >= 85 && codeNum <= 86)) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={`weather-icon snow-icon ${className}`}>
        <path
          d="M44 32C48.4183 32 52 28.4183 52 24C52 19.8055 48.7758 16.3645 44.6721 16.0333C43.3954 10.5275 38.4958 6.4 32.64 6.4C25.7475 6.4 20.16 11.9875 20.16 18.88C20.16 19.3948 20.1932 19.9016 20.2575 20.4C16.5331 21.2786 13.76 24.6361 13.76 28.64C13.76 33.3234 17.5566 37.12 22.24 37.12H44Z"
          fill="url(#snowCloudGrad)"
        />
        <g fill="#E0F2FE" className="snow-flakes">
          <circle cx="22" cy="46" r="2.5" />
          <circle cx="33" cy="50" r="2.5" />
          <circle cx="44" cy="45" r="2.5" />
        </g>
        <defs>
          <linearGradient id="snowCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Fog / Mist
  if (codeNum === 45 || codeNum === 48) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={`weather-icon fog-icon ${className}`}>
        <g stroke="url(#fogGrad)" strokeWidth="4" strokeLinecap="round" className="fog-lines">
          <line x1="14" y1="24" x2="50" y2="24" />
          <line x1="10" y1="32" x2="54" y2="32" />
          <line x1="16" y1="40" x2="48" y2="40" />
          <line x1="22" y1="48" x2="42" y2="48" />
        </g>
        <defs>
          <linearGradient id="fogGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#F1F5F9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Default Fallback (Sun/Cloud)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={`weather-icon ${className}`}>
      <circle cx="32" cy="32" r="16" fill="#F59E0B" />
    </svg>
  );
}
