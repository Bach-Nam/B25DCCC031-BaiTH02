import type { City } from "../types/weather";

interface CityListProps {
  cities: City[];
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}

function CityList({ cities, selectedCity, onSelectCity }: CityListProps) {
  return (
    <div className="card">
      <h2 className="card-title">Chọn thành phố</h2>
      <div className="city-list">
        {cities.map((city) => {
          // Chỉ thành phố trùng với thành phố đang chọn mới là "selected"
          const isSelected =
            selectedCity !== null && selectedCity.name === city.name;

          return (
            <button
              key={city.name}
              className={isSelected ? "city-button selected" : "city-button"}
              onClick={() => onSelectCity(city)}
            >
              <span>{city.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CityList;
