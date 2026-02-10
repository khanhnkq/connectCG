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
  typingUsers = [],
  selectedImage,
  onImageSelect,
  onClearImage,
  isUploading,
  onShowMediaGallery,
  onOpenLightbox,
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
            onShowMediaGallery={onShowMediaGallery}
          />

          <MessageList
            messages={messages}
            currentUser={currentUser}
            activeRoom={activeRoom}
            messagesEndRef={messagesEndRef}
            onOpenLightbox={onOpenLightbox}
          />

          {typingUsers.length > 0 && (
            <div className="px-6 py-2 bg-transparent text-[11px] text-text-secondary animate-pulse flex items-center gap-2 italic">
              <div className="flex gap-1">
                <span className="size-1 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="size-1 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="size-1 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              {typingUsers.length === 1
                ? `${typingUsers[0]} đang nhập...`
                : `${typingUsers.length} người đang nhập...`}
            </div>
          )}

          <MessageInput
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={onSendMessage}
            onShowEmojiPicker={onToggleEmojiPicker}
            showEmojiPicker={showEmojiPicker}
            emojiPickerRef={emojiPickerRef}
            emojis={emojis}
            selectedImage={selectedImage}
            onImageSelect={onImageSelect}
            onClearImage={onClearImage}
            isUploading={isUploading}
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
