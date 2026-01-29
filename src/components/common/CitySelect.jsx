import React, { useEffect, useState } from "react";
import CityService from "../../services/CityService"; // Đảm bảo đường dẫn đúng

const CitySelect = ({
  value,
  onChange,
  error,
  label = "Tỉnh/Thành phố",
  disabled,
}) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await CityService.getAllCities();
        // Sắp xếp theo tên
        data.sort((a, b) => a.name.localeCompare(b.name));
        setCities(data);
      } catch (err) {
        console.error("Failed to load cities", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Handle change: tìm city object từ code và gửi lên
  const handleChange = (e) => {
    const selectedCode = e.target.value;
    const selectedCity = cities.find((c) => c.code === selectedCode);

    if (onChange) {
      onChange({
        code: selectedCode,
        name: selectedCity ? selectedCity.name : "",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-base font-medium">{label}</label>
      <select
        value={value?.code || ""}
        onChange={handleChange}
        disabled={loading || disabled}
        className={`w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${
          error ? "border-red-500" : "border-border-dark"
        } bg-surface-dark h-14 px-4 text-base transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat`}
      >
        <option value="" className="bg-surface-dark text-text-secondary">
          -- Chọn Tỉnh/Thành phố --
        </option>
        {cities.map((city) => (
          <option
            key={city.code}
            value={city.code}
            className="bg-surface-dark text-white"
          >
            {city.name}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default CitySelect;
