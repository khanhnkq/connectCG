import React from "react";
import { ChatInterface as FeatureChatInterface } from "../../features/chat/ChatInterface";

/**
 * Backward compatibility wrapper for /dashboard/chat route.
 * Delegates directly to the modularized feature component in src/features/chat/.
 */
export default function ChatInterface(props) {
  return <FeatureChatInterface {...props} />;
}
