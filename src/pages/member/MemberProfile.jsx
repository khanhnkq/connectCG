import React from "react";
import ProfilePage from "../../features/profile/ProfilePage";

/**
 * Backward compatibility wrapper for MemberProfile.
 * Delegates directly to the unified ProfilePage in "member" mode.
 */
export default function MemberProfile() {
  return <ProfilePage mode="member" />;
}
