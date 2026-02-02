import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationList from "../notification/NotificationList";

const NotificationDropdown = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
}) => {
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-80 md:w-96 z-50 origin-top-right shadow-2xl rounded-2xl"
        >
          <NotificationList
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            onMarkAllAsRead={onMarkAllAsRead}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
