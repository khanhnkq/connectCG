import React from "react";
import { User, Pencil, Briefcase, Heart, MapPin, MagnifyingGlass as Search, Cake, Users, Sparkle as Sparkles } from "@phosphor-icons/react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import { formatDate } from "../../utils/dateUtils";

// eslint-disable-next-line no-unused-vars
const InfoItem = ({ icon: Icon, label, value, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="group relative flex items-center justify-between p-4 rounded-2xl bg-surface-subtle hover:bg-surface-subtle/80 border-0 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-xl bg-surface-main flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300 border-0">
          <Icon
            className="text-text-secondary group-hover:text-primary transition-colors"
            size={20}
          />
        </div>
        <span className="text-text-secondary font-medium text-sm group-hover:text-text-main transition-colors">
          {label}
        </span>
      </div>
      <span className="text-text-main font-bold text-sm bg-surface-main px-3 py-1.5 rounded-lg border-0 shadow-sm transition-all">
        {value}
      </span>
    </motion.div>
  );
};

const ProfileAbout = ({ profile, isOwner }) => {
  const infoGroups = [
    {
      items: [
        {
          icon: Users,
          label: "Giới tính",
          value:
            { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" }[profile?.gender] ||
            "Chưa cập nhật",
        },
        {
          icon: Cake,
          label: "Ngày sinh",
          value: formatDate(profile?.dateOfBirth),
        },
        {
          icon: Search,
          label: "Tìm kiếm",
          value:
            { LOVE: "Hẹn hò", FRIENDS: "Kết bạn", NETWORKING: "Kết nối" }[
              profile?.lookingFor
            ] || "Chưa cập nhật",
        },
      ],
    },
    {
      items: [
        {
          icon: Briefcase,
          label: "Nghề nghiệp",
          value: profile?.occupation || "Chưa cập nhật",
        },
        {
          icon: Heart,
          label: "Tình trạng",
          value:
            {
              SINGLE: "Độc thân",
              MARRIED: "Đã kết hôn",
              DIVORCED: "Đã ly hôn",
              WIDOWED: "Đã góa",
            }[profile?.maritalStatus] || "Chưa cập nhật",
        },
        {
          icon: MapPin,
          label: isOwner ? "Đến từ" : "Thành phố",
          value: profile?.cityName || "Chưa cập nhật",
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 size-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="bg-surface-main/80 backdrop-blur-xl rounded-3xl border-0 p-6 md:p-8 shadow-xl relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col gap-1">
            <h3 className="text-text-main font-black text-2xl flex items-center gap-3 tracking-tight">
              {isOwner ? "Chi tiết về bạn" : "Thông tin chi tiết"}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {infoGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-4">
              {group.items.map((item, itemIdx) => (
                <InfoItem
                  key={itemIdx}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  delay={(groupIdx * 3 + itemIdx) * 0.1}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileAbout;
