import React, { useEffect, useState } from "react";
import CityService from "../../services/CityService"; // Đảm bảo đường dẫn đúng

const CitySelect = ({ value, onChange, error, label = "Tỉnh/Thành phố" }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await CityService.getAllCities();
        data.sort((a, b) => a.name.localeCompare(b.name));
        setCities(data);
        setFilteredCities(data);
      } catch (err) {
        console.error("Failed to load cities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  // Update Init Display Name when value changes or cities load
  useEffect(() => {
    if (value?.code && cities.length > 0) {
      const city = cities.find((c) => c.code === value.code);
      if (city) setSelectedCityName(city.name);
    } else if (!value?.code) {
      setSelectedCityName("");
      setSearchTerm("");
    }
  }, [value, cities]);

  // Filter logic
  useEffect(() => {
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  const handleSelect = (city) => {
    setSelectedCityName(city.name);
    setSearchTerm(city.name);
    setIsOpen(false);
    if (onChange) {
      onChange({ code: city.code, name: city.name });
    }
  };

  const handleBlur = () => {
    // Delay to allow click event on option to process
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className={`relative group ${label ? "mb-4" : "mb-0"}`}>
      {label && (
        <label className="block text-sm font-medium text-text-main mb-2 font-bold">
          {label}
        </label>
      )}
      <div
        className={`relative transition-all duration-200 ${
          isOpen ? "shadow-lg" : ""
        }`}
      >
        <input
          type="text"
          value={isOpen ? searchTerm : selectedCityName}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (e.target.value === "") {
              if (onChange) onChange({ code: "", name: "" });
              setSelectedCityName("");
            }
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm("");
            setFilteredCities(cities);
          }}
          onBlur={handleBlur}
          placeholder="Chọn tỉnh/thành phố..."
          disabled={loading}
          className={`w-full h-12 bg-background-main border ${
            error ? "border-red-500" : "border-border-main"
          } ${
            isOpen ? "rounded-t-xl border-b-0" : "rounded-xl"
          } pl-4 pr-10 text-text-main placeholder-text-secondary/40 focus:outline-none focus:border-primary/50 transition-all z-20 relative flex items-center font-medium`}
        />

        {/* Arrow Icon */}
        <span
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none material-symbols-outlined transition-transform duration-200 z-30 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        >
          expand_more
        </span>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full left-0 top-full bg-surface-main border border-t-0 border-border-main rounded-b-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 origin-top custom-scrollbar">
            {/* Separator line to ensure seamless look but visual separation */}
            <div className="h-[1px] w-full bg-border-main mx-auto opacity-50"></div>

            {loading ? (
              <div className="p-4 text-text-secondary text-sm text-center italic">
                Đang tải danh sách...
              </div>
            ) : filteredCities.length > 0 ? (
              <div className="p-1">
                {filteredCities.map((city) => (
                  <div
                    key={city.code}
                    className={`px-4 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between group mx-1 my-0.5 ${
                      value?.code === city.code
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary hover:bg-background-main hover:text-text-main"
                    }`}
                    onClick={() => handleSelect(city)}
                  >
                    <span className="font-medium">{city.name}</span>
                    {value?.code === city.code && (
                      <span className="material-symbols-outlined text-sm">
                        check
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-text-secondary text-sm text-center">
                Không tìm thấy "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CitySelect;
