import React from "react";
import { useSelector } from "react-redux";
import { PushPin } from "@phosphor-icons/react";
import { usePostActions } from "../../features/feed/hooks/usePostActions";
import { normalizePostData, REPORT_REASONS } from "../../features/feed/utils/feedUtils";

import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostMediaGrid from "./PostMediaGrid";
import PostReactions from "./PostReactions";
import PostFooterAction from "./PostFooterAction";
import PostUpdate from "./PostUpdate";
import SharedPostContent from "./SharedPostContent";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";
import ReportModal from "../report/ReportModal";
import ImageLightbox from "../common/ImageLightBox";

export default function PostCard({
  post, id, author, time, content, image, type = "feed",
  onUpdate, onDelete, isAdmin: canPin = false,
  defaultShowComments = false,
}) {
  const { user } = useSelector((state) => state.auth);
  const data = normalizePostData(post, { id, author, time, content, image });
  const isShared = Boolean(post?.originalPost);
  const displayPost = isShared ? post.originalPost : post;

  const actions = usePostActions({
    postData: data, onUpdate, onDelete, canPin,
    defaultShowComments,
  });

  return (
    <article className={`bg-surface-main rounded-2xl border border-border-main transition-colors duration-150 mb-4 ${type === "dashboard" ? "border-border-strong" : ""}`}>
      {data.isPinned && (
        <div className="px-6 pt-3 flex items-center gap-2 text-primary font-bold text-xs select-none">
          <PushPin size={14} weight="fill" className="rotate-45" />
          <span>Bài viết đã ghim</span>
        </div>
      )}

      <PostHeader
        author={data.author} timeDisplay={data.timeDisplay} groupId={data.groupId} groupName={data.groupName}
        visibility={data.visibility} aiStatus={data.aiStatus} isPinned={data.isPinned} canPin={canPin}
        currentUserId={user?.id} showMenu={actions.showMenu} setShowMenu={actions.setShowMenu}
        onEdit={() => actions.setIsEditing(true)} onDelete={actions.handleDelete}
        onTogglePin={actions.handleTogglePin} onShare={actions.openShareModal} onReport={actions.openReportModal}
      />


      {actions.isEditing ? (
        <div className="px-5 md:px-8 pb-4">
          <PostUpdate post={data} onUpdate={actions.handleUpdate} onCancel={() => actions.setIsEditing(false)} />
        </div>
      ) : (
        <PostContent content={data.content} />
      )}

      {isShared && <SharedPostContent post={displayPost} />}

      {!actions.isEditing && (
        <PostMediaGrid
          mediaItems={data.mediaItems}
          onMediaClick={actions.openLightbox}
          isPaused={actions.videoPaused}
          setIsPaused={actions.setVideoPaused}
        />
      )}

      <PostReactions
        reactCount={actions.localReactCount}
        commentCount={actions.localCommentCount}
        shareCount={actions.localShareCount}
        onToggleComments={actions.toggleComments}
        onShareClick={actions.openShareModal}
      />

      <PostFooterAction
        currentReaction={actions.localReaction}
        onReact={actions.handleReact}
        onToggleComments={actions.toggleComments}
        onShareClick={actions.openShareModal}
      />

      {actions.showComments && <CommentSection postId={data.id} />}

      <ShareModal isOpen={actions.showShareModal} onClose={actions.closeShareModal} postId={data.id} postContent={data.content} />

      {actions.lightboxIndex >= 0 && (
        <ImageLightbox
          mediaItems={data.mediaItems}
          initialIndex={actions.lightboxIndex}
          isPaused={actions.videoPaused}
          onTogglePause={actions.setVideoPaused}
          onClose={actions.closeLightbox}
        />
      )}

      <ReportModal
        isOpen={actions.showReportModal}
        onClose={actions.closeReportModal}
        onSubmit={actions.handleReportSubmit}
        title="Báo cáo bài viết"
        subtitle="Hãy giúp chúng tôi hiểu vấn đề với bài viết này"
        reasons={REPORT_REASONS}
        targetPayload={{ targetType: "POST", targetId: data.id }}
        user={data.author}
      />
    </article>
  );
}
