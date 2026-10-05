import React from "react";
import { Card } from "../components/ui/card/Card";
import { Button, IconButton } from "../components/ui/button/Button";
import { Badge } from "../components/ui/badge/Badge";
import { Avatar } from "../components/ui/avatar/Avatar";
import { mockUsers, mockPosts } from "./mocks/apiMockData";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";

export default {
  title: "Design System/Card",
  component: Card,
  tags: ["autodocs"],
};

export const Basic = {
  render: () => (
    <Card className="max-w-md">
      <Card.Header
        title="Thông tin nhóm"
        subtitle="Cộng đồng Designer & Frontend VN"
        action={<Badge variant="primary">Công khai</Badge>}
      />
      <Card.Body>
        <p className="text-sm text-text-secondary leading-relaxed">
          Nơi giao lưu, chia sẻ kinh nghiệm về Thiết kế giao diện (UI/UX), Hệ thống thiết kế (Design System) và Lập trình Frontend hiện đại.
        </p>
      </Card.Body>
      <Card.Footer>
        <span className="text-xs text-text-muted">1,420 thành viên</span>
        <Button size="sm" variant="primary">
          Tham gia nhóm
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const PostCardLayout = {
  render: () => {
    const post = mockPosts.textOnly;
    return (
      <Card className="max-w-xl">
        <div className="p-4 flex items-center justify-between border-b border-border-main">
          <div className="flex items-center gap-3">
            <Avatar src={post.authorAvatar} name={post.authorFullName} size="md" status="online" />
            <div>
              <h4 className="text-sm font-bold text-text-main hover:text-primary cursor-pointer transition-colors">
                {post.authorFullName}
              </h4>
              <p className="text-xs text-text-muted">15 phút trước · Công khai</p>
            </div>
          </div>
          <IconButton icon={MoreHorizontal} variant="ghost" size="sm" aria-label="Tùy chọn khác" />
        </div>

        <Card.Body className="py-4">
          <p className="text-sm text-text-main leading-relaxed">{post.content}</p>
        </Card.Body>

        <div className="px-6 py-2.5 border-t border-border-main bg-surface-subtle/30 flex items-center justify-between text-xs text-text-muted">
          <span>{post.reactCount} lượt thích</span>
          <span>{post.commentCount} bình luận · {post.shareCount} lượt chia sẻ</span>
        </div>

        <div className="p-2 border-t border-border-main grid grid-cols-3 gap-1">
          <Button variant="ghost" size="sm">
            Thích
          </Button>
          <Button variant="ghost" size="sm">
            Bình luận
          </Button>
          <Button variant="ghost" size="sm">
            Chia sẻ
          </Button>
        </div>
      </Card>
    );
  },
};
