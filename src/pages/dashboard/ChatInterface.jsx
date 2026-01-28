import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import ChatService from "../../services/chat/ChatService";
import FirebaseChatService from "../../services/chat/FirebaseChatService";
import reportService from "../../services/ReportService";
import FriendService from "../../services/friend/FriendService";
import ReportModal from "../../components/report/ReportModal";
import { uploadImage } from "../../utils/uploadImage";

export default function ChatInterface() {
    const { user: currentUser } = useSelector((state) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [friends, setFriends] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [groupName, setGroupName] = useState("");

    const handleCreateGroup = async () => {
        if (selectedMembers.length < 1) {
            toast.error("Vui lòng chọn ít nhất 1 người");
            return;
        }

        const isDirect = selectedMembers.length === 1;
        const tid = toast.loading(isDirect ? "Đang khởi tạo..." : "Đang tạo nhóm...");

        try {
            let room;
            if (isDirect) {
                // Nếu chỉ chọn 1 người, dùng logic getOrCreateDirectChat
                const response = await ChatService.getOrCreateDirectChat(selectedMembers[0].id);
                room = response.data;
            } else {
                // Nếu > 1 người, tạo nhóm
                const name = groupName.trim() || `Nhóm của ${currentUser.username}`;
                const response = await ChatService.createGroupChat(name, selectedMembers.map(f => f.id));
                room = response.data;
            }

            await fetchRooms();
            setActiveRoom(room);
            setShowNewChatModal(false);
            setSelectedMembers([]);
            setGroupName("");
            toast.success(isDirect ? "Đã kết nối!" : "Đã tạo nhóm!", { id: tid });
        } catch (error) {
            console.error("Error creating chat:", error);
            toast.error(isDirect ? "Lỗi khi kết nối" : "Lỗi khi tạo nhóm", { id: tid });
        }
    };
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef(null);

    // Fetch rooms
    const fetchRooms = async () => {
        try {
            const response = await ChatService.getMyChatRooms();
            const rooms = response.data;
            setConversations(rooms);

            // Decide which room to select
            const selectedKey = location.state?.selectedRoomKey;
            if (selectedKey) {
                const match = rooms.find(r => r.firebaseRoomKey === selectedKey);
                if (match) setActiveRoom(match);
                else if (rooms.length > 0 && !activeRoom) setActiveRoom(rooms[0]);
            } else if (rooms.length > 0 && !activeRoom) {
                setActiveRoom(rooms[0]);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
            toast.error("Không thể tải danh sách cuộc trò chuyện");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [location.state?.selectedRoomKey]);

    // Subscribe to messages when activeRoom changes
    useEffect(() => {
        if (!activeRoom) return;

        setMessages([]); // Clear old messages
        const unsubscribe = FirebaseChatService.subscribeToMessages(
            activeRoom.firebaseRoomKey,
            (newMsg) => {
                setMessages((prev) => [...prev, newMsg]);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [activeRoom]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch friends for new chat
    useEffect(() => {
        if (showNewChatModal) {
            const fetchFriendsList = async () => {
                try {
                    const response = await FriendService.getMyFriends({ size: 100 });
                    setFriends(response.data.content || []);
                } catch (error) {
                    console.error("Error fetching friends:", error);
                }
            };
            fetchFriendsList();
        }
    }, [showNewChatModal]);

    const handleStartNewChat = async (userId) => {
        const tid = toast.loading("Đang khởi tạo...");
        try {
            const response = await ChatService.getOrCreateDirectChat(userId);
            const room = response.data;
            await fetchRooms();
            setActiveRoom(room);
            setShowNewChatModal(false);
            toast.success("Đã kết nối!", { id: tid });
        } catch (error) {
            console.error("Error starting chat:", error);
            toast.error("Lỗi khi tạo cuộc trò chuyện", { id: tid });
        }
    };

    const filteredFriends = friends.filter(f =>
        f.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSendMessage = async () => {
        const text = inputText.trim();
        if (!text || !activeRoom) return;

        if (!currentUser?.id) {
            toast.error("Phiên làm việc hết hạn, vui lòng đăng nhập lại");
            return;
        }

        setInputText(""); // Xóa ngay để tránh gửi lặp
        try {
            const msgData = {
                senderId: currentUser.id,
                senderName: currentUser.username || "Anonymous",
                text: text,
                type: 'text',
                timestamp: Date.now()
            };
            await FirebaseChatService.sendMessage(activeRoom.firebaseRoomKey, msgData);
        } catch (error) {
            console.error("Error sending message:", error);
            setInputText(text); // Khôi phục nếu lỗi
            toast.error("Gửi tin nhắn thất bại");
        }
    };

    const [showReportUser, setShowReportUser] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const chatAvatarInputRef = useRef(null);

    const handleUpdateAvatar = async (file) => {
        if (!activeRoom || !file) return;
        const tid = toast.loading("Đang tải ảnh lên...");
        try {
            const uploadedUrl = await uploadImage(file, 'chat/avatar');
            const response = await ChatService.updateAvatar(activeRoom.id, uploadedUrl);
            const updatedRoom = response.data;
            setActiveRoom(updatedRoom);
            setConversations(prev => prev.map(c => c.id === updatedRoom.id ? updatedRoom : c));
            setIsEditingAvatar(false);
            toast.success("Đã cập nhật ảnh đại diện!", { id: tid });
        } catch (error) {
            console.error("Error updating avatar:", error);
            toast.error(error.message || "Cập nhật ảnh thất bại", { id: tid });
        }
    };

    const handleRenameName = async () => {
        if (!tempName.trim() || tempName === activeRoom.name) {
            setIsEditingName(false);
            return;
        }

        const tid = toast.loading("Đang đổi tên...");
        try {
            const response = await ChatService.renameRoom(activeRoom.id, tempName);
            const updatedRoom = response.data;

            // Update active room
            setActiveRoom(updatedRoom);

            // Update in conversations list
            setConversations(prev => prev.map(c => c.id === updatedRoom.id ? updatedRoom : c));

            setIsEditingName(false);
            toast.success("Đã đổi tên nhóm!", { id: tid });
        } catch (error) {
            console.error("Error renaming room:", error);
            toast.error("Lỗi khi đổi tên nhóm", { id: tid });
        }
    };

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-background-dark">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="h-full w-full flex overflow-hidden bg-chat-bg relative">
                {/* Conversations List */}
                {/* Conversations List */}
                <div className={`${activeRoom ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-[#3A2A20] bg-background-dark z-10 shrink-0`}>
                    <div className="p-5 border-b border-[#3A2A20] flex justify-between items-center bg-background-dark/95 backdrop-blur-md sticky top-0 z-10">
                        <h2 className="text-xl font-extrabold text-white tracking-tight">Messages</h2>
                        <button
                            onClick={() => setShowNewChatModal(true)}
                            className="size-9 rounded-full bg-[#3A2A20] hover:bg-primary hover:text-[#231810] flex items-center justify-center text-primary transition-all shadow-md"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                        </button>
                    </div>
                    <div className="px-5 py-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-text-secondary text-[20px] group-focus-within:text-primary transition-colors">search</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-4 py-3 border border-[#3A2A20] rounded-xl bg-[#2A1D15] text-white placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                placeholder="Search conversations..."
                                type="text"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                        {conversations
                            .filter(conv => conv.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => setActiveRoom(conv)}
                                    className={`p-3 rounded-xl cursor-pointer relative group flex gap-3 items-center shadow-lg transition-colors ${activeRoom?.id === conv.id ? 'bg-[#3A2A20] border border-[#493222] shadow-black/20' : 'hover:bg-[#2A1D15] border border-transparent'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="size-12 rounded-full bg-cover bg-center group-hover:ring-2 ring-primary/30 transition-all" style={{ backgroundImage: `url("${conv.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className={`font-bold text-sm truncate ${activeRoom?.id === conv.id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>{conv.name || 'Hội thoại'}</h3>
                                        </div>
                                        <p className={`text-text-secondary text-xs truncate`}>Bấm để xem tin nhắn</p>
                                    </div>
                                    {activeRoom?.id === conv.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-xl"></div>}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Chat Area */}
                {/* Chat Area */}
                <div className={`${activeRoom ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-chat-bg relative`}>
                    {activeRoom ? (
                        <>
                            <div className="h-20 px-6 border-b border-[#3A2A20] flex justify-between items-center bg-[#1A120B]/90 backdrop-blur-md z-10 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setActiveRoom(null)} className="md:hidden text-text-secondary hover:text-white">
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>
                                    <div className="relative">
                                        <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-[#3A2A20]" style={{ backgroundImage: `url("${activeRoom.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}></div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                                            {activeRoom.name || 'Đang tải...'}
                                        </h3>
                                        <p className="text-text-secondary text-xs flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Đang kết nối
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-text-secondary">
                                    <button className="size-10 rounded-full hover:bg-[#3A2A20] hover:text-primary flex items-center justify-center transition-all">
                                        <span className="material-symbols-outlined">call</span>
                                    </button>
                                    <button className="size-10 rounded-full hover:bg-[#3A2A20] hover:text-primary flex items-center justify-center transition-all">
                                        <span className="material-symbols-outlined">videocam</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth">
                                {messages.map((msg, index) => {
                                    const isSentByMe = msg.senderId === currentUser.id;
                                    return (
                                        <div key={index} className={`flex gap-3 max-w-[80%] ${isSentByMe ? 'self-end justify-end' : ''}`}>
                                            {!isSentByMe && (
                                                <div className="size-8 rounded-full bg-gray-600 flex items-center justify-center shrink-0 self-end mb-1 ring-1 ring-[#3A2A20] text-[10px] text-white font-bold">
                                                    {msg.senderName?.charAt(0)}
                                                </div>
                                            )}
                                            <div className={`flex flex-col gap-1 ${isSentByMe ? 'items-end' : ''}`}>
                                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isSentByMe ? 'bg-bubble-sent rounded-br-none text-[#231810] font-semibold shadow-orange-500/10' : 'bg-bubble-received rounded-bl-none text-white'}`}>
                                                    <p>{msg.text}</p>
                                                </div>
                                                <div className={`flex items-center gap-1 text-text-secondary text-[10px] ${!isSentByMe ? 'ml-1' : 'mr-1'}`}>
                                                    <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 px-6 bg-[#1A120B] border-t border-[#3A2A20]">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                    className="flex gap-3 items-end"
                                >
                                    <button type="button" className="p-3 text-text-secondary hover:text-white hover:bg-[#3A2A20] rounded-full transition-colors flex-shrink-0">
                                        <span className="material-symbols-outlined">add_circle</span>
                                    </button>
                                    <div className="flex-1 bg-[#2A1D15] border border-[#3A2A20] rounded-3xl flex items-center px-4 py-1.5 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                                        <input
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            className="bg-transparent border-none text-white placeholder-text-secondary/50 focus:ring-0 w-full py-2.5 text-sm"
                                            placeholder="Type a message..."
                                            type="text"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!inputText.trim()}
                                        className="p-3.5 bg-primary hover:bg-orange-600 text-[#231810] rounded-full shadow-lg shadow-orange-500/20 transition-all hover:scale-105 flex-shrink-0 disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-4">
                            <span className="material-symbols-outlined text-6xl opacity-20">forum</span>
                            <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Conversation Details */}
                <aside className="hidden xl:flex w-80 flex-col border-l border-[#3A2A20] bg-background-dark overflow-y-auto shrink-0 z-20">
                    {activeRoom ? (
                        <>
                            <div className="p-8 flex flex-col items-center border-b border-[#3A2A20]">
                                <div className="relative group/avatar">
                                    <div className="size-24 rounded-full bg-cover bg-center ring-4 ring-[#2A1D15] mb-4 shadow-xl" style={{ backgroundImage: `url("${activeRoom?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}></div>
                                    {activeRoom?.type === 'GROUP' && (
                                        <>
                                            <button
                                                onClick={() => chatAvatarInputRef.current?.click()}
                                                className="absolute bottom-4 right-0 size-8 bg-primary rounded-full border-4 border-[#1A120B] text-[#231810] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all shadow-lg hover:scale-110"
                                            >
                                                <span className="material-symbols-outlined text-[18px] font-bold">photo_camera</span>
                                            </button>
                                            <input
                                                type="file"
                                                ref={chatAvatarInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleUpdateAvatar(e.target.files[0])}
                                            />
                                        </>
                                    )}
                                </div>
                                {isEditingName ? (
                                    <div className="flex gap-2 mb-1 w-full px-4">
                                        <input
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            className="bg-[#2A1D15] border border-[#3A2A20] text-white text-sm rounded-lg px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && handleRenameName()}
                                        />
                                        <button onClick={handleRenameName} className="text-primary flex items-center justify-center p-1 rounded hover:bg-[#3A2A20]">
                                            <span className="material-symbols-outlined text-[18px]">check</span>
                                        </button>
                                        <button onClick={() => setIsEditingName(false)} className="text-text-secondary flex items-center justify-center p-1 rounded hover:bg-[#3A2A20]">
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <h2 className="text-white text-xl font-extrabold mb-1 text-center flex items-center gap-2 group/title">
                                        {activeRoom?.name || 'Đang tải...'}
                                        {activeRoom?.type === 'GROUP' && (
                                            <button
                                                onClick={() => { setIsEditingName(true); setTempName(activeRoom.name || ""); }}
                                                className="opacity-0 group-hover/title:opacity-100 text-text-secondary hover:text-primary transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                            </button>
                                        )}
                                    </h2>
                                )}
                                <p className="text-text-secondary text-sm mb-4">{activeRoom?.type === 'GROUP' ? 'Group Chat' : 'Direct Message'}</p>
                                <div className="flex gap-3 w-full justify-center">
                                    <button
                                        onClick={() => activeRoom?.type !== 'GROUP' && navigate(`/dashboard/member/${activeRoom?.otherParticipantId}`)}
                                        className="flex flex-col items-center gap-1 group"
                                    >
                                        <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-primary group-hover:text-[#231810] flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-primary transition-colors">Profile</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1 group">
                                        <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-primary group-hover:text-[#231810] flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                                            <span className="material-symbols-outlined">notifications_off</span>
                                        </div>
                                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-primary transition-colors">Mute</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1 group">
                                        <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-red-500 group-hover:text-white flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                                            <span className="material-symbols-outlined">block</span>
                                        </div>
                                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-red-500 transition-colors">Block</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                {activeRoom?.type === 'GROUP' ? (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-white text-sm font-bold uppercase tracking-wide">Nhóm ({activeRoom.members?.length || 0} thành viên)</h3>
                                        </div>
                                        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                            {activeRoom.members?.map(member => (
                                                <div
                                                    key={member.id}
                                                    onClick={() => navigate(`/dashboard/member/${member.id}`)}
                                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#2A1D15] cursor-pointer group transition-all"
                                                >
                                                    <div className="size-8 rounded-full bg-cover bg-center border border-[#3A2A20]" style={{ backgroundImage: `url("${member.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-sm font-bold truncate group-hover:text-primary transition-colors">{member.fullName}</p>
                                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${member.role === 'ADMIN' ? 'bg-orange-500/20 text-orange-400' : 'bg-[#1A120B] text-text-secondary'}`}>
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                    <span className="material-symbols-outlined text-text-secondary text-sm opacity-0 group-hover:opacity-100 transition-all">chevron_right</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-white text-sm font-bold uppercase tracking-wide">Shared Media</h3>
                                            <button className="text-primary text-xs font-bold hover:underline">See All</button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=150&q=80',
                                                'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=150&q=80',
                                                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80',
                                                'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=150&q=80'
                                            ].map((img, i) => (
                                                <div key={i} className="aspect-square bg-cover bg-center rounded-xl cursor-pointer hover:opacity-80 transition-opacity border border-[#3A2A20]" style={{ backgroundImage: `url("${img}")` }}></div>
                                            ))}
                                            <div className="aspect-square bg-[#2A1D15] rounded-xl flex items-center justify-center text-text-secondary hover:text-white cursor-pointer transition-colors border border-[#3A2A20]">
                                                <span className="text-xs font-bold">+12</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="p-5 border-t border-[#3A2A20]">
                                <h3 className="text-white text-sm font-bold uppercase tracking-wide mb-3">Privacy & Support</h3>
                                <div className="flex flex-col gap-2">
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2A1D15] hover:bg-[#3A2A20] border border-[#3A2A20] group transition-colors text-left">
                                        <div className="flex items-center gap-3 text-text-secondary group-hover:text-white">
                                            <span className="material-symbols-outlined">lock</span>
                                            <span className="text-sm font-medium">Encryption</span>
                                        </div>
                                        <span className="material-symbols-outlined text-text-secondary text-[16px]">chevron_right</span>
                                    </button>


                                    <button
                                        onClick={() => setShowReportUser(true)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2A1D15] hover:bg-[#3A2A20] border border-[#3A2A20] group transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3 text-text-secondary group-hover:text-white">
                                            <span className="material-symbols-outlined">report</span>
                                            <span className="text-sm font-medium">Báo cáo</span>
                                        </div>
                                        <span className="material-symbols-outlined text-text-secondary text-[16px]">
                                            chevron_right
                                        </span>
                                    </button>

                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-text-secondary h-full p-8 text-center gap-3">
                            <span className="material-symbols-outlined text-4xl opacity-20">info</span>
                            <p className="text-xs italic">Chọn một cuộc trò chuyện để xem chi tiết</p>
                        </div>
                    )}
                </aside>
            </div>
            <ReportModal
                isOpen={showReportUser}
                onClose={() => setShowReportUser(false)}
                title={`Báo cáo ${activeRoom?.name || 'người dùng'}`}
                subtitle="Giúp chúng tôi hiểu rõ hơn về sự việc"
                question="Vì sao bạn muốn báo cáo người dùng này?"
                reasons={[
                    "Spam hoặc lừa đảo",
                    "Quấy rối hoặc bắt nạt",
                    "Nội dung không phù hợp",
                    "Tài khoản giả mạo",
                    "Khác",
                ]}
                user={activeRoom}
                targetPayload={{
                    targetType: activeRoom?.type === 'GROUP' ? 'GROUP' : 'USER',
                    targetId: activeRoom?.id,
                }}
                onSubmit={async (data) => {
                    const toastId = toast.loading("Đang gửi báo cáo...", {
                        style: {
                            background: "#1A120B",
                            color: "#FFD8B0",
                        },
                    });

                    try {
                        await reportService.createReport(data);

                        toast.success("Báo cáo thành công!", {
                            id: toastId,
                            style: {
                                background: "#1A120B",
                                color: "#FF8A2A",
                                border: "1px solid #FF8A2A",
                                fontWeight: "700",
                            },
                        });

                        setShowReportUser(false);
                    } catch (err) {
                        toast.error(
                            err?.response?.data?.message ||
                            "Gửi báo cáo thất bại. Vui lòng thử lại!",
                            {
                                id: toastId,
                                style: {
                                    background: "#1A120B",
                                    color: "#FF6A00",
                                },
                            }
                        );
                    }
                }}
            />

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowNewChatModal(false)}></div>
                    <div className="relative bg-[#1A120B] border border-[#3A2A20] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[#3A2A20] flex justify-between items-center bg-[#2A1D15]">
                            <h3 className="text-xl font-bold text-white">Tin nhắn mới</h3>
                            <button onClick={() => setShowNewChatModal(false)} className="text-text-secondary hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-text-secondary text-sm">search</span>
                                </div>
                                <input
                                    className="block w-full pl-9 pr-4 py-2 bg-[#2A1D15] border border-[#3A2A20] rounded-xl text-white placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all"
                                    placeholder="Tìm tên bạn bè..."
                                    type="text"
                                    autoFocus
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                                {filteredFriends.length > 0 ? (
                                    filteredFriends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            onClick={() => {
                                                const isSelected = selectedMembers.some(m => m.id === friend.id);
                                                if (isSelected) {
                                                    setSelectedMembers(prev => prev.filter(m => m.id !== friend.id));
                                                } else {
                                                    setSelectedMembers(prev => [...prev, friend]);
                                                }
                                            }}
                                            className={`flex items-center gap-3 p-3 rounded-2xl hover:bg-[#342418] cursor-pointer group transition-all ${selectedMembers.some(m => m.id === friend.id) ? 'bg-[#3A2A20] ring-1 ring-primary/30' : ''}`}
                                        >
                                            <div className="relative">
                                                <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary/50 transition-all shadow-lg" style={{ backgroundImage: `url("${friend.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}></div>
                                                {selectedMembers.some(m => m.id === friend.id) && (
                                                    <div className="absolute -top-1 -right-1 size-5 bg-primary rounded-full flex items-center justify-center border-2 border-[#1A120B]">
                                                        <span className="material-symbols-outlined text-[12px] text-[#231810] font-bold">check</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-bold text-sm group-hover:text-primary transition-colors">{friend.fullName || friend.username}</p>
                                                <p className="text-text-secondary text-[11px]">@{friend.username}</p>
                                            </div>
                                            {!selectedMembers.length && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStartNewChat(friend.id); }}
                                                    className="material-symbols-outlined text-text-secondary group-hover:text-primary text-[20px] opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    send
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-text-secondary flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-4xl opacity-20">group_off</span>
                                        <p className="text-xs italic">Không tìm thấy bạn bè nào</p>
                                    </div>
                                )}
                            </div>

                            {selectedMembers.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-[#3A2A20] space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                                        {selectedMembers.map(m => (
                                            <div key={m.id} className="flex items-center gap-2 bg-[#3A2A20] pl-1 pr-2 py-1 rounded-full border border-primary/20">
                                                <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${m.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}></div>
                                                <span className="text-[10px] text-white font-medium max-w-[80px] truncate">{m.fullName || m.username}</span>
                                                <button onClick={() => setSelectedMembers(prev => prev.filter(x => x.id !== m.id))} className="text-text-secondary hover:text-red-400">
                                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3">
                                        <input
                                            className="block w-full px-4 py-2.5 bg-[#2A1D15] border border-[#3A2A20] rounded-xl text-white placeholder-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all shadow-inner"
                                            placeholder="Tên nhóm (tùy chọn)..."
                                            type="text"
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                        />
                                        <button
                                            onClick={handleCreateGroup}
                                            className="w-full py-3 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {selectedMembers.length === 1 ? 'chat' : 'group_add'}
                                            </span>
                                            {selectedMembers.length === 1 ? 'Bắt đầu trò chuyện' : `Tạo nhóm (${selectedMembers.length})`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
