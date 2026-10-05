import React, { createContext, useContext } from "react";

const TabsContext = createContext(null);

/**
 * Modern Flat Tabs Compound Primitive
 * - Zero drop shadow, zero blur
 * - Usage:
 *   <Tabs value={activeTab} onChange={setActiveTab}>
 *     <Tabs.List>
 *       <Tabs.Trigger value="tab1">Bản tin</Tabs.Trigger>
 *       <Tabs.Trigger value="tab2">Thành viên</Tabs.Trigger>
 *     </Tabs.List>
 *     <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
 *     <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
 *   </Tabs>
 */
export function Tabs({ value, onChange, children, className = "" }) {
  return (
    <TabsContext.Provider value={{ activeValue: value, onChange }}>
      <div className={`w-full flex flex-col ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children, className = "" }) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1.5 p-1 bg-surface-subtle border border-border-main rounded-xl select-none overflow-x-auto ${className}`}
    >
      {children}
    </div>
  );
};

Tabs.Trigger = function TabsTrigger({
  value,
  children,
  icon: Icon,
  badge,
  className = "",
  disabled = false,
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs.Trigger must be used within <Tabs>");

  const { activeValue, onChange } = context;
  const isActive = activeValue === value;

  return (
    <button
      role="tab"
      type="button"
      disabled={disabled}
      aria-selected={isActive}
      onClick={() => onChange?.(value)}
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive
          ? "bg-surface-main text-text-main border border-border-main"
          : "text-text-secondary hover:text-text-main hover:bg-surface-main/50 border border-transparent"
      } ${className}`}
    >
      {Icon && <Icon className="size-3.5 shrink-0" />}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] leading-tight font-extrabold ${
            isActive
              ? "bg-primary text-white"
              : "bg-surface-main text-text-muted border border-border-main"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ value, children, className = "" }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs.Panel must be used within <Tabs>");

  if (context.activeValue !== value) return null;

  return (
    <div role="tabpanel" className={`pt-4 ${className}`}>
      {children}
    </div>
  );
};

export default Tabs;
