import { useState } from 'react';

import RightSidebar from '../../components/layout/RightSidebar.jsx';

export default function FriendSuggestions() {
    const [suggestions, setSuggestions] = useState([
        {
            id: 1,
            name: 'Hồng Nhung',
            age: 24,
            location: 'Hà Nội',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0',
            mutualFriends: 12,
            reason: 'Có cùng sở thích: Du lịch',
            online: true
        },
        {
            id: 2,
            name: 'Tuấn Anh',
            age: 29,
            location: 'TP. HCM',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g',
            mutualFriends: 8,
            reason: 'Thành viên mới gần bạn',
            online: false
        },
        {
            id: 3,
            name: 'Minh Thư',
            age: 26,
            location: 'Đà Nẵng',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y',
            mutualFriends: 5,
            reason: 'Có cùng sở thích: Nghệ thuật',
            online: true
        },
        {
            id: 4,
            name: 'Quốc Bảo',
            age: 28,
            location: 'Cần Thơ',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5XMIpiqrD96rbcu3BjxqHOkpiTb_uUr6zVOzb3_EuEuyT7BKqTEpoqxuP4Q5_KQvP60A_2VSvikFgb-T6dHDeoW_JBguXbEb2aBZWpYU2ZHqnq9-UbMsPrpz9nuSS5PoGtucwsXXNpETlS5qomt4Lt5QiBEH-IIExc6OiETtXvtpKy0BwNQlgjk1GYSXjtSmGV42SJAbFmDxmcSZYbOTUNXQk7EwH1M2sDDKY33EOblUP98AmvedKaka_lnog0uPtQE6vFnDMUuk',
            mutualFriends: 18,
            reason: 'Bạn của Sarah Jenkins',
            online: true
        }
    ]);

    return (
        <div className="flex flex-1 overflow-hidden relative w-full h-full">
            <div className="flex-1 overflow-y-auto bg-background-dark p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">Gợi ý kết bạn</h1>
                            <p className="text-text-secondary text-base font-medium mt-1">Khám phá những người bạn mới có cùng sở thích hoặc bạn chung xung quanh bạn.</p>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {suggestions.map((person) => (
                                <article
                                    key={person.id}
                                    className="flex flex-col bg-[#2a1d15] rounded-2xl overflow-hidden border border-[#3e2b1d] hover:border-primary/50 transition-all shadow-xl group"
                                >
                                    <div className="h-56 w-full overflow-hidden relative">
                                        <img
                                            src={person.image}
                                            alt={person.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {person.online && (
                                            <div className="absolute top-4 right-4 size-4 bg-green-500 border-2 border-[#2a1d15] rounded-full shadow-lg"></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1d15] via-transparent to-transparent opacity-60"></div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-white font-bold text-xl group-hover:text-primary transition-colors">
                                                {person.name}, {person.age}
                                            </h3>
                                            <span className="text-text-secondary text-xs flex items-center gap-1 font-medium bg-[#3a2b22] px-2 py-1 rounded-full">
                                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                {person.location}
                                            </span>
                                        </div>
                                        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">info</span>
                                            {person.reason}
                                        </p>
                                        <p className="text-text-secondary text-sm mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">group</span>
                                            {person.mutualFriends} bạn chung
                                        </p>

                                        <div className="mt-auto flex flex-col gap-3">
                                            <button className="w-full py-3 rounded-xl bg-primary hover:bg-orange-600 text-[#231810] font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2">
                                                <span className="material-symbols-outlined font-black">person_add</span>
                                                Kết bạn
                                            </button>
                                            <button className="w-full py-3 rounded-xl bg-[#3a2b22] hover:bg-[#493222] text-white font-bold text-sm transition-colors border border-white/5">
                                                Để sau
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mt-16 flex justify-center pb-10">
                            <button className="px-10 py-4 rounded-full bg-[#342418] hover:bg-[#493222] text-white font-black text-sm uppercase tracking-widest border border-[#493222] transition-all shadow-2xl hover:-translate-y-1">
                                Xem thêm gợi ý
                            </button>
                        </div>
                    </div>
                </div>
                <RightSidebar />
            </div>

    );
}
