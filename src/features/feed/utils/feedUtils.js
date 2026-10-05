import { formatRelativeTime } from "../../../utils/dateUtils";

export const REPORT_REASONS = [
  "Spam hoặc lừa đảo",
  "Nội dung khiêu dâm",
  "Bạo lực hoặc nguy hiểm",
  "Quấy rối hoặc bắt nạt",
  "Thông tin sai lệch",
  "Vi phạm quyền sở hữu trí tuệ",
  "Khác",
];

export function normalizePostData(post, fallback = {}) {
  if (post) {
    const mediaItems = post.media?.length
      ? post.media
      : (post.images || []).map((url) => ({ url, type: "IMAGE" }));

    return {
      id: post.id,
      content: post.content,
      author: {
        name: post.authorFullName || post.authorName,
        avatar: post.authorAvatar,
        id: post.authorId,
        isSystem: post.isSystem,
      },
      groupId: post.groupId,
      groupName: post.groupName,
      timeDisplay: formatRelativeTime(post.createdAt),
      mediaItems,
      visibility: post.visibility,
      aiStatus: post.aiStatus,
      currentUserReaction: post.currentUserReaction,
      reactCount: post.reactCount || 0,
      commentCount: post.commentCount || 0,
      shareCount: post.shareCount || 0,
      isPinned: post.isPinned,
      pinnedAt: post.pinnedAt,
    };
  }

  return {
    id: fallback.id,
    content: fallback.content,
    author: fallback.author,
    timeDisplay: fallback.time,
    mediaItems: fallback.image ? [{ url: fallback.image, type: "IMAGE" }] : [],
  };
}
