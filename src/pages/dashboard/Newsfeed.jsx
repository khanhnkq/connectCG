import React, { useState, useEffect } from 'react';
import { IconBell } from '@tabler/icons-react';
import { getMyNotifications, markAsRead } from '../../services/NotificationService';
import NotificationList from '../../components/notification/NotificationList';

import RightSidebar from '../../components/layout/RightSidebar';
import PostComposer from '../../components/feed/PostComposer';
import PostCard from '../../components/feed/PostCard';

export default function Newsfeed() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotificationsSync = async () => {
      try {
        const data = await getMyNotifications();
        setNotifications(data || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotificationsSync();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
      setNotifications(updated);
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  }


  return (


    <div className="flex w-full relative items-start">
      <div className="flex-1 w-full">
        <div className="max-w-3xl mx-auto w-full px-6 py-8 pb-20">
          <header className="flex justify-between items-center mb-8 sticky top-0 bg-background-dark/95 backdrop-blur-sm z-30 py-4 -mt-4 border-b border-[#342418]">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Bảng tin</h1>
              <p className="text-text-secondary text-sm font-medium">Xem những gì đang diễn ra xung quanh bạn</p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="size-10 rounded-full bg-[#342418] hover:bg-[#3e2b1d] text-white flex items-center justify-center transition-all relative"
                >
                  <IconBell className="text-neutral-200 h-5 w-5" />
                  {notifications.some(n => !n.isRead) && <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full animate-pulse border border-[#342418]"></span>}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 z-50">
                     <NotificationList
                        notifications={notifications}
                        onMarkAsRead={handleMarkAsRead}
                      />
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
              id={101}
              author={{ name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuHYpNqBoJZ6H3wxyG6OtCnMMVU4FTUngw6LYZy4SgjA0mY2sYsDcePdMS10ev3_M8tw950TFDzIey60zy_0YaYchnCYNkI1EFXtTTC7THk5zGBor8yBtMr-aAf8sbShLZVQv8CQzSm5kNH7EvWmKXyi1RIv1DxZa3HFHT34tseJeUcKe6h6lFC6Ar26xYdz8DghOGsPL3pKr3Sb5Jj3_uULvl0M_QzCz6myNZnocquEnyZkGrndeht0XMB4Yrsu9Is2B6nJ3Mi9M' }}
              time="2 giờ trước"
              content="Thực sự thích không khí tại quán cà phê mới này! ☕️ Cà phê tuyệt vời và không gian thật hoàn hảo để làm việc. Rất khuyến khích các bạn ghé thử nếu có dịp ở gần đây!"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuB5H7LQP89_ZyvOx7F5cl1FYMVnX-MFWL-CyfK4ZXJL_PYJnCoIl8ZQfS6hcPUIg20U2Y9NtA0u6tEvMAtdbXX7OuYPnlq15Bo-FQ6Swbqb-iVM7pLDFoVMpMpC9jeXWPszg-3mORsIVFncUTgYkKHk_zDbiqZFQ9R_O4k5tzf_rbG6LXkhpDkHpj_eZ83CRu03Xlyf_iE1svoJcndPrSOAOuGERcRUJQoJiNv5XFwlwZ8uSty1MtJOsSHs3Y2RbmyrHtxPayn-WcA"
              stats={{ likes: 24, comments: 4, shares: 1 }}
              type="feed"
            />

            <PostCard
              id={102}
              author={{ name: 'David Kim', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfCl1X2bsOD2anKofpFDzckD9z_a3CDOQqg1A1-nnzE0ALZhx8h2sNsn_PdV7-P6oEpg0XRttDsHUQJwA2Aa3MdUW6FIzwdzYDOxxjZFF7_x9QBl_cJ0NvpSwm_LFGlB5Yi4n9ksqFEjuIaIuQTyLOghyL8b2P7JdZiE9YN9aMocc7VfC_uvu-UaLuLtbGD9_5Kropk3H3Na2Of1n_kfzDW9PvINieVznAqTbyDeohff0qGU0J5IQTasq56bubbiAsxjbHlaBRaZ4' }}
              time="5 giờ trước"
              content="Vừa hoàn thành đường chạy 10k! 🏃‍♂️ Cảm thấy vừa thành tựu vừa kiệt sức. Tập luyện cho marathon thật gian nan nhưng rất đáng giá."
              stats={{ likes: 156, comments: 23, shares: 0 }}
              type="feed"
            />
          </div>
        </div>
      </div>

      <RightSidebar />
    </div>
  );

}
