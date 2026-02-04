import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ChatService from "../../services/chat/ChatService";
import UserProfileService from "../../services/user/UserProfileService";
import FriendSuggestionService from "../../services/FriendSuggestionService";
import FriendRequestService from "../../services/friend/FriendRequestService";

import { useFriends, useFriendRequests } from "../../hooks/useFriends";
import FriendsSidebar from "../../components/friends/FriendsSidebar";
import FriendsListPanel from "../../components/friends/FriendsListPanel";
import FriendProfileDetail from "../../components/friends/FriendProfileDetail";

export default function FriendsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // UI State - Use URL as source of truth
  const viewMode = (searchParams.get("tab") || "all").toUpperCase();
  const setViewMode = (newMode) => {
    setSearchParams(
      (prev) => {
        prev.set("tab", newMode.toLowerCase());
        return prev;
      },
      { replace: true },
    );
  };
  const [activeItem, setActiveItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeProfileTab, setActiveProfileTab] = useState("about");

  // Profile Detail State
  const [fullProfile, setFullProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Suggestions State
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [processingSuggestions, setProcessingSuggestions] = useState({});

  // Custom Hooks
  const {
    friends,
    isLoading: friendsLoading,
    handleUnfriend,
    // fetchFriends, // Removed implicit fetch, managed by hook internal effect/loadMore
    hasMore: friendsHasMore,
    loadMore: loadMoreFriends,
    updateFilter: updateFriendsFilter,
  } = useFriends(null, { name: "" }); // Pass empty initial filter

  const {
    requests,
    isLoading: requestsLoading,
    processingRequests,
    handleAcceptRequest: acceptRequest,
    handleRejectRequest: rejectRequest,
    fetchRequests,
  } = useFriendRequests();

  // Debounce search for Friends view
  useEffect(() => {
    if (viewMode === "ALL") {
      const delayDebounceFn = setTimeout(() => {
        updateFriendsFilter({ name: searchTerm });
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, viewMode, updateFriendsFilter]);

  // Fetch Suggestions
  const fetchSuggestions = useCallback(async () => {
    setSuggestionsLoading(true);
    try {
      const response = await FriendSuggestionService.getSuggestions(0, 50);
      const formattedSuggestions = response.data.content.map((item) => ({
        ...item,
        id: item.userId, // Map userId to id for consistent usage
        type: "SUGGESTION",
      }));
      setSuggestions(formattedSuggestions);
    } catch {
      toast.error("Không thể tải danh sách gợi ý");
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  // Fetch suggestions on mount to show count in sidebar
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Fetch data based on view mode (Removed fetchFriends call since hook handles it)
  useEffect(() => {
    // if (viewMode === "ALL") {
    // fetchFriends(); // Hook handles this on filter change or mount
    // } else
    if (viewMode === "REQUESTS") {
      fetchRequests();
    } else if (viewMode === "SUGGESTIONS") {
      fetchSuggestions();
    }
  }, [viewMode, fetchRequests, fetchSuggestions]);

  // Fetch full profile when activeItem changes
  useEffect(() => {
    const fetchFullProfile = async () => {
      if (!activeItem) {
        setFullProfile(null);
        return;
      }

      const targetId =
        activeItem.userId || activeItem.id || activeItem.senderId;
      setIsProfileLoading(true);

      try {
        // Always fetch fresh profile data to ensure accuracy
        const response = await UserProfileService.getUserProfile(targetId);
        setFullProfile(response.data);

        // If displaying suggestion, merge extra info from suggestion item
        if (activeItem.type === "SUGGESTION") {
          // Keep suggestion specific data if needed
        }

        setActiveProfileTab("about");
      } catch {
        // Fallback to activeItem data if fetch fails
        setFullProfile(activeItem);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchFullProfile();
  }, [activeItem]);

  // Handlers
  const handleStartChat = async (friendId) => {
    const tid = toast.loading("Đang kết nối...");
    try {
      const response = await ChatService.getOrCreateDirectChat(friendId);
      const room = response.data;
      toast.success("Đã mở cuộc trò chuyện!", { id: tid });
      navigate("/dashboard/chat", {
        state: { selectedRoomKey: room.firebaseRoomKey },
      });
    } catch {
      toast.error("Lỗi khi kết nối", { id: tid });
    }
  };

  const handleUnfriendWrapper = async (friendId) => {
    const success = await handleUnfriend(friendId);
    if (success && activeItem?.id === friendId) {
      setActiveItem(null);
    }
  };

  const handleAddFriend = async (id) => {
    setProcessingSuggestions((prev) => ({ ...prev, [id]: "adding" }));
    const tid = toast.loading("Đang gửi lời mời...");
    try {
      await FriendRequestService.sendRequest(id);
      toast.success("Đã gửi lời mời kết bạn!", { id: tid });

      // Remove from suggestions list visually
      setSuggestions((prev) => prev.filter((s) => s.userId !== id));

      if (activeItem?.userId === id) {
        setActiveItem(null);
      }
    } catch {
      toast.error("Lỗi khi gửi lời mời", {
        id: tid,
      });
    } finally {
      setProcessingSuggestions((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const handleDismissSuggestion = async (id) => {
    setProcessingSuggestions((prev) => ({ ...prev, [id]: "dismissing" }));
    try {
      await FriendSuggestionService.dismissSuggestion(id);
      toast.success("Đã ẩn gợi ý");
      setSuggestions((prev) => prev.filter((s) => s.userId !== id));

      if (activeItem?.userId === id) {
        setActiveItem(null);
      }
    } catch {
      toast.error("Lỗi khi ẩn gợi ý");
    } finally {
      setProcessingSuggestions((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const handleAcceptRequestWrapper = async (request) => {
    const success = await acceptRequest(request);
    if (success && activeItem?.requestId === request.requestId) {
      setActiveItem(null);
    }
  };

  const handleRejectRequestWrapper = async (request) => {
    const success = await rejectRequest(request);
    if (success && activeItem?.requestId === request.requestId) {
      setActiveItem(null);
    }
  };

  // Filter Logic
  const getDisplayedList = () => {
    if (viewMode === "ALL") {
      return friends; // Already filtered by server
    }

    let list = [];
    if (viewMode === "SUGGESTIONS") list = suggestions;
    else if (viewMode === "REQUESTS") list = requests;

    if (!list) return [];

    // Client-side filtering for Requests and Suggestions
    return list.filter((item) => {
      if (viewMode === "REQUESTS") {
        const name = item.senderFullName || item.senderUsername || "";
        const username = item.senderUsername || "";
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          username.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      const name = item.fullName || item.username || "";
      const username = item.username || "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const displayedList = getDisplayedList();

  return (
    <div className="h-full w-full flex overflow-hidden bg-background-main relative">
      <FriendsSidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        setActiveItem={setActiveItem}
        friendsCount={friends.length}
        requestsCount={requests.length}
        suggestionsCount={suggestions.length}
      />

      <FriendsListPanel
        viewMode={viewMode}
        setViewMode={setViewMode}
        displayedList={displayedList}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isLoading={
          viewMode === "ALL"
            ? friendsLoading
            : viewMode === "REQUESTS"
            ? requestsLoading
            : suggestionsLoading
        }
        processingRequests={
          viewMode === "SUGGESTIONS"
            ? processingSuggestions
            : processingRequests
        }
        onAcceptRequest={handleAcceptRequestWrapper}
        onRejectRequest={handleRejectRequestWrapper}
        onAddFriend={handleAddFriend}
        onDismissSuggestion={handleDismissSuggestion}
        onLoadMore={viewMode === "ALL" ? loadMoreFriends : null}
        hasMore={viewMode === "ALL" ? friendsHasMore : false}
      />

      <div
        className={`${
          activeItem ? "flex" : "hidden"
        } xl:flex flex-1 flex-col bg-background-secondary relative border-l border-border-main`}
      >
        <FriendProfileDetail
          activeItem={activeItem}
          fullProfile={fullProfile}
          isProfileLoading={isProfileLoading}
          activeProfileTab={activeProfileTab}
          setActiveProfileTab={setActiveProfileTab}
          setActiveItem={setActiveItem}
          viewMode={viewMode}
          onStartChat={handleStartChat}
          onUnfriend={handleUnfriendWrapper}
          onAddFriend={handleAddFriend}
          onDismissSuggestion={handleDismissSuggestion}
          onAcceptRequest={handleAcceptRequestWrapper}
          onRejectRequest={handleRejectRequestWrapper}
        />
      </div>
    </div>
  );
}
