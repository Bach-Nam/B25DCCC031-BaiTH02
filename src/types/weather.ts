// Thông tin một thành phố trong danh sách
export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

// Thời tiết hiện tại (lấy từ phần "current" của API)
export interface CurrentWeatherData {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
}

// Dự báo 7 ngày (lấy từ phần "daily" của API)
// Các mảng có cùng độ dài: phần tử thứ i thuộc cùng một ngày
export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

// Toàn bộ dữ liệu thời tiết của một thành phố
export interface WeatherData {
  current: CurrentWeatherData;
  daily: DailyWeatherData;
}

// Đơn vị nhiệt độ: chỉ có thể là "C" hoặc "F"
export type TemperatureUnit = "C" | "F";
