import React from "react";
import {
  Users,
  UserPlus,
  UserFocus,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
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
        } w-full md:w-80 lg:w-96 flex-col bg-surface-main shrink-0`}
    >
      {/* Header */}
      <div className="p-4 md:p-5 bg-gradient-to-b from-surface-main to-background-main sticky top-0 z-10 backdrop-blur-md">
        <div className="mb-4 md:block hidden">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            {viewMode === "ALL" && <Users size={22} className="text-primary" />}
            {viewMode === "REQUESTS" && <UserPlus size={22} className="text-primary" />}
            {viewMode === "SUGGESTIONS" && <UserFocus size={22} className="text-primary" />}
            {getTitle()}
          </h2>
          <p className="text-text-secondary text-sm mt-1">{getSubtitle()}</p>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex gap-1 mb-4 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {[
            { id: "ALL", label: "Tất cả", icon: Users },
            {
              id: "REQUESTS",
              label: "Lời mời",
              icon: UserPlus,
              badge:
                displayedList.length && viewMode === "REQUESTS"
                  ? displayedList.length
                  : 0,
            },
            { id: "SUGGESTIONS", label: "Gợi ý", icon: UserFocus },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setViewMode(tab.id);
                  setActiveItem(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-0 ${viewMode === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-background-main"
                  }`}
              >
                <TabIcon size={18} />
                {tab.label}
                {tab.id === "REQUESTS" && tab.badge > 0 && (
                  <span className="bg-primary text-[#231810] px-1.5 py-0.5 rounded text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass size={18} className="text-text-secondary group-focus-within:text-primary transition-colors" />
          </div>
          <input
            className="block w-full pl-10 pr-4 py-3 border-0 rounded-xl bg-surface-subtle text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-main transition-all text-sm"
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
              <X size={18} />
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
            <div className="size-16 rounded-full bg-surface-subtle border-0 flex items-center justify-center mb-4">
              <MagnifyingGlass size={32} className="opacity-40 text-primary" />
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
