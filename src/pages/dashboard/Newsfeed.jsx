import Sidebar from '../../components/layout/Sidebar';
import RightSidebar from '../../components/layout/RightSidebar';
import PostComposer from '../../components/feed/PostComposer';
import PostCard from '../../components/feed/PostCard';
import { useState, useRef, useEffect } from "react";


export default function Newsfeed() {
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      content: "Sarah Jenkins đã thích bài viết của bạn",
      time: "2 phút trước",
      read: false,
    },
    {
      id: 2,
      content: "David Kim đã bình luận về bài viết của bạn",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      content: "Bạn có một lời mời kết bạn mới",
      time: "Hôm qua",
      read: true,
    },
  ]);

  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
        <div className="max-w-3xl mx-auto w-full px-6 py-8 pb-20">
          <header className="flex justify-between items-center mb-8 sticky top-0 bg-background-dark/95 backdrop-blur-sm z-30 py-4 -mt-4 border-b border-[#342418]">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Bảng tin</h1>
              <p className="text-text-secondary text-sm font-medium">Xem những gì đang diễn ra xung quanh bạn</p>
            </div>
            <div className="flex gap-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="size-10 rounded-full bg-[#342418] hover:bg-[#3e2b1d] text-white flex items-center justify-center transition-all relative"
                >
                  <span className="material-symbols-outlined">notifications</span>

                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-[#342418]"></span>
                  )}
                </button>

                {/* DROPDOWN */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-[#1E140D] border border-[#342418] rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#342418]">
                      <h4 className="text-white font-bold text-sm">Thông báo</h4>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 && (
                        <p className="text-text-secondary text-sm p-4 text-center">
                          Không có thông báo nào
                        </p>
                      )}

                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`group px-4 py-3 flex gap-3 items-start border-b border-[#342418] hover:bg-[#2A1D15] transition-colors ${!n.read ? "bg-[#2A1D15]" : ""
                            }`}
                        >

                          {!n.read && (
                            <span className="mt-2 size-2 bg-primary rounded-full"></span>
                          )}

                          <div className="flex-1">
                            <p className={`text-sm ${n.read ? "text-text-secondary" : "text-white font-medium"}`}>
                              {n.content}
                            </p>
                            <span className="text-[11px] text-text-secondary">
                              {n.time}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            {!n.read && (
                              <button
                                onClick={() =>
                                  setNotifications((prev) =>
                                    prev.map((x) =>
                                      x.id === n.id ? { ...x, read: true } : x
                                    )
                                  )
                                }
                                className="text-primary text-[11px] hover:underline"
                              >
                                Đã xem
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setNotifications((prev) =>
                                  prev.filter((x) => x.id !== n.id)
                                )
                              }
                              className="text-red-400 text-[11px] hover:underline"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="lg:hidden size-10 rounded-full bg-[#342418] hover:bg-[#3e2b1d] text-white flex items-center justify-center transition-all">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </header>

          <div className="flex flex-col gap-6">
            <PostComposer userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw" />

            <PostCard
              author={{ name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuHYpNqBoJZ6H3wxyG6OtCnMMVU4FTUngw6LYZy4SgjA0mY2sYsDcePdMS10ev3_M8tw950TFDzIey60zy_0YaYchnCYNkI1EFXtTTC7THk5zGBor8yBtMr-aAf8sbShLZVQv8CQzSm5kNH7EvWmKXyi1RIv1DxZa3HFHT34tseJeUcKe6h6lFC6Ar26xYdz8DghOGsPL3pKr3Sb5Jj3_uULvl0M_QzCz6myNZnocquEnyZkGrndeht0XMB4Yrsu9Is2B6nJ3Mi9M' }}
              time="2 giờ trước"
              content="Thực sự thích không khí tại quán cà phê mới này! ☕️ Cà phê tuyệt vời và không gian thật hoàn hảo để làm việc. Rất khuyến khích các bạn ghé thử nếu có dịp ở gần đây!"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuB5H7LQP89_ZyvOx7F5cl1FYMVnX-MFWL-CyfK4ZXJL_PYJnCoIl8ZQfS6hcPUIg20U2Y9NtA0u6tEvMAtdbXX7OuYPnlq15Bo-FQ6Swbqb-iVM7pLDFoVMpMpC9jeXWPszg-3mORsIVFncUTgYkKHk_zDbiqZFQ9R_O4k5tzf_rbG6LXkhpDkHpj_eZ83CRu03Xlyf_iE1svoJcndPrSOAOuGERcRUJQoJiNv5XFwlwZ8uSty1MtJOsSHs3Y2RbmyrHtxPayn-WcA"
              stats={{ likes: 24, comments: 4, shares: 1 }}
              type="feed"
            />

            <PostCard
              author={{ name: 'David Kim', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfCl1X2bsOD2anKofpFDzckD9z_a3CDOQqg1A1-nnzE0ALZhx8h2sNsn_PdV7-P6oEpg0XRttDsHUQJwA2Aa3MdUW6FIzwdzYDOxxjZFF7_x9QBl_cJ0NvpSwm_LFGlB5Yi4n9ksqFEjuIaIuQTyLOghyL8b2P7JdZiE9YN9aMocc7VfC_uvu-UaLuLtbGD9_5Kropk3H3Na2Of1n_kfzDW9PvINieVznAqTbyDeohff0qGU0J5IQTasq56bubbiAsxjbHlaBRaZ4' }}
              time="5 giờ trước"
              content="Vừa hoàn thành đường chạy 10k! 🏃‍♂️ Cảm thấy vừa thành tựu vừa kiệt sức. Tập luyện cho marathon thật gian nan nhưng rất đáng giá."
              stats={{ likes: 156, comments: 23, shares: 0 }}
              type="feed"
            />
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}
