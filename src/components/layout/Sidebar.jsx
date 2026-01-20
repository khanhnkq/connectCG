import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const menuItems = [
        { icon: 'home', label: 'Home', path: '/dashboard/feed' },
        { icon: 'person', label: 'Profile', path: '/dashboard/profile/public' },
        { icon: 'explore', label: 'Explore', path: '/dashboard/explore' }, // Mapping to groups for now as explore
        { icon: 'groups', label: 'Groups', path: '/dashboard/groups' },
        { icon: 'chat_bubble', label: 'Messages', path: '/dashboard/chat', badge: '3' },
        { icon: 'favorite', label: 'Matches', path: '/dashboard/newsfeed-1' }, // Placeholder
        { icon: 'star', label: 'VIP Upgrade', path: '#', highlight: true },
    ];

    return (
        <aside className="w-72 hidden lg:flex flex-col border-r border-[#342418] bg-background-dark h-full overflow-y-auto shrink-0 z-20">
            <div className="p-6 pb-2">
                <div className="flex gap-4 items-center mb-8">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-lg ring-2 ring-[#342418]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw")' }}></div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-lg font-bold leading-tight">Alex Doe</h1>
                        <Link to="/dashboard/profile" className="text-text-secondary text-sm font-medium cursor-pointer hover:text-primary transition-colors flex items-center gap-1">
                            Edit Profile <span className="material-symbols-outlined text-[14px]">edit</span>
                        </Link>
                    </div>
                </div>
            </div>
            <nav className="flex-1 px-4 flex flex-col gap-2">
                {menuItems.map((item, index) => {
                    const active = isActive(item.path);
                    const isVip = item.label === 'VIP Upgrade';

                    let className = "flex items-center gap-4 px-4 py-3.5 rounded-full transition-all group ";
                    if (active) {
                        className += "bg-primary/20 text-primary";
                    } else {
                        className += "text-text-secondary hover:bg-[#342418] hover:text-white";
                    }
                    if (item.badge || active) className += " justify-between";

                    return (
                        <Link key={index} to={item.path} className={className}>
                            <div className="flex items-center gap-4">
                                <span className={`material-symbols-outlined ${!active && 'group-hover:scale-110'} transition-transform ${isVip ? 'text-yellow-500 group-hover:rotate-12' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-bold tracking-wide">{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className={`${active ? 'bg-primary text-[#231810] shadow-orange-500/20 shadow-lg' : 'bg-[#342418] text-white border border-[#493222]'} text-xs font-extrabold px-2 py-0.5 rounded-full`}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-6 mt-auto">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#342418] to-[#493222] rounded-2xl p-5 flex flex-col gap-3 border border-[#493222] shadow-xl">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-1">
                        <span className="material-symbols-outlined">diamond</span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base">Go Premium</h3>
                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">Boost your profile and see who likes you instantly.</p>
                    </div>
                    <button className="w-full mt-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm py-3 rounded-full transition-all shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5">
                        Get VIP Access
                    </button>
                </div>
            </div>
        </aside>
    );
}
