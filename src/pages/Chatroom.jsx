import { formatPublishedDate } from "@/lib/formatPublishedDate";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { io } from 'socket.io-client';
import Swal from "sweetalert2";

const token = localStorage.getItem('token') || "123";

let socket = io.connect('http://localhost:4000', {
    secure: true,
    auth: {
        token: token,
    },
});

export default function Chatroom() {
    const query = useSearchParams();
    const targetId = query[0]?.get('targetId');
    const targetName = query[0]?.get('targetName')?.replace(/_/g, ' ');
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState([]);
    const [me, setMe] = useState(null);
    const [chatwith, setChatwith] = useState(null);
    const chatContainerRef = useRef();
    const once = useRef(true);
    const once2 = useRef(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);

    const navigate = useNavigate();

    const [chatList, setChatList] = useState([
        { id: '1', name: 'John Doe' },
        { id: '3', name: 'Jinx Yun' },
        { id: '789', name: 'Daniel' }
    ]);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);
    };

    // DATE FORMATTER
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    // SENDING MESSAGE WITH LOADER
    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const tempId = Date.now();

        // Immediately display sending message
        const tempMessage = {
            id: tempId,
            text: message,
            createdAt: "Sending...",
            sending: true,
            createdAt: new Date().toISOString(), // ✅ This gives "2025-11-26T17:20:05.369Z"
            user: { id: me?.id, username: me?.name }
        };

        setChats((prev) => [...prev, tempMessage]);
        scrollToBottom();

        setSending(true);

        socket.emit('group-chat', message, () => {
            setSending(false);
        });

        setMessage('');
    };

    // RESET + LOADING WHEN SWITCHING CHATS
    useEffect(() => {
        if (targetId && once.current) {
            setChats([]);
            setLoadingMessages(true);
            socket.emit("join-room", { targetId, targetName });
            once.current = false;
        }
        return () => {
            once.current = true;
        };
    }, [targetId]);

    // SOCKET LISTENERS
    useEffect(() => {
        socket.on("connect", () => {
            console.log('Connected:', socket.id);
        });

        socket.on('error', (error) => {
            console.error('Socket connection error:', error);
            Swal.fire(
                "Error in chats",
                error,
                "error"
            );
        });
        socket.on('me', (arg) => {
            console.log("me:");
            setMe({ id: arg.id, name: arg.role });
        });

        socket.on('chats', (arg) => {
            console.log("chats:", arg);
            setChats(arg || []);
            setLoadingMessages(false);
        });

        socket.on('room_users', (arg) => {
            console.log("room_users:", arg);
            const exists = arg.find(user => user === targetId);
            if (exists) setChatwith(targetName);
        });

        socket.on('message', (msg) => {
            // Remove temporary message bubbles
            console.log("message:", msg);
            setChats(prev => prev.filter((m) => !m.sending));
            setChats(prev => [...prev, msg]);
        });

        return () => {
            socket.off("connect");
            socket.off("me");
            socket.off("chats");
            socket.off("room_users");
            socket.off("message");
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    // Close sidebar on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setShowSidebar(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 w-[100vw]">

            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* LEFT SIDEBAR */}
            <aside className={`
                fixed md:relative z-50 flex flex-col w-64 bg-white border-r shadow-sm transform transition-transform duration-300
                ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                h-full
            `}>
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chatList.map((chat, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                navigate(`/chatroom?targetId=${chat.id}&targetName=${chat.name.replace(/\s/g, "_")}`);
                                setShowSidebar(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 
                                    text-left transition-all duration-200
                                    ${chat.id === targetId ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}
                                `}
                        >
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                                ${chat.id === targetId ? "bg-blue-500" : "bg-gray-400"}
                            `}>
                                {chat.name.charAt(0)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                    chat.id === targetId ? "text-blue-600" : "text-gray-800"
                                }`}>
                                    {chat.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {chat.id === targetId ? "Active now" : "Tap to chat"}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* MAIN CHAT AREA */}
            <div className="flex flex-col flex-1 w-full">

                {/* HEADER */}
                <header className="hidden md:flex items-center gap-3 px-6 py-4 bg-white border-b shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {targetName?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{chatwith || targetName || "Select a chat"}</h2>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Online
                        </p>
                    </div>
                </header>

                {/* CHAT BODY */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50"
                >
                    {!targetId ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <p className="text-lg font-medium">Select a chat to start messaging</p>
                                <p className="text-sm">Choose a conversation from the sidebar</p>
                            </div>
                        </div>
                    ) : loadingMessages ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                <p>Loading messages...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {chats.map((chat, i) => {
                                    const isMe = chat.user?.id === me?.id;
                                    const messageDate = formatDate(chat.created_at || new Date());
                                    // const showDate = messageDate !== lastDate;
                                    let lastDate = messageDate;
                                    console.log("isMe:", isMe, "chat.user.id:", chat.user?.id, "me.id:", me?.id);

                                    return (
                                        <div key={i}>
                                            {/* {showDate && (
                                                <div className="text-center my-3">
                                                    <span className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded-full">
                                                        {messageDate}
                                                    </span>
                                                </div>
                                            )} */}

                                            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                <div
                                                    className={`max-w-[70%] lg:max-w-[60%] px-4 py-2 rounded-2xl shadow-sm
                                                        ${isMe
                                                            ? "bg-blue-500 text-white rounded-br-none"
                                                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                                                        }`}
                                                >
                                                    {!isMe && (
                                                        <p className="text-xs font-medium text-blue-600 mb-1">
                                                            {chat?.user?.username}
                                                        </p>
                                                    )}

                                                    <p className="text-sm leading-relaxed">{chat.text}</p>

                                                    <p className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-500"}`}>
                                                        {chat.sending ? "Sending..." : formatPublishedDate(chat?.createdAt)}
                                                    </p>

                                                    {chat.sending && (
                                                        <div className="flex justify-end mt-1">
                                                            <div className="animate-spin h-3 w-3 border-b-2 border-white"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )}
                </div>

                {/* MESSAGE INPUT */}
                <footer className="p-4 bg-white border-t">
                    <form onSubmit={sendMessage} className="flex items-center gap-3">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            type="text"
                            placeholder="Type a message..."
                            disabled={!targetId}
                            className="flex-1 px-4 py-3 rounded-full bg-gray-100 text-sm outline-none 
                            focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        />

                        <button
                            type="submit"
                            disabled={!message.trim() || !targetId}
                            className="px-5 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 
                            text-white text-sm font-medium rounded-full transition-colors
                            disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span>Send</span>
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
}
