import React from "react";
import ProfilePage from "../../features/profile/ProfilePage";

/**
 * Backward compatibility wrapper for UserProfile.
 * Delegates directly to the unified ProfilePage in "self" mode.
 */
export default function UserProfile() {
  return <ProfilePage mode="self" />;
}
