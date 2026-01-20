import { useState } from 'react';

export default function AdvancedMemberSearch() {
    const [onlineOnly, setOnlineOnly] = useState(true);
    const [ageRange, setAgeRange] = useState({ min: 24, max: 35 });
    const [distance, setDistance] = useState('10km');
    const [selectedInterests, setSelectedInterests] = useState(['Travel', 'Hiking']);

    const interests = ['Travel', 'Music', 'Cooking', 'Hiking', 'Gaming', 'Art', 'Fitness'];

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const members = [
        {
            id: 1,
            name: 'Sarah',
            age: 24,
            location: 'Brooklyn, NY',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtzj33ot6VHzYPrEZRs8cpa1g_r4fQJavkqxNjq0EJWXWXUQjJMlqnaalvjE9rDGu7s-4N_I1I3eewvwLthcUyNjFp3IVZELsi4gYSlI7lW_Tsv4AZy3_r2ChuvRlcerEebNvx18lMIzNin0BpxepStd03-HmsyNay81AAaCMrsCk4wgoh8PXLpyiXqCfpWwAZCplF2qLe6PDAUHU2UefOlWMTkJMFOFWp5yucZ5qU_aNbg2RyWshb8pQnKLpSYVJC-Ls9BfNdq0k',
            tags: ['Photography', 'Coffee'],
            online: true,
            liked: true
        },
        {
            id: 2,
            name: 'James',
            age: 29,
            location: 'Manhattan, NY',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFFOuYSb8rrkTBRcwwKlN6-MaZ_rOVsEeQYa2Cf0j5qsh4ejcX2MsTBLVmLzZ8ki_cvVN06OlWcisbOKzMnOPAeSfr3Ova1uEE1sZZKxUnnONhxzxmabSIMzZT-s8X896jy-nLyQ67OgNM2jsl7d1ge7lq9bpFQvjyTSOYWOkKVgu3dJtrm7xJV6_cDzOyMj42lXAwe9oF0lgdrp779XNtHDszgm2TbWboiv6uwZVocO7IcPEXaMfkwFwU5yJXFUbDWzE3Sv1gfCE',
            tags: ['Travel', 'Music'],
            online: false,
            liked: false
        },
        {
            id: 3,
            name: 'Maya',
            age: 26,
            location: 'Jersey City, NJ',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwo1VHAkMAwMxb5zxfQQn7iSSm6EcfQoSYw57oB-RFAtO8xMBXEOSUzrfccz77fElzMRNrQ3tJgAiuNuvyozQJ0n5-cY4Fh9Kl2fEnDQFFJrHhj5JLNRkM_0yaFtsd8RYu-zMxHBnONKyOGDT2m_JDP5DwoIqzZVP9Dm0rzQksNm--Hht71w509BbCB7RAaHher_soh5492hauOYivRTBkrl0hdFe9z9-Tc0r02H64o9P_aZeF4VlIXsQQL1JBvMng5kj1ywSZIok',
            tags: ['Art', 'Reading'],
            online: true,
            liked: false
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display antialiased min-h-screen flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-border-dark bg-white dark:bg-background-dark px-6 lg:px-10 py-3 z-20">
                <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                    <div className="size-8 text-primary">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Connect</h2>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500 dark:text-text-secondary">
                        <a className="text-gray-900 dark:text-white font-bold" href="#">Discover</a>
                        <a className="hover:text-primary transition-colors" href="#">Matches</a>
                        <a className="hover:text-primary transition-colors" href="#">Events</a>
                    </nav>
                    <div className="flex gap-2">
                        <button className="flex items-center justify-center rounded-full size-10 bg-gray-100 dark:bg-border-dark text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                        </button>
                        <button className="flex items-center justify-center rounded-full size-10 bg-gray-100 dark:bg-border-dark text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                        </button>
                    </div>
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-primary cursor-pointer"
                        style={{
                            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNcxTvHj0jOMuv5iaJwqbnE4hkEhmNP9a4w07IThay3nDWktADaGCwp9yDzGwXVKEe-aV4W2guasuLeaseeutj8L7Nn8Sef8c-gkncu34aFOFwb2odowQbL6-mWAUgGPQ37tokgyAXfVKkTPSNKZq6jx7lSj5hfZaXgpihrGBOVEqvEDTmQhRkGevhEelwlFWWkCfOmdSyyKP9dIxXU5qnGiNz-RepW40s7qXgHYd8Ps3_jYTWC2o4AqUdXTwnM7WK7xML-1F8YyM")'
                        }}
                    />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Sidebar: Filters */}
                <aside className="w-full md:w-[320px] lg:w-[360px] flex flex-col border-r border-gray-200 dark:border-border-dark bg-white dark:bg-background-dark z-10 overflow-y-auto custom-scrollbar flex-none hidden md:flex">
                    <div className="p-5 pb-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight">Filter Matches</h2>
                            <button className="text-sm font-medium text-primary hover:text-orange-400">Reset</button>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <label className="flex w-full items-center rounded-xl bg-gray-100 dark:bg-surface-dark h-12 px-4 focus-within:ring-2 ring-primary/50 transition-all">
                                <span className="material-symbols-outlined text-gray-400 dark:text-text-secondary">search</span>
                                <input
                                    className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-text-secondary focus:ring-0 text-sm ml-2"
                                    placeholder="City, interest, or keyword"
                                />
                            </label>
                        </div>

                        {/* Online Only Toggle */}
                        <div className="mb-6 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-surface-dark p-4 flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-gray-900 dark:text-white text-sm font-bold">Online Only</p>
                                <p className="text-gray-500 dark:text-text-secondary text-xs">Members online now</p>
                            </div>
                            <label className="relative flex h-[24px] w-[44px] cursor-pointer items-center rounded-full bg-gray-300 dark:bg-border-dark p-1 has-[:checked]:justify-end has-[:checked]:bg-primary transition-all duration-300">
                                <div className="h-[18px] w-[18px] rounded-full bg-white shadow-sm" />
                                <input
                                    type="checkbox"
                                    checked={onlineOnly}
                                    onChange={() => setOnlineOnly(!onlineOnly)}
                                    className="invisible absolute"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Accordions Container */}
                    <div className="flex flex-col px-5 pb-10 gap-4">
                        {/* Age Range Accordion */}
                        <details className="group flex flex-col rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-surface-dark overflow-hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <p className="text-gray-900 dark:text-white text-sm font-bold">Age Range</p>
                                <span className="material-symbols-outlined text-gray-500 dark:text-white text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1">
                                <div className="flex justify-between text-sm text-gray-500 dark:text-text-secondary mb-3 font-medium">
                                    <span>{ageRange.min}</span>
                                    <span>{ageRange.max}</span>
                                </div>
                                <div className="relative h-1.5 w-full rounded-full bg-gray-300 dark:bg-border-dark">
                                    <div className="absolute h-full w-[40%]left-[20%] rounded-full bg-primary" />
                                </div>
                            </div>
                        </details>

                        {/* Location Accordion */}
                        <details className="group flex flex-col rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-surface-dark overflow-hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <p className="text-gray-900 dark:text-white text-sm font-bold">Location</p>
                                <span className="material-symbols-outlined text-gray-500 dark:text-white text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-primary text-sm font-bold cursor-pointer mb-1">
                                    <span className="material-symbols-outlined text-[18px]">my_location</span>
                                    <span>Use my current location</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="distance"
                                            checked={distance === '10km'}
                                            onChange={() => setDistance('10km')}
                                            className="text-primary focus:ring-primary bg-transparent border-gray-400 dark:border-gray-600"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Within 10 km</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="distance"
                                            checked={distance === '50km'}
                                            onChange={() => setDistance('50km')}
                                            className="text-primary focus:ring-primary bg-transparent border-gray-400 dark:border-gray-600"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Within 50 km</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="distance"
                                            checked={distance === 'anywhere'}
                                            onChange={() => setDistance('anywhere')}
                                            className="text-primary focus:ring-primary bg-transparent border-gray-400 dark:border-gray-600"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">Anywhere</span>
                                    </label>
                                </div>
                            </div>
                        </details>

                        {/* Interests Accordion */}
                        <details className="group flex flex-col rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-surface-dark overflow-hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <p className="text-gray-900 dark:text-white text-sm font-bold">Interests</p>
                                <span className="material-symbols-outlined text-gray-500 dark:text-white text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1">
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest) => (
                                        <button
                                            key={interest}
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedInterests.includes(interest)
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white dark:bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </details>
                    </div>
                </aside>

                {/* Main Content: Search Results */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background-dark p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newest Members</h1>
                                <p className="text-gray-500 dark:text-text-secondary mt-1">
                                    Showing 124 matches near <span className="text-gray-900 dark:text-white font-semibold">New York, NY</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-500 dark:text-text-secondary">Sort by:</span>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-full px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:border-primary transition-colors">
                                        Recommended
                                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {members.map((member) => (
                                <article
                                    key={member.id}
                                    className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-200 dark:bg-surface-dark shadow-lg dark:shadow-none hover:-translate-y-1 transition-all duration-300"
                                >
                                    <img
                                        alt={`Portrait of ${member.name}`}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        src={member.image}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                    {/* Online Status */}
                                    {member.online && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2 py-1 border border-white/10">
                                            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wide">Online</span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col items-start text-white">
                                        <div className="flex flex-col gap-1 w-full mb-3">
                                            <h3 className="text-2xl font-bold leading-none">
                                                {member.name}, {member.age}
                                            </h3>
                                            <div className="flex items-center gap-1 text-gray-300 text-sm">
                                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                <span>{member.location}</span>
                                            </div>
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {member.tags.map((tag) => (
                                                    <span key={tag} className="text-[10px] font-medium bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 w-full pt-2 border-t border-white/10">
                                            <button className="flex-1 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                                Message
                                            </button>
                                            <button
                                                className={`size-10 rounded-full ${member.liked
                                                        ? 'bg-primary hover:bg-orange-600 text-white shadow-lg shadow-primary/30'
                                                        : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                                                    } flex items-center justify-center transition-colors`}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">favorite</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="mt-12 flex justify-center pb-8">
                            <button className="px-8 py-3 rounded-full bg-white dark:bg-surface-dark text-gray-900 dark:text-white font-bold border border-gray-200 dark:border-border-dark hover:border-primary hover:text-primary transition-all shadow-md">
                                Load More Matches
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
