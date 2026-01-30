import FriendListItem from './FriendListItem';
import FriendRequestItem from './FriendRequestItem';

export default function FriendsListPanel({
    viewMode,
    displayedList,
    activeItem,
    setActiveItem,
    searchTerm,
    setSearchTerm,
    processingRequests,
    onAcceptRequest,
    onRejectRequest
}) {
    const getTitle = () => {
        if (viewMode === 'ALL') return 'Danh sách bạn bè';
        if (viewMode === 'REQUESTS') return 'Lời mời kết bạn';
        return 'Gợi ý kết bạn';
    };

    const getSubtitle = () => {
        const count = displayedList.length;
        if (viewMode === 'ALL') return `${count} bạn bè`;
        if (viewMode === 'REQUESTS') return `${count} lời mời`;
        return `${count} gợi ý`;
    };

    return (
        <div className={`${activeItem ? 'hidden xl:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-[#3A2A20] bg-[#1E140F] shrink-0`}>
            {/* Header */}
            <div className="p-5 border-b border-[#3A2A20] bg-gradient-to-b from-[#1E140F] to-[#1A120B] sticky top-0 z-10 backdrop-blur-md">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                            {viewMode === 'ALL' ? 'group' : viewMode === 'REQUESTS' ? 'person_add' : 'person_search'}
                        </span>
                        {getTitle()}
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">{getSubtitle()}</p>
                </div>

                {/* Search */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-text-secondary text-[20px] group-focus-within:text-primary transition-colors">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-4 py-3 border border-[#3A2A20] rounded-xl bg-[#2A1D15] text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        placeholder="Tìm kiếm..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
                {displayedList.length > 0 ? (
                    displayedList.map((item) => (
                        viewMode === 'REQUESTS' ? (
                            <FriendRequestItem
                                key={item.requestId}
                                request={item}
                                isActive={activeItem?.requestId === item.requestId}
                                onClick={() => setActiveItem(item)}
                                onAccept={onAcceptRequest}
                                onReject={onRejectRequest}
                                isProcessing={processingRequests[item.requestId]}
                            />
                        ) : (
                            <FriendListItem
                                key={item.id}
                                item={item}
                                isActive={activeItem?.id === item.id}
                                onClick={() => setActiveItem(item)}
                                viewMode={viewMode}
                            />
                        )
                    ))
                ) : (
                    <div className="text-center text-text-secondary py-16 flex flex-col items-center">
                        <div className="size-16 rounded-full bg-[#2A1D15] border-2 border-[#3A2A20] flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl opacity-30">search_off</span>
                        </div>
                        <p className="font-medium mb-1">Không tìm thấy kết quả</p>
                        <p className="text-xs text-text-secondary/70">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                )}
            </div>
        </div>
    );
}
