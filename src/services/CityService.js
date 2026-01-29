import axios from 'axios';

const CityService = {
    /**
     * Get all cities from external API
     * @returns {Promise<Array>} List of cities with standardized format
     */
    getAllCities: async () => {
        try {
            // Gọi API ngoài
            const response = await axios.get('https://34tinhthanh.com/api/provinces');
            const data = response.data;

            // Map dữ liệu về format chung của app
            // API trả về: [{"province_code":"91","name":"An Giang"}, ...]
            return data.map(item => ({
                id: item.province_code, // Dùng code làm ID để consistent
                code: item.province_code,
                name: item.name,
                region: null // API này không có region, có thể bổ sung logic map nếu cần
            }));
        } catch (error) {
            console.error('Error fetching cities:', error);
            return [];
        }
    },

    /**
     * Get city by Code (local lookup from fetched list is better, but here we might just return object)
     */
    getCityByCode: async (code) => {
        try {
            const cities = await CityService.getAllCities();
            return cities.find(c => c.code === code);
        } catch (error) {
            return null;
        }
    }
};

export default CityService;
