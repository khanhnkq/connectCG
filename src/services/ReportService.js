import { reportApi } from '../api';

/**
 * ReportService - Facade wrapper delegating to auto-generated reportApi SDK.
 * Preserves 100% backward compatibility for all existing components.
 */
const reportService = {
    createReport(payload) {
        return reportApi.reportCreateReport(payload);
    },

    getReports(params = {}) {
        const { page = 0, size = 10, status, targetType } = params;
        return reportApi.reportGetReports({ page, size, status, targetType });
    },

    getReportById(id) {
        return reportApi.reportGetReportDetail({ id });
    },

    updateReportStatus(id, status) {
        // status: "PENDING" | "UNDER_REVIEW" | "RESOLVED"
        return reportApi.reportUpdateReportStatus({ id }, { status });
    },
};

export default reportService;
