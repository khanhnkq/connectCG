import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import PostComposer from '../../components/feed/PostComposer';
import PostCard from '../../components/feed/PostCard';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function NewsfeedDashboard1() {
    const [isAdmin] = useState(true); // Mocking admin status for demonstration
    const [activeTab, setActiveTab] = useState('Feed');

    const [pendingPosts, setPendingPosts] = useState([
        { id: 1, author: "John Doe", content: "Is the Nikon Z9 worth it for wildlife?", time: "2h ago", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80" },
        { id: 2, author: "Alice Smith", content: "Check out my latest macro shots!", time: "5h ago", image: "https://images.unsplash.com/photo-1452570053594-1b985d6ea82e?auto=format&fit=crop&w=800&q=80" }
    ]);

    const [memberRequests, setMemberRequests] = useState([
        { id: 101, name: "Lucas Vance", bio: "Landscape enthusiast from Seattle", avatar: "https://i.pravatar.cc/150?u=lucas", time: "1h ago" },
        { id: 102, name: "Elena Rossi", bio: "Film photography is my passion", avatar: "https://i.pravatar.cc/150?u=elena", time: "3h ago" }
    ]);

    const [modTab, setModTab] = useState('Posts'); // 'Posts' or 'Members'

    const [members, setMembers] = useState([
        { id: 1, name: "Sarah Jenkins", role: "Moderator", joined: "2 months ago", avatar: "https://i.pravatar.cc/150?u=sarah" },
        { id: 2, name: "Marcus Chen", role: "Member", joined: "1 month ago", avatar: "https://i.pravatar.cc/150?u=marcus" },
        { id: 3, name: "Yuki Tanaka", role: "Member", joined: "2 weeks ago", avatar: "https://i.pravatar.cc/150?u=yuki" },
        { id: 4, name: "Alex Rivera", role: "Member", joined: "3 days ago", avatar: "https://i.pravatar.cc/150?u=alex" },
    ]);

    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const handleAction = (action, target, type = 'danger') => {
        setConfirmConfig({
            isOpen: true,
            title: `${action} Request`,
            message: `Are you sure you want to ${action.toLowerCase()} this?`,
            type: type,
            onConfirm: () => {
                toast.success(`Action: ${action} applied`, { theme: "dark" });
                setConfirmConfig({ ...confirmConfig, isOpen: false });
            }
        });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                <div className="w-full pb-20">
                    {/* Group Header */}
                    <div className="relative w-full h-64 md:h-80 lg:h-96">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC4UKPEvyLmJB2T_0cHwdqw-m6rRaeCijIyofpi2tDwAbXp7LCHbhxcxpYXmKGhk7S5X-znhu3DxgZbYXXJDgRlF-KCkS3Eb8j_VRTjkNj03tosJXVj4vrqlfQXE13u4scgadmpL_IcqFWg-P_jdepWlBXre7vyGiKNwfohBKWmUbXHIapGMciMuI81qrJPcCndZuV0UEbYBDhEdSocpCwfv4jdV3q5YDH6aIxKIKhKe4w_D1Yu_z0potLBShRqwr7rRsTI2D7pK7g")'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
                                        Photography Lovers
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-primary/20 backdrop-blur-sm text-primary border border-primary/30 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                                            Public Group
                                        </span>
                                        {isAdmin && (
                                            <span className="bg-orange-500/20 backdrop-blur-sm text-orange-400 border border-orange-500/30 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
                                                <span className="material-symbols-outlined !text-[14px]">shield_person</span>
                                                Admin View
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-white/90 font-medium text-sm md:text-base flex items-center gap-2 drop-shadow-sm">
                                    <span className="material-symbols-outlined !text-[18px] text-primary">groups</span>
                                    <span>12.5k Members</span>
                                    <span className="size-1 bg-white/40 rounded-full"></span>
                                    <span className="text-primary font-bold">Very Active</span>
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined !text-[20px]">edit_square</span>
                                    Post
                                </button>
                                <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold text-sm transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined !text-[20px]">person_add</span>
                                    Invite
                                </button>
                                <button
                                    onClick={() => handleAction('Report', 'this group', 'warning')}
                                    className="size-10 flex items-center justify-center rounded-full bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-white border border-yellow-500/20 backdrop-blur-md transition-all"
                                    title="Report Group"
                                >
                                    <span className="material-symbols-outlined !text-[20px]">report</span>
                                </button>
                                <button className="size-10 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 backdrop-blur-md transition-all group">
                                    <span className="material-symbols-outlined !text-[20px]">logout</span>
                                </button>

                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-[#342418] sticky top-0 bg-background-dark/95 backdrop-blur-xl z-30">
                        <div className="max-w-7xl mx-auto px-6">
                            <nav className="flex gap-8 overflow-x-auto hide-scrollbar">
                                {['Feed', 'Members', 'Photos', 'Events'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 font-bold text-sm tracking-wide whitespace-nowrap transition-all border-b-2 ${activeTab === tab
                                            ? 'text-primary border-primary'
                                            : 'text-text-secondary hover:text-white border-transparent'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                                {isAdmin && (
                                    <button
                                        onClick={() => setActiveTab('Moderation')}
                                        className={`py-4 font-black text-sm tracking-widest whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${activeTab === 'Moderation'
                                            ? 'text-orange-400 border-orange-400'
                                            : 'text-text-secondary hover:text-orange-400 border-transparent'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">gavel</span>
                                        MODERATION
                                        {(pendingPosts.length > 0 || memberRequests.length > 0) && (
                                            <span className="size-5 bg-orange-500 text-[#231810] text-[10px] rounded-full flex items-center justify-center">
                                                {pendingPosts.length + memberRequests.length}
                                            </span>
                                        )}
                                    </button>
                                )}
                            </nav>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-7xl mx-auto w-full px-6 py-8">
                        {activeTab === 'Feed' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 flex flex-col gap-6">
                                    <PostComposer userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw" />
                                    <PostCard
                                        author={{ name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuHYpNqBoJZ6H3wxyG6OtCnMMVU4FTUngw6LYZy4SgjA0mY2sYsDcePdMS10ev3_M8tw950TFDzIey60zy_0YaYchnCYNkI1EFXtTTC7THk5zGBor8yBtMr-aAf8sbShLZVQv8CQzSm5kNH7EvWmKXyi1RIv1DxZa3HFHT34tseJeUcKe6h6lFC6Ar26xYdz8DghOGsPL3pKr3Sb5Jj3_uULvl0M_QzCz6myNZnocquEnyZkGrndeht0XMB4Yrsu9Is2B6nJ3Mi9M' }}
                                        time="2 hours ago"
                                        content="Golden hour in Kyoto. The light was absolutely perfect this evening. Used a 85mm prime lens for this one. What do you think about the composition?"
                                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuB5H7LQP89_ZyvOx7F5cl1FYMVnX-MFWL-CyfK4ZXJL_PYJnCoIl8ZQfS6hcPUIg20U2Y9NtA0u6tEvMAtdbXX7OuYPnlq15Bo-FQ6Swbqb-iVM7pLDFoVMpMpC9jeXWPszg-3mORsIVFncUTgYkKHk_zDbiqZFQ9R_O4k5tzf_rbG6LXkhpDkHpj_eZ83CRu03Xlyf_iE1svoJcndPrSOAOuGERcRUJQoJiNv5XFwlwZ8uSty1MtJOsSHs3Y2RbmyrHtxPayn-WcA"
                                        stats={{ likes: 248, comments: 42, shares: 12 }}
                                        type="dashboard"
                                    />
                                </div>
                                <div className="hidden lg:flex flex-col gap-6">
                                    <div className="bg-card-dark rounded-2xl p-6 border border-[#3e2b1d]">
                                        <h3 className="text-white font-bold text-lg mb-3">About Group</h3>
                                        <p className="text-text-secondary text-sm leading-relaxed mb-4">
                                            A community for photographers of all levels to share their work, get feedback, and discuss gear.
                                        </p>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <span className="material-symbols-outlined text-text-secondary text-[20px]">public</span>
                                                <span>Public Group</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <span className="material-symbols-outlined text-text-secondary text-[20px]">history</span>
                                                <span>Created 2 years ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Members' && (
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <h3 className="text-xl font-bold text-white">Group Members</h3>
                                    <span className="text-sm text-text-secondary">{members.length} members</span>
                                </div>
                                <div className="bg-card-dark border border-[#3e2b1d] rounded-3xl overflow-hidden divide-y divide-[#3e2b1d]">
                                    {members.map((member) => (
                                        <div key={member.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <img src={member.avatar} className="size-12 rounded-full border-2 border-[#3e2b1d]" alt="" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-white">{member.name}</p>
                                                        <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${member.role === 'Moderator' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-zinc-800 text-zinc-400'
                                                            }`}>
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-text-secondary mt-0.5 italic">Joined {member.joined}</p>
                                                </div>
                                            </div>
                                            {isAdmin && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAction('Kick', member.name)}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">person_remove</span>
                                                        Kick
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Moderation' && isAdmin && (
                            <div className="max-w-3xl mx-auto space-y-8">
                                {/* Header & Toggles */}
                                <div className="bg-[#1a120b] border border-[#3e2b1d] p-8 rounded-[2.5rem] shadow-2xl">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-orange-400 tracking-tight">Moderation Desk</h3>
                                            <p className="text-text-secondary text-sm font-medium mt-1">Review pending content and members</p>
                                        </div>
                                        <div className="size-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                                            <span className="material-symbols-outlined text-3xl">gavel</span>
                                        </div>
                                    </div>

                                    <div className="flex p-1.5 bg-[#120a05] rounded-2xl border border-[#2d1f14]">
                                        <button
                                            onClick={() => setModTab('Posts')}
                                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${modTab === 'Posts' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/50 hover:text-white'}`}
                                        >
                                            <span className="material-symbols-outlined text-lg">article</span>
                                            Pending Posts ({pendingPosts.length})
                                        </button>
                                        <button
                                            onClick={() => setModTab('Members')}
                                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${modTab === 'Members' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/50 hover:text-white'}`}
                                        >
                                            <span className="material-symbols-outlined text-lg">person_add</span>
                                            Join Requests ({memberRequests.length})
                                        </button>
                                    </div>
                                </div>

                                {/* Content based on sub-tab */}
                                {modTab === 'Posts' ? (
                                    <div className="flex flex-col gap-8">
                                        {pendingPosts.map(post => (
                                            <PostCard
                                                key={post.id}
                                                author={{ name: post.author, avatar: `https://i.pravatar.cc/150?u=${post.author}` }}
                                                time={post.time}
                                                content={post.content}
                                                image={post.image}
                                                type="admin"
                                            />
                                        ))}
                                        {pendingPosts.length === 0 && (
                                            <div className="py-24 text-center space-y-4 bg-card-dark rounded-[3rem] border-2 border-dashed border-[#342418]">
                                                <span className="material-symbols-outlined text-6xl text-text-muted/20">task_alt</span>
                                                <p className="text-text-secondary font-bold uppercase tracking-widest">No pending posts</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {memberRequests.map(request => (
                                            <div key={request.id} className="bg-card-dark border border-[#3e2b1d] p-6 rounded-3xl flex items-center justify-between hover:border-orange-500/30 transition-all group shadow-xl">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <img src={request.avatar} className="size-16 rounded-2xl border-2 border-[#3e2b1d] object-cover" alt="" />
                                                        <div className="absolute -bottom-2 -right-2 size-6 rounded-lg bg-primary flex items-center justify-center text-[#231810] shadow-lg">
                                                            <span className="material-symbols-outlined text-[14px] font-black">person</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-white font-black text-lg group-hover:text-primary transition-colors">{request.name}</h4>
                                                        <p className="text-text-secondary text-sm line-clamp-1">{request.bio}</p>
                                                        <p className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Requested {request.time}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleAction('Approve', request.name)}
                                                        className="px-6 py-3 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-[#231810] transition-all font-black text-[10px] uppercase tracking-widest border border-orange-500/20"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('Reject', request.name)}
                                                        className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-red-500/20"
                                                    >
                                                        Ignore
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {memberRequests.length === 0 && (
                                            <div className="py-24 text-center space-y-4 bg-card-dark rounded-[3rem] border-2 border-dashed border-[#342418]">
                                                <span className="material-symbols-outlined text-6xl text-text-muted/20">how_to_reg</span>
                                                <p className="text-text-secondary font-bold uppercase tracking-widest">No pending member requests</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                onConfirm={confirmConfig.onConfirm}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                confirmText="Confirm"
            />
        </div>
    );
}
