import React from "react";
import { Briefcase, Heart, MapPin, MagnifyingGlass as Search } from "@phosphor-icons/react";
import { Card } from "../../../components/ui/card/Card";

/**
 * Modern Flat ProfileSidebar Component
 * Displays the quick About overview and Hobbies chips on the Timeline view.
 */
export function ProfileSidebar({ profile, isOwner = false }) {
  const maritalStatusMap = {
    SINGLE: "Độc thân",
    MARRIED: "Đã kết hôn",
    DIVORCED: "Ly hôn",
    WIDOWED: "Góa",
  };

  const lookingForMap = {
    LOVE: "Tình yêu",
    FRIENDS: "Bạn bè",
    NETWORKING: "Kết nối",
  };

  const bioText =
    profile?.bio ||
    (isOwner
      ? "Bạn chưa cập nhật tiểu sử."
      : "Người dùng này chưa cập nhật tiểu sử.");

  const cityName =
    profile?.city?.name || profile?.cityName || "Chưa cập nhật";
  const occupation = profile?.occupation || "Chưa cập nhật";
  const maritalStatus =
    maritalStatusMap[profile?.maritalStatus] || "Chưa cập nhật";
  const lookingFor = lookingForMap[profile?.lookingFor] || "Chưa cập nhật";

  return (
    <div className="flex flex-col gap-6">
      {/* Intro Card */}
      <Card className="p-5">
        <h3 className="text-text-main font-bold text-lg mb-3">Giới thiệu</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {bioText}
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-text-secondary text-sm">
            <Briefcase size={18} className="text-text-muted shrink-0" />
            <span>
              Nghề nghiệp:{" "}
              <strong className="text-text-main font-semibold">
                {occupation}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-text-secondary text-sm">
            <Heart size={18} className="text-text-muted shrink-0" />
            <span>
              Tình trạng:{" "}
              <strong className="text-text-main font-semibold">
                {maritalStatus}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-text-secondary text-sm">
            <Search size={18} className="text-text-muted shrink-0" />
            <span>
              Tìm kiếm:{" "}
              <strong className="text-text-main font-semibold">
                {lookingFor}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-text-secondary text-sm">
            <MapPin size={18} className="text-text-muted shrink-0" />
            <span>
              Đến từ:{" "}
              <strong className="text-text-main font-semibold">{cityName}</strong>
            </span>
          </div>
        </div>
      </Card>

      {/* Hobbies Section */}
      {profile?.hobbies?.length > 0 && (
        <Card className="p-5">
          <h3 className="text-text-main font-bold text-lg mb-3">Sở thích</h3>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby, index) => (
              <span
                key={hobby.id || index}
                className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20"
              >
                {hobby.name}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default ProfileSidebar;
