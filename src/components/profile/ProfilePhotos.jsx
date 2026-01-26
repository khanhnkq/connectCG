import React from 'react';

const ProfilePhotos = ({ profile, isOwner }) => {
    return (
        <div className="bg-[#342418] rounded-2xl border border-[#3e2b1d] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">image</span>
                    {isOwner ? 'Ảnh của bạn' : 'Bộ sưu tập ảnh'}
                </h3>
                {isOwner && (
                    <button className="bg-primary hover:bg-orange-600 text-[#231810] text-xs font-bold px-4 py-2 rounded-lg transition-all">
                        Thêm ảnh
                    </button>
                )}
            </div>

            {profile?.gallery?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {profile.gallery.map((media, index) => (
                        <div key={index} className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer shadow-lg">
                            <img
                                src={media.url}
                                alt={`Gallery ${index}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-white">zoom_in</span>
                                {isOwner && <span className="material-symbols-outlined text-white hover:text-red-500 transition-colors">delete</span>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <span className="material-symbols-outlined text-5xl text-text-secondary/20 mb-3">camera_roll</span>
                    <p className="text-text-secondary italic">
                        {isOwner ? 'Bạn chưa tải lên bức ảnh nào.' : 'Người dùng này chưa có ảnh nào trong bộ sưu tập.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotos;
