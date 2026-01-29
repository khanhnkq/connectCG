import React from "react";
import { User, Pencil } from "lucide-react";

const ProfileAbout = ({ profile, isOwner }) => {
  return (
    <div className="bg-[#342418] rounded-2xl border border-[#3e2b1d] p-6 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
          <User className="text-primary" size={20} />
          {isOwner ? "Chi tiết về bạn" : "Thông tin chi tiết"}
        </h3>
        {isOwner && (
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            <Pencil size={16} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm py-2 border-b border-[#493222]">
              <span className="text-text-secondary">Giới tính</span>
              <span className="text-white font-medium">
                {{
                  MALE: "Nam",
                  FEMALE: "Nữ",
                  OTHER: "Khác",
                }[profile?.gender] || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-[#493222]">
              <span className="text-text-secondary">Ngày sinh</span>
              <span className="text-white font-medium">
                {profile?.dateOfBirth || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-[#493222]">
              <span className="text-text-secondary">Tìm kiếm</span>
              <span className="text-white font-medium">
                {{
                  LOVE: "Tình yêu",
                  FRIENDS: "Bạn bè",
                  NETWORKING: "Kết nối",
                }[profile?.lookingFor] || "Chưa cập nhật"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm py-2 border-b border-[#493222]">
              <span className="text-text-secondary">Nghề nghiệp</span>
              <span className="text-white font-medium">
                {profile?.occupation || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-[#493222]">
              <span className="text-text-secondary">Tình trạng</span>
              <span className="text-white font-medium">
                {{
                  SINGLE: "Độc thân",
                  MARRIED: "Đã kết hôn",
                  DIVORCED: "Ly hôn",
                }[profile?.maritalStatus] || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-[#493222]">
              <span className="text-text-secondary">
                {isOwner ? "Đến từ" : "Thành phố"}
              </span>
              <span className="text-white font-medium">
                {profile?.cityName || "Chưa cập nhật"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout;
