import React from "react";
import { useSelector } from "react-redux";
import { Image, Video, Globe, Users, Lock, CaretDown, X } from "@phosphor-icons/react";
import { Avatar } from "../ui/avatar/Avatar";
import { Button } from "../ui/button/Button";
import { usePostComposer } from "../../features/feed/hooks/usePostComposer";

const VISIBILITY_CONFIG = {
  PUBLIC: { label: "Công khai", icon: Globe },
  FRIENDS: { label: "Bạn bè", icon: Users },
  PRIVATE: { label: "Riêng tư", icon: Lock },
};

/**
 * PostComposer: Composes a new post with text, image/video attachments, and privacy settings.
 * Logic is completely encapsulated in usePostComposer.
 */
export default function PostComposer({ userAvatar, onPostCreated, groupId }) {
  const { profile: userProfile } = useSelector((state) => state.user);
  const {
    formik,
    showVisibilityMenu,
    setShowVisibilityMenu,
    imageInputRef,
    videoInputRef,
    handleFileChange,
    removeMedia,
  } = usePostComposer({ onPostCreated, groupId });

  const avatarUrl = userProfile?.currentAvatarUrl || userAvatar;
  const currentVisibility = VISIBILITY_CONFIG[formik.values.visibility] || VISIBILITY_CONFIG.PUBLIC;
  const VisIcon = currentVisibility.icon;

  return (
    <div className="bg-surface-main p-5 md:p-6 rounded-2xl mb-4 md:mb-5 relative border-0">
      {/* Input area with author avatar */}
      <div className="flex gap-3.5 items-start mb-3">
        <Avatar
          src={avatarUrl}
          name={userProfile?.fullName || "User"}
          size="lg"
          className="hidden md:inline-flex shrink-0"
        />
        <div className="flex-1 pt-1">
          <textarea
            name="content"
            rows={formik.values.content ? 3 : 2}
            className="w-full bg-transparent border-none focus:ring-0 text-text-main placeholder:text-text-muted text-base p-0 resize-none leading-relaxed outline-none"
            placeholder="Bạn đang nghĩ gì?"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          {formik.touched.content && formik.errors.content && (
            <p className="text-danger text-xs mt-1 font-medium">{formik.errors.content}</p>
          )}
        </div>
      </div>

      {/* Media previews */}
      {formik.values.media.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-2 ${formik.values.media.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {formik.values.media.map((file, index) => (
              <div
                key={index}
                className={`relative rounded-xl overflow-hidden bg-black/5 ${
                  formik.values.media.length === 3 && index === 0 ? "col-span-2 aspect-[2/1]" : "aspect-video"
                }`}
              >
                {file.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(file)} alt="Đính kèm" className="w-full h-full object-cover" />
                ) : (
                  <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" controls />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-danger text-white rounded-lg p-1 transition-colors cursor-pointer select-none"
                  aria-label="Xóa tệp đính kèm"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls & Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <input type="file" hidden ref={imageInputRef} accept="image/*" onChange={handleFileChange} />
          <input type="file" hidden ref={videoInputRef} accept="video/*" onChange={handleFileChange} />

          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-subtle text-text-secondary hover:text-emerald-600 transition-colors text-xs font-semibold cursor-pointer"
          >
            <Image size={18} />
            <span>Ảnh</span>
          </button>

          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-subtle text-text-secondary hover:text-blue-600 transition-colors text-xs font-semibold cursor-pointer"
          >
            <Video size={18} />
            <span>Video</span>
          </button>

          {!groupId && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowVisibilityMenu((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-subtle text-text-main text-xs font-semibold hover:bg-surface-subtle/80 transition-colors cursor-pointer border-0"
              >
                <VisIcon size={14} />
                <span>{currentVisibility.label}</span>
                <CaretDown size={12} />
              </button>

              {showVisibilityMenu && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-surface-main rounded-xl z-30 overflow-hidden py-1 border-0 shadow-lg">
                  {Object.entries(VISIBILITY_CONFIG).map(([visKey, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={visKey}
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("visibility", visKey);
                          setShowVisibilityMenu(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 text-xs w-full text-left transition-colors cursor-pointer ${
                          formik.values.visibility === visKey ? "bg-primary/10 text-primary font-bold" : "text-text-main hover:bg-surface-subtle"
                        }`}
                      >
                        <Icon size={14} />
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={formik.handleSubmit}
          isLoading={formik.isSubmitting}
          loadingText="Đang đăng..."
          disabled={formik.isSubmitting || (!formik.values.content.trim() && formik.values.media.length === 0)}
        >
          Đăng
        </Button>
      </div>
    </div>
  );
}
