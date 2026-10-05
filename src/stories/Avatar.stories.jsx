import React from "react";
import { Avatar, AvatarGroup } from "../components/ui/avatar/Avatar";
import { mockUsers } from "./mocks/apiMockData";

export default {
  title: "Design System/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
    status: {
      control: "select",
      options: [undefined, "online", "offline", "busy"],
    },
  },
};

export const WithImage = {
  args: {
    src: mockUsers.currentUser.avatarUrl,
    name: mockUsers.currentUser.fullName,
    size: "lg",
    status: "online",
  },
};

export const InitialsFallback = {
  args: {
    src: "", // No image URL, triggers initials fallback
    name: "Lê Mai Chi",
    size: "lg",
    status: "online",
  },
};

export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" name="Quốc Khánh" />
      <Avatar size="sm" name="Quốc Khánh" />
      <Avatar size="md" name="Quốc Khánh" status="online" />
      <Avatar size="lg" name="Quốc Khánh" status="online" />
      <Avatar size="xl" name="Quốc Khánh" status="busy" />
      <Avatar size="2xl" name="Quốc Khánh" status="offline" />
    </div>
  ),
};

export const Group = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar src={mockUsers.currentUser.avatarUrl} name={mockUsers.currentUser.fullName} />
      <Avatar src={mockUsers.friend1.avatarUrl} name={mockUsers.friend1.fullName} />
      <Avatar name="Lê Mai Chi" />
      <Avatar name="Hoàng Văn Nam" />
      <Avatar name="Phạm Minh Tâm" />
    </AvatarGroup>
  ),
};
