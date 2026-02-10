import React, { Fragment } from 'react';
import { PlayCircle } from 'lucide-react';
import { formatDaySeparator } from '../../utils/chatHelpers.js';

const MessageList = React.memo(({ messages, currentUser, activeRoom, messagesEndRef, onOpenLightbox }) => {
    // Map of messageId/index to members who have read up to that message
    const readReceiptsMap = {};
    if (activeRoom?.members) {
        activeRoom.members.forEach(member => {
            // Only show other members' read status, not the current user's
            if (!member.lastReadAt || member.id === currentUser.id) return;

            const lastReadTime = new Date(member.lastReadAt).getTime();
            let lastReadMsgId = null;
            for (let i = messages.length - 1; i >= 0; i--) {
                const msgTime = messages[i].timestamp ? new Date(messages[i].timestamp).getTime() : 0;
                if (msgTime <= lastReadTime) {
                    lastReadMsgId = messages[i].id || i;
                    break;
                }
            }

            if (lastReadMsgId !== null) {
                if (!readReceiptsMap[lastReadMsgId]) readReceiptsMap[lastReadMsgId] = [];
                readReceiptsMap[lastReadMsgId].push(member);
            }
        });
    }

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
                        <div className="flex flex-col w-full">
                            <div
                                className={`flex gap-3 max-w-[80%] ${isSentByMe ? "self-end justify-end ml-auto" : ""
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
                                    className={`flex flex-col gap-1 ${isSentByMe ? "items-end" : "items-start"
                                        }`}
                                >
                                    {/* Display name in groups for others */}
                                    {!isSentByMe && activeRoom?.type === "GROUP" && (
                                        <span className="text-[10px] font-bold text-primary ml-1 mb-0.5">
                                            {msgSenderName}
                                        </span>
                                    )}

                                    {/* Message Content - Text or Image */}
                                    {msg.type === 'image' && msg.imageUrl ? (
                                        <div className="flex flex-col gap-1">
                                            <div
                                                className={`overflow-hidden rounded-2xl ${isSentByMe ? 'rounded-br-none' : 'rounded-bl-none'} cursor-pointer hover:opacity-90 transition-opacity`}
                                                onClick={() => onOpenLightbox && onOpenLightbox(msg.imageUrl, 'image')}
                                            >
                                                <img
                                                    src={msg.imageUrl}
                                                    alt="Shared image"
                                                    className="max-w-xs max-h-96 object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            {msg.text && (
                                                <div
                                                    className={`p-3 rounded-xl text-sm leading-relaxed ${isSentByMe
                                                        ? "bg-bubble-sent text-white font-semibold"
                                                        : "bg-bubble-received text-text-main"
                                                        }`}
                                                >
                                                    <p className="whitespace-pre-wrap break-words break-all">{msg.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : msg.type === 'video' && msg.imageUrl ? (
                                        <div className="flex flex-col gap-1">
                                            <div
                                                className={`relative overflow-hidden rounded-2xl ${isSentByMe ? 'rounded-br-none' : 'rounded-bl-none'} cursor-pointer hover:opacity-90 transition-opacity group`}
                                                onClick={() => onOpenLightbox && onOpenLightbox(msg.imageUrl, 'video')}
                                            >
                                                <video
                                                    src={msg.imageUrl}
                                                    className="max-w-xs max-h-96 object-cover"
                                                    muted
                                                    preload="metadata"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                                    <PlayCircle size={48} className="text-white opacity-90 drop-shadow-lg scale-100 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                                    VIDEO
                                                </div>
                                            </div>
                                            {msg.text && (
                                                <div
                                                    className={`p-3 rounded-xl text-sm leading-relaxed ${isSentByMe
                                                        ? "bg-bubble-sent text-white font-semibold"
                                                        : "bg-bubble-received text-text-main"
                                                        }`}
                                                >
                                                    <p className="whitespace-pre-wrap break-words break-all">{msg.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isSentByMe
                                                ? "bg-bubble-sent rounded-br-none text-white font-semibold"
                                                : "bg-bubble-received rounded-bl-none text-text-main self-start"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap break-words break-all">{msg.text}</p>
                                        </div>
                                    )}
                                    <div className={`flex items-center gap-1 text-text-secondary text-[10px] mt-1 ${isSentByMe ? "self-end pr-1" : "self-start pl-1"}`}>
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

                            {/* Seen Indicators - always at right edge, below message */}
                            {readReceiptsMap[msg.id || index] && (
                                <div className="flex justify-end pr-2 -mt-1">
                                    {activeRoom?.type === "DIRECT" ? (
                                        <span className="text-[10px] text-text-secondary select-none font-medium">Đã xem</span>
                                    ) : (
                                        <div className="flex -space-x-1.5 overflow-hidden">
                                            {readReceiptsMap[msg.id || index].map(member => (
                                                <div
                                                    key={member.id}
                                                    className="size-4 rounded-full border border-background-main bg-cover bg-center shadow-sm ring-1 ring-primary/10 animate-in zoom-in duration-300"
                                                    title={`${member.fullName} đã xem`}
                                                    style={{ backgroundImage: `url("${member.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}")` }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Fragment>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
});

export default MessageList;
