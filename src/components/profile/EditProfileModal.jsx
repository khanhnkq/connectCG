import React from "react";
import ProfileEditModal from "../../features/profile/components/ProfileEditModal";

/**
 * Backward compatibility wrapper for legacy EditProfileModal.
 * Delegates directly to the new Multi-Flow ProfileEditModal.
 */
export default function EditProfileModal(props) {
  return <ProfileEditModal {...props} />;
}
