# Kế hoạch Triển khai - Tìm kiếm Quanh đây (Geolocation)

Thực hiện tính năng "Tìm người quanh đây" cho phép người dùng lọc thành viên trong các bán kính cụ thể (5m, 10m, 15m, 1km...).

## Thay đổi Đề xuất

### [Backend] `connectCG_BE`

#### [SỬA ĐỔI] [UserProfile.java](file:///d:/workspace-ai/connectCG_BE/src/main/java/org/example/connectcg_be/entity/UserProfile.java)
- Thêm trường `private Double latitude;` (Vĩ độ)
- Thêm trường `private Double longitude;` (Kinh độ)

#### [SỬA ĐỔI] [UserProfileRepository.java](file:///d:/workspace-ai/connectCG_BE/src/main/java/org/example/connectcg_be/repository/UserProfileRepository.java)
- Cập nhật câu truy vấn `searchMembers` để thêm tính toán khoảng cách Haversine.
- Thêm tham số: `currentUserLat`, `currentUserLon`, `radiusInMeters` (bán kính theo mét).
- Logic lọc: Chỉ lấy những user có khoảng cách <= bán kính đã chọn.

#### [SỬA ĐỔI] [UserProfileController.java](file:///d:/workspace-ai/connectCG_BE/src/main/java/org/example/connectcg_be/controller/UserProfileController.java)
- Nhận thêm tham số `lat`, `lon`, `radius` trong API tìm kiếm `/search`.
- Logic: Khi người dùng tìm kiếm kèm vị trí, hệ thống sẽ tạm thời dùng vị trí đó để tính toán (hoặc cập nhật luôn vào profile nếu cần).

### [Frontend] `connectCG`

#### [SỬA ĐỔI] [MemberFilterSidebar.jsx](file:///d:/workspace-ai/connectCG/src/pages/search/MemberFilterSidebar.jsx)
- Thêm mục "Tìm quanh đây".
- Thêm nút "📍 Quét vị trí của tôi" (Sử dụng Browser Geolocation API).
- Thêm lựa chọn bán kính: 10m, 50m, 100m, 1km, 5km.

#### [SỬA ĐỔI] [AdvancedMemberSearch.jsx](file:///d:/workspace-ai/connectCG/src/pages/search/AdvancedMemberSearch.jsx)
- Quản lý state vị trí (`lat`, `lon`) và bán kính (`radius`).
- Truyền các tham số này xuống API khi gọi search.

#### [SỬA ĐỔI] [UserSearchService.js](file:///d:/workspace-ai/connectCG/src/services/user/UserSearchService.js)
- Cập nhật method search để nhận thêm `lat`, `lon`, `radius`.

## Kế hoạch Kiểm thử (Verification)
### Kiểm thử Thủ công
1.  **Bật Vị trí**: Nhấn nút "Quét vị trí" trên giao diện -> Trình duyệt hỏi quyền -> Chọn "Cho phép".
2.  **Chọn Bán kính**: Chọn thử "10 mét".
3.  **Kết quả**:
    *   Hệ thống sẽ lọc ra những user có tọa độ trong vùng 10m.
    *   (Do dữ liệu test chưa có tọa độ, ban đầu có thể không ra ai, cần update DB giả lập để test).
