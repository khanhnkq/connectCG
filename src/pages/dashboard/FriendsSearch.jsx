import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import toast from "react-hot-toast";
import CityService from "../../services/CityService";
import FriendService from "../../services/friend/FriendService";

export default function FriendsSearch() {
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    name: "",

    gender: "",
    cityCode: "",
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 8,
    totalPages: 0,
    totalElements: 0,
  });

  const [cities, setCities] = useState([]);

  // Fetch cities for dropdown
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch friends when filters or pagination change
  useEffect(() => {
    fetchFriends();
  }, [searchFilters, pagination.page]);

  const fetchCities = async () => {
    try {
      const citiesData = await CityService.getAllCities();
      setCities(citiesData);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      toast.error("Không thể tải danh sách thành phố");
    }
  };

  const fetchFriends = async () => {
    const userId = user?.id || user?.userId || user?.sub;
    if (!userId) return;

    setLoading(true);
    try {
      const filters = {
        page: pagination.page,
        size: pagination.size,
        ...(searchFilters.name && { name: searchFilters.name }),
        ...(searchFilters.gender && { gender: searchFilters.gender }),
        ...(searchFilters.cityCode && { cityCode: searchFilters.cityCode }),
      };

      const response = await FriendService.getFriends(userId, filters);

      // Append new data if loading more pages, replace if it's the first page
      setFriends((prev) =>
        pagination.page === 0
          ? response.data.content
          : [...prev, ...response.data.content],
      );
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      }));
    } catch (error) {
      console.error("Failed to fetch friends:", error);
      toast.error("Không thể tải danh sách bạn bè");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 0 })); // Reset to first page
  };

  const handleResetFilters = () => {
    setSearchFilters({ name: "", gender: "", cityCode: "" });
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages - 1) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden relative">
      {/* Main Content: Friends List */}
      <main className="flex-1 overflow-y-auto bg-background-main p-4 md:p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-main">
              Bạn bè của tôi
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Tìm kiếm và quản lý danh sách bạn bè của bạn (
              {pagination.totalElements} người)
            </p>
          </div>

          {/* Loading State */}
          {loading && friends.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-text-secondary font-bold">
                  Đang tải danh sách bạn bè...
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && friends.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-text-secondary/30 mb-4">
                  group_off
                </span>
                <p className="text-text-secondary text-lg">
                  Không tìm thấy bạn bè nào
                </p>
                <p className="text-text-secondary/60 text-sm mt-2">
                  Thử thay đổi bộ lọc tìm kiếm
                </p>
              </div>
            </div>
          )}

          {/* Friends Grid */}
          {friends.length > 0 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {friends.map((friend) => (
                  <article
                    key={friend.id}
                    className="flex flex-col bg-surface-main rounded-xl overflow-hidden border border-border-main hover:border-primary/50 transition-colors shadow-lg"
                  >
                    <div className="h-64 sm:h-[16rem] w-full overflow-hidden relative">
                      <Link
                        to={`/dashboard/member/${friend.id}`}
                        className="block w-full h-full"
                      >
                        <img
                          src={
                            friend.avatarUrl ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={friend.fullName}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </Link>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-text-main font-bold text-lg leading-tight mb-1">
                        <Link
                          to={`/dashboard/member/${friend.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {friend.fullName}
                        </Link>
                      </h3>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-text-secondary text-sm">
                          location_on
                        </span>
                        <span className="text-text-secondary text-sm font-medium">
                          {friend.cityName || "Chưa cập nhật"}
                        </span>
                      </div>
                      {friend.gender && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className="material-symbols-outlined text-text-secondary text-sm">
                            {friend.gender === "MALE" ? "male" : "female"}
                          </span>
                          <span className="text-text-secondary text-sm">
                            {friend.gender === "MALE"
                              ? "Nam"
                              : friend.gender === "FEMALE"
                              ? "Nữ"
                              : "Khác"}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto flex flex-col gap-2">
                        <Link
                          to={`/dashboard/member/${friend.id}`}
                          className="w-full py-2 rounded-lg bg-primary hover:bg-orange-600 text-text-main font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">
                            visibility
                          </span>
                          Xem hồ sơ
                        </Link>
                        <button className="w-full py-2 rounded-lg bg-background-main hover:bg-surface-main text-text-main font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-border-main">
                          <span className="material-symbols-outlined text-sm">
                            chat
                          </span>
                          Nhắn tin
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {pagination.page < pagination.totalPages - 1 && (
                <div className="mt-12 flex justify-center pb-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-8 py-3 rounded-full bg-surface-main hover:bg-background-main text-text-main font-bold border border-border-main transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Đang tải..." : "Xem thêm kết quả"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Search Filters Sidebar */}
      <aside className="w-full md:w-[320px] lg:w-[340px] flex flex-col border-l border-border-main bg-surface-main z-10 overflow-y-auto custom-scrollbar flex-none hidden md:flex">
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-text-main text-xl font-bold leading-tight">
              Bộ lọc tìm kiếm
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-sm font-bold text-primary hover:text-orange-400"
            >
              Đặt lại
            </button>
          </div>

          <div className="mb-6">
            <label className="text-text-main text-sm font-bold mb-2 block">
              Tìm theo tên
            </label>
            <label className="flex w-full items-center rounded-xl bg-background-main border border-border-main h-12 px-4 focus-within:ring-1 ring-primary/50 transition-all">
              <span className="material-symbols-outlined text-text-secondary">
                search
              </span>
              <input
                className="w-full bg-transparent border-none text-text-main placeholder-text-secondary/60 focus:ring-0 text-sm ml-2 focus:outline-none"
                placeholder="Nhập tên bạn bè..."
                value={searchFilters.name}
                onChange={(e) => handleSearchChange("name", e.target.value)}
              />
            </label>
          </div>

          <div className="mb-6">
            <label className="text-text-main text-sm font-bold mb-3 block">
              Giới tính
            </label>
            <div className="space-y-2">
              {[
                { value: "", label: "Tất cả" },
                { value: "MALE", label: "Nam" },
                { value: "FEMALE", label: "Nữ" },
                { value: "OTHER", label: "Khác" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group/label"
                >
                  <div
                    className={`size-4 rounded-full border flex items-center justify-center ${
                      searchFilters.gender === option.value
                        ? "border-primary"
                        : "border-border-main"
                    }`}
                  >
                    {searchFilters.gender === option.value && (
                      <div className="size-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="gender"
                    checked={searchFilters.gender === option.value}
                    onChange={() => handleSearchChange("gender", option.value)}
                    className="hidden"
                  />
                  <span
                    className={`text-sm group-hover/label:text-text-main transition-colors ${
                      searchFilters.gender === option.value
                        ? "text-text-main"
                        : "text-text-secondary"
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-text-main text-sm font-bold mb-3 block">
              Thành phố
            </label>
            <select
              value={searchFilters.cityCode}
              onChange={(e) => handleSearchChange("cityCode", e.target.value)}
              className="w-full rounded-xl bg-background-main border border-border-main text-text-main h-12 px-4 focus:ring-1 ring-primary/50 focus:outline-none text-sm"
            >
              <option value="">Tất cả thành phố</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-border-main bg-background-main p-4">
            <p className="text-text-secondary text-xs mb-2">Kết quả tìm kiếm</p>
            <p className="text-text-main text-2xl font-bold">
              {pagination.totalElements}
            </p>
            <p className="text-text-secondary text-xs mt-1">bạn bè</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
