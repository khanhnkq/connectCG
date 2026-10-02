import axios from 'axios';

// Danh sách tỉnh/thành phố chuẩn Việt Nam (Fallback khi API ngoài bị chặn bởi AdBlock/Network)
const FALLBACK_CITIES = [
    { code: "01", name: "Thành phố Hà Nội" },
    { code: "79", name: "Thành phố Hồ Chí Minh" },
    { code: "31", name: "Thành phố Hải Phòng" },
    { code: "48", name: "Thành phố Đà Nẵng" },
    { code: "92", name: "Thành phố Cần Thơ" },
    { code: "46", name: "Thành phố Huế" },
    { code: "91", name: "An Giang" },
    { code: "77", name: "Bà Rịa - Vũng Tàu" },
    { code: "24", name: "Bắc Ninh" },
    { code: "06", name: "Bắc Kạn" },
    { code: "27", name: "Bắc Giang" },
    { code: "74", name: "Bình Dương" },
    { code: "70", name: "Bình Phước" },
    { code: "60", name: "Bình Thuận" },
    { code: "50", name: "Bình Định" },
    { code: "83", name: "Bến Tre" },
    { code: "95", name: "Bạc Liêu" },
    { code: "04", name: "Cao Bằng" },
    { code: "96", name: "Cà Mau" },
    { code: "11", name: "Điện Biên" },
    { code: "66", name: "Đắk Lắk" },
    { code: "58", name: "Đắk Nông" },
    { code: "75", name: "Đồng Nai" },
    { code: "82", name: "Đồng Tháp" },
    { code: "52", name: "Gia Lai" },
    { code: "42", name: "Hà Tĩnh" },
    { code: "35", name: "Hà Nam" },
    { code: "17", name: "Hòa Bình" },
    { code: "33", name: "Hưng Yên" },
    { code: "93", name: "Hậu Giang" },
    { code: "56", name: "Khánh Hòa" },
    { code: "62", name: "Kon Tum" },
    { code: "97", name: "Kiên Giang" },
    { code: "12", name: "Lai Châu" },
    { code: "15", name: "Lào Cai" },
    { code: "68", name: "Lâm Đồng" },
    { code: "20", name: "Lạng Sơn" },
    { code: "98", name: "Long An" },
    { code: "36", name: "Nam Định" },
    { code: "40", name: "Nghệ An" },
    { code: "37", name: "Ninh Bình" },
    { code: "25", name: "Phú Thọ" },
    { code: "54", name: "Phú Yên" },
    { code: "51", name: "Quảng Ngãi" },
    { code: "22", name: "Quảng Ninh" },
    { code: "44", name: "Quảng Trị" },
    { code: "45", name: "Quảng Bình" },
    { code: "49", name: "Quảng Nam" },
    { code: "94", name: "Sóc Trăng" },
    { code: "14", name: "Sơn La" },
    { code: "38", name: "Thanh Hóa" },
    { code: "19", name: "Thái Nguyên" },
    { code: "34", name: "Thái Bình" },
    { code: "99", name: "Tiền Giang" },
    { code: "84", name: "Trà Vinh" },
    { code: "08", name: "Tuyên Quang" },
    { code: "80", name: "Tây Ninh" },
    { code: "86", name: "Vĩnh Long" },
    { code: "26", name: "Vĩnh Phúc" },
    { code: "13", name: "Yên Bái" }
].map(item => ({
    id: item.code,
    code: item.code,
    name: item.name,
    region: null
}));

const CityService = {
    /**
     * Get all cities from external API with reliable offline/adblock fallback
     * @returns {Promise<Array>} List of cities with standardized format
     */
    getAllCities: async () => {
        try {
            const response = await axios.get('https://34tinhthanh.com/api/provinces', {
                timeout: 3000
            });
            const data = response.data;
            if (Array.isArray(data) && data.length > 0) {
                return data.map(item => ({
                    id: item.province_code || item.code,
                    code: item.province_code || item.code,
                    name: item.name,
                    region: null
                }));
            }
        } catch (error) {
            // AdBlocker / ERR_BLOCKED_BY_CLIENT / Network error -> Tự động fallback sang danh sách nội bộ
            console.warn('API tỉnh thành bên ngoài không khả dụng (hoặc bị AdBlock chặn), sử dụng danh sách nội bộ:', error.message);
        }
        return FALLBACK_CITIES;
    },

    /**
     * Get city by Code
     */
    getCityByCode: async (code) => {
        try {
            const cities = await CityService.getAllCities();
            return cities.find(c => c.code === code) || null;
        } catch {
            return FALLBACK_CITIES.find(c => c.code === code) || null;
        }
    }
};

export default CityService;
