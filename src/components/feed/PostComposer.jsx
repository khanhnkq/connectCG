export default function PostComposer({ userAvatar }) {
    return (
        <div className="flex flex-col gap-4 bg-card-dark p-5 rounded-2xl shadow-lg border border-[#3e2b1d] transition-shadow hover:shadow-[#f47b25]/5 mb-6">
            <div className="flex gap-4">
                <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shrink-0 border border-[#493222]" style={{ backgroundImage: `url("${userAvatar}")` }}></div>
                <div className="flex-1">
                    <textarea className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-text-secondary/60 resize-none text-lg py-2 h-14 leading-relaxed" placeholder="What's on your mind?"></textarea>
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
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#493222] text-text-secondary hover:text-white transition-colors ml-2">
                        <span className="material-symbols-outlined text-[18px]">public</span>
                        <span className="text-sm font-medium text-xs">Public</span>
                        <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    </button>
                </div>
                <button className="bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm px-6 py-2.5 rounded-full transition-all shadow-md shadow-orange-500/10">
                    Post
                </button>
            </div>
        </div>
    );
}
