import Sidebar from '../../components/layout/Sidebar';

export default function ChatInterface() {
    const conversations = [
        { id: 1, name: 'Sarah Jenkins', time: 'Now', message: "That sounds amazing! Let's go!", avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFnbIOg359_IruqeJZR2XF_Z9o0ttAo63JvDFovmYNSKdvPDsjabpqB7jFC2UUE6tzEncOSivvm1W5vNt9KxVCVPm7pn8OrwN7RLmHA4OMIo36hL-88I-wXa9YN61Vi-X20nAg7gI-1QfF28jrI8oV5TGX_X32VjN7POtm_CtBB9DkdWcNvsqgkBEwNZFhOLngZBuNQA5Z5pU-fGIhAf3z355mdR5RIij1VsmKLkaqcqcd87735upuE6OE5UqM8bI3FCXkrTk4agw', online: true, active: true },
        { id: 2, name: 'Marcus Chen', time: '2h', message: 'Thanks for the tip about Tokyo!', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuHYpNqBoJZ6H3wxyG6OtCnMMVU4FTUngw6LYZy4SgjA0mY2sYsDcePdMS10ev3_M8tw950TFDzIey60zy_0YaYchnCYNkI1EFXtTTC7THk5zGBor8yBtMr-aAf8sbShLZVQv8CQzSm5kNH7EvWmKXyi1RIv1DxZa3HFHT34tseJeUcKe6h6lFC6Ar26xYdz8DghOGsPL3pKrXSb5Jj3_uULvl0M_QzCz6myNZnocquEnyZkGrndeht0XMB4Yrsu9Is2B6nJ3Mi9M', online: false, active: false },
        { id: 3, name: 'Emma W.', time: '5h', message: 'Are you free this weekend?', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0', online: true, active: false, unread: true },
        { id: 4, name: 'Sophia M.', time: '1d', message: 'Liked your photo', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y', online: false, active: false }
    ];

    const messages = [
        { type: 'received', text: 'Hey Alex! I saw your post about the new cafe. It looks super cozy! ☕️', time: '10:42 AM' },
        { type: 'sent', text: "Hi Sarah! Yes, it's absolutely fantastic. The ambiance is perfect for working or just chilling.", time: '10:45 AM', read: true },
        { type: 'sent', text: 'You should definitely check it out sometime!', time: '10:45 AM', read: true },
        { type: 'received', text: "That sounds amazing! I'm actually free this Friday evening if you want to grab a coffee? 👀", time: '10:48 AM', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIX1wAYBAaj5E3ZSRIlI5IPaunhWNdzmIwF7-7p1gL_GDonD1nu-64KLjLpSPdZTVgljRLZnXwvmCxExZiHo0M0herxixGJXSTWUUAwUfcER7CvEaSojHMw584hz6DQinjDLJ3ybtst0uHqmfgErVEQADCAch_-XcX66M40huD5lbsnGQgpcJJL27uK7XbMfy9toGEIHhCHmzH89TomH2nGCh8_diALS3wNYS029XSURlHuNngihv2mo_HfP7QfP_804f4760TbQE' },
        { type: 'sent', text: "That sounds amazing! Let's go! Friday works for me.", time: 'Just now', read: false }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            <main className="flex-1 h-full flex overflow-hidden bg-chat-bg relative">
                {/* Conversations List */}
                <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-[#3A2A20] bg-background-dark z-10 shrink-0">
                    <div className="p-5 border-b border-[#3A2A20] flex justify-between items-center bg-background-dark/95 backdrop-blur-md sticky top-0 z-10">
                        <h2 className="text-xl font-extrabold text-white tracking-tight">Messages</h2>
                        <button className="size-9 rounded-full bg-[#3A2A20] hover:bg-primary hover:text-[#231810] flex items-center justify-center text-primary transition-all shadow-md">
                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                        </button>
                    </div>
                    <div className="px-5 py-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-text-secondary text-[20px] group-focus-within:text-primary transition-colors">search</span>
                            </div>
                            <input className="block w-full pl-10 pr-4 py-3 border border-[#3A2A20] rounded-xl bg-[#2A1D15] text-white placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium" placeholder="Search conversations..." type="text" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                        {conversations.map((conv) => (
                            <div key={conv.id} className={`p-3 rounded-xl cursor-pointer relative group flex gap-3 items-center shadow-lg transition-colors ${conv.active ? 'bg-[#3A2A20] border border-[#493222] shadow-black/20' : 'hover:bg-[#2A1D15] border border-transparent'}`}>
                                <div className="relative shrink-0">
                                    <div className="size-12 rounded-full bg-cover bg-center group-hover:ring-2 ring-primary/30 transition-all" style={{ backgroundImage: `url("${conv.avatar}")` }}></div>
                                    {conv.online && <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#3A2A20]"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={`font-bold text-sm truncate ${conv.active ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>{conv.name}</h3>
                                        <span className={`${conv.active ? 'text-primary font-medium' : 'text-text-secondary'} text-[11px]`}>{conv.time}</span>
                                    </div>
                                    <p className={`${conv.active ? 'text-white' : 'text-text-secondary group-hover:text-gray-300'} text-xs truncate ${conv.unread ? 'font-bold text-white' : 'font-medium'}`}>{conv.message}</p>
                                </div>
                                {conv.unreads && <div className="size-2 rounded-full bg-primary shrink-0 mr-1"></div>}
                                {conv.active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-xl"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="hidden md:flex flex-1 flex-col bg-chat-bg relative">
                    <div className="h-20 px-6 border-b border-[#3A2A20] flex justify-between items-center bg-[#1A120B]/90 backdrop-blur-md z-10 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-[#3A2A20]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFnbIOg359_IruqeJZR2XF_Z9o0ttAo63JvDFovmYNSKdvPDsjabpqB7jFC2UUE6tzEncOSivvm1W5vNt9KxVCVPm7pn8OrwN7RLmHA4OMIo36hL-88I-wXa9YN61Vi-X20nAg7gI-1QfF28jrI8oV5TGX_X32VjN7POtm_CtBB9DkdWcNvsqgkBEwNZFhOLngZBuNQA5Z5pU-fGIhAf3z355mdR5RIij1VsmKLkaqcqcd87735upuE6OE5UqM8bI3FCXkrTk4agw")' }}></div>
                                <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-[#1A120B]"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base flex items-center gap-2">
                                    Sarah Jenkins
                                    <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold border border-primary/20">Match</span>
                                </h3>
                                <p className="text-text-secondary text-xs flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Active now
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 text-text-secondary">
                            <button className="size-10 rounded-full hover:bg-[#3A2A20] hover:text-primary flex items-center justify-center transition-all">
                                <span className="material-symbols-outlined">call</span>
                            </button>
                            <button className="size-10 rounded-full hover:bg-[#3A2A20] hover:text-primary flex items-center justify-center transition-all">
                                <span className="material-symbols-outlined">videocam</span>
                            </button>
                            <button className="size-10 rounded-full hover:bg-[#3A2A20] hover:text-white flex items-center justify-center transition-all xl:hidden">
                                <span className="material-symbols-outlined">info</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth">
                        <div className="flex justify-center">
                            <span className="text-text-secondary text-[11px] font-bold bg-[#2A1D15] px-4 py-1.5 rounded-full uppercase tracking-wide border border-[#3A2A20]">Today</span>
                        </div>

                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-3 max-w-[80%] ${msg.type === 'sent' ? 'self-end justify-end' : ''}`}>
                                {msg.type === 'received' && (
                                    <div className="size-8 rounded-full bg-cover bg-center shrink-0 self-end mb-1 ring-1 ring-[#3A2A20]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFnbIOg359_IruqeJZR2XF_Z9o0ttAo63JvDFovmYNSKdvPDsjabpqB7jFC2UUE6tzEncOSivvm1W5vNt9KxVCVPm7pn8OrwN7RLmHA4OMIo36hL-88I-wXa9YN61Vi-X20nAg7gI-1QfF28jrI8oV5TGX_X32VjN7POtm_CtBB9DkdWcNvsqgkBEwNZFhOLngZBuNQA5Z5pU-fGIhAf3z355mdR5RIij1VsmKLkaqcqcd87735upuE6OE5UqM8bI3FCXkrTk4agw")' }}></div>
                                )}
                                <div className={`flex flex-col gap-1 ${msg.type === 'sent' ? 'items-end' : ''}`}>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'sent' ? 'bg-bubble-sent rounded-br-none text-[#231810] font-semibold shadow-orange-500/10' : 'bg-bubble-received rounded-bl-none text-white'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                    {msg.image && (
                                        <div className="bg-bubble-received p-2 rounded-2xl rounded-tl-none overflow-hidden w-64 mt-1">
                                            <div className="bg-cover bg-center h-32 w-full rounded-xl transform hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${msg.image}")` }}></div>
                                        </div>
                                    )}
                                    <div className={`flex items-center gap-1 text-text-secondary text-[10px] ${msg.type === 'received' ? 'ml-1' : 'mr-1'}`}>
                                        <span>{msg.time}</span>
                                        {msg.type === 'sent' && (
                                            <span className={`material-symbols-outlined text-[12px] ${msg.read ? 'text-primary' : ''}`}>{msg.read ? 'done_all' : 'done'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 px-6 bg-[#1A120B] border-t border-[#3A2A20]">
                        <div className="flex gap-3 items-end">
                            <button className="p-3 text-text-secondary hover:text-white hover:bg-[#3A2A20] rounded-full transition-colors flex-shrink-0">
                                <span className="material-symbols-outlined">add_circle</span>
                            </button>
                            <div className="flex-1 bg-[#2A1D15] border border-[#3A2A20] rounded-3xl flex items-center px-4 py-1.5 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                                <input className="bg-transparent border-none text-white placeholder-text-secondary/50 focus:ring-0 w-full py-2.5 text-sm" placeholder="Type a message..." type="text" />
                                <button className="text-text-secondary hover:text-primary p-1.5 rounded-full transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">mood</span>
                                </button>
                            </div>
                            <button className="hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-[#231810] transition-all group shadow-sm shadow-orange-900/20 flex-shrink-0">
                                <span className="material-symbols-outlined text-[20px] group-hover:animate-bounce">redeem</span>
                                <span className="text-sm font-bold">Gift</span>
                            </button>
                            <button className="p-3.5 bg-primary hover:bg-orange-600 text-[#231810] rounded-full shadow-lg shadow-orange-500/20 transition-all hover:scale-105 flex-shrink-0">
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Conversation Details */}
                <aside className="hidden xl:flex w-80 flex-col border-l border-[#3A2A20] bg-background-dark overflow-y-auto shrink-0 z-20">
                    <div className="p-8 flex flex-col items-center border-b border-[#3A2A20]">
                        <div className="size-24 rounded-full bg-cover bg-center ring-4 ring-[#2A1D15] mb-4 shadow-xl" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFnbIOg359_IruqeJZR2XF_Z9o0ttAo63JvDFovmYNSKdvPDsjabpqB7jFC2UUE6tzEncOSivvm1W5vNt9KxVCVPm7pn8OrwN7RLmHA4OMIo36hL-88I-wXa9YN61Vi-X20nAg7gI-1QfF28jrI8oV5TGX_X32VjN7POtm_CtBB9DkdWcNvsqgkBEwNZFhOLngZBuNQA5Z5pU-fGIhAf3z355mdR5RIij1VsmKLkaqcqcd87735upuE6OE5UqM8bI3FCXkrTk4agw")' }}></div>
                        <h2 className="text-white text-xl font-extrabold mb-1">Sarah Jenkins</h2>
                        <p className="text-text-secondary text-sm mb-4">@sarah_j • New York, NY</p>
                        <div className="flex gap-3 w-full justify-center">
                            <button className="flex flex-col items-center gap-1 group">
                                <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-primary group-hover:text-[#231810] flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-primary transition-colors">Profile</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 group">
                                <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-primary group-hover:text-[#231810] flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                                    <span className="material-symbols-outlined">notifications_off</span>
                                </div>
                                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-primary transition-colors">Mute</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 group">
                                <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-red-500 group-hover:text-white flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                                    <span className="material-symbols-outlined">block</span>
                                </div>
                                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-red-500 transition-colors">Block</span>
                            </button>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white text-sm font-bold uppercase tracking-wide">Shared Media</h3>
                            <button className="text-primary text-xs font-bold hover:underline">See All</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuDIX1wAYBAaj5E3ZSRIlI5IPaunhWNdzmIwF7-7p1gL_GDonD1nu-64KLjLpSPdZTVgljRLZnXwvmCxExZiHo0M0herxixGJXSTWUUAwUfcER7CvEaSojHMw584hz6DQinjDLJ3ybtst0uHqmfgErVEQADCAch_-XcX66M40huD5lbsnGQgpcJJL27uK7XbMfy9toGEIHhCHmzH89TomH2nGCh8_diALS3wNYS029XSURlHuNngihv2mo_HfP7QfP_804f4760TbQE',
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM',
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw',
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuC4UKPEvyLmJB2T_0cHwdqw-m6rRaeCijIyofpi2tDwAbXp7LCHbhxcxpYXmKGhk7S5X-znhu3DxgZbYXXJDgRlF-KCkS3Eb8j_VRTjkNj03tosJXVj4vrqlfQXE13u4scgadmpL_IcqFWg-P_jdepWlBXre7vyGiKNwfohBKWmUbXHIapGMciMuI81qrJPcCndZuV0UEbYBDhEdSocpCwfv4jdV3q5YDH6aIxKIKhKe4w_D1Yu_z0potLBShRqwr7rRsTI2D7pK7g'
                            ].map((img, i) => (
                                <div key={i} className="aspect-square bg-cover bg-center rounded-xl cursor-pointer hover:opacity-80 transition-opacity border border-[#3A2A20]" style={{ backgroundImage: `url("${img}")` }}></div>
                            ))}
                            <div className="aspect-square bg-[#2A1D15] rounded-xl flex items-center justify-center text-text-secondary hover:text-white cursor-pointer transition-colors border border-[#3A2A20]">
                                <span className="text-xs font-bold">+12</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t border-[#3A2A20]">
                        <h3 className="text-white text-sm font-bold uppercase tracking-wide mb-3">Privacy & Support</h3>
                        <div className="flex flex-col gap-2">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2A1D15] hover:bg-[#3A2A20] border border-[#3A2A20] group transition-colors text-left">
                                <div className="flex items-center gap-3 text-text-secondary group-hover:text-white">
                                    <span className="material-symbols-outlined">lock</span>
                                    <span className="text-sm font-medium">Encryption</span>
                                </div>
                                <span className="material-symbols-outlined text-text-secondary text-[16px]">chevron_right</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2A1D15] hover:bg-[#3A2A20] border border-[#3A2A20] group transition-colors text-left">
                                <div className="flex items-center gap-3 text-text-secondary group-hover:text-white">
                                    <span className="material-symbols-outlined">report</span>
                                    <span className="text-sm font-medium">Report</span>
                                </div>
                                <span className="material-symbols-outlined text-text-secondary text-[16px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
