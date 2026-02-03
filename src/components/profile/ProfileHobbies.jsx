import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { getIconComponent } from "../../utils/iconMap";
import HobbySelectionModal from "./HobbySelectionModal";

const ProfileHobbies = ({ profile, isOwner }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-surface-main rounded-2xl border border-border-main p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-text-main font-bold text-xl flex items-center gap-2">
            {isOwner ? "Sở thích của bạn" : "Sở thích"}
          </h3>
          {isOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
            >
              <Pencil size={16} /> Quản lý
            </button>
          )}
        </div>
        {profile?.hobbies?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {profile.hobbies.map((hobby, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={index}
                className="group relative bg-surface-main hover:bg-primary/5 border border-border-main hover:border-primary/40 px-5 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(255,107,0,0.15)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                <div className="p-2 bg-background-main rounded-xl border border-border-main/50 group-hover:border-primary/20 group-hover:scale-110 transition-transform">
                  {getIconComponent(hobby.icon, {
                    size: 20,
                    className:
                      "text-text-secondary group-hover:text-primary transition-colors",
                  })}
                </div>
                <span className="text-text-main font-bold text-sm tracking-tight group-hover:text-primary transition-colors">
                  {hobby.name}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <p className="text-text-secondary italic">
              {isOwner
                ? "Hãy thêm những sở thích để mọi người hiểu bạn hơn."
                : "Người dùng này chưa cập nhật sở thích."}
            </p>
          </div>
        )}
      </div>

      {isOwner && (
        <HobbySelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentHobbies={profile?.hobbies}
          userId={profile?.userId}
        />
      )}
    </>
  );
};

export default ProfileHobbies;
