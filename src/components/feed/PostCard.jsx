export default function PostCard({ author, time, content, image, stats = { likes: 0, comments: 0, shares: 0 }, type = 'feed', children }) {
    // type: 'feed' (Newsfeed/Timeline) or 'dashboard' (NewsfeedDashboard1 - taller image/different style)

    return (
        <article className={`bg-card-dark rounded-2xl border border-[#3e2b1d] overflow-hidden ${type === 'dashboard' ? 'shadow-lg' : 'shadow-sm'}`}>
            <div className="p-5 flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-11 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all" style={{ backgroundImage: `url("${author.avatar}")` }}></div>
                    <div className="flex flex-col justify-center">
                        <h3 className="text-white font-bold text-base hover:text-primary cursor-pointer transition-colors">{author.name}</h3>
                        <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1 font-medium">
                            {time} • <span className="material-symbols-outlined text-[14px] text-text-secondary">public</span>
                        </p>
                    </div>
                </div>
                <button className="text-text-secondary hover:text-white p-2 rounded-full hover:bg-[#493222] transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>
            <div className="px-5 pb-4">
                {children ? children : <div className="text-gray-200 text-base font-normal leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: content }}></div>}
            </div>
            {image && (
                <div className={`w-full bg-[#2a1d15] bg-cover bg-center cursor-pointer relative group ${type === 'dashboard' ? 'h-80' : 'aspect-[4/3] sm:aspect-video'}`} style={{ backgroundImage: `url("${image}")` }}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
            )}
            <div className="px-5 py-3 border-b border-[#493222] flex items-center justify-between text-text-secondary text-sm">
                <div className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors">
                    <span className="size-5 rounded-full bg-primary flex items-center justify-center text-[12px] text-white material-symbols-outlined shadow-sm">thumb_up</span>
                    <span className="font-medium">{stats.likes} likes</span>
                </div>
                <div className="flex gap-4">
                    <span className="hover:text-white cursor-pointer transition-colors font-medium">{stats.comments} comments</span>
                    {stats.shares > 0 && <span className="hover:text-white cursor-pointer transition-colors font-medium">{stats.shares} shares</span>}
                </div>
            </div>
            <div className="p-2 px-3 flex items-center justify-between">
                <div className="flex gap-1 flex-1">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#493222] text-text-secondary hover:text-red-500 transition-colors group">
                        <span className="material-symbols-outlined icon-outline group-hover:text-red-500 group-active:scale-90 transition-all">favorite</span>
                        <span className="text-sm font-bold">Like</span>
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#493222] text-text-secondary hover:text-blue-400 transition-colors group">
                        <span className="material-symbols-outlined icon-outline group-active:scale-90 transition-all">chat_bubble</span>
                        <span className="text-sm font-bold">Comment</span>
                    </button>
                    <button className="hidden sm:flex items-center justify-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#493222] text-text-secondary hover:text-green-400 transition-colors group">
                        <span className="material-symbols-outlined icon-outline group-active:scale-90 transition-all">share</span>
                        <span className="text-sm font-bold">Share</span>
                    </button>
                </div>
                <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary hover:to-orange-500 text-primary hover:text-[#231810] transition-all border border-primary/30 hover:border-transparent group shadow-sm shadow-orange-900/20">
                    <span className="material-symbols-outlined text-[20px]">redeem</span>
                    <span className="text-sm font-bold">Gift</span>
                </button>
            </div>
        </article>
    );
}
