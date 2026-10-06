import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { User, Briefcase, MapPin, Camera } from "@phosphor-icons/react";
import toast from "react-hot-toast";

import { Modal } from "../../../components/ui/modal/Modal";
import { updateProfileInfo, updateUserAvatar, updateUserCover } from "../../../redux/slices/userSlice";
import { uploadAvatar, uploadCover } from "../../../utils/uploadImage";
import { BasicInfoFlow } from "../flows/BasicInfoFlow";
import { CareerEducationFlow } from "../flows/CareerEducationFlow";
import { SocialLocationFlow } from "../flows/SocialLocationFlow";
import { MediaCropFlow } from "../flows/MediaCropFlow";

const FLOW_ITEMS = [
  { id: "basic", label: "Thông tin cơ bản", icon: User },
  { id: "career", label: "Nghề nghiệp & Học vấn", icon: Briefcase },
  { id: "social", label: "Vị trí & Định hướng", icon: MapPin },
  { id: "media", label: "Ảnh đại diện & Bìa", icon: Camera },
];

export function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  initialFlow = "basic",
}) {
  const dispatch = useDispatch();
  const [activeFlow, setActiveFlow] = useState(initialFlow);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveFlow(initialFlow);
    }
  }, [isOpen, initialFlow]);

  // Unified save handler for text/data flows
  const handleSaveProfile = async (partialData) => {
    setIsSaving(true);
    try {
      // Merge with existing profile data to maintain consistency
      const payload = {
        fullName: profile?.fullName,
        bio: profile?.bio,
        occupation: profile?.occupation,
        maritalStatus: profile?.maritalStatus || "SINGLE",
        lookingFor: profile?.lookingFor || "FRIENDS",
        gender: profile?.gender || "MALE",
        dateOfBirth: profile?.dateOfBirth,
        cityCode: profile?.cityCode,
        cityName: profile?.cityName,
        ...partialData,
      };

      await dispatch(updateProfileInfo(payload)).unwrap();
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Có lỗi xảy ra khi lưu thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = async (file) => {
    setIsUploadingAvatar(true);
    const toastId = toast.loading("Đang tải ảnh đại diện lên...");
    try {
      const uploadedUrl = await uploadAvatar(file);
      await dispatch(updateUserAvatar(uploadedUrl)).unwrap();
      toast.success("Cập nhật ảnh đại diện thành công!", { id: toastId });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Không thể tải ảnh đại diện lên", { id: toastId });
      throw error;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Cover upload handler
  const handleCoverUpload = async (file) => {
    setIsUploadingCover(true);
    const toastId = toast.loading("Đang tải ảnh bìa lên...");
    try {
      const uploadedUrl = await uploadCover(file);
      await dispatch(updateUserCover(uploadedUrl)).unwrap();
      toast.success("Cập nhật ảnh bìa thành công!", { id: toastId });
    } catch (error) {
      console.error("Cover upload error:", error);
      toast.error("Không thể tải ảnh bìa lên", { id: toastId });
      throw error;
    } finally {
      setIsUploadingCover(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Modal.Header title="Chỉnh sửa thông tin hồ sơ" />

      <Modal.Body className="p-0">
        <div className="flex flex-col sm:flex-row min-h-[460px]">
          {/* Navigation Flow Sidebar */}
          <div className="w-full sm:w-56 p-4 border-b sm:border-b-0 sm:border-r border-border-main bg-surface-subtle shrink-0 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted px-2 block mb-2">
              Danh mục
            </span>

            {FLOW_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeFlow === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveFlow(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? "bg-primary text-white font-bold"
                      : "text-text-secondary hover:text-text-main hover:bg-surface-main"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Flow Form Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
            {activeFlow === "basic" && (
              <BasicInfoFlow
                profile={profile}
                onSave={handleSaveProfile}
                isLoading={isSaving}
              />
            )}

            {activeFlow === "career" && (
              <CareerEducationFlow
                profile={profile}
                onSave={handleSaveProfile}
                isLoading={isSaving}
              />
            )}

            {activeFlow === "social" && (
              <SocialLocationFlow
                profile={profile}
                onSave={handleSaveProfile}
                isLoading={isSaving}
              />
            )}

            {activeFlow === "media" && (
              <MediaCropFlow
                profile={profile}
                onAvatarUpload={handleAvatarUpload}
                onCoverUpload={handleCoverUpload}
                isUploadingAvatar={isUploadingAvatar}
                isUploadingCover={isUploadingCover}
              />
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ProfileEditModal;
