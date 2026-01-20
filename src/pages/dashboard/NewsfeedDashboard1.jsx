import Sidebar from '../../components/layout/Sidebar';
import PostComposer from '../../components/feed/PostComposer';
import PostCard from '../../components/feed/PostCard';

export default function NewsfeedDashboard1() {
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
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
                                        Photography Lovers
                                    </h1>
                                    <span className="bg-primary/20 backdrop-blur-sm text-primary border border-primary/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Public Group
                                    </span>
                                </div>
                                <p className="text-white/80 font-medium text-base md:text-lg flex items-center gap-2 mt-1">
                                    <span className="material-symbols-outlined text-sm">group</span> 12.5k Members •{' '}
                                    <span className="text-primary font-bold">Very Active</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-5 py-2.5 rounded-full bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                    Post Something
                                </button>
                                <button className="px-5 py-2.5 rounded-full bg-[#342418]/80 hover:bg-[#342418] text-white border border-white/10 backdrop-blur-md font-bold text-sm transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                                    Invite Friends
                                </button>
                                <button className="size-10 flex items-center justify-center rounded-full bg-[#342418]/80 hover:bg-red-500/20 hover:text-red-500 text-text-secondary border border-white/10 backdrop-blur-md transition-all">
                                    <span className="material-symbols-outlined">logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-[#342418] sticky top-0 bg-background-dark/95 backdrop-blur-xl z-30">
                        <div className="max-w-7xl mx-auto px-6">
                            <nav className="flex gap-8 overflow-x-auto hide-scrollbar">
                                <a href="#" className="py-4 text-primary border-b-2 border-primary font-bold text-sm tracking-wide whitespace-nowrap">
                                    Feed
                                </a>
                                <a href="#" className="py-4 text-text-secondary hover:text-white font-bold text-sm tracking-wide whitespace-nowrap transition-colors">
                                    Members
                                </a>
                                <a href="#" className="py-4 text-text-secondary hover:text-white font-bold text-sm tracking-wide whitespace-nowrap transition-colors">
                                    Photos
                                </a>
                                <a href="#" className="py-4 text-text-secondary hover:text-white font-bold text-sm tracking-wide whitespace-nowrap transition-colors">
                                    Events
                                </a>
                                <a href="#" className="py-4 text-text-secondary hover:text-white font-bold text-sm tracking-wide whitespace-nowrap transition-colors">
                                    Files
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Feed Content */}
                    <div className="max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 flex flex-col gap-6">

                            <PostComposer userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw" />

                            <PostCard
                                author={{ name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuHYpNqBoJZ6H3wxyG6OtCnMMVU4FTUngw6LYZy4SgjA0mY2sYsDcePdMS10ev3_M8tw950TFDzIey60zy_0YaYchnCYNkI1EFXtTTC7THk5zGBor8yBtMr-aAf8sbShLZVQv8CQzSm5kNH7EvWmKXyi1RIv1DxZa3HFHT34tseJeUcKe6h6lFC6Ar26xYdz8DghOGsPL3pKrXSb5Jj3_uULvl0M_QzCz6myNZnocquEnyZkGrndeht0XMB4Yrsu9Is2B6nJ3Mi9M' }}
                                time="2 hours ago"
                                content="Golden hour in Kyoto. The light was absolutely perfect this evening. Used a 85mm prime lens for this one. What do you think about the composition?"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuB5H7LQP89_ZyvOx7F5cl1FYMVnX-MFWL-CyfK4ZXJL_PYJnCoIl8ZQfS6hcPUIg20U2Y9NtA0u6tEvMAtdbXX7OuYPnlq15Bo-FQ6Swbqb-iVM7pLDFoVMpMpC9jeXWPszg-3mORsIVFncUTgYkKHk_zDbiqZFQ9R_O4k5tzf_rbG6LXkhpDkHpj_eZ83CRu03Xlyf_iE1svoJcndPrSOAOuGERcRUJQoJiNv5XFwlwZ8uSty1MtJOsSHs3Y2RbmyrHtxPayn-WcA"
                                stats={{ likes: 248, comments: 42, shares: 12 }}
                                type="dashboard"
                            />
                        </div>

                        {/* Right Sidebar */}
                        <div className="hidden lg:flex flex-col gap-6">
                            <div className="bg-card-dark rounded-2xl p-6 border border-[#3e2b1d]">
                                <h3 className="text-white font-bold text-lg mb-3">About Group</h3>
                                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                                    A community for photographers of all levels to share their work, get feedback, and discuss gear. We organize monthly photowalks and weekly challenges.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <span className="material-symbols-outlined text-text-secondary text-[20px]">public</span>
                                        <span>Public • Anyone can see</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <span className="material-symbols-outlined text-text-secondary text-[20px]">visibility</span>
                                        <span>Visible • Anyone can find</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <span className="material-symbols-outlined text-text-secondary text-[20px]">history</span>
                                        <span>Created 2 years ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
