import React, { useRef } from "react";
import { Camera, Pencil } from "@phosphor-icons/react";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * AvatarUploadField: Tải lên và xem trước ảnh đại diện
 * - Bo tròn hoàn hảo (rounded-full)
 * - 0px blur, 0px drop shadow, viền đứt nét phẳng
 * - Kiểm tra dung lượng 2MB
 */
export default function AvatarUploadField({
  avatarPreview,
  onChange,
  disabled = false,
  error,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Kích thước ảnh không được vượt quá 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange?.(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative group cursor-pointer">
        <label className="block cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={handleFileChange}
          />
          <div
            className={`size-28 sm:size-32 rounded-full border-0 flex flex-col items-center justify-center transition-all overflow-hidden select-none ${
              error
                ? "bg-danger/10"
                : "bg-surface-subtle hover:bg-surface-subtle/80"
            }`}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-text-muted group-hover:text-primary transition-colors">
                <Camera size={36} />
                <span className="text-[11px] font-semibold">Tải ảnh lên</span>
              </div>
            )}
          </div>

          {/* Edit Badge Button */}
          <div className="absolute bottom-0.5 right-0.5 size-8 bg-primary rounded-full text-white border-0 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
            <Pencil size={15} weight="bold" />
          </div>
        </label>
      </div>

      <p className="text-[11px] text-text-muted">
        Ảnh chân dung rõ nét, dung lượng tối đa 2MB
      </p>

      {error && (
        <p className="text-xs text-danger font-medium">{error}</p>
      )}
    </div>
  );
}
