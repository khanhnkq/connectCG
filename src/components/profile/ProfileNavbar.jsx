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
        <div className="flex gap-1 overflow-x-auto pb-1 pt-2 scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2.5 font-bold transition-all whitespace-nowrap rounded-xl ${activeTab === tab.id
                            ? 'bg-surface-subtle text-primary'
                            : 'text-text-secondary hover:text-text-main hover:bg-surface-subtle/50'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
