import React from "react";
import { GroupDetailPage as FeatureGroupDetailPage } from "../../features/groups/GroupDetailPage";

/**
 * Backward compatibility wrapper for /dashboard/groups/:id route.
 * Delegates directly to the modularized feature component in src/features/groups/.
 */
export default function GroupDetailPage(props) {
  return <FeatureGroupDetailPage {...props} />;
}
