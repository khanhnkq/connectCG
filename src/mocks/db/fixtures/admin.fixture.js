/**
 * Mock Admin Portal Fixture
 * Matches backend Spring Boot Admin & Report contracts
 */
export const initialReports = [
  {
    id: 1,
    targetType: "USER",
    targetId: 5,
    reporterId: 2,
    reporterName: "Trần Hoàng Nam",
    reporterUsername: "hoangnam",
    reason: "HARASSMENT",
    description: "Tài khoản có dấu hiệu bình luận tiêu cực lặp lại.",
    status: "PENDING",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 2,
    targetType: "POST",
    targetId: 105,
    reporterId: 3,
    reporterName: "Lê Mai Chi",
    reporterUsername: "maichi",
    reason: "SPAM",
    description: "Nội dung quảng cáo dịch vụ hosting không liên quan.",
    status: "PENDING",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 3,
    targetType: "GROUP",
    targetId: 3,
    reporterId: 4,
    reporterName: "Võ Quốc Anh",
    reporterUsername: "quocanh",
    reason: "COPYRIGHT",
    description: "Nhóm có bài đăng vi phạm bản quyền hình ảnh.",
    status: "PENDING",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 4,
    targetType: "USER",
    targetId: 2,
    reporterId: 3,
    reporterName: "Lê Mai Chi",
    reporterUsername: "maichi",
    reason: "OTHER",
    description: "Báo cáo thử nghiệm đã được xử lý xong.",
    status: "RESOLVED",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
];

export const initialHobbies = [
  { id: 1, name: "Nhiếp ảnh", category: "Nghệ thuật" },
  { id: 2, name: "Lập trình", category: "Công nghệ" },
  { id: 3, name: "Thiết kế UI/UX", category: "Nghệ thuật" },
  { id: 4, name: "Cây cảnh & Sen đá", category: "Đời sống" },
  { id: 5, name: "Chạy bộ", category: "Thể thao" },
  { id: 6, name: "Đọc sách", category: "Đời sống" },
  { id: 7, name: "Du lịch phượt", category: "Khám phá" },
  { id: 8, name: "Trí tuệ nhân tạo (AI)", category: "Công nghệ" },
];
