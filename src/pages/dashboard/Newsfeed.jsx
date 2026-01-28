import React, { useState, useEffect } from 'react';
import { IconBell } from '@tabler/icons-react';


import { getMyNotifications, markAsRead } from '../../services/NotificationService';
import NotificationList from '../../components/notification/NotificationList';



import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications } from '../../redux/slices/notificationSlice';

import { setNotifications } from '../../redux/slices/notificationSlice';



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
  const [showNotifications, setShowNotifications] = useState(false);




  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);





  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);

      const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
      dispatch(setNotifications(updated));

      dispatch(fetchNotifications()); // Refresh notifications after marking as read

    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  }

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


    <div className="flex w-full relative items-start">
      <div className="flex-1 w-full">
        <div className="max-w-3xl mx-auto w-full px-6 py-8 pb-20">
          <header className="flex justify-between items-center mb-8 sticky top-0 bg-background-dark/95 backdrop-blur-sm z-30 py-4 -mt-4 border-b border-[#342418]">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Bảng tin</h1>
              <p className="text-text-secondary text-sm font-medium">Xem những gì đang diễn ra xung quanh bạn</p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="size-10 rounded-full bg-[#342418] hover:bg-[#3e2b1d] text-white flex items-center justify-center transition-all relative"
                >
                  <IconBell className="text-neutral-200 h-5 w-5" />
                  {notifications.some(n => !n.isRead) && <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full animate-pulse border border-[#342418]"></span>}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 z-50">
                    <NotificationList

                      notifications={notifications}

                      onMarkAsRead={handleMarkAsRead}
                    />
                  </div>
                )}
              </div>


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
      </div>

      <RightSidebar />
    </div>
  );

}
