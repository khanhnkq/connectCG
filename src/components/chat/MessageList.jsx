import React, { Fragment } from 'react';
import { formatDaySeparator } from '../../utils/chatHelpers.js';

const MessageList = ({ messages, currentUser, activeRoom, messagesEndRef }) => {
    return (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
            {messages.map((msg, index) => {
                const isSentByMe = msg.senderId === currentUser.id;

                // Logic ngăn cách ngày
                const msgDate = msg.timestamp ? new Date(msg.timestamp) : new Date();
                const prevMsg = index > 0 ? messages[index - 1] : null;
                const prevMsgDate = prevMsg && prevMsg.timestamp ? new Date(prevMsg.timestamp) : null;

                const isNewDay = !prevMsgDate || msgDate.toDateString() !== prevMsgDate.toDateString();

                // Dynamic Avatar & Name Lookup
                let msgAvatar = msg.senderAvatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                let msgSenderName = msg.senderName || "Unknown";

                if (isSentByMe) {
                    msgAvatar = currentUser.avatarUrl || msgAvatar;
                    msgSenderName = currentUser.fullName || currentUser.username || msgSenderName;
                } else if (activeRoom?.type === "DIRECT") {
                    msgAvatar = activeRoom.avatarUrl || msgAvatar;
                    msgSenderName = activeRoom.name || msgSenderName;
                } else if (activeRoom?.members) {
                    const sender = activeRoom.members.find(
                        (m) => m.id === msg.senderId,
                    );
                    if (sender) {
                        if (sender.avatarUrl) msgAvatar = sender.avatarUrl;
                        if (sender.fullName) msgSenderName = sender.fullName;
                    }
                }

                return (
                    <Fragment key={msg.id || index}>
                        {isNewDay && (
                            <div className="flex items-center justify-center my-6">
                                <div className="h-px bg-border-main flex-1 opacity-20" />
                                <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted bg-surface-main/30 py-1 rounded-full border border-border-main/20">
                                    {formatDaySeparator(msg.timestamp || Date.now())}
                                </span>
                                <div className="h-px bg-border-main flex-1 opacity-20" />
                            </div>
                        )}
                        <div
                            className={`flex gap-3 max-w-[80%] ${isSentByMe ? "self-end justify-end" : ""
                                }`}
                        >
                            {!isSentByMe && (
                                <div
                                    className="size-8 rounded-full bg-cover bg-center shrink-0 self-end mb-1 border border-border-main"
                                    style={{
                                        backgroundImage: `url("${msgAvatar}")`,
                                    }}
                                ></div>
                            )}
                            <div
                                className={`flex flex-col gap-1 ${isSentByMe ? "items-end" : ""
                                    }`}
                            >
                                {/* Display name in groups for others */}
                                {!isSentByMe && activeRoom?.type === "GROUP" && (
                                    <span className="text-[10px] font-bold text-primary ml-1 mb-0.5">
                                        {msgSenderName}
                                    </span>
                                )}
                                <div
                                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isSentByMe
                                        ? "bg-bubble-sent rounded-br-none text-white font-semibold"
                                        : "bg-bubble-received rounded-bl-none text-text-main"
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                </div>
                                <div
                                    className={`flex items-center gap-1 text-text-secondary text-[10px] ${!isSentByMe ? "ml-1" : "mr-1"
                                        }`}
                                >
                                    <span>
                                        {msg.timestamp
                                            ? new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false
                                            })
                                            : "Vừa xong"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
