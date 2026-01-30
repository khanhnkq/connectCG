export default function FriendListItem({ item, isActive, onClick, viewMode }) {
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-xl cursor-pointer relative group flex gap-3 items-center transition-all duration-200 ${isActive
                ? 'bg-primary/10 border-2 border-primary shadow-lg shadow-primary/10'
                : 'bg-surface-main/50 hover:bg-surface-main border-2 border-transparent hover:border-border-main'
                }`}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                <div
                    className="size-14 rounded-xl bg-cover bg-center border-2 border-border-main group-hover:border-primary/50 transition-all"
                    style={{ backgroundImage: `url("${item.avatarUrl || item.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                ></div>
                {item.isOnline && (
                    <div className="absolute -bottom-1 -right- size-4 bg-green-500 rounded-full border-2 border-surface-main shadow-lg"></div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-base truncate transition-colors ${isActive ? 'text-text-main' : 'text-text-main group-hover:text-primary'
                    }`}>
                    {item.fullName || item.name || item.username}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
                    {viewMode === 'SUGGESTIONS' && (
                        <>
                            <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                            <span className="truncate">{item.city || item.location}</span>
                        </>
                    )}
                    {viewMode === 'ALL' && item.mutualFriends > 0 && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-medium">
                            {item.mutualFriends} bạn chung
                        </span>
                    )}
                    {!item.city && !item.location && viewMode === 'SUGGESTIONS' && (
                        <span className="text-text-secondary/60 italic">Chưa cập nhật vị trí</span>
                    )}
                </div>
            </div>

            {/* Chevron */}
            <span className={`material-symbols-outlined text-[24px] transition-all ${isActive ? 'text-primary opacity-100' : 'text-text-secondary opacity-0 group-hover:opacity-100'
                }`}>
                chevron_right
            </span>
        </div>
    );
}
