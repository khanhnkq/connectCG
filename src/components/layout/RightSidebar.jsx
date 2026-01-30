import { useState, useEffect, useCallback, useRef } from "react";
import { Search, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import FriendService from "../../services/friend/FriendService";

export default function RightSidebar() {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

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

        setFriends((prev) =>
          currentPage === 0
            ? newFriends
            : [...prev, ...newFriends],
        );
      } catch (error) {
        console.error("Failed to fetch friends", error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [],
  );

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFriends(0, searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchFriends]);

  // Handle scroll to load more
  const handleScroll = () => {
    // Logic cuộn nếu cần, hiện tại bỏ qua page/hasMore chưa dùng đúng
  };

  const suggestedMatches = [
    {
      name: "Hồng Nhung",
      relation: "12 bạn chung",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0",
    },
    {
      name: "Tuấn Anh",
      relation: "Thành viên mới",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g",
    },
    {
      name: "Minh Thư",
      relation: "Ở gần bạn",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y",
    },
  ];

  return (
    <aside
      className="w-80 hidden xl:flex flex-col border-l border-border-main bg-background-main p-6 h-screen sticky top-0 overflow-y-auto shrink-0 z-20 transition-colors duration-300"
      onScroll={handleScroll}
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
            to="/search/members"
            className="text-primary text-xs font-bold hover:underline tracking-wide"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          {suggestedMatches.map((match, index) => (
            <div
              key={index}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-11 rounded-full bg-cover bg-center border border-transparent group-hover:border-primary transition-all"
                  style={{ backgroundImage: `url("${match.avatar}")` }}
                ></div>
                <div className="flex flex-col">
                  <span className="text-text-main text-sm font-bold group-hover:text-primary transition-colors cursor-pointer">
                    {match.name}
                  </span>
                  <span className="text-text-secondary text-xs">
                    {match.relation}
                  </span>
                </div>
              </div>
              <button className="size-9 rounded-full bg-surface-main border border-border-main hover:bg-primary hover:text-white flex items-center justify-center text-primary transition-all shadow-md">
                <UserPlus size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-text-main font-bold text-base tracking-wide">
            Bạn bè
          </h3>
          <span className="bg-surface-main border border-border-main text-text-secondary text-xs font-bold px-2.5 py-1 rounded-full">
            {friends.length}
          </span>
        </div>
        <div className="flex flex-col gap-2">
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
                <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-main"></div>
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
    </aside>
  );
}
