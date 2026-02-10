import React from "react";
import { Link } from "react-router-dom";

const SharedPostContent = ({ post }) => {
  if (!post) return null;

  // Format time helper (simplified version or import from utils)
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
  };

  return (
    <Link
      to={`/dashboard/post/${post.id}`}
      className="block mx-5 mb-4 border border-border-main rounded-lg p-4 bg-background-main/50 hover:bg-background-main transition-all group"
    >
      {/* Header nhỏ của bài gốc */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full size-8 flex-shrink-0 border border-border-main"
          style={{ backgroundImage: `url("${post.authorAvatar}")` }}
        ></div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-text-main group-hover:text-primary transition-colors">
            {post.authorFullName}
          </span>
          <span className="text-xs text-text-secondary">
            {formatTime(post.createdAt)}
          </span>
        </div>
      </div>

      {/* Nội dung bài gốc */}
      <p className="text-text-main text-sm mb-2 line-clamp-3">{post.content}</p>

      {/* Media Preview (Simplified) */}
      {post.media && post.media.length > 0 && (
        <div className="rounded-lg overflow-hidden aspect-video bg-black/5 relative">
          {post.media[0].type === "VIDEO" ? (
            <video
              src={post.media[0].url}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={post.media[0].url}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          {post.media.length > 1 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                +{post.media.length - 1}
              </span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

export default SharedPostContent;
