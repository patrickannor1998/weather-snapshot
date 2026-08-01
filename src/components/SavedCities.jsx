import React from 'react';

const POPULAR_CITIES = [
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
];

export default function SavedCities({
  isOpen,
  onClose,
  favorites = [],
  onSelectCity,
  onRemoveFavorite,
}) {
  if (!isOpen) return null;

  return (
    <div className="favorites-overlay" onClick={onClose}>
      <div className="favorites-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <h3>Saved Cities</h3>
          </div>
          <button className="btn-close-drawer" onClick={onClose} aria-label="Close saved cities modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-section">
            <h4>Your Bookmarks</h4>
            {favorites.length === 0 ? (
              <div className="empty-fav-state">
                <p>No saved cities yet.</p>
                <span>Click the bookmark icon on any city to pin it here!</span>
              </div>
            ) : (
              <div className="fav-list">
                {favorites.map((fav) => (
                  <div key={`${fav.lat}-${fav.lon}`} className="fav-card">
                    <div
                      className="fav-card-click"
                      onClick={() => {
                        onSelectCity(fav.lat, fav.lon, fav.name, fav.country);
                        onClose();
                      }}
                    >
                      <span className="fav-name">{fav.name}</span>
                      <span className="fav-country">{fav.country}</span>
                    </div>

                    <button
                      className="btn-remove-fav"
                      onClick={() => onRemoveFavorite(fav.lat, fav.lon)}
                      title="Remove bookmark"
                      aria-label="Remove bookmark"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="drawer-section popular-section">
            <h4>Quick Popular Cities</h4>
            <div className="popular-grid">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.name}
                  className="popular-chip"
                  onClick={() => {
                    onSelectCity(city.lat, city.lon, city.name, city.country);
                    onClose();
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{city.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
