import React from "react";
import { MessageSquare } from "lucide-react";
import ChatHeader from "./ChatHeader.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

const ChatWindow = ({
  activeRoom,
  messages,
  currentUser,
  messagesEndRef,
  inputText,
  setInputText,
  onSendMessage,
  showEmojiPicker,
  onToggleEmojiPicker,
  emojiPickerRef,
  emojis,
  onBack,
  onShowSettings,
  onInviteMember,
}) => {
  return (
    <div
      className={`${activeRoom ? "flex" : "hidden"
        } md:flex flex-1 flex-col bg-chat-bg relative transition-colors duration-300`}
    >
      {activeRoom ? (
        <>
          <ChatHeader
            activeRoom={activeRoom}
            onBack={onBack}
            onShowSettings={onShowSettings}
            onInviteMember={onInviteMember}
          />

          <MessageList
            messages={messages}
            currentUser={currentUser}
            activeRoom={activeRoom}
            messagesEndRef={messagesEndRef}
          />

          <MessageInput
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={onSendMessage}
            onShowEmojiPicker={onToggleEmojiPicker}
            showEmojiPicker={showEmojiPicker}
            emojiPickerRef={emojiPickerRef}
            emojis={emojis}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-4">
          <MessageSquare size={64} className="opacity-20" />
          <p>Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
