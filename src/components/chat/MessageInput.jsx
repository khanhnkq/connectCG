import React, { useState } from 'react';
import { CirclePlus, Send } from 'lucide-react';

const MessageInput = ({
    inputText,
    setInputText,
    onSendMessage,
    onShowEmojiPicker,
    showEmojiPicker,
    emojiPickerRef,
    emojis
}) => {
    return (
        <div className="p-4 px-6 bg-background-main border-t border-border-main">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSendMessage();
                }}
                className="flex gap-3 items-end"
            >
                <div className="relative" ref={emojiPickerRef}>
                    <button
                        type="button"
                        onClick={onShowEmojiPicker}
                        className={`p-3 text-text-secondary hover:text-text-main hover:bg-surface-main rounded-full transition-colors flex-shrink-0 ${showEmojiPicker ? "bg-surface-main text-primary" : ""}`}
                    >
                        <CirclePlus size={24} />
                    </button>

                    {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-4 p-3 bg-surface-main border border-border-main rounded-2xl shadow-2xl grid grid-cols-6 gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 w-64 backdrop-blur-xl bg-opacity-95">
                            {emojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => {
                                        setInputText(prev => prev + emoji);
                                        // setShowEmojiPicker(false); // Handled by parent or within hook? 
                                        // Better to let parent handle or extract emoji picker too
                                    }}
                                    className="text-2xl hover:scale-125 transition-transform p-1"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex-1 bg-surface-main border border-border-main rounded-3xl flex items-center px-4 py-1.5 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                    <input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="bg-transparent border-none text-text-main placeholder-text-secondary/50 focus:ring-0 w-full py-2.5 text-sm"
                        placeholder="Nhập tin nhắn..."
                        type="text"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-3.5 bg-primary hover:bg-orange-600 text-[#231810] rounded-full shadow-lg shadow-orange-500/20 transition-all hover:scale-105 flex-shrink-0 disabled:opacity-50 disabled:hover:scale-100"
                >
                    <Send size={24} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
