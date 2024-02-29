import { useEffect, useState } from 'react';
import Search from '../search';

export default function Weather() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const KELVIN = 273.15;

  async function fetchWeatherData(param) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${apiKey}`
      );

      const data = await response.json();

      if (data) {
        setWeatherData(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  function handleSearch() {
    fetchWeatherData(search);
  }

  function getCurrentDate() {
    return new Date().toLocaleDateString('en-us', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function getFahrenheit(currentTemp) {
    const fahrenheit = Math.floor((currentTemp - KELVIN) * 1.8 + 32);
    return fahrenheit;
  }

  function getCelcius(currentTemp) {
    const celcius = Math.floor(currentTemp - KELVIN);
    return celcius;
  }

  useEffect(() => {
    fetchWeatherData('Madison');
  }, []);

  return (
    <div>
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      {loading ? (
        <div className='loading'>Loading...</div>
      ) : (
        <div>
          <div className='city-name'>
            <h2>
              {weatherData?.name}, <span>{weatherData?.sys?.country}</span>
            </h2>
          </div>
          <div className='date'>
            <span>{getCurrentDate()}</span>
          </div>
          <div className='temp'>
            {getFahrenheit(weatherData?.main?.temp)}&deg;F (
            {getCelcius(weatherData?.main?.temp)}&deg;C)
          </div>
          <p className='description'>
            {weatherData && weatherData.weather && weatherData.weather[0]
              ? weatherData.weather[0].description
              : ''}
          </p>
          <div className='weather-info'>
            <div className='column'>
              <div>
                <p className='wind'>{weatherData?.wind?.speed}</p>
                <p>Wind Speed</p>
              </div>
            </div>
            <div className='column'>
              <div>
                <p className='wind'>{weatherData?.main?.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

//
