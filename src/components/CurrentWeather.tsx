import type { CurrentWeatherData, TemperatureUnit } from "../types/weather";
import {
  getWeatherInfo,
  formatTemperature,
  formatUpdateTime,
} from "../weatherService";

interface CurrentWeatherProps {
  cityName: string;
  current: CurrentWeatherData;
  unit: TemperatureUnit;
}

function CurrentWeather({ cityName, current, unit }: CurrentWeatherProps) {
  const weatherInfo = getWeatherInfo(current.weather_code);

  return (
    <div className="card current-card">
      <h2 className="current-city">{cityName}</h2>
      <div className="current-temp">
        {formatTemperature(current.temperature_2m, unit)}
      </div>
      <div className="current-description">{weatherInfo.description}</div>

      <div className="current-details">
        <div className="detail-box">
          <span>Độ ẩm</span>
          <strong>{current.relative_humidity_2m}%</strong>
        </div>
        <div className="detail-box">
          <span>Tốc độ gió</span>
          <strong>{current.wind_speed_10m} km/h</strong>
        </div>
      </div>

      <p className="update-time">Cập nhật: {formatUpdateTime(current.time)}</p>
    </div>
  );
}

export default CurrentWeather;
