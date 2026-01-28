import { useState } from 'react';
import postService from '../../services/PostService';

export default function PostComposer({ userAvatar, onPostCreated }) {
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('PUBLIC');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert('Please write something before posting!');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await postService.createPost({
                content: content.trim(),
                visibility: visibility
            });

            const createdPost = response.data;

            // Check if post was flagged for review
            if (createdPost.status === 'PENDING') {
                alert('⚠️ Your post has been flagged for admin review due to potentially inappropriate content. You will be notified once it is reviewed.');
            } else {
                alert('✅ Post created successfully!');
                if (onPostCreated) {
                    onPostCreated(createdPost);
                }
            }

            // Clear form
            setContent('');
            setVisibility('PUBLIC');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('❌ Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const visibilityIcons = {
        PUBLIC: 'public',
        FRIENDS: 'group',
        PRIVATE: 'lock'
    };

    return (
        <div className="flex flex-col gap-4 bg-card-dark p-5 rounded-2xl shadow-lg border border-[#3e2b1d] transition-shadow hover:shadow-[#f47b25]/5 mb-6">
            <div className="flex gap-4">
                <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shrink-0 border border-[#493222]" style={{ backgroundImage: `url("${userAvatar}")` }}></div>
                <div className="flex-1">
                    <textarea
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-text-secondary/60 resize-none text-lg py-2 h-14 leading-relaxed"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                    ></textarea>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-between items-center border-t border-[#493222] pt-4 mt-1">
                <div className="flex gap-1">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#493222] text-text-secondary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[22px]">image</span>
                        <span className="text-sm font-medium hidden sm:block">Photo</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#493222] text-text-secondary hover:text-blue-400 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">videocam</span>
                        <span className="text-sm font-medium hidden sm:block">Video</span>
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#493222] text-text-secondary hover:text-white transition-colors ml-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">{visibilityIcons[visibility]}</span>
                            <span className="text-sm font-medium text-xs">{visibility}</span>
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                        {showVisibilityMenu && (
                            <div className="absolute top-full mt-2 bg-[#2a1f17] border border-[#493222] rounded-lg shadow-lg z-10">
                                {['PUBLIC', 'FRIENDS', 'PRIVATE'].map((vis) => (
                                    <button
                                        key={vis}
                                        onClick={() => {
                                            setVisibility(vis);
                                            setShowVisibilityMenu(false);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-[#493222] text-white text-sm w-full text-left"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">{visibilityIcons[vis]}</span>
                                        {vis}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !content.trim()}
                    className="bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm px-6 py-2.5 rounded-full transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </div>
        </div>
    );
}
