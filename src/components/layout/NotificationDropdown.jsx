import React from "react";
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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-[80vw] sm:w-64 md:w-72 z-50 origin-top-right shadow-2xl rounded-2xl border border-border-main bg-surface-main overflow-hidden"
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
