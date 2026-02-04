import toast from "react-hot-toast";

export const AD_BANNERS = [
  {
    backgroundImage:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Đặt",
    highlight: "Đồ Ăn",
    subtitle: "Giảm <span class='text-white font-bold'>50%</span> ngay hôm nay!",
    promoBadge: "Khuyến mãi",
    onClick: () => toast("Tính năng đặt món đang được phát triển! 🍜"),
  },
  {
    backgroundImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Quiz",
    highlight: "Ken",
    subtitle:
      "Nền tảng ôn thi <span class='text-white font-bold'>hiệu quả</span>",
    promoBadge: "Mới",
    promoColor: "bg-blue-500",
    highlightColor: "text-blue-400",
    href: "https://quizken.vercel.app",
  },
];
