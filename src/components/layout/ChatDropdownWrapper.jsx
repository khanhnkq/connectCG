import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatDropdown from "../chat/ChatDropdown";

const ChatDropdownWrapper = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-80 md:w-96 z-50 origin-top-right shadow-2xl rounded-2xl bg-background-main border border-border-main overflow-hidden"
        >
          <ChatDropdown onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatDropdownWrapper;
