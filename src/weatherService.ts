import type { WeatherData, TemperatureUnit } from "./types/weather";

// ===== 1. Hàm gọi API dùng chung cho mọi thành phố =====
export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + latitude +
    "&longitude=" + longitude +
    "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
    "&timezone=Asia%2FHo_Chi_Minh" +
    "&forecast_days=7";

  const response = await fetch(url);

  // Nếu server trả về lỗi (ví dụ 404, 500) thì ném lỗi ra ngoài
  if (!response.ok) {
    throw new Error("Máy chủ trả về lỗi: " + response.status);
  }

  const data = await response.json();

  // Kiểm tra dữ liệu có đủ các phần cần thiết không
  if (!data.current || !data.daily || !Array.isArray(data.daily.time)) {
    throw new Error("Dữ liệu trả về không hợp lệ");
  }

  return {
    current: data.current,
    daily: data.daily,
  };
}

// ===== 2. Đổi weather_code thành mô tả tiếng Việt =====
export interface WeatherInfo {
  description: string;
}

export function getWeatherInfo(code: number): WeatherInfo {
  if (code === 0) return { description: "Trời quang" };
  if (code === 1) return { description: "Ít mây" };
  if (code === 2) return { description: "Có mây" };
  if (code === 3) return { description: "Nhiều mây" };
  if (code === 45 || code === 48) return { description: "Sương mù" };
  if (code >= 51 && code <= 55) return { description: "Mưa phùn" };
  if (code === 56 || code === 57) return { description: "Mưa phùn lạnh" };
  if (code >= 61 && code <= 65) return { description: "Mưa" };
  if (code === 66 || code === 67) return { description: "Mưa lạnh" };
  if (code >= 71 && code <= 77) return { description: "Tuyết" };
  if (code >= 80 && code <= 82) return { description: "Mưa rào" };
  if (code === 85 || code === 86) return { description: "Mưa tuyết" };
  if (code === 95) return { description: "Dông" };
  if (code === 96 || code === 99) return { description: "Dông kèm mưa đá" };

  return { description: "Không xác định" };
}

// ===== 3. Đổi nhiệt độ theo đơn vị, làm tròn thành số nguyên =====
export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === "F") {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return Math.round(fahrenheit) + "°F";
  }
  return Math.round(celsius) + "°C";
}

// ===== 4. Định dạng ngày giờ =====
const weekdayNames = [
  "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7",
];

// "2026-10-22" -> { weekday: "Thứ 5", dayMonth: "22/10" }
export function formatDay(dateText: string) {
  const parts = dateText.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const date = new Date(year, month - 1, day);
  return {
    weekday: weekdayNames[date.getDay()],
    dayMonth: day + "/" + month,
  };
}

// "2026-10-22T14:00" -> "14:00 - 22/10/2026"
export function formatUpdateTime(timeText: string): string {
  const parts = timeText.split("T");
  const dateParts = parts[0].split("-");
  return parts[1] + " - " + dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
}
