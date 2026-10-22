import type { DailyWeatherData, TemperatureUnit } from "../types/weather";
import {
  getWeatherInfo,
  formatTemperature,
  formatDay,
} from "../weatherService";

interface ForecastProps {
  daily: DailyWeatherData;
  unit: TemperatureUnit;
  todayDate: string; // ví dụ "2026-10-22"
}

function Forecast({ daily, unit, todayDate }: ForecastProps) {
  return (
    <div className="card">
      <h2 className="card-title">Dự báo {daily.time.length} ngày</h2>
      <div className="forecast-list">
        {daily.time.map((dateText, index) => {
          const day = formatDay(dateText);
          const weatherInfo = getWeatherInfo(daily.weather_code[index]);
          const isToday = dateText === todayDate;

          return (
            <div
              key={dateText}
              className={isToday ? "forecast-item today" : "forecast-item"}
            >
              <div className="forecast-day">
                <div className="forecast-weekday">
                  {isToday ? "Hôm nay" : day.weekday}
                </div>
                <div className="forecast-date">{day.dayMonth}</div>
              </div>
              <div className="forecast-description">
                {weatherInfo.description}
              </div>
              <div className="forecast-temps">
                <span className="temp-max">
                  {formatTemperature(daily.temperature_2m_max[index], unit)}
                </span>
                <span className="temp-min">
                  {formatTemperature(daily.temperature_2m_min[index], unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Forecast;
