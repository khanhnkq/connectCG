import Sidebar from '../../components/layout/Sidebar';
import RightSidebar from '../../components/layout/RightSidebar';

export default function FriendRequests() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                <div className="max-w-3xl mx-auto w-full px-6 py-8 pb-20">
                    <header className="flex justify-between items-center mb-8 sticky top-0 bg-background-dark/95 backdrop-blur-sm z-30 py-4 -mt-4 border-b border-[#342418]">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <a href="#" className="lg:hidden text-white mr-2">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </a>
                                <h1 className="text-3xl font-extrabold text-white tracking-tight">Requests</h1>
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">4</span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium ml-0 lg:ml-0">Manage your connections</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#342418] hover:bg-[#3e2b1d] text-white transition-all text-sm font-bold border border-[#493222]">
                                <span className="material-symbols-outlined text-[18px]">history</span>
                                <span className="hidden sm:inline">Sent Requests</span>
                            </button>
                        </div>
                    </header>

                    {/* Friend Requests List */}
                    <div className="flex flex-col gap-6">
                        <section>
                            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                Today <span className="text-text-secondary font-normal text-sm">2 requests</span>
                            </h2>
                            <div className="bg-card-dark rounded-2xl border border-[#3e2b1d] overflow-hidden shadow-lg">
                                {/* Request Item 1 */}
                                <div className="p-5 flex flex-col sm:flex-row items-center gap-4 border-b border-[#3e2b1d] hover:bg-[#2a1d15] transition-colors">
                                    <div className="relative">
                                        <div className="size-16 rounded-full bg-cover bg-center ring-4 ring-[#2a1d15]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIX1wAYBAaj5E3ZSRIlI5IPaunhWNdzmIwF7-7p1gL_GDonD1nu-64KLjLpSPdZTVgljRLZnXwvmCxExZiHo0M0herxixGJXSTWUUAwUfcER7CvEaSojHMw584hz6DQinjDLJ3ybtst0uHqmfgErVEQADCAch_-XcX66M40huD5lbsnGQgpcJJL27uK7XbMfy9toGEIHhCHmzH89TomH2nGCh8_diALS3wNYS029XSURlHuNngihv2mo_HfP7QfP_804f4760TbQE")' }}></div>
                                        <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-full flex items-center justify-center border-2 border-[#2a1d15]">
                                            <span className="material-symbols-outlined text-[14px] text-white">person_add</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-white font-bold text-base hover:text-primary cursor-pointer transition-colors">Michael Chen</h3>
                                        <p className="text-text-secondary text-sm mt-1 mb-2">34 mutual friends</p>
                                        <div className="hidden sm:flex items-center gap-2 text-xs text-text-secondary bg-[#231810] px-3 py-1.5 rounded-lg w-fit">
                                            <span className="material-symbols-outlined text-[14px]">school</span>
                                            UCLA Alumni
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm px-6 py-2.5 rounded-full transition-all shadow-lg shadow-orange-500/10">
                                            Confirm
                                        </button>
                                        <button className="flex-1 sm:flex-none bg-[#342418] hover:bg-[#3e2b1d] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-all">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {/* Request Item 2 */}
                                <div className="p-5 flex flex-col sm:flex-row items-center gap-4 hover:bg-[#2a1d15] transition-colors">
                                    <div className="relative">
                                        <div className="size-16 rounded-full bg-cover bg-center ring-4 ring-[#2a1d15]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM")' }}></div>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-white font-bold text-base hover:text-primary cursor-pointer transition-colors">Sarah Williams</h3>
                                        <p className="text-text-secondary text-sm mt-1 mb-2">8 mutual friends</p>
                                        <div className="hidden sm:flex items-center gap-2 text-xs text-text-secondary bg-[#231810] px-3 py-1.5 rounded-lg w-fit">
                                            <span className="material-symbols-outlined text-[14px]">work</span>
                                            Designer at Creative Co.
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm px-6 py-2.5 rounded-full transition-all shadow-lg shadow-orange-500/10">
                                            Confirm
                                        </button>
                                        <button className="flex-1 sm:flex-none bg-[#342418] hover:bg-[#3e2b1d] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-all">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-white font-bold text-lg mb-4">People You May Know</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Suggestion Card 1 */}
                                <div className="bg-card-dark rounded-2xl border border-[#3e2b1d] p-4 flex flex-col gap-4 hover:border-primary/30 transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="size-14 rounded-full bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g")' }}></div>
                                        <button className="text-text-secondary hover:text-white p-1 rounded-full hover:bg-[#342418] transition-colors">
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-base line-clamp-1">James Rodriguez</h3>
                                        <p className="text-text-secondary text-sm mt-1 mb-3">Mutual friend: Emma W.</p>
                                        <button className="w-full bg-[#342418] hover:bg-primary hover:text-[#231810] text-primary font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                                            Add Friend
                                        </button>
                                    </div>
                                </div>
                                {/* Suggestion Card 2 */}
                                <div className="bg-card-dark rounded-2xl border border-[#3e2b1d] p-4 flex flex-col gap-4 hover:border-primary/30 transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="size-14 rounded-full bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y")' }}></div>
                                        <button className="text-text-secondary hover:text-white p-1 rounded-full hover:bg-[#342418] transition-colors">
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-base line-clamp-1">Sophia Martinez</h3>
                                        <p className="text-text-secondary text-sm mt-1 mb-3">Nearby</p>
                                        <button className="w-full bg-[#342418] hover:bg-primary hover:text-[#231810] text-primary font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                                            Add Friend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <RightSidebar />
        </div>
    );
}
