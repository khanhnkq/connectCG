import React from 'react';

export default function ProfileNavbar({ activeTab, setActiveTab, friendsCount }) {
    const tabs = [
        { id: 'timeline', label: 'Dòng thời gian' },
        { id: 'about', label: 'Giới thiệu' },
        { id: 'photos', label: 'Ảnh' },
        { id: 'hobbies', label: 'Sở thích' },
        { id: 'friends', label: `Bạn bè (${friendsCount || 0})` },
    ];

    return (
        <div className="flex gap-1 overflow-x-auto pb-1 border-t border-[#493222] pt-2 scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-text-secondary hover:text-white hover:bg-[#493222]/50 rounded-t-lg'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
