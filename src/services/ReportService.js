import axiosClient from '../config/axiosConfig';

const reportService = {
    createReport(payload) {
        return axiosClient.post('/reports', payload);
    },

    getReports(params = {}) {
        const { page = 0, size = 10, status, targetType } = params;
        return axiosClient.get('/reports', { 
            params: { page, size, status, targetType } 
        });
    },

    getReportById(id) {
        return axiosClient.get(`/reports/${id}`);
    },

    updateReportStatus(id, status) {
        // status: "PENDING" | "UNDER_REVIEW" | "RESOLVED"
        return axiosClient.put(`/reports/${id}`, { status });
    },
};

export default reportService;
