export default function RightSidebar() {
    const suggestedMatches = [
        { name: 'Emma W.', relation: 'Mutual friend', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0' },
        { name: 'James L.', relation: 'New user', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g' },
        { name: 'Sophia M.', relation: 'Nearby', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y' }
    ];

    const activeNow = [
        { name: 'David Kim', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfCl1X2bsOD2anKofpFDzckD9z_a3CDOQqg1A1-nnzE0ALZhx8h2sNsn_PdV7-P6oEpg0XRttDsHUQJwA2Aa3MdUW6FIzwdzYDOxxjZFF7_x9QBl_cJ0NvpSwm_LFGlB5Yi4n9ksqFEjuIaIuQTyLOghyL8b2P7JdZiE9YN9aMocc7VfC_uvu-UaLuLtbGD9_5Kropk3H3Na2Of1n_kfzDW9PvINieVznAqTbyDeohff0qGU0J5IQTasq56bubbiAsxjbHlaBRaZ4' },
        { name: 'Lisa Ray', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJPlnDjBjXuixfttGBOr0_Jx2ZLTctMTrGw14hx9On0XfJumO9xm9cOekOU2h2N4DYnbdA2kJqNkj1La7ogr0YwtHbWZbBTN2f4jz2tMaZ4MysYtOwrJh9nwBn3ooj5LQfIAwf-a0pq9vR24ScthQGYkC_nY1vIxbb6OW1ySd-C8q1C-EFoeCLGB47y8OGHnKoiwdLpB3Jgft_uYAPe6-xAq52AMh9kmGduf6uAp8MOpDKV3ZUqpAElRvG46XdK09BKNQRomKVHFo' },
        { name: 'Michael B.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5XMIpiqrD96rbcu3BjxqHOkpiTb_uUr6zVOzb3_EuEuyT7BKqTEpoqxuP4Q5_KQvP60A_2VSvikFgb-T6dHDeoW_JBguXbEb2aBZWpYU2ZHqnq9-UbMsPrpz9nuSS5PoGtucwsXXNpETlS5qomt4Lt5QiBEH-IIExc6OiETtXvtpKy0BwNQlgjk1GYSXjtSmGV42SJAbFmDxmcSZYbOTUNXQk7EwH1M2sDDKY33EOblUP98AmvedKaka_lnog0uPtQE6vFnDMUuk' }
    ];

    return (
        <aside className="w-80 hidden xl:flex flex-col border-l border-[#342418] bg-background-dark p-6 h-full overflow-y-auto shrink-0 z-20">
            <div className="mb-8 group">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors">search</span>
                    </div>
                    <input className="block w-full pl-12 pr-4 py-3.5 border-none rounded-2xl leading-5 bg-[#342418] text-white placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:bg-[#3e2b1d] transition-all sm:text-sm font-medium" placeholder="Search friends, posts..." type="text" />
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-white font-bold text-base tracking-wide">Suggested Matches</h3>
                    <a href="#" className="text-primary text-xs font-bold hover:underline tracking-wide">See all</a>
                </div>
                <div className="flex flex-col gap-5">
                    {suggestedMatches.map((match, index) => (
                        <div key={index} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="size-11 rounded-full bg-cover bg-center border border-transparent group-hover:border-primary transition-all" style={{ backgroundImage: `url("${match.avatar}")` }}></div>
                                <div className="flex flex-col">
                                    <span className="text-white text-sm font-bold group-hover:text-primary transition-colors cursor-pointer">{match.name}</span>
                                    <span className="text-text-secondary text-xs">{match.relation}</span>
                                </div>
                            </div>
                            <button className="size-9 rounded-full bg-[#493222] hover:bg-primary hover:text-[#231810] flex items-center justify-center text-primary transition-all shadow-md">
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-white font-bold text-base tracking-wide">Active Now</h3>
                    <span className="bg-[#342418] text-text-secondary text-xs font-bold px-2.5 py-1 rounded-full">12</span>
                </div>
                <div className="flex flex-col gap-2">
                    {activeNow.map((friend, index) => (
                        <div key={index} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#342418] cursor-pointer transition-colors group">
                            <div className="relative">
                                <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary/50 transition-all" style={{ backgroundImage: `url("${friend.avatar}")` }}></div>
                                <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-dark"></div>
                            </div>
                            <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{friend.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
