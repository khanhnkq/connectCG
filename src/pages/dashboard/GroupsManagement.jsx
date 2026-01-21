import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import React from 'react';

export default function GroupsManagement() {
    const navigate = useNavigate();

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
                            <h2 className="text-2xl font-extrabold text-white tracking-tight">Community Hub</h2>
                        </div>
                        <Link
                            to="/dashboard/groups/create"
                            className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-[#231810] hover:bg-orange-600 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">add</span>
                            Start a Group
                        </Link>
                    </div>

                    <div className="px-6 py-8">
                        {/* Your Groups Section */}
                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-5">
                                <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">groups</span>
                                    My Communities
                                </h3>
                            </div>
                            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                                {yourGroups.map((group) => (
                                    <Link
                                        key={group.id}
                                        to="/dashboard/newsfeed-1"
                                        className="min-w-[260px] w-[260px] bg-card-dark rounded-[2rem] border border-[#3e2b1d] overflow-hidden group hover:border-primary/50 transition-all shadow-xl block"
                                    >
                                        <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url("${group.image}")` }}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            {group.isAdmin && (
                                                <div className="absolute top-3 right-3 bg-orange-500/90 backdrop-blur-md text-[#231810] text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/20">
                                                    ADMIN
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h4 className="text-white font-bold text-lg leading-tight mb-1 truncate group-hover:text-primary transition-colors">{group.name}</h4>
                                            <p className="text-text-secondary text-[11px] mb-4 font-medium uppercase tracking-wider">{group.newPosts} updates this week</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <img key={i} src={`https://i.pravatar.cc/100?u=${group.id}${i}`} className="size-7 rounded-full border-2 border-card-dark" alt="" />
                                                    ))}
                                                    <div className="size-7 rounded-full ring-2 ring-card-dark bg-[#342418] text-text-muted text-[9px] font-bold flex items-center justify-center">
                                                        +{group.members}
                                                    </div>
                                                </div>
                                                {group.isAdmin && (
                                                    <span className="text-[9px] font-black text-primary border border-primary/30 bg-primary/10 px-2 py-1 rounded-lg uppercase">
                                                        Control
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Discover Groups Section */}
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">explore</span>
                                    Explore More
                                </h3>
                                <div className="relative w-full sm:w-80 group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-lg">search</span>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-11 pr-4 py-3 border border-[#3e2b1d] rounded-2xl bg-[#1a120b] text-white placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                                        placeholder="Find your tribe..."
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {discoverGroups.map((group) => (
                                    <article key={group.id} className="bg-card-dark rounded-3xl border border-[#3e2b1d] overflow-hidden flex flex-col hover:border-primary/30 transition-all group h-full shadow-2xl">
                                        <div className="h-44 bg-cover bg-center relative" style={{ backgroundImage: `url("${group.image}")` }}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                            <div className="absolute bottom-4 left-5 right-5">
                                                <h4 className="text-white font-bold text-xl leading-tight group-hover:text-primary transition-colors">{group.name}</h4>
                                                <p className="text-gray-400 text-xs mt-1 font-medium italic">{group.tagline}</p>
                                            </div>
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-2.5 py-1.5 rounded-xl flex items-center gap-2 border border-white/10 shadow-lg">
                                                <span className="material-symbols-outlined text-primary text-[16px]">groups</span>
                                                <span className="text-white text-[11px] font-black">{group.members}</span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-card-dark to-[#1a120b]">
                                            <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed">{group.description}</p>
                                            <div className="mt-auto">
                                                <button className="w-full py-3 rounded-2xl bg-[#342418] hover:bg-primary hover:text-[#231810] text-primary font-black text-xs transition-all uppercase tracking-widest border border-primary/20 hover:border-transparent">
                                                    Request Entry
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
