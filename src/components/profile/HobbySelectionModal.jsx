import React, { useEffect, useState } from "react";
import { X, Search, Loader2 } from "lucide-react";
import UserProfileService from "../../services/user/UserProfileService";
import { getIconComponent } from "../../utils/iconMap";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/slices/userSlice";

export default function HobbySelectionModal({
  isOpen,
  onClose,
  currentHobbies,
  userId,
}) {
  const [hobbies, setHobbies] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      fetchHobbies();
      setSelectedIds(currentHobbies?.map((h) => h.id) || []);
    }
  }, [isOpen, currentHobbies]);

  const fetchHobbies = async () => {
    setIsLoading(true);
    try {
      const res = await UserProfileService.getAllHobbies();
      setHobbies(res.data);
    } catch (error) {
      console.error("Failed to fetch hobbies", error);
      toast.error("Không thể tải danh sách sở thích");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHobby = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await UserProfileService.updateUserHobbies(selectedIds);
      toast.success("Cập nhật sở thích thành công!");
      dispatch(fetchUserProfile(userId));
      onClose();
    } catch (error) {
      console.error("Failed to update hobbies", error);
      toast.error("Lỗi khi cập nhật sở thích");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredHobbies = hobbies.filter((hobby) =>
    hobby.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-main border border-border-main rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-main">
          <h2 className="text-xl font-bold text-text-main">
            Chỉnh sửa sở thích
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border-main bg-background-main/50">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm sở thích..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background-main border border-border-main rounded-xl pl-10 pr-4 py-3 text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredHobbies.map((hobby) => {
                const isSelected = selectedIds.includes(hobby.id);
                return (
                  <button
                    key={hobby.id}
                    onClick={() => toggleHobby(hobby.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background-main border-border-main text-text-secondary hover:bg-surface-main hover:border-primary/50"
                    }`}
                  >
                    {getIconComponent(hobby.icon, {
                      size: 28,
                      className: isSelected
                        ? "text-primary"
                        : "text-text-secondary",
                    })}
                    <span className="font-bold text-sm text-center">
                      {hobby.name}
                    </span>
                  </button>
                );
              })}
              {filteredHobbies.length === 0 && (
                <div className="col-span-full text-center text-text-secondary py-10">
                  Không tìm thấy sở thích nào.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-main flex justify-between items-center bg-surface-main rounded-b-2xl">
          <span className="text-text-secondary font-medium">
            Đã chọn:{" "}
            <span className="text-primary font-bold">{selectedIds.length}</span>
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-text-secondary hover:text-text-main hover:bg-background-main transition-all"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-orange-600 text-[#231810] px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              {isSaving && <Loader2 className="animate-spin" size={16} />}
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
