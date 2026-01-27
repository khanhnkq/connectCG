import axiosClient from '../config/axiosConfig';

const CityService = {
    /**
     * Get all cities
     * @returns {Promise<Array>} List of cities
     */
    getAllCities: async () => {
        try {
            const response = await axiosClient.get('/v1/cities');
            return response.data;
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw error;
        }
    },

    /**
     * Get city by ID
     * @param {number} cityId - City ID
     * @returns {Promise<Object>} City object
     */
    getCityById: async (cityId) => {
        try {
            const response = await axiosClient.get(`/v1/cities/${cityId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching city ${cityId}:`, error);
            throw error;
        }
    }
};

export default CityService;
