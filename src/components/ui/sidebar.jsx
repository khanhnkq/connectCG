"use client";
import { cn } from "../../lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <div className="hidden md:block w-[60px] shrink-0" />

      <motion.div
        className={cn(
          "h-[calc(100vh-64px)] px-4 py-4 hidden md:flex md:flex-col bg-background-main shrink-0 border-r border-border-main fixed left-0 top-[64px] z-40",
          className,
        )}
        animate={{
          width: animate ? (open ? "240px" : "60px") : "240px",
          paddingLeft: animate ? (open ? "16px" : "8px") : "16px",
          paddingRight: animate ? (open ? "16px" : "8px") : "16px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-background-main w-full border-b border-border-main",
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-text-main"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[90] md:hidden"
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className={cn(
                  "fixed h-full w-[280px] inset-y-0 left-0 bg-background-main p-6 z-[100] flex flex-col justify-between shadow-xl border-r border-border-main",
                  className,
                )}
              >
                <div
                  className="absolute right-4 top-4 z-50 text-text-main"
                  onClick={() => setOpen(!open)}
                >
                  <IconX />
                </div>
                {children}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({ link, className, ...props }) => {
  const { open, animate } = useSidebar();

  const content = (
    <>
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-text-main text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </>
  );

  if (link.onClick) {
    return (
      <button
        onClick={link.onClick}
        className={cn(
          "flex items-center justify-start gap-2 group/sidebar py-2 bg-transparent border-none cursor-pointer w-full hover:bg-surface-main/80 rounded-md px-2",
          className,
        )}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center justify-start gap-2  group/sidebar py-2 hover:bg-surface-main/80 rounded-md px-2",
        className,
      )}
      {...props}
    >
      {content}
    </Link>
  );
};
