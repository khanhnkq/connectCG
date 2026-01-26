import axiosClient from '../config/axiosConfig';

const reportService = {
    createReport(payload) {
        return axiosClient.post('/reports', payload);
    },

    getReports() {
        return axiosClient.get('/reports');
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
