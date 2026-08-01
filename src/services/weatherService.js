/**
 * Service to interact with Open-Meteo Weather and Geocoding APIs.
 */

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search locations matching a query string.
 * @param {string} query 
 * @returns {Promise<Array>} List of location objects
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const response = await fetch(
      `${GEOCODING_API_URL}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`
    );
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.results) return [];

    return data.results.map((item) => ({
      id: `${item.id}-${item.latitude}-${item.longitude}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code ? item.country_code.toUpperCase() : '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    return [];
  }
}

/**
 * Fetch detailed weather data for given coordinates.
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} locationName 
 * @param {string} country 
 * @returns {Promise<Object>}
 */
export async function fetchWeatherData(latitude, longitude, locationName = '', country = '') {
  const url = `${FORECAST_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to retrieve weather data from server.');
  }

  const data = await response.json();

  // Process current weather
  const current = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    pressure: Math.round(data.current.surface_pressure),
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    locationName: locationName || 'Selected Location',
    country: country || '',
    latitude,
    longitude,
    timezone: data.timezone,
  };

  // Process hourly (next 24 hours starting from current hour)
  const now = new Date();
  const currentISOHour = now.toISOString().slice(0, 13);
  let startIndex = data.hourly.time.findIndex((t) => t.startsWith(currentISOHour));
  if (startIndex === -1) startIndex = 0;

  const hourly = data.hourly.time.slice(startIndex, startIndex + 24).map((time, index) => {
    const actualIdx = startIndex + index;
    const hourDate = new Date(time);
    return {
      time: time,
      formattedTime: hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      temp: Math.round(data.hourly.temperature_2m[actualIdx]),
      pop: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[actualIdx] : 0,
      humidity: data.hourly.relative_humidity_2m[actualIdx],
      weatherCode: data.hourly.weather_code[actualIdx],
    };
  });

  // Process 7-day daily forecast
  const daily = data.daily.time.map((time, index) => {
    const dateObj = new Date(time + 'T00:00:00');
    const dayName = index === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const sunriseObj = new Date(data.daily.sunrise[index]);
    const sunsetObj = new Date(data.daily.sunset[index]);

    return {
      time,
      dayName,
      formattedDate,
      maxTemp: Math.round(data.daily.temperature_2m_max[index]),
      minTemp: Math.round(data.daily.temperature_2m_min[index]),
      weatherCode: data.daily.weather_code[index],
      uvIndexMax: data.daily.uv_index_max ? Math.round(data.daily.uv_index_max[index]) : null,
      sunrise: sunriseObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      sunset: sunsetObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  });

  // Additional stats for today
  current.maxTemp = daily[0]?.maxTemp ?? current.temperature;
  current.minTemp = daily[0]?.minTemp ?? current.temperature;
  current.uvIndex = daily[0]?.uvIndexMax ?? 3;
  current.sunrise = daily[0]?.sunrise ?? '06:00 AM';
  current.sunset = daily[0]?.sunset ?? '07:30 PM';

  return {
    current,
    hourly,
    daily,
  };
}

/**
 * Get human readable description and theme class for weather code.
 * @param {number} code 
 * @param {boolean} isDay 
 */
export function getWeatherDetails(code, isDay = true) {
  const map = {
    0: { label: 'Clear Sky', category: isDay ? 'clear-day' : 'clear-night' },
    1: { label: 'Mainly Clear', category: isDay ? 'clear-day' : 'clear-night' },
    2: { label: 'Partly Cloudy', category: 'cloudy' },
    3: { label: 'Overcast', category: 'cloudy' },
    45: { label: 'Foggy', category: 'fog' },
    48: { label: 'Depositing Rime Fog', category: 'fog' },
    51: { label: 'Light Drizzle', category: 'rain' },
    53: { label: 'Moderate Drizzle', category: 'rain' },
    55: { label: 'Dense Drizzle', category: 'rain' },
    56: { label: 'Freezing Drizzle', category: 'snow' },
    57: { label: 'Freezing Drizzle', category: 'snow' },
    61: { label: 'Slight Rain', category: 'rain' },
    63: { label: 'Moderate Rain', category: 'rain' },
    65: { label: 'Heavy Rain', category: 'rain' },
    66: { label: 'Freezing Rain', category: 'snow' },
    67: { label: 'Freezing Rain', category: 'snow' },
    71: { label: 'Light Snowfall', category: 'snow' },
    73: { label: 'Moderate Snowfall', category: 'snow' },
    75: { label: 'Heavy Snowfall', category: 'snow' },
    77: { label: 'Snow Grains', category: 'snow' },
    80: { label: 'Light Rain Showers', category: 'rain' },
    81: { label: 'Moderate Rain Showers', category: 'rain' },
    82: { label: 'Violent Rain Showers', category: 'rain' },
    85: { label: 'Slight Snow Showers', category: 'snow' },
    86: { label: 'Heavy Snow Showers', category: 'snow' },
    95: { label: 'Thunderstorm', category: 'thunderstorm' },
    96: { label: 'Thunderstorm with Hail', category: 'thunderstorm' },
    99: { label: 'Thunderstorm with Heavy Hail', category: 'thunderstorm' },
  };

  return map[code] || { label: 'Variable', category: 'clear-day' };
}
