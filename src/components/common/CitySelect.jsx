import React, { useEffect, useState } from 'react';
import CityService from '../../services/CityService'; // Đảm bảo đường dẫn đúng

const CitySelect = ({ value, onChange, error, label = "Tỉnh/Thành phố" }) => {
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
        const selectedCity = cities.find(c => c.code === selectedCode);

        if (onChange) {
            onChange({
                code: selectedCode,
                name: selectedCity ? selectedCity.name : ''
            });
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <select
                value={value?.code || ''}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            >
                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                {cities.map((city) => (
                    <option key={city.code} value={city.code}>
                        {city.name}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default CitySelect;
