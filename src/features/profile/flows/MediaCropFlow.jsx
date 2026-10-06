import React, { useState, useRef, useEffect } from "react";
import { ArrowClockwise, UploadSimple, Image as ImageIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button/Button";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function MediaCropFlow({
  profile,
  onAvatarUpload,
  onCoverUpload,
  isUploadingAvatar = false,
  isUploadingCover = false,
}) {
  const [activeMediaTab, setActiveMediaTab] = useState("avatar"); // "avatar" | "cover"
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const isAvatar = activeMediaTab === "avatar";
  const isUploading = isAvatar ? isUploadingAvatar : isUploadingCover;

  const currentUrl = isAvatar
    ? profile?.currentAvatarUrl || profile?.avatarUrl || ""
    : profile?.currentCoverUrl || profile?.coverUrl || "";

  // Reset local state when switching media tabs
  const handleSwitchTab = (tab) => {
    setActiveMediaTab(tab);
    setSelectedFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    setZoom(1);
    setRotation(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp định dạng hình ảnh");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Kích thước tệp vượt quá giới hạn 2MB");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
    setZoom(1);
    setRotation(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Draw crop preview on Canvas
  useEffect(() => {
    if (!imagePreviewUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imagePreviewUrl;

    image.onload = () => {
      imgRef.current = image;
      const targetWidth = isAvatar ? 300 : 600;
      const targetHeight = isAvatar ? 300 : 250;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.save();

      // Move to center of canvas for rotation and scaling
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Draw image centered
      const aspect = image.width / image.height;
      let drawWidth = targetWidth;
      let drawHeight = targetWidth / aspect;

      if (drawHeight < targetHeight) {
        drawHeight = targetHeight;
        drawWidth = targetHeight * aspect;
      }

      ctx.drawImage(
        image,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();
    };
  }, [imagePreviewUrl, zoom, rotation, isAvatar]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleApplyUpload = async () => {
    if (!selectedFile || !canvasRef.current) {
      toast.error("Vui lòng chọn hình ảnh trước");
      return;
    }

    const canvas = canvasRef.current;
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          toast.error("Lỗi xuất hình ảnh");
          return;
        }

        const fileName = `${isAvatar ? "avatar" : "cover"}_${Date.now()}.jpg`;
        const processedFile = new File([blob], fileName, { type: "image/jpeg" });

        try {
          if (isAvatar && onAvatarUpload) {
            await onAvatarUpload(processedFile);
          } else if (!isAvatar && onCoverUpload) {
            await onCoverUpload(processedFile);
          }
          // Reset selection on success
          setSelectedFile(null);
          setImagePreviewUrl(null);
        } catch {
          // Toast handled by parent or hook
        }
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-text-main">Ảnh đại diện & Ảnh bìa</h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Tùy chỉnh ảnh đại diện và ảnh bìa trang cá nhân. Hỗ trợ xem trước và nén chuẩn.
        </p>
      </div>

      {/* Media Type Selector */}
      <div className="flex border-b border-border-main gap-2">
        <button
          type="button"
          onClick={() => handleSwitchTab("avatar")}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
            isAvatar
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text-main"
          }`}
        >
          Ảnh đại diện (1:1)
        </button>
        <button
          type="button"
          onClick={() => handleSwitchTab("cover")}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
            !isAvatar
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text-main"
          }`}
        >
          Ảnh bìa (16:9 / Rộng)
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Editor & Preview Area */}
      {imagePreviewUrl ? (
        <div className="space-y-4">
          <div className="flex justify-center p-4 bg-surface-subtle border border-border-main rounded-2xl overflow-hidden">
            <canvas
              ref={canvasRef}
              className={`border border-border-main bg-black/5 ${
                isAvatar ? "rounded-full aspect-square max-w-[240px]" : "rounded-xl w-full max-h-[220px]"
              }`}
            />
          </div>

          {/* Controls: Zoom slider & Rotate button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-surface-main p-3.5 border border-border-main rounded-2xl">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-text-secondary font-medium">
                <span>Phóng to</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-primary h-1.5 bg-surface-subtle rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleRotate}
              >
                Xoay 90°
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Đổi ảnh khác
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Current Image Preview Box */
        <div className="p-6 border-2 border-dashed border-border-main rounded-2xl text-center space-y-4 bg-surface-main">
          {currentUrl ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={currentUrl}
                alt={isAvatar ? "Avatar hiện tại" : "Cover hiện tại"}
                className={`border border-border-main object-cover ${
                  isAvatar
                    ? "size-28 rounded-full"
                    : "w-full max-w-md h-32 rounded-xl"
                }`}
              />
              <span className="text-xs text-text-secondary">Ảnh hiện đang được sử dụng</span>
            </div>
          ) : (
            <div className="size-16 rounded-2xl bg-surface-subtle border border-border-main flex items-center justify-center text-text-muted mx-auto">
              <ImageIcon size={28} />
            </div>
          )}

          <div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Chọn tệp ảnh mới
            </Button>
            <p className="text-[11px] text-text-muted mt-2">
              Định dạng PNG, JPG, WebP. Tối đa 2MB.
            </p>
          </div>
        </div>
      )}

      {/* Action Footer */}
      {selectedFile && (
        <div className="pt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSelectedFile(null);
              setImagePreviewUrl(null);
            }}
            disabled={isUploading}
          >
            Hủy chỉnh sửa
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleApplyUpload}
            isLoading={isUploading}
            disabled={isUploading}
          >
            {isAvatar ? "Cập nhật ảnh đại diện" : "Cập nhật ảnh bìa"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default MediaCropFlow;
