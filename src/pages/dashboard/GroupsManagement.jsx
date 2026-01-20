import Sidebar from '../../components/layout/Sidebar';

export default function GroupsManagement() {
    const yourGroups = [
        { id: 1, name: 'Tokyo Travelers', newPosts: 15, members: 128, isAdmin: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM' },
        { id: 2, name: 'Coffee & Code', newPosts: 3, members: 42, isAdmin: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIX1wAYBAaj5E3ZSRIlI5IPaunhWNdzmIwF7-7p1gL_GDonD1nu-64KLjLpSPdZTVgljRLZnXwvmCxExZiHo0M0herxixGJXSTWUUAwUfcER7CvEaSojHMw584hz6DQinjDLJ3ybtst0uHqmfgErVEQADCAch_-XcX66M40huD5lbsnGQgpcJJL27uK7XbMfy9toGEIHhCHmzH89TomH2nGCh8_diALS3wNYS029XSURlHuNngihv2mo_HfP7QfP_804f4760TbQE' },
        { id: 3, name: 'Indie Music Fans', newPosts: 89, members: 850, isAdmin: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFnbIOg359_IruqeJZR2XF_Z9o0ttAo63JvDFovmYNSKdvPDsjabpqB7jFC2UUE6tzEncOSivvm1W5vNt9KxVCVPm7pn8OrwN7RLmHA4OMIo36hL-88I-wXa9YN61Vi-X20nAg7gI-1QfF28jrI8oV5TGX_X32VjN7POtm_CtBB9DkdWcNvsqgkBEwNZFhOLngZBuNQA5Z5pU-fGIhAf3z355mdR5RIij1VsmKLkaqcqcd87735upuE6OE5UqM8bI3FCXkrTk4agw' }
    ];

    const discoverGroups = [
        { id: 1, name: 'Photography Lovers', tagline: 'Capture the moment', members: '12.5k', description: 'A community for photographers of all levels to share their work, get feedback, and discuss gear.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4UKPEvyLmJB2T_0cHwdqw-m6rRaeCijIyofpi2tDwAbXp7LCHbhxcxpYXmKGhk7S5X-znhu3DxgZbYXXJDgRlF-KCkS3Eb8j_VRTjkNj03tosJXVj4vrqlfQXE13u4scgadmpL_IcqFWg-P_jdepWlBXre7vyGiKNwfohBKWmUbXHIapGMciMuI81qrJPcCndZuV0UEbYBDhEdSocpCwfv4jdV3q5YDH6aIxKIKhKe4w_D1Yu_z0potLBShRqwr7rRsTI2D7pK7g' },
        { id: 2, name: 'Hiking Club', tagline: 'Adventure awaits', members: '8.2k', description: 'Join us for weekly hikes, camping trips, and outdoor adventures. Beginners welcome!', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM' },
        { id: 3, name: 'Bookworms Unite', tagline: 'Read, Discuss, Repeat', members: '4.1k', description: 'Monthly book club meetings, literary discussions, and book swaps for avid readers.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIX1wAYBAaj5E3ZSRIlI5IPaunhWNdzmIwF7-7p1gL_GDonD1nu-64KLjLpSPdZTVgljRLZnXwvmCxExZiHo0M0herxixGJXSTWUUAwUfcER7CvEaSojHMw584hz6DQinjDLJ3ybtst0uHqmfgErVEQADCAch_-XcX66M40huD5lbsnGQgpcJJL27uK7XbMfy9toGEIHhCHmzH89TomH2nGCh8_diALS3wNYS029XSURlHuNngihv2mo_HfP7QfP_804f4760TbQE' }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                <div className="max-w-7xl mx-auto w-full pb-20">
                    {/* Header */}
                    <div className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-xl border-b border-[#342418] p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button className="lg:hidden text-white">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <h2 className="text-2xl font-extrabold text-white tracking-tight">Groups</h2>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-[#231810] transition-all font-bold text-sm group">
                            <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">add</span>
                            Create New Group
                        </button>
                        <button className="sm:hidden size-10 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-primary hover:text-[#231810] transition-all">
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>

                    <div className="px-6 py-8">
                        {/* Your Groups Section */}
                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-5">
                                <h3 className="text-xl font-bold text-white tracking-wide">Your Groups</h3>
                                <div className="flex gap-2">
                                    <button className="size-8 rounded-full bg-[#342418] hover:bg-primary hover:text-[#231810] text-text-secondary flex items-center justify-center transition-all">
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    <button className="size-8 rounded-full bg-[#342418] hover:bg-primary hover:text-[#231810] text-text-secondary flex items-center justify-center transition-all">
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                                {yourGroups.map((group) => (
                                    <div key={group.id} className="min-w-[240px] w-[240px] bg-card-dark rounded-2xl border border-[#3e2b1d] overflow-hidden group cursor-pointer hover:border-primary/50 transition-all shadow-md">
                                        <div className="h-28 bg-cover bg-center relative" style={{ backgroundImage: `url("${group.image}")` }}>
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                                            {group.isAdmin && (
                                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10">
                                                    ADMIN
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h4 className="text-white font-bold text-lg leading-tight mb-1 truncate">{group.name}</h4>
                                            <p className="text-text-secondary text-xs mb-3">{group.newPosts} new posts this week</p>
                                            <div className="flex items-center -space-x-2">
                                                <div className="size-7 rounded-full ring-2 ring-card-dark bg-[#493222] text-text-secondary text-[10px] font-bold flex items-center justify-center">
                                                    +{group.members}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="min-w-[240px] w-[240px] bg-[#2a1d15] rounded-2xl border-2 border-dashed border-[#493222] flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-[#342418] transition-all group">
                                    <div className="size-12 rounded-full bg-[#342418] group-hover:bg-primary group-hover:text-[#231810] text-primary flex items-center justify-center mb-3 transition-colors">
                                        <span className="material-symbols-outlined text-2xl">add</span>
                                    </div>
                                    <span className="text-text-secondary group-hover:text-white font-bold text-sm">Join New Group</span>
                                </div>
                            </div>
                        </div>

                        {/* Discover Groups Section */}
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h3 className="text-xl font-bold text-white tracking-wide">Discover Groups</h3>
                                <div className="relative w-full sm:w-80">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-text-secondary text-lg">search</span>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-4 py-2.5 border-none rounded-xl bg-[#342418] text-white placeholder-text-secondary/70 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-[#3e2b1d] transition-all text-sm font-medium shadow-inner"
                                        placeholder="Search for groups..."
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {discoverGroups.map((group) => (
                                    <article key={group.id} className="bg-card-dark rounded-2xl border border-[#3e2b1d] overflow-hidden flex flex-col hover:shadow-lg hover:shadow-orange-500/5 transition-all group h-full">
                                        <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url("${group.image}")` }}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-3 left-4 right-4">
                                                <h4 className="text-white font-bold text-xl leading-tight">{group.name}</h4>
                                                <p className="text-gray-300 text-xs mt-1 font-medium">{group.tagline}</p>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                                                <span className="material-symbols-outlined text-primary text-[14px]">groups</span>
                                                <span className="text-white text-xs font-bold">{group.members}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <p className="text-text-secondary text-sm mb-4 line-clamp-2">{group.description}</p>
                                            <div className="mt-auto">
                                                <button className="w-full py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 group-hover:shadow-orange-500/20">
                                                    Join Group
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
