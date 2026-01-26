import React from 'react';

const ProfileHobbies = ({ profile, isOwner }) => {
    return (
        <div className="bg-[#342418] rounded-2xl border border-[#3e2b1d] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">interests</span>
                    {isOwner ? 'Sở thích của bạn' : 'Sở thích'}
                </h3>
                {isOwner && (
                    <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                        <span className="material-symbols-outlined text-sm">edit</span> Quản lý
                    </button>
                )}
            </div>
            {profile?.hobbies?.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                    {profile.hobbies.map((hobby, index) => (
                        <div key={index} className="bg-[#493222] hover:bg-[#5c402d] border border-primary/20 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer group">
                            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">{hobby.icon || 'star'}</span>
                            <span className="text-white font-bold text-sm">{hobby.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <span className="material-symbols-outlined text-5xl text-text-secondary/20 mb-3">auto_awesome</span>
                    <p className="text-text-secondary italic">
                        {isOwner ? 'Hãy thêm những sở thích để mọi người hiểu bạn hơn.' : 'Người dùng này chưa cập nhật sở thích.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfileHobbies;
