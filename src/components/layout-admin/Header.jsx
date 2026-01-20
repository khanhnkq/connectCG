import React from 'react';

const Header = ({ title = "Management" }) => {
    return (
        <header className="flex items-center justify-between border-b border-border-dark px-10 py-5 bg-background-dark/80 backdrop-blur-md z-10 h-20">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative w-96">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl">search</span>
                    <input
                        className="w-full bg-surface-dark border border-border-dark rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary border-none outline-none placeholder:text-text-muted/60"
                        placeholder="Search..."
                    />
                </div>
                <button className="bg-surface-dark p-3 rounded-xl text-text-muted hover:text-white hover:bg-accent-dark transition-all relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
