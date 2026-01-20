import Sidebar from '../../components/layout/Sidebar';
import PostCard from '../../components/feed/PostCard';

export default function UserProfile() {
    const photos = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDIX1wAYBAaj5E3ZSRIlI5IPaunhWNdzmIwF7-7p1gL_GDonD1nu-64KLjLpSPdZTVgljRLZnXwvmCxExZiHo0M0herxixGJXSTWUUAwUfcER7CvEaSojHMw584hz6DQinjDLJ3ybtst0uHqmfgErVEQADCAch_-XcX66M40huD5lbsnGQgpcJJL27uK7XbMfy9toGEIHhCHmzH89TomH2nGCh8_diALS3wNYS029XSURlHuNngihv2mo_HfP7QfP_804f4760TbQE',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCfCl1X2bsOD2anKofpFDzckD9z_a3CDOQqg1A1-nnzE0ALZhx8h2sNsn_PdV7-P6oEpg0XRttDsHUQJwA2Aa3MdUW6FIzwdzYDOxxjZFF7_x9QBl_cJ0NvpSwm_LFGlB5Yi4n9ksqFEjuIaIuQTyLOghyL8b2P7JdZiE9YN9aMocc7VfC_uvu-UaLuLtbGD9_5Kropk3H3Na2Of1n_kfzDW9PvINieVznAqTbyDeohff0qGU0J5IQTasq56bubbiAsxjbHlaBRaZ4',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDJPlnDjBjXuixfttGBOr0_Jx2ZLTctMTrGw14hx9On0XfJumO9xm9cOekOU2h2N4DYnbdA2kJqNkj1La7ogr0YwtHbWZbBTN2f4jz2tMaZ4MysYtOwrJh9nwBn3ooj5LQfIAwf-a0pq9vR24ScthQGYkC_nY1vIxbb6OW1ySd-C8q1C-EFoeCLGB47y8OGHnKoiwdLpB3Jgft_uYAPe6-xAq52AMh9kmGduf6uAp8MOpDKV3ZUqpAElRvG46XdK09BKNQRomKVHFo',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC5XMIpiqrD96rbcu3BjxqHOkpiTb_uUr6zVOzb3_EuEuyT7BKqTEpoqxuP4Q5_KQvP60A_2VSvikFgb-T6dHDeoW_JBguXbEb2aBZWpYU2ZHqnq9-UbMsPrpz9nuSS5PoGtucwsXXNpETlS5qomt4Lt5QiBEH-IIExc6OiETtXvtpKy0BwNQlgjk1GYSXjtSmGV42SJAbFmDxmcSZYbOTUNXQk7EwH1M2sDDKY33EOblUP98AmvedKaka_lnog0uPtQE6vFnDMUuk',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBuHYpNqBoJZ6H3wxyG6OtCnMMVU4FTUngw6LYZy4SgjA0mY2sYsDcePdMS10ev3_M8tw950TFDzIey60zy_0YaYchnCYNkI1EFXtTTC7THk5zGBor8yBtMr-aAf8sbShLZVQv8CQzSm5kNH7EvWmKXyi1RIv1DxZa3HFHT34tseJeUcKe6h6lFC6Ar26xYdz8DghOGsPL3pKrXSb5Jj3_uULvl0M_QzCz6myNZnocquEnyZkGrndeht0XMB4Yrsu9Is2B6nJ3Mi9M'
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                <div className="w-full mx-auto pb-20">
                    {/* Header/Cover */}
                    <div className="bg-[#342418] border-b border-[#3e2b1d]">
                        <div className="w-full max-w-6xl mx-auto">
                            <div className="relative w-full h-64 md:h-80 lg:h-96 group overflow-hidden rounded-b-3xl">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
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
                                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5">
                                                <span className="material-symbols-outlined text-[20px]">mail</span>
                                                Message
                                            </button>
                                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#493222] hover:bg-primary/20 text-primary hover:text-white border border-primary/30 hover:border-primary font-bold px-4 py-3 rounded-xl transition-all hover:-translate-y-0.5">
                                                <span className="material-symbols-outlined text-[20px]">redeem</span>
                                                Send Gift
                                            </button>
                                            <button className="flex items-center justify-center gap-2 bg-[#493222] hover:bg-[#5c402d] text-white hover:text-red-500 font-bold px-4 py-3 rounded-xl transition-all group">
                                                <span className="material-symbols-outlined icon-outline group-hover:font-variation-settings-filled text-[24px]">favorite</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 overflow-x-auto pb-1 border-t border-[#493222] pt-2 scrollbar-hide">
                                    <a href="#" className="px-6 py-3 text-primary font-bold border-b-2 border-primary transition-colors whitespace-nowrap">Timeline</a>
                                    <a href="#" className="px-6 py-3 text-text-secondary hover:text-white font-semibold hover:bg-[#493222]/50 rounded-t-lg transition-colors whitespace-nowrap">About</a>
                                    <a href="#" className="px-6 py-3 text-text-secondary hover:text-white font-semibold hover:bg-[#493222]/50 rounded-t-lg transition-colors whitespace-nowrap">Photos</a>
                                    <a href="#" className="px-6 py-3 text-text-secondary hover:text-white font-semibold hover:bg-[#493222]/50 rounded-t-lg transition-colors whitespace-nowrap">Videos</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Column (About & Photos) */}
                            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                                <div className="bg-[#342418] rounded-2xl border border-[#3e2b1d] p-5 shadow-sm">
                                    <h3 className="text-white font-bold text-lg mb-4">About</h3>
                                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                                        Digital nomad, coffee enthusiast, and amateur photographer. Loving life one pixel at a time! 📸 ☕️
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 text-text-secondary text-sm">
                                            <span className="material-symbols-outlined text-[20px]">cake</span>
                                            <span>Born <strong>October 24, 1995</strong></span>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-secondary text-sm">
                                            <span className="material-symbols-outlined text-[20px]">work</span>
                                            <span>Designer at <strong>Creative Studio</strong></span>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-secondary text-sm">
                                            <span className="material-symbols-outlined text-[20px]">favorite</span>
                                            <span>Single</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-secondary text-sm">
                                            <span className="material-symbols-outlined text-[20px]">location_on</span>
                                            <span>Lives in <strong>San Francisco</strong></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#342418] rounded-2xl border border-[#3e2b1d] p-5 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-white font-bold text-lg">Photos</h3>
                                        <a href="#" className="text-primary text-sm font-bold hover:underline">See all</a>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                                        {photos.slice(0, 9).map((photo, index) => (
                                            <div key={index} className="aspect-square bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundImage: `url("${photo}")` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Posts) */}
                            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                                <div className="flex items-center justify-between bg-[#342418] p-3 px-5 rounded-2xl border border-[#3e2b1d]">
                                    <h2 className="text-white font-bold text-lg">Posts</h2>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-1 bg-[#493222] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#5c402d] transition-colors">
                                            <span className="material-symbols-outlined text-[16px]">tune</span>
                                            Filters
                                        </button>
                                    </div>
                                </div>

                                <PostCard
                                    author={{ name: 'Alex Doe', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw' }}
                                    time="Just now"
                                    content='Updated my cover photo! 🗼 Had such an amazing time in Tokyo last month. Already missing the sushi and the neon lights. <a href="#" className="text-primary hover:underline font-medium ml-1">#Travel</a> <a href="#" className="text-primary hover:underline font-medium">#Japan</a> <a href="#" className="text-primary hover:underline font-medium">#Memories</a>'
                                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM"
                                    stats={{ likes: 84, comments: 12, shares: 3 }}
                                />

                                <PostCard
                                    author={{ name: 'Alex Doe', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw' }}
                                    time="Yesterday at 8:30 PM"
                                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuDIX1wAYBAaj5E3ZSRIlI5IPaunhWNdzmIwF7-7p1gL_GDonD1nu-64KLjLpSPdZTVgljRLZnXwvmCxExZiHo0M0herxixGJXSTWUUAwUfcER7CvEaSojHMw584hz6DQinjDLJ3ybtst0uHqmfgErVEQADCAch_-XcX66M40huD5lbsnGQgpcJJL27uK7XbMfy9toGEIHhCHmzH89TomH2nGCh8_diALS3wNYS029XSURlHuNngihv2mo_HfP7QfP_804f4760TbQE"
                                    stats={{ likes: 32, comments: 5, shares: 0 }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-2xl">☕️</span>
                                        <span className="text-white font-bold">Life Event: Found a new favorite coffee spot!</span>
                                    </div>
                                    <p className="text-white text-lg font-medium leading-relaxed">
                                        Seriously, the atmosphere here is unmatched. It's so quiet and perfect for working on my design portfolio. If you're in the area, you have to try their cold brew.
                                    </p>
                                </PostCard>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
