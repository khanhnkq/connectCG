import React, { createContext, useContext, useState } from "react";
import {
  ChevronRight,
  File as FileIcon,
  Folder as FolderIcon,
} from "lucide-react";

const TreeContext = createContext();

export const Tree = ({
  children,
  className = "",
  initialSelectedId = "",
  initialExpandedItems = [],
  elements,
  ...props
}) => {
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [expandedItems, setExpandedItems] = useState(initialExpandedItems);

  const handleExpand = (id) => {
    setExpandedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <TreeContext.Provider
      value={{
        selectedId,
        setSelectedId,
        expandedItems,
        handleExpand,
        elements,
      }}
    >
      <div className={`relative overflow-hidden ${className}`} {...props}>
        {children}
      </div>
    </TreeContext.Provider>
  );
};

export const Folder = ({
  className = "",
  element,
  value,
  children,
  isSelectable = true,
}) => {
  const { expandedItems, handleExpand, selectedId, setSelectedId } =
    useContext(TreeContext);
  const isExpanded = expandedItems.includes(value);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-start gap-1 py-1 rounded-md transition-colors duration-200 cursor-pointer text-text-main hover:bg-background-secondary
       `}
        onClick={(e) => {
          e.stopPropagation();
          handleExpand(value);
          if (isSelectable) setSelectedId(value);
        }}
      >
        <ChevronRight
          className={`h-4 w-4 shrink-0 mt-1 transition-transform duration-200 ${
            isExpanded ? "rotate-90 text-text-secondary" : "text-text-secondary"
          }`}
        />
        <div className="flex flex-col flex-1 min-w-0">{element}</div>
      </div>

      {isExpanded && (
        <div className="relative ml-2.5 pl-2.5 border-l border-border-main">
          {children}
        </div>
      )}
    </div>
  );
};

export const File = ({
  className = "",
  value,
  children,
  isSelectable = true,
}) => {
  const { selectedId, setSelectedId } = useContext(TreeContext);

  return (
    <div
      className={`relative flex items-center gap-1 py-1 rounded-md transition-colors duration-200 cursor-pointer text-text-main hover:bg-background-secondary
      ${
        isSelectable && selectedId === value ? "bg-background-secondary" : ""
      } ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        if (isSelectable) setSelectedId(value);
      }}
    >
      <div className="flex flex-col flex-1 min-w-0 pl-5">{children}</div>
    </div>
  );
};
