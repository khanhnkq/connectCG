export default function FriendsSidebar({ viewMode, setViewMode, setActiveItem, friendsCount, requestsCount, suggestionsCount }) {
    return (
        <div className="hidden md:flex w-20 lg:w-64 flex-col border-r border-border-main bg-surface-main shrink-0">
            <div className="p-5 border-b border-border-main flex items-center gap-3">
                <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">diversity_3</span>
                </div>
                <span className="text-text-main font-bold text-lg hidden lg:block">Bạn bè</span>
            </div>

            <div className="p-3 space-y-1">
                <button
                    onClick={() => { setViewMode('ALL'); setActiveItem(null); }}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === 'ALL'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-text-secondary hover:bg-background-main hover:text-text-main'
                        }`}
                >
                    <span className="material-symbols-outlined">group</span>
                    <span className="font-medium hidden lg:block">Tất cả bạn bè</span>
                    <span className="ml-auto bg-background-main px-2 py-0.5 rounded text-xs hidden lg:block">{friendsCount}</span>
                </button>

                <button
                    onClick={() => { setViewMode('REQUESTS'); setActiveItem(null); }}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === 'REQUESTS'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-text-secondary hover:bg-background-main hover:text-text-main'
                        }`}
                >
                    <span className="material-symbols-outlined">person_add</span>
                    <span className="font-medium hidden lg:block">Lời mời kết bạn</span>
                    {requestsCount > 0 && (
                        <span className="ml-auto bg-primary text-white font-bold px-2 py-0.5 rounded text-xs hidden lg:block">
                            {requestsCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => { setViewMode('SUGGESTIONS'); setActiveItem(null); }}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === 'SUGGESTIONS'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-text-secondary hover:bg-background-main hover:text-text-main'
                        }`}
                >
                    <span className="material-symbols-outlined">person_search</span>
                    <span className="font-medium hidden lg:block">Gợi ý kết bạn</span>
                    <span className="ml-auto bg-background-main px-2 py-0.5 rounded text-xs hidden lg:block">{suggestionsCount}</span>
                </button>
            </div>
        </div>
    );
}
