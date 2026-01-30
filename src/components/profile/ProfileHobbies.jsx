import React from "react";
import { Sparkles, Pencil } from "lucide-react";
import { getIconComponent } from "../../utils/iconMap";

const ProfileHobbies = ({ profile, isOwner }) => {
  return (
    <div className="bg-surface-main rounded-2xl border border-border-main p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-text-main font-bold text-xl flex items-center gap-2">
          <Sparkles className="text-primary" size={20} />
          {isOwner ? "Sở thích của bạn" : "Sở thích"}
        </h3>
        {isOwner && (
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            <Pencil size={16} /> Quản lý
          </button>
        )}
      </div>
      {profile?.hobbies?.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {profile.hobbies.map((hobby, index) => (
            <div
              key={index}
              className="bg-background-main hover:bg-surface-main border border-primary/20 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer group"
            >
              {getIconComponent(hobby.icon, {
                size: 32,
                className:
                  "text-primary group-hover:scale-110 transition-transform",
              })}
              <span className="text-text-main font-bold text-sm">
                {hobby.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 flex flex-col items-center justify-center">
          <Sparkles className="text-text-secondary/20 mb-3" size={48} />
          <p className="text-text-secondary italic">
            {isOwner
              ? "Hãy thêm những sở thích để mọi người hiểu bạn hơn."
              : "Người dùng này chưa cập nhật sở thích."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileHobbies;
