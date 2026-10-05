import React from "react";
import PostCard from "../components/feed/PostCard";
import { MockAppProviders } from "./mocks/MockAppProviders";
import { mockPosts } from "./mocks/apiMockData";

export default {
  title: "Features/Feed/PostCard",
  component: PostCard,
  decorators: [
    (Story) => (
      <MockAppProviders>
        <div className="max-w-2xl mx-auto p-4 bg-background-main min-h-screen">
          <Story />
        </div>
      </MockAppProviders>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export const TextOnly = {
  args: {
    post: mockPosts.textOnly,
  },
};

export const MultiImage = {
  args: {
    post: mockPosts.withImages,
  },
};

export const GroupPinnedPost = {
  args: {
    post: {
      ...mockPosts.inGroup,
      isPinned: true,
    },
    isAdmin: true,
  },
};
