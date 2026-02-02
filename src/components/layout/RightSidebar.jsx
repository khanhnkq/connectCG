import { useState, useEffect, useCallback, useRef } from "react";
import { Search, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import FriendService from "../../services/friend/FriendService";
import FriendSuggestionService from "../../services/FriendSuggestionService";
import FriendRequestService from "../../services/friend/FriendRequestService";
import { useSelector } from 'react-redux';
import { selectOnlineUserIds } from '../../redux/slices/onlineUsersSlice';

export default function RightSidebar() {
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const onlineUserIds = useSelector(selectOnlineUserIds);

  const fetchFriends = useCallback(
    async (currentPage, currentSearchTerm) => {
      // Allow re-fetch if searching (debounce handles frequency), 
      // but block immediate duplicate calls if needed. 
      // Actually checking loadingRef prevents parallel calls.
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      try {
        const params = { page: currentPage, size: 20 };
        if (currentSearchTerm && currentSearchTerm.trim()) {
          params.name = currentSearchTerm;
        }
        const response = await FriendService.getMyFriends(params);
        const newFriends = response.data.content || [];
        const totalPages = response.data.totalPages || 0;

        setFriends((prev) =>
          currentPage === 0
            ? newFriends
            : [...prev, ...newFriends],
        );

        // Update hasMore based on pagination info
        setHasMore(currentPage + 1 < totalPages);
      } catch (error) {
        console.error("Failed to fetch friends", error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [],
  );

  // Fetch suggestions
  const fetchSuggestions = useCallback(async () => {
    setSuggestionsLoading(true);
    try {
      const response = await FriendSuggestionService.getSuggestions(0, 3);
      setSuggestions(response.data.content || []);
    } catch (error) {
      console.error("Failed to fetch suggestions", error);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(0); // Reset page when searching
      setHasMore(true);
      fetchFriends(0, searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchFriends]);

  // Fetch suggestions on mount
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Handle scroll to load more
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Check if scrolled near bottom (within 100px)
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (!loading && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFriends(nextPage, searchTerm);
      }
    }
  };

  // Handle add friend
  const handleAddFriend = async (userId) => {
    const tid = toast.loading("Đang gửi lời mời...");
    try {
      await FriendRequestService.sendRequest(userId);
      toast.success("Đã gửi lời mời kết bạn!", { id: tid });
      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => s.userId !== userId));
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error(error.response?.data?.message || "Lỗi khi gửi lời mời", { id: tid });
    }
  };

  return (
    <aside
      className="w-80 hidden xl:flex flex-col border-l border-border-main bg-background-main p-6 h-screen sticky top-0 shrink-0 z-20 transition-colors duration-300"
    >
      <div className="mb-8 group">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              className="text-text-secondary group-focus-within:text-primary transition-colors"
              size={20}
            />
          </div>
          <input
            className="block w-full pl-12 pr-4 py-3.5 border border-border-main rounded-2xl leading-5 bg-surface-main text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-main/90 transition-all sm:text-sm font-medium"
            placeholder="Tìm kiếm bạn bè..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-text-main font-bold text-base tracking-wide">
            Gợi ý bạn bè
          </h3>
          <Link
            to="/dashboard/friends?tab=suggestions"
            className="text-primary text-xs font-bold hover:underline tracking-wide"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          {suggestionsLoading ? (
            <div className="flex justify-center py-4">
              <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.userId}
                className="flex items-center justify-between group"
              >
                <Link
                  to={`/dashboard/member/${suggestion.userId}`}
                  className="flex items-center gap-3 flex-1"
                >
                  <div
                    className="size-11 rounded-full bg-cover bg-center border border-transparent group-hover:border-primary transition-all"
                    style={{ backgroundImage: `url("${suggestion.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-text-main text-sm font-bold group-hover:text-primary transition-colors cursor-pointer">
                      {suggestion.fullName || suggestion.username}
                    </span>
                    <span className="text-text-secondary text-xs truncate max-w-[120px]">
                      {suggestion.description || 'Gợi ý'}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => handleAddFriend(suggestion.userId)}
                  className="size-9 rounded-full bg-surface-main border border-border-main hover:bg-primary hover:text-white flex items-center justify-center text-primary transition-all shadow-md"
                  title="Kết bạn"
                >
                  <UserPlus size={20} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-xs text-center py-4">
              Không có gợi ý nào
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-5 shrink-0">
          <h3 className="text-text-main font-bold text-base tracking-wide">
            Bạn bè
          </h3>
          <span className="bg-surface-main border border-border-main text-text-secondary text-xs font-bold px-2.5 py-1 rounded-full">
            {friends.length}
          </span>
        </div>

        {/* Friends List - Scrollable Container */}
        <div
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="flex flex-col gap-2 pb-20">
            {friends.map((friend) => (
              <Link
                to={`/dashboard/member/${friend.id}`}
                key={friend.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-main cursor-pointer transition-colors group"
              >
                <div className="relative">
                  <div
                    className="size-10 rounded-full bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary/50 transition-all"
                    style={{
                      backgroundImage: `url("${friend.avatarUrl ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }")`,
                    }}
                  ></div>
                  {onlineUserIds.includes(friend.id) && (
                    <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-main"></div>
                  )}
                </div>
                <span className="text-text-main text-sm font-medium group-hover:text-primary transition-colors">
                  {friend.fullName}
                </span>
              </Link>
            ))}
            {loading && (
              <div className="flex justify-center py-2">
                <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!loading && friends.length === 0 && (
              <p className="text-text-secondary text-xs pl-2">
                Chưa có bạn bè nào đang online
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
