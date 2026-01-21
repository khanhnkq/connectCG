import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="bg-background-dark text-white font-display antialiased w-full overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-[#1A120B]/90 backdrop-blur-md border-b border-white/5 transition-all">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-4xl">diversity_3</span>
                        <span className="text-xl font-extrabold tracking-tight">Connect<span className="text-primary">.</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-bold text-gray-300 hover:text-white transition-colors" href="#">Our Story</a>
                        <a className="text-sm font-bold text-gray-300 hover:text-white transition-colors" href="#">Community</a>
                        <a className="text-sm font-bold text-gray-300 hover:text-white transition-colors" href="#">Safety</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="hidden sm:block text-white hover:text-primary font-bold px-5 py-2.5 transition-colors text-sm border border-primary/30 hover:border-primary rounded-full">
                            Member Log In
                        </Link>
                        <Link to="/registration/step-1" className="bg-primary hover:bg-orange-600 text-[#1A120B] font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-orange-500/20 text-sm hover:scale-105 active:scale-95">
                            Join Community
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Group of diverse people connecting"
                        className="w-full h-full object-cover object-center opacity-70"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhcShxtS0XBI7jv54oz8BZHYnYJHTux8aUkOpW2U1TcMj77P1Zk7CfS0xkdspYSsaFMEIHlz7XfA_bNAzViKVPgpAvEnxYOXH6uBKwPaXvisQj-qzxZ0kEh4uvH_nXlKY02OoRAN8PtRB7-rUPoFMJRdcUuPkHkHHuBUvoUAb3ySmdNj7Tgq_LJwGk2s63fXg_g2aazlaj2KhkB8JkcpRh7OewTypUwnWJyqOdhFQGXDv8ZfgpP_74nO8k0KbW4mjhNz82gGN1nPQ"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1A120B] via-[#1A120B]/80 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A120B] via-transparent to-transparent z-10" />
                </div>
                <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 w-full grid lg:grid-cols-2 gap-12">
                    <div className="flex flex-col justify-center items-start pt-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Now Live Globally
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
                            Connect, Share, and <span className="text-primary block mt-2">Find Your People</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed font-medium drop-shadow-md">
                            Experience a new way to socialize. Connect with thousands of like-minded individuals in a safe, premium environment designed for authentic relationships.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link to="/registration/step-1" className="bg-primary hover:bg-orange-600 text-[#1A120B] text-base font-bold px-8 py-4 rounded-full transition-all transform hover:-translate-y-1 shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2">
                                Join the Community
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </Link>
                            <Link to="/login" className="bg-black/20 backdrop-blur-sm border border-primary/50 hover:border-primary text-primary hover:bg-primary/10 text-base font-bold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">login</span>
                                Member Log In
                            </Link>
                        </div>
                        <div className="mt-12 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="flex -space-x-4">
                                <div className="size-12 rounded-full border-2 border-[#1A120B] bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw")' }} />
                                <div className="size-12 rounded-full border-2 border-[#1A120B] bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFnbIOg359_IruqeJZR2XF_Z9o0ttAo63JvDFovmYNSKdvPDsjabpqB7jFC2UUE6tzEncOSivvm1W5vNt9KxVCVPm7pn8OrwN7RLmHA4OMIo36hL-88I-wXa9YN61Vi-X20nAg7gI-1QfF28jrI8oV5TGX_X32VjN7POtm_CtBB9DkdWcNvsqgkBEwNZFhOLngZBuNQA5Z5pU-fGIhAf3z355mdR5RIij1VsmKLkaqcqcd87735upuE6OE5UqM8bI3FCXkrTk4agw")' }} />
                                <div className="size-12 rounded-full border-2 border-[#1A120B] bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuHYpNqBoJZ6H3wxyG6OtCnMMVU4FTUngw6LYZy4SgjA0mY2sYsDcePdMS10ev3_M8tw950TFDzIey60zy_0YaYchnCYNkI1EFXtTTC7THk5zGBor8yBtMr-aAf8sbShLZVQv8CQzSm5kNH7EvWmKXyi1RIv1DxZa3HFHT34tseJeUcKe6h6lFC6Ar26xYdz8DghOGsPL3pKrXSb5Jj3_uULvl0M_QzCz6myNZnocquEnyZkGrndeht0XMB4Yrsu9Is2B6nJ3Mi9M")' }} />
                                <div className="size-12 rounded-full border-2 border-[#1A120B] bg-[#261E17] flex items-center justify-center text-xs font-bold text-white">+5k</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <span key={i} className="material-symbols-outlined text-sm">star</span>
                                    ))}
                                </div>
                                <p className="text-sm font-medium text-gray-300"><span className="text-white font-bold">10k+</span> members joined this week</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[#1A120B] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
                            Everything you need to <span className="text-primary">connect</span>
                        </h2>
                        <p className="text-text-secondary text-lg leading-relaxed">
                            Our platform provides premium tools to help you express yourself, discover new friends, and build relationships that last.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: 'manage_search', title: 'Advanced Matchmaking', description: 'Filter matches by interests, location, and lifestyle. Our smart algorithm helps you find exactly who you\'re looking for without the noise.' },
                            { icon: 'auto_awesome', title: 'Express Yourself', description: 'Create a stunning profile with photo galleries and a personal diary. Post updates, share moments, and let your true personality shine.' },
                            { icon: 'redeem', title: 'Virtual Gifts', description: 'Break the ice instantly. Send thoughtful virtual gifts to show appreciation and start meaningful conversations with a gesture of kindness.' }
                        ].map((feature, index) => (
                            <div key={index} className="bg-[#261E17] p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-2 shadow-xl hover:shadow-primary/5">
                                <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ring-1 ring-white/5">
                                    <span className="material-symbols-outlined text-primary text-4xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-b from-[#1A120B] to-[#120c07] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Recent Members</h2>
                            <p className="text-text-secondary">Join thousands of people active right now. Connect instantly.</p>
                        </div>
                        <button className="text-primary font-bold hover:text-white transition-colors flex items-center gap-1 group">
                            View all members <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                        </button>
                    </div>
                    <div className="relative">
                        {/* Blurred member cards grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-50 select-none pointer-events-none">
                            {[
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0',
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g',
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y',
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuCfCl1X2bsOD2anKofpFDzckD9z_a3CDOQqg1A1-nnzE0ALZhx8h2sNsn_PdV7-P6oEpg0XRttDsHUQJwA2Aa3MdUW6FIzwdzYDOxxjZFF7_x9QBl_cJ0NvpSwm_LFGlB5Yi4n9ksqFEjuIaIuQTyLOghyL8b2P7JdZiE9YN9aMocc7VfC_uvu-UaLuLtbGD9_5Kropk3H3Na2Of1n_kfzDW9PvINieVznAqTbyDeohff0qGU0J5IQTasq56bubbiAsxjbHlaBRaZ4',
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuDJPlnDjBjXuixfttGBOr0_Jx2ZLTctMTrGw14hx9On0XfJumO9xm9cOekOU2h2N4DYnbdA2kJqNkj1La7ogr0YwtHbWZbBTN2f4jz2tMaZ4MysYtOwrJh9nwBn3ooj5LQfIAwf-a0pq9vR24ScthQGYkC_nY1vIxbb6OW1ySd-C8q1C-EFoeCLGB47y8OGHnKoiwdLpB3Jgft_uYAPe6-xAq52AMh9kmGduf6uAp8MOpDKV3ZUqpAElRvG46XdK09BKNQRomKVHFo',
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuC5XMIpiqrD96rbcu3BjxqHOkpiTb_uUr6zVOzb3_EuEuyT7BKqTEpoqxuP4Q5_KQvP60A_2VSvikFgb-T6dHDeoW_JBguXbEb2aBZWpYU2ZHqnq9-UbMsPrpz9nuSS5PoGtucwsXXNpETlS5qomt4Lt5QiBEH-IIExc6OiETtXvtpKy0BwNQlgjk1GYSXjtSmGV42SJAbFmDxmcSZYbOTUNXQk7EwH1M2sDDKY33EOblUP98AmvedKaka_lnog0uPtQE6vFnDMUuk'
                            ].map((imgUrl, index) => (
                                <div key={index} className="bg-[#261E17] p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-3 grayscale-[50%]">
                                    <div
                                        className="size-20 rounded-full bg-cover bg-center blur-[6px]"
                                        style={{ backgroundImage: `url("${imgUrl}")` }}
                                    />
                                    <div className="h-4 w-20 bg-white/10 rounded-full" />
                                    <div className="h-3 w-12 bg-white/5 rounded-full" />
                                </div>
                            ))}
                        </div>
                        {/* CTA overlay */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                            <div className="bg-[#261E17]/80 backdrop-blur-xl border border-primary/20 p-8 rounded-[2rem] shadow-2xl text-center max-w-sm w-full transform transition-all hover:scale-105 duration-500 group">
                                <div className="size-4 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-[#1A120B] transition-colors">
                                    <span className="material-symbols-outlined text-3xl">lock</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Join to View Profiles</h3>
                                <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                                    Sign up for free to see full profiles, photos, and connect with members near you.
                                </p>
                                <Link to="/registration/step-1" className="block w-full bg-primary hover:bg-orange-600 text-[#1A120B] font-bold py-4 rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40">
                                    Create Free Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0f0a07] border-t border-white/5 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                        <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-primary text-3xl">diversity_3</span>
                                <span className="text-xl font-extrabold tracking-tight">Connect<span className="text-primary">.</span></span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                The premium social network designed for meaningful connections and real friendships. Join the conversation today.
                            </p>
                            <div className="flex gap-3">
                                <a className="size-10 rounded-full bg-white/5 hover:bg-primary hover:text-[#1A120B] flex items-center justify-center transition-all text-gray-400" href="#">
                                    <span className="material-symbols-outlined text-lg">public</span>
                                </a>
                                <a className="size-10 rounded-full bg-white/5 hover:bg-primary hover:text-[#1A120B] flex items-center justify-center transition-all text-gray-400" href="#">
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                </a>
                                <a className="size-10 rounded-full bg-white/5 hover:bg-primary hover:text-[#1A120B] flex items-center justify-center transition-all text-gray-400" href="#">
                                    <span className="material-symbols-outlined text-lg">chat</span>
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-20">
                            <div>
                                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Company</h4>
                                <ul className="flex flex-col gap-3 text-sm text-gray-400">
                                    <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                                    <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                                    <li><a className="hover:text-primary transition-colors" href="#">Press</a></li>
                                    <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Resources</h4>
                                <ul className="flex flex-col gap-3 text-sm text-gray-400">
                                    <li><a className="hover:text-primary transition-colors" href="#">Safety Tips</a></li>
                                    <li><a className="hover:text-primary transition-colors" href="#">Community Guidelines</a></li>
                                    <li><a className="hover:text-primary transition-colors" href="#">Success Stories</a></li>
                                    <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Legal</h4>
                                <ul className="flex flex-col gap-3 text-sm text-gray-400">
                                    <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                                    <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                                    <li><a className="hover:text-primary transition-colors" href="#">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-medium">
                        <p>© 2023 Connect Social Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a className="hover:text-gray-400 transition-colors" href="#">English (US)</a>
                            <a className="hover:text-gray-400 transition-colors" href="#">Sitemap</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
