import React, { useState, useEffect, useRef } from 'react';
import { searchLocations } from '../services/weatherService';

export default function Navbar({
  onSelectLocation,
  onUseMyLocation,
  unit,
  onToggleUnit,
  onToggleFavorites,
  favoritesCount = 0,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchLocations(searchTerm);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc) => {
    const displayName = loc.name;
    const country = loc.admin1 ? `${loc.admin1}, ${loc.country}` : loc.country;
    onSelectLocation(loc.latitude, loc.longitude, displayName, country);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else if (searchTerm.trim()) {
      // Fallback search first result
      searchLocations(searchTerm).then((results) => {
        if (results.length > 0) {
          handleSelect(results[0]);
        }
      });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-name">Weather</span>
          <span className="brand-badge">Snapshot</span>
        </div>
      </div>

      <div className="search-container" ref={searchRef}>
        <form onSubmit={handleSubmit} className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            placeholder="Search city or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            aria-label="Search city or location"
          />

          {isSearching && (
            <div className="search-spinner" aria-hidden="true"></div>
          )}

          <button
            type="button"
            className="btn-location"
            onClick={onUseMyLocation}
            title="Use current GPS location"
            aria-label="Use current location"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
          </button>
        </form>

        {isOpen && (
          <ul className="suggestions-dropdown">
            {suggestions.map((loc) => (
              <li key={loc.id} onClick={() => handleSelect(loc)}>
                <div className="suggestion-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div className="suggestion-details">
                    <span className="loc-name">{loc.name}</span>
                    <span className="loc-country">
                      {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="navbar-controls">
        <button
          className="unit-toggle-btn"
          onClick={onToggleUnit}
          title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
          aria-label="Toggle temperature unit"
        >
          <span className={unit === 'C' ? 'active-unit' : ''}>°C</span>
          <span className="divider">|</span>
          <span className={unit === 'F' ? 'active-unit' : ''}>°F</span>
        </button>

        <button
          className="favorites-toggle-btn"
          onClick={onToggleFavorites}
          title="Saved Cities"
          aria-label="Saved Cities"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {favoritesCount > 0 && <span className="fav-badge">{favoritesCount}</span>}
        </button>
      </div>
    </header>
  );
}
