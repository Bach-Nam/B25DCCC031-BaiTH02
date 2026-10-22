import { useState, useEffect } from "react";
import type { City, WeatherData, TemperatureUnit } from "./types/weather";
import { cities } from "./data/cities";
import { fetchWeather } from "./weatherService";
import CityList from "./components/CityList";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";

function App() {
  // ----- State (dữ liệu mà React ghi nhớ) -----
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  // Mỗi lần bấm "Thử lại" ta tăng số này lên 1 để useEffect chạy lại
  const [retryCount, setRetryCount] = useState<number>(0);

  // ----- useEffect: chạy khi chọn thành phố khác hoặc bấm "Thử lại" -----
  useEffect(() => {
    if (selectedCity === null) {
      return;
    }

    // Biến này tránh việc kết quả cũ ghi đè kết quả mới
    // khi người dùng bấm đổi thành phố quá nhanh
    let isCancelled = false;

    async function loadWeather(city: City) {
      setIsLoading(true);
      setErrorMessage("");
      setWeatherData(null);

      try {
        const data = await fetchWeather(city.latitude, city.longitude);
        if (!isCancelled) {
          setWeatherData(data);
        }
      } catch (error) {
        if (!isCancelled) {
          if (error instanceof TypeError) {
            setErrorMessage(
              "Không thể kết nối mạng. Vui lòng kiểm tra Internet và thử lại."
            );
          } else {
            setErrorMessage(
              "Không lấy được dữ liệu thời tiết. Vui lòng thử lại sau."
            );
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadWeather(selectedCity);

    // Hàm dọn dẹp: chạy trước lần useEffect tiếp theo
    return () => {
      isCancelled = true;
    };
  }, [selectedCity, retryCount]);

  function handleSelectCity(city: City) {
    setSelectedCity(city);
  }

  function handleRetry() {
    setRetryCount(retryCount + 1);
  }

  function handleToggleUnit() {
    // Chỉ đổi đơn vị, KHÔNG gọi lại API
    setUnit(unit === "C" ? "F" : "C");
  }

  // ----- Quyết định hiển thị gì ở cột bên phải -----
  function renderWeatherArea() {
    if (selectedCity === null) {
      return (
        <div className="card message-card">
          <p>Hãy chọn một thành phố để xem thời tiết.</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="card message-card">
          <p>Đang tải dữ liệu thời tiết...</p>
        </div>
      );
    }

    if (errorMessage !== "") {
      return (
        <div className="card message-card">
          <p>{errorMessage}</p>
          <button className="retry-button" onClick={handleRetry}>
            Thử lại
          </button>
        </div>
      );
    }

    if (weatherData !== null) {
      // Ngày hiện tại theo đúng múi giờ của API: "2026-10-22T14:00" -> "2026-10-22"
      const todayDate = weatherData.current.time.split("T")[0];

      return (
        <>
          <CurrentWeather
            cityName={selectedCity.name}
            current={weatherData.current}
            unit={unit}
          />
          <Forecast
            daily={weatherData.daily}
            unit={unit}
            todayDate={todayDate}
          />
        </>
      );
    }

    return null;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Thời tiết Việt Nam</h1>
        <button className="unit-button" onClick={handleToggleUnit}>
          Đơn vị: °{unit} (bấm để đổi sang °{unit === "C" ? "F" : "C"})
        </button>
      </header>

      <main className="layout">
        <section className="column-left">
          <CityList
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
          />
        </section>
        <section className="column-right">{renderWeatherArea()}</section>
      </main>
    </div>
  );
}

export default App;
