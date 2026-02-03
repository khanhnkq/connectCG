import FriendListItem from "./FriendListItem";
import FriendRequestItem from "./FriendRequestItem";
import FriendSuggestionItem from "./FriendSuggestionItem";

export default function FriendsListPanel({
  viewMode,
  setViewMode,
  displayedList,
  activeItem,
  setActiveItem,
  searchTerm,
  setSearchTerm,
  isLoading,
  processingRequests,
  onAcceptRequest,
  onRejectRequest,
  onAddFriend,
  onDismissSuggestion,
  onLoadMore,
  hasMore
}) {
  const getTitle = () => {
    if (viewMode === "ALL") return "Danh sách bạn bè";
    if (viewMode === "REQUESTS") return "Lời mời kết bạn";
    return "Gợi ý kết bạn";
  };

  const getSubtitle = () => {
    const count = displayedList.length;
    if (viewMode === "ALL") return `${count} bạn bè`;
    if (viewMode === "REQUESTS") return `${count} lời mời`;
    return `${count} gợi ý`;
  };

  return (
    <div
      className={`${activeItem ? "hidden xl:flex" : "flex"
        } w-full md:w-80 lg:w-96 flex-col border-r border-border-main bg-surface-main shrink-0`}
    >
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-border-main bg-gradient-to-b from-surface-main to-background-main sticky top-0 z-10 backdrop-blur-md">
        <div className="mb-4 md:block hidden">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              {viewMode === "ALL"
                ? "group"
                : viewMode === "REQUESTS"
                  ? "person_add"
                  : "person_search"}
            </span>
            {getTitle()}
          </h2>
          <p className="text-text-secondary text-sm mt-1">{getSubtitle()}</p>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex gap-1 mb-4 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {[
            { id: "ALL", label: "Tất cả", icon: "group" },
            {
              id: "REQUESTS",
              label: "Lời mời",
              icon: "person_add",
              badge:
                displayedList.length && viewMode === "REQUESTS"
                  ? displayedList.length
                  : 0,
            },
            { id: "SUGGESTIONS", label: "Gợi ý", icon: "person_search" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setViewMode(tab.id);
                setActiveItem(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${viewMode === tab.id
                ? "bg-primary/10 text-primary border-primary/30"
                : "text-text-secondary border-transparent hover:bg-background-main"
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {tab.icon}
              </span>
              {tab.label}
              {tab.id === "REQUESTS" && tab.badge > 0 && (
                <span className="bg-primary text-[#231810] px-1.5 py-0.5 rounded text-[10px] font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-secondary text-[20px] group-focus-within:text-primary transition-colors">
              search
            </span>
          </div>
          <input
            className="block w-full pl-10 pr-4 py-3 border border-border-main rounded-xl bg-background-main text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            placeholder="Tìm kiếm..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-background-main px-3 py-4 space-y-2 relative">
        {isLoading && displayedList.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-background-main z-20">
            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-text-secondary text-sm">Đang tải...</p>
          </div>
        ) : displayedList.length > 0 ? (
          displayedList.map((item, index) => {
            const isLast = index === displayedList.length - 1;
            const refProps = isLast && onLoadMore && hasMore ? {
              ref: (node) => {
                if (isLoading) return;
                if (window.friendsObserver) window.friendsObserver.disconnect();
                window.friendsObserver = new IntersectionObserver(entries => {
                  if (entries[0].isIntersecting && hasMore) {
                    onLoadMore();
                  }
                });
                if (node) window.friendsObserver.observe(node);
              }
            } : {};

            if (viewMode === "REQUESTS") {
              return (
                <div key={item.requestId} {...refProps}>
                  <FriendRequestItem
                    request={item}
                    isActive={activeItem?.requestId === item.requestId}
                    onClick={() => setActiveItem(item)}
                    onAccept={onAcceptRequest}
                    onReject={onRejectRequest}
                    isProcessing={processingRequests[item.requestId]}
                  />
                </div>
              );
            } else if (viewMode === "SUGGESTIONS") {
              return (
                <div key={item.userId} {...refProps}>
                  <FriendSuggestionItem
                    suggestion={item}
                    isActive={activeItem?.userId === item.userId}
                    onClick={() => setActiveItem(item)}
                    onAddFriend={onAddFriend}
                    onDismiss={onDismissSuggestion}
                    isProcessing={processingRequests[item.userId]}
                  />
                </div>
              );
            } else {
              return (
                <div key={item.id} {...refProps}>
                  <FriendListItem
                    item={item}
                    isActive={activeItem?.id === item.id}
                    onClick={() => setActiveItem(item)}
                    viewMode={viewMode}
                  />
                </div>
              );
            }
          })
        ) : (
          <div className="text-center text-text-secondary py-16 flex flex-col items-center">
            <div className="size-16 rounded-full bg-[#2A1D15] border-2 border-[#3A2A20] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl opacity-30">
                search_off
              </span>
            </div>
            <p className="font-medium mb-1">Không tìm thấy kết quả</p>
            <p className="text-xs text-text-secondary/70">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
