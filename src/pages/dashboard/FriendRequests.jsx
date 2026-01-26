import Sidebar from '../../components/layout/Sidebar';
import RightSidebar from '../../components/layout/RightSidebar';

export default function FriendRequests() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                <div className="max-w-4xl mx-auto w-full px-6 py-8 pb-20">
                    <header className="flex justify-between items-center mb-8 sticky top-0 bg-background-dark/95 backdrop-blur-sm z-30 py-4 -mt-4 border-b border-[#342418]">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-extrabold text-white tracking-tight">Lời mời kết bạn</h1>
                                <span className="bg-primary text-[#231810] text-xs font-black px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/20">4</span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium">Quản lý các kết nối và yêu cầu kết bạn của bạn</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#342418] hover:bg-[#3e2b1d] text-white transition-all text-sm font-bold border border-[#493222] shadow-xl">
                                <span className="material-symbols-outlined text-[20px]">history</span>
                                <span className="hidden sm:inline">Lời mời đã gửi</span>
                            </button>
                        </div>
                    </header>

                    {/* Friend Requests List */}
                    <div className="flex flex-col gap-10">
                        <section>
                            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">notifications_active</span>
                                Mới nhất <span className="text-text-secondary font-medium text-sm">(2 yêu cầu)</span>
                            </h2>
                            <div className="bg-[#2a1d15] rounded-[2rem] border border-[#3e2b1d] overflow-hidden shadow-2xl">
                                {/* Request Item 1 */}
                                <div className="p-6 flex flex-col sm:flex-row items-center gap-6 border-b border-[#3e2b1d]/50 hover:bg-[#342418]/50 transition-colors group">
                                    <div className="relative">
                                        <div className="size-20 rounded-2xl bg-cover bg-center ring-4 ring-[#2a1d15] shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIX1wAYBAaj5E3ZSRIlI5IPaunhWNdzmIwF7-7p1gL_GDonD1nu-64KLjLpSPdZTVgljRLZnXwvmCxExZiHo0M0herxixGJXSTWUUAwUfcER7CvEaSojHMw584hz6DQinjDLJ3ybtst0uHqmfgErVEQADCAch_-XcX66M40huD5lbsnGQgpcJJL27uK7XbMfy9toGEIHhCHmzH89TomH2nGCh8_diALS3wNYS029XSURlHuNngihv2mo_HfP7QfP_804f4760TbQE")' }}></div>
                                        <div className="absolute -bottom-2 -right-2 size-8 bg-primary rounded-xl flex items-center justify-center border-4 border-[#2a1d15] shadow-lg">
                                            <span className="material-symbols-outlined text-[18px] text-[#231810] font-black">person_add</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-white font-black text-xl hover:text-primary cursor-pointer transition-colors tracking-tight">Michael Chen</h3>
                                        <p className="text-text-secondary text-sm mt-1 mb-3 font-medium">34 bạn chung</p>
                                        <div className="hidden sm:flex items-center gap-2 text-xs text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full w-fit">
                                            <span className="material-symbols-outlined text-[16px]">school</span>
                                            Cựu sinh viên UCLA
                                        </div>
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none bg-primary hover:bg-orange-600 text-[#231810] font-black text-sm px-8 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 uppercase tracking-widest">
                                            Chấp nhận
                                        </button>
                                        <button className="flex-1 sm:flex-none bg-[#342418] hover:bg-red-500/20 hover:text-red-500 text-white font-bold text-sm px-8 py-3 rounded-xl transition-all border border-white/5">
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                                {/* Request Item 2 */}
                                <div className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-[#342418]/50 transition-colors group">
                                    <div className="relative">
                                        <div className="size-20 rounded-2xl bg-cover bg-center ring-4 ring-[#2a1d15] shadow-2xl -rotate-3 group-hover:rotate-0 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM")' }}></div>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-white font-black text-xl hover:text-primary cursor-pointer transition-colors tracking-tight">Sarah Williams</h3>
                                        <p className="text-text-secondary text-sm mt-1 mb-3 font-medium">8 bạn chung</p>
                                        <div className="hidden sm:flex items-center gap-2 text-xs text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full w-fit">
                                            <span className="material-symbols-outlined text-[16px]">work</span>
                                            Nhà thiết kế tại Creative Co.
                                        </div>
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none bg-primary hover:bg-orange-600 text-[#231810] font-black text-sm px-8 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/10 uppercase tracking-widest">
                                            Chấp nhận
                                        </button>
                                        <button className="flex-1 sm:flex-none bg-[#342418] hover:bg-red-500/20 hover:text-red-500 text-white font-bold text-sm px-8 py-3 rounded-xl transition-all border border-white/5">
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="py-10 text-center bg-[#1a120b] border border-[#3e2b1d] rounded-[3rem] border-dashed border-2">
                            <div className="size-20 rounded-full bg-[#342418] flex items-center justify-center mx-auto mb-5 text-text-secondary/30">
                                <span className="material-symbols-outlined text-4xl">group_add</span>
                            </div>
                            <h3 className="text-white font-black text-xl mb-2">Tìm kiếm thêm bạn mới?</h3>
                            <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto font-medium">Khám phá danh sách gợi ý của chúng tôi để mở rộng vòng kết nối của bạn.</p>
                            <button className="px-10 py-3.5 rounded-full bg-primary hover:bg-orange-600 text-[#231810] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-orange-500/10">
                                Xem gợi ý ngay
                            </button>
                        </section>
                    </div>
                </div>
            </main>

            <RightSidebar />
        </div>
    );
}
