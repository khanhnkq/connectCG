import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import RightSidebar from '../../components/layout/RightSidebar';
import PostComposer from '../../components/feed/PostComposer';
import PostCard from '../../components/feed/PostCard';
import postService from '../../services/PostService';
import toast from 'react-hot-toast';

export default function Newsfeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPublicHomepagePosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching newsfeed:", error);
      toast.error("Failed to load newsfeed posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    // only add if approved (AI check result)
    if (newPost.status === 'APPROVED') {
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }
  };

  // Helper to format time (placeholder for now, can use date-fns/dayjs later)
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
        <div className="max-w-3xl mx-auto w-full px-6 py-8 pb-20">
          <header className="flex justify-between items-center mb-8 sticky top-0 bg-background-dark/95 backdrop-blur-sm z-30 py-4 -mt-4 border-b border-[#342418]">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Bảng tin</h1>
              <p className="text-text-secondary text-sm font-medium">Xem những gì đang diễn ra xung quanh bạn</p>
            </div>
            <div className="flex gap-3">
              <button className="lg:hidden size-10 rounded-full bg-[#342418] hover:bg-[#3e2b1d] text-white flex items-center justify-center transition-all">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </header>

          <div className="flex flex-col gap-6">
            <PostComposer
              userAvatar="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              onPostCreated={handlePostCreated}
            />

            {loading ? (
              <div className="text-center py-10 text-text-secondary">Loading feed...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-text-secondary">No posts to show yet.</div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={{
                    name: post.author?.username || 'Anonymous',
                    avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                  }}
                  time={formatTime(post.createdAt)}
                  content={post.content}
                  image={null} // TODO: Implement media handling if needed
                  stats={{
                    likes: post.reactCount || 0,
                    comments: post.commentCount || 0,
                    shares: post.shareCount || 0
                  }}
                  type="feed"
                />
              ))
            )}
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}
