import React, { useRef } from 'react';
import { PlusCircle as CirclePlus, PaperPlaneTilt as Send, Image as ImageIcon, X } from "@phosphor-icons/react";
import { IconButton } from "../ui/button/Button";

const MessageInput = ({
    inputText,
    setInputText,
    onSendMessage,
    onShowEmojiPicker,
    showEmojiPicker,
    emojiPickerRef,
    emojis,
    selectedImage,
    onImageSelect,
    onClearImage,
    isUploading
}) => {
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
            onImageSelect(file);
        }
    };

    return (
        <div className="p-4 px-6 bg-background-main">
            {/* Media Preview */}
            {selectedImage && (
                <div className="mb-3 relative inline-block">
                    {selectedImage.type?.startsWith('video/') ? (
                        <video
                            src={URL.createObjectURL(selectedImage)}
                            className="h-24 w-24 object-cover rounded-xl ring-2 ring-primary"
                            autoPlay
                            muted
                            loop
                        />
                    ) : (
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            className="h-24 w-24 object-cover rounded-xl ring-2 ring-primary"
                        />
                    )}
                    <IconButton
                        icon={X}
                        variant="danger"
                        size="sm"
                        aria-label="Xóa file đính kèm"
                        onClick={onClearImage}
                        className="absolute -top-2 -right-2 size-6 rounded-full"
                    />
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSendMessage();
                }}
                className="flex gap-2.5 items-end"
            >
                {/* Emoji Picker */}
                <div className="relative" ref={emojiPickerRef}>
                    <IconButton
                        icon={CirclePlus}
                        variant="ghost"
                        size="md"
                        aria-label="Thêm biểu tượng cảm xúc"
                        type="button"
                        onClick={onShowEmojiPicker}
                        className={showEmojiPicker ? "text-primary bg-surface-main" : ""}
                    />

                    {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-4 p-3 bg-surface-main rounded-2xl shadow-2xl grid grid-cols-6 gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 w-64 backdrop-blur-xl">
                            {emojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => {
                                        setInputText(prev => prev + emoji);
                                    }}
                                    className="text-2xl hover:scale-125 transition-transform p-1 cursor-pointer"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Media Picker Button */}
                <IconButton
                    icon={ImageIcon}
                    variant="ghost"
                    size="md"
                    aria-label="Đính kèm hình ảnh hoặc video"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex-1 bg-surface-subtle border-0 rounded-xl flex items-center px-4 py-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface-main transition-all">
                    <input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="bg-transparent border-none text-text-main placeholder:text-text-muted focus:ring-0 focus:outline-none w-full py-1 text-sm font-medium"
                        placeholder={selectedImage ? "Thêm chú thích (tùy chọn)..." : "Nhập tin nhắn..."}
                        type="text"
                        disabled={isUploading}
                    />
                </div>

                <IconButton
                    icon={Send}
                    type="submit"
                    variant="primary"
                    size="md"
                    aria-label="Gửi tin nhắn"
                    isLoading={isUploading}
                    disabled={(!inputText.trim() && !selectedImage) || isUploading}
                />
            </form>
        </div>
    );
};

export default MessageInput;
