import React from "react";
import { Bell, Search } from "lucide-react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

const Header = ({ title = "Quản lý" }) => {
  return (
    <header className="flex items-center justify-between border-b border-border px-10 py-5 bg-background/80 backdrop-blur-md z-10 h-20">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-text-main">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-6">
        <AnimatedThemeToggler />
        <button className="bg-surface p-3 rounded-xl text-text-muted hover:text-text-main hover:bg-surface/80 transition-all relative border border-border">
          <Bell className="size-6" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
