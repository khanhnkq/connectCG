import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

export default function FriendList() {
    const friendList = [
        { name: 'Sarah', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFnbIOg359_IruqeJZR2XF_Z9o0ttAo63JvDFovmYNSKdvPDsjabpqB7jFC2UUE6tzEncOSivvm1W5vNt9KxVCVPm7pn8OrwN7RLmHA4OMIo36hL-88I-wXa9YN61Vi-X20nAg7gI-1QfF28jrI8oV5TGX_X32VjN7POtm_CtBB9DkdWcNvsqgkBEwNZFhOLngZBuNQA5Z5pU-fGIhAf3z355mdR5RIij1VsmKLkaqcqcd87735upuE6OE5UqM8bI3FCXkrTk4agw', mutual: 12, role: 'Designer' },
        { name: 'Marcus', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuHYpNqBoJZ6H3wxyG6OtCnMMVU4FTUngw6LYZy4SgjA0mY2sYsDcePdMS10ev3_M8tw950TFDzIey60zy_0YaYchnCYNkI1EFXtTTC7THk5zGBor8yBtMr-aAf8sbShLZVQv8CQzSm5kNH7EvWmKXyi1RIv1DxZa3HFHT34tseJeUcKe6h6lFC6Ar26xYdz8DghOGsPL3pKrXSb5Jj3_uULvl0M_QzCz6myNZnocquEnyZkGrndeht0XMB4Yrsu9Is2B6nJ3Mi9M', mutual: 8, role: 'Developer' },
        { name: 'Emma', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0', mutual: 5, role: 'Product Manager' },
        { name: 'James', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g', mutual: 24, role: 'Artist' },
        { name: 'Sophia', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y', mutual: 16, role: 'Writer' },
        { name: 'David', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfCl1X2bsOD2anKofpFDzckD9z_a3CDOQqg1A1-nnzE0ALZhx8h2sNsn_PdV7-P6oEpg0XRttDsHUQJwA2Aa3MdUW6FIzwdzYDOxxjZFF7_x9QBl_cJ0NvpSwm_LFGlB5Yi4n9ksqFEjuIaIuQTyLOghyL8b2P7JdZiE9YN9aMocc7VfC_uvu-UaLuLtbGD9_5Kropk3H3Na2Of1n_kfzDW9PvINieVznAqTbyDeohff0qGU0J5IQTasq56bubbiAsxjbHlaBRaZ4', mutual: 3, role: 'Student' },
        { name: 'Michael', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIX1wAYBAaj5E3ZSRIlI5IPaunhWNdzmIwF7-7p1gL_GDonD1nu-64KLjLpSPdZTVgljRLZnXwvmCxExZiHo0M0herxixGJXSTWUUAwUfcER7CvEaSojHMw584hz6DQinjDLJ3ybtst0uHqmfgErVEQADCAch_-XcX66M40huD5lbsnGQgpcJJL27uK7XbMfy9toGEIHhCHmzH89TomH2nGCh8_diALS3wNYS029XSURlHuNngihv2mo_HfP7QfP_804f4760TbQE', mutual: 45, role: 'Engineer' },
        { name: 'Olivia', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM', mutual: 2, role: 'Consultant' }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                <div className="w-full mx-auto pb-20">
                    <div className="bg-[#342418] border-b border-[#3e2b1d]">
                        <div className="w-full max-w-6xl mx-auto">
                            <div className="relative w-full h-64 md:h-80 lg:h-96 group overflow-hidden rounded-b-3xl">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                                    <span className="material-symbols-outlined text-lg">camera_alt</span>
                                    <span className="hidden sm:inline">Edit Cover Photo</span>
                                </button>
                            </div>
                            <div className="px-4 md:px-8 pb-4 relative">
                                <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-12 gap-6 relative z-10 mb-6">
                                    <div className="relative shrink-0">
                                        <div className="size-32 md:size-44 rounded-full border-4 border-[#342418] bg-[#221710] p-1 shadow-2xl">
                                            <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw")' }}></div>
                                        </div>
                                        <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 size-5 md:size-6 bg-green-500 border-4 border-[#342418] rounded-full" title="Online"></div>
                                    </div>
                                    <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                        <div className="mb-2 md:mb-4">
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">Alex Doe</h1>
                                            <p className="text-text-secondary font-medium text-sm flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                                Online Now
                                                <span className="text-text-secondary/50">•</span>
                                                <span className="text-text-secondary/80">San Francisco, CA</span>
                                            </p>
                                            <div className="flex gap-4 mt-3 text-sm text-text-secondary">
                                                <span><strong className="text-white">1.2k</strong> Friends</span>
                                                <span><strong className="text-white">450</strong> Photos</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mb-4 w-full md:w-auto">
                                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                                Edit Profile
                                            </button>
                                            <button className="flex items-center justify-center gap-2 bg-[#493222] hover:bg-[#5c402d] text-white font-bold px-4 py-3 rounded-xl transition-all">
                                                <span className="material-symbols-outlined">more_horiz</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 overflow-x-auto pb-1 border-t border-[#493222] pt-2 scrollbar-hide">
                                    <Link to="/dashboard/profile/view" className="px-6 py-3 text-text-secondary hover:text-white font-semibold hover:bg-[#493222]/50 rounded-t-lg transition-colors whitespace-nowrap">Timeline</Link>
                                    <a href="#" className="px-6 py-3 text-text-secondary hover:text-white font-semibold hover:bg-[#493222]/50 rounded-t-lg transition-colors whitespace-nowrap">About</a>
                                    <Link to="#" className="px-6 py-3 text-primary font-bold border-b-2 border-primary transition-colors whitespace-nowrap">Friends</Link>
                                    <a href="#" className="px-6 py-3 text-text-secondary hover:text-white font-semibold hover:bg-[#493222]/50 rounded-t-lg transition-colors whitespace-nowrap">Photos</a>
                                    <a href="#" className="px-6 py-3 text-text-secondary hover:text-white font-semibold hover:bg-[#493222]/50 rounded-t-lg transition-colors whitespace-nowrap">Videos</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mt-8">
                        <div className="bg-[#342418] rounded-2xl border border-[#3e2b1d] p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-white font-bold text-xl">Friends</h2>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary text-lg">search</span>
                                        <input type="text" placeholder="Search friends..." className="bg-[#221710] border border-[#493222] text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-primary w-64 shadow-inner" />
                                    </div>
                                    <button className="text-sm font-bold text-primary hover:text-white transition-colors">Find Requests</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {friendList.map((friend, index) => (
                                    <div key={index} className="bg-[#2a1d15] border border-[#3e2b1d] rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors group">
                                        <div className="relative">
                                            <div className="size-20 rounded-full bg-cover bg-center ring-4 ring-[#342418] group-hover:ring-primary/20 transition-all" style={{ backgroundImage: `url("${friend.avatar}")` }}></div>
                                            <div className="absolute bottom-0 right-0 size-5 bg-green-500 border-4 border-[#2a1d15] rounded-full"></div>
                                        </div>
                                        <div className="text-center w-full">
                                            <h3 className="text-white font-bold text-base truncate">{friend.name}</h3>
                                            <p className="text-text-secondary text-xs">{friend.role}</p>
                                            <p className="text-text-secondary text-xs mt-1">{friend.mutual} mutual friends</p>
                                        </div>
                                        <div className="flex gap-2 w-full mt-2">
                                            <button className="flex-1 bg-primary/10 hover:bg-primary text-primary hover:text-[#231810] font-bold text-xs py-2 rounded-lg transition-all">
                                                Message
                                            </button>
                                            <button className="bg-[#342418] hover:bg-red-500/20 text-text-secondary hover:text-red-500 p-2 rounded-lg transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">person_remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
