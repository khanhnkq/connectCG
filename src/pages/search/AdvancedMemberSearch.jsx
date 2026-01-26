import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar.jsx';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdvancedMemberSearch() {
    const { profile: userProfile } = useSelector((state) => state.user);
    const [onlineOnly, setOnlineOnly] = useState(true);
    const [ageRange, setAgeRange] = useState({ min: 24, max: 35 });
    const [distance, setDistance] = useState('10km');
    const [selectedInterests, setSelectedInterests] = useState(['Du lịch', 'Leo núi']);

    const interests = ['Du lịch', 'Âm thực', 'Nấu ăn', 'Leo núi', 'Chơi game', 'Nghệ thuật', 'Gym'];

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const members = [
        {
            id: 1,
            name: 'Sarah',
            age: 24,
            location: 'Brooklyn, NY',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtzj33ot6VHzYPrEZRs8cpa1g_r4fQJavkqxNjq0EJWXWXUQjJMlqnaalvjE9rDGu7s-4N_I1I3eewvwLthcUyNjFp3IVZELsi4gYSlI7lW_Tsv4AZy3_r2ChuvRlcerEebNvx18lMIzNin0BpxepStd03-HmsyNay81AAaCMrsCk4wgoh8PXLpyiXqCfpWwAZCplF2qLe6PDAUHU2UefOlWMTkJMFOFWp5yucZ5qU_aNbg2RyWshb8pQnKLpSYVJC-Ls9BfNdq0k',
            mutualFriends: 12,
            mutualAvatars: [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_o9Xo2P_yZzTqP4j_2jx_0gV5kLX5yM8nO9pE3rF_1sT_4uV_6wX7z_8yA9bC0dE_fG_H1iJ_kL_3mN_oP_5qR_6sT7uV8w',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuC_1lM2nO3p_4kR_5sU_6tV_7wX8yZ9aB0c_eD_F1gH_2iK_3lM_4nO_5pQ_6rS_7tU_8vW'
            ],
            online: true,
            liked: true
        },
        {
            id: 2,
            name: 'James',
            age: 29,
            location: 'Manhattan, NY',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFFOuYSb8rrkTBRcwwKlN6-MaZ_rOVsEeQYa2Cf0j5qsh4ejcX2MsTBLVmLzZ8ki_cvVN06OlWcisbOKzMnOPAeSfr3Ova1uEE1sZZKxUnnONhxzxmabSIMzZT-s8X896jy-nLyQ67OgNM2jsl7d1ge7lq9bpFQvjyTSOYWOkKVgu3dJtrm7xJV6_cDzOyMj42lXAwe9oF0lgdrp779XNtHDszgm2TbWboiv6uwZVocO7IcPEXaMfkwFwU5yJXFUbDWzE3Sv1gfCE',
            mutualFriends: 8,
            mutualAvatars: [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2mN3oP4q_5lS_6tU_7vW_8xY9aB0c_eE_F1gH_2jK_3lM_4nO_5pQ_6rS_7tU_8vX',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuE_3nO4pQ5r_6mT_7uV_8wX_9yZ0bC1d_fF_G2hI_3kL_4mN_5oP_6qR_7sT_8uV_9wW'
            ],
            online: false,
            liked: false
        },
        {
            id: 3,
            name: 'Maya',
            age: 26,
            location: 'Jersey City, NJ',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwo1VHAkMAwMxb5zxfQQn7iSSm6EcfQoSYw57oB-RFAtO8xMBXEOSUzrfccz77fElzMRNrQ3tJgAiuNuvyozQJ0n5-cY4Fh9Kl2fEnDQFFJrHhj5JLNRkM_0yaFtsd8RYu-zMxHBnONKyOGDT2m_JDP5DwoIqzZVP9Dm0rzQksNm--Hht71w509BbCB7RAaHher_soh5492hauOYivRTBkrl0hdFe9z9-Tc0r02H64o9P_aZeF4VlIXsQQL1JBvMng5kj1ywSZIok',
            mutualFriends: 5,
            mutualAvatars: [],
            online: true,
            liked: false
        },
        {
            id: 4,
            name: 'Lucas',
            age: 28,
            location: 'Queens, NY',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJPlnDjBjXuixfttGBOr0_Jx2ZLTctMTrGw14hx9On0XfJumO9xm9cOekOU2h2N4DYnbdA2kJqNkj1La7ogr0YwtHbWZbBTN2f4jz2tMaZ4MysYtOwrJh9nwBn3ooj5LQfIAwf-a0pq9vR24ScthQGYkC_nY1vIxbb6OW1ySd-C8q1C-EFoeCLGB47y8OGHnKoiwdLpB3Jgft_uYAPe6-xAq52AMh9kmGduf6uAp8MOpDKV3ZUqpAElRvG46XdK09BKNQRomKVHFo',
            mutualFriends: 18,
            mutualAvatars: [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuF_4oP5qR6s_7nU_8vW_9xY_0zB2eD_fG_H3iJ_4kL_5mN_6oP_7qR_8sT_9uV_0wX',
            ],
            online: true,
            liked: false
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Content: Search Results */}
                <main className="flex-1 overflow-y-auto bg-background-dark p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {/* Results Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white">Tìm bạn mới</h1>
                            <p className="text-text-secondary text-sm mt-1">Sử dụng bộ lọc thông minh để tìm những người phù hợp nhất với bạn.</p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {members.map((member) => (
                                <article
                                    key={member.id}
                                    className="flex flex-col bg-[#2a1d15] rounded-xl overflow-hidden border border-[#3e2b1d] hover:border-primary/50 transition-colors shadow-lg"
                                >
                                    {/* Image Section - Top Half */}
                                    <div className="h-64 sm:h-[16rem] w-full overflow-hidden relative">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                        {member.online && (
                                            <div className="absolute top-3 right-3 size-4 bg-green-500 border-2 border-[#2a1d15] rounded-full"></div>
                                        )}
                                    </div>

                                    {/* Content Section - Bottom Half */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-white font-bold text-lg leading-tight mb-1">
                                            {member.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-text-secondary text-sm font-medium">{member.mutualFriends} bạn chung</span>
                                        </div>

                                        {/* Buttons */}
                                        <div className="mt-auto flex flex-col gap-2">
                                            <button className="w-full py-2 rounded-lg bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                                <span className="material-symbols-outlined text-sm">person_add</span>
                                                Kết bạn
                                            </button>
                                            <button className="w-full py-2 rounded-lg bg-[#3a2b22] hover:bg-[#493222] text-white font-bold text-sm transition-colors">
                                                Để sau
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="mt-12 flex justify-center pb-8">
                            <button className="px-8 py-3 rounded-full bg-[#342418] hover:bg-[#493222] text-white font-bold border border-[#493222] transition-all shadow-lg hover:-translate-y-0.5">
                                Xem thêm kết quả
                            </button>
                        </div>
                    </div>
                </main>

                {/* Search Filters Sidebar - Moved to Right */}
                <aside className="w-full md:w-[320px] lg:w-[340px] flex flex-col border-l border-[#342418] bg-[#221710] z-10 overflow-y-auto custom-scrollbar flex-none hidden md:flex">
                    <div className="p-5 pb-0">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-white text-xl font-bold leading-tight">Bộ lọc tìm kiếm</h2>
                            <button className="text-sm font-bold text-primary hover:text-orange-400">Đặt lại</button>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <label className="flex w-full items-center rounded-xl bg-[#342418] border border-[#493222] h-12 px-4 focus-within:ring-1 ring-primary/50 transition-all">
                                <span className="material-symbols-outlined text-text-secondary">search</span>
                                <input
                                    className="w-full bg-transparent border-none text-white placeholder-text-secondary/60 focus:ring-0 text-sm ml-2 focus:outline-none"
                                    placeholder="Tên, thành phố hoặc từ khóa..."
                                />
                            </label>
                        </div>

                        {/* Online Only Toggle */}
                        <div className="mb-6 rounded-xl border border-[#342418] bg-[#2a1d15] p-4 flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-white text-sm font-bold">Đang online</p>
                                <p className="text-text-secondary text-xs">Thành viên đang truy cập</p>
                            </div>
                            <label className="relative flex h-[24px] w-[44px] cursor-pointer items-center rounded-full bg-[#342418] p-1 has-[:checked]:justify-end has-[:checked]:bg-primary transition-all duration-300">
                                <div className="h-[18px] w-[18px] rounded-full bg-white shadow-sm" />
                                <input
                                    type="checkbox"
                                    checked={onlineOnly}
                                    onChange={() => setOnlineOnly(!onlineOnly)}
                                    className="invisible absolute"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Accordions Container */}
                    <div className="flex flex-col px-5 pb-10 gap-4">
                        {/* Age Range Accordion */}
                        <details className="group flex flex-col rounded-xl border border-[#342418] bg-[#2a1d15] overflow-hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-white/5 transition-colors list-none">
                                <p className="text-white text-sm font-bold">Độ tuổi</p>
                                <span className="material-symbols-outlined text-text-secondary text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1">
                                <div className="flex justify-between text-sm text-text-secondary mb-3 font-medium">
                                    <span>{ageRange.min}</span>
                                    <span>{ageRange.max}</span>
                                </div>
                                <div className="relative h-1.5 w-full rounded-full bg-[#342418]">
                                    <div className="absolute h-full w-[40%] left-[20%] rounded-full bg-primary" />
                                </div>
                            </div>
                        </details>

                        {/* Location Accordion */}
                        <details className="group flex flex-col rounded-xl border border-[#342418] bg-[#2a1d15] overflow-hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-white/5 transition-colors list-none">
                                <p className="text-white text-sm font-bold">Vị trí</p>
                                <span className="material-symbols-outlined text-text-secondary text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-primary text-sm font-bold cursor-pointer mb-1">
                                    <span className="material-symbols-outlined text-[18px]">my_location</span>
                                    <span>Sử dụng vị trí của tôi</span>
                                </div>
                                <div className="space-y-2">
                                    {['10km', '50km', 'anywhere'].map((val) => (
                                        <label key={val} className="flex items-center gap-3 cursor-pointer group/label">
                                            <div className={`size-4 rounded-full border flex items-center justify-center ${distance === val ? 'border-primary' : 'border-[#493222]'}`}>
                                                {distance === val && <div className="size-2 rounded-full bg-primary" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="distance"
                                                checked={distance === val}
                                                onChange={() => setDistance(val)}
                                                className="hidden"
                                            />
                                            <span className={`text-sm group-hover/label:text-white transition-colors ${distance === val ? 'text-white' : 'text-text-secondary'}`}>
                                                {val === 'anywhere' ? 'Mọi nơi' : `Trong vòng ${val}`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </details>

                        {/* Interests Accordion */}
                        <details className="group flex flex-col rounded-xl border border-[#342418] bg-[#2a1d15] overflow-hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-white/5 transition-colors list-none">
                                <p className="text-white text-sm font-bold">Sở thích</p>
                                <span className="material-symbols-outlined text-text-secondary text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1">
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest) => (
                                        <button
                                            key={interest}
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedInterests.includes(interest)
                                                ? 'bg-primary text-[#231810] border-primary'
                                                : 'bg-transparent text-text-secondary border-[#493222] hover:border-primary hover:text-primary'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </details>
                    </div>
                </aside>
            </div>
        </div >
    );
}
