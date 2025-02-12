"use client"

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { ChatRoom, Message, ChatParticipant } from "@/types/chat";

interface ChatContextType {
    isOpen: boolean;
    activeChatRoom: string | null;
    chatRooms: ChatRoom[];
    participants: Record<string, ChatParticipant>;
    messages: Record<string, Message[]>;
    unreadCounts: Record<string, number>;
    totalUnreadCount: number;
    openChat: (roomId: string) => void;
    closeChat: () => void;
    toggleChat: () => void;
    backToRooms: () => void;
    sendMessage: (
        roomId: string,
        content: string,
        attachmentData: { url: string; name: string; size: number; type: string } | null,
        replyToId?: string
    ) => Promise<void>;
    uploadFile: (file: File, roomId: string) => Promise<{ url: string; type: string; name: string; size: number }>;
    editMessage: (messageId: string, newContent: string) => Promise<void>;
    getFileUrl: (filePath: string) => Promise<string | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [participants, setParticipants] = useState<Record<string, ChatParticipant>>({});
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

    // Total unread count calculated from individual counts.
    const totalUnreadCount = useMemo(() => {
        return Object.values(unreadCounts).reduce((a, b) => a + b, 0);
    }, [unreadCounts]);

    // Use a ref to hold activeChatRoom to avoid including it in dependency arrays.
    const activeChatRoomRef = useRef(activeChatRoom);
    useEffect(() => {
        activeChatRoomRef.current = activeChatRoom;
    }, [activeChatRoom]);

    // Fetch initial chat rooms when user ID is available.
    useEffect(() => {
        if (!user?.id) return;

        async function fetchChatRooms() {
            const { data: rooms, error } = await supabase
                .from("chat_rooms")
                .select("*")
                .or(`broker_id.eq.${user?.id},trucker_id.eq.${user?.id}`)
                .order("last_activity_at", { ascending: false });

            if (error) {
                console.error("Error fetching chat rooms:", error);
                return;
            }

            setChatRooms(rooms || []);

            // Fetch participant profiles (exclude current user)
            if (rooms?.length) {
                const participantIds = Array.from(
                    new Set(
                        rooms.map((room) =>
                            room.broker_id === user?.id ? room.trucker_id : room.broker_id
                        )
                    )
                );

                const { data: profiles, error: profilesError } = await supabase
                    .from("profiles")
                    .select("id, full_name")
                    .in("id", participantIds);

                if (profilesError) {
                    console.error("Error fetching participant profiles:", profilesError);
                } else if (profiles) {
                    const participantsMap = profiles.reduce<Record<string, ChatParticipant>>(
                        (acc, profile) => ({
                            ...acc,
                            [profile.id]: {
                                id: profile.id,
                                full_name: profile.full_name,
                            },
                        }),
                        {}
                    );
                    setParticipants(participantsMap);
                }
            }

            // Initialize messages placeholder for each chat room.
            const initialMessages: Record<string, Message[]> = {};
            rooms?.forEach((room) => {
                initialMessages[room.id] = [];
            });
            setMessages(initialMessages);
        }

        fetchChatRooms();
    }, [user?.id]);

    // Real-time subscription for chat rooms (minimal dependency: only user id).
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase.channel("chat-rooms-changes");

        // DELETE event
        channel.on(
            "postgres_changes",
            {
                event: "DELETE",
                schema: "public",
                table: "chat_rooms",
            },
            (payload) => {
                const deletedRoomId = payload.old.id;
                setChatRooms((prev) => prev.filter((room) => room.id !== deletedRoomId));
                setMessages((prev) => {
                    const newMessages = { ...prev };
                    delete newMessages[deletedRoomId];
                    return newMessages;
                });

                if (activeChatRoomRef.current === deletedRoomId) {
                    setActiveChatRoom(null);
                    setIsOpen(false);
                }
            }
        );

        // Common handler for INSERT and UPDATE
        const handleChatRoomChange = (payload: any) => {
            const { eventType, new: newRoom } = payload;
            if (eventType === "INSERT") {
                setChatRooms((prev) => {
                    const exists = prev.some((room) => room.id === newRoom.id);
                    if (exists) return prev;
                    return [...prev, newRoom].sort(
                        (a, b) =>
                            new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime()
                    );
                });
                setMessages((prev) => ({ ...prev, [newRoom.id]: [] }));
            } else if (eventType === "UPDATE") {
                setChatRooms((prev) =>
                    prev
                        .map((room) => (room.id === newRoom.id ? newRoom : room))
                        .sort(
                            (a, b) =>
                                new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime()
                        )
                );
            }
        };

        // INSERT events for both broker and trucker
        channel.on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "chat_rooms",
                filter: `broker_id=eq.${user.id}`,
            },
            handleChatRoomChange
        );
        channel.on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "chat_rooms",
                filter: `trucker_id=eq.${user.id}`,
            },
            handleChatRoomChange
        );

        channel.subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [user?.id]);

    // Memoize chat room IDs to ensure message subscription only changes when IDs change.
    const chatRoomIds = useMemo(() => chatRooms.map((room) => room.id), [chatRooms]);

    // Fetch message history and subscribe to new messages.
    useEffect(() => {
        if (!user?.id || chatRoomIds.length === 0) return;

        async function fetchMessageHistory() {
            const { data: messageHistory, error } = await supabase
                .from("messages")
                .select("*")
                .in("chat_room_id", chatRoomIds)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching message history:", error);
                return;
            }

            // Group messages by chat room.
            const messagesByRoom = messageHistory?.reduce((acc, message) => {
                acc[message.chat_room_id] = acc[message.chat_room_id] || [];
                acc[message.chat_room_id].push(message);
                return acc;
            }, {} as Record<string, Message[]>);

            setMessages(messagesByRoom || {});

            // Calculate unread counts.
            const newUnreadCounts: Record<string, number> = {};
            messageHistory?.forEach((message) => {
                if (message.sender_id !== user?.id && (!message.read_at || message.status !== "read")) {
                    newUnreadCounts[message.chat_room_id] = (newUnreadCounts[message.chat_room_id] || 0) + 1;
                }
            });
            setUnreadCounts(newUnreadCounts);
        }

        fetchMessageHistory();

        const messageChannel = supabase.channel("messages");
        const filterStr = chatRoomIds.join(",");

        messageChannel.on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `chat_room_id=in.(${filterStr})`,
            },
            (payload: any) => {
                const newMessage = payload.new as Message;
                const roomId = newMessage.chat_room_id;
                setMessages((prev) => ({
                    ...prev,
                    [roomId]: [...(prev[roomId] || []), newMessage],
                }));
                if (newMessage.sender_id !== user.id && activeChatRoomRef.current !== roomId) {
                    setUnreadCounts((prev) => ({
                        ...prev,
                        [roomId]: (prev[roomId] || 0) + 1,
                    }));
                }
            }
        );

        messageChannel.subscribe();
        return () => {
            messageChannel.unsubscribe();
        };
    }, [user?.id, chatRoomIds]);

    // Mark messages as read for the active chat room.
    useEffect(() => {
        if (!user?.id || !activeChatRoom) return;

        const markMessagesAsRead = async () => {
            const timestamp = new Date().toISOString();
            const { error } = await supabase
                .from("messages")
                .update({ read_at: timestamp, status: "read" })
                .eq("chat_room_id", activeChatRoom)
                .eq("status", "sent")
                .neq("sender_id", user.id);

            if (error) {
                console.error("Error marking messages as read:", error);
                return;
            }

            // Update the local state optimistically.
            setMessages((prev) => ({
                ...prev,
                [activeChatRoom]: (prev[activeChatRoom] || []).map((msg) =>
                    msg.sender_id !== user.id && msg.status === "sent"
                        ? { ...msg, read_at: timestamp, status: "read" }
                        : msg
                ),
            }));

            setUnreadCounts((prev) => {
                const updated = { ...prev };
                updated[activeChatRoom] = 0;
                return updated;
            });
        };

        markMessagesAsRead();
        const interval = setInterval(markMessagesAsRead, 5000);
        return () => clearInterval(interval);
    }, [user?.id, activeChatRoom]);

    // Chat action handlers.
    const openChat = useCallback((roomId: string) => {
        setActiveChatRoom(roomId);
        setIsOpen(true);
    }, []);

    const closeChat = useCallback(() => {
        setIsOpen(false);
        setActiveChatRoom(null);
    }, []);

    const toggleChat = useCallback(() => {
        setIsOpen((prev) => {
            if (prev) {
                setActiveChatRoom(null);
            }
            return !prev;
        });
    }, []);

    const backToRooms = useCallback(() => {
        setIsOpen(true);
        setActiveChatRoom(null);
    }, []);

    const sendMessage = useCallback(
        async (
            roomId: string,
            content: string,
            attachmentData: { url: string; name: string; size: number; type: string } | null,
            replyToId?: string
        ) => {
            if (!user?.id) return;
            const { error } = await supabase.from("messages").insert({
                chat_room_id: roomId,
                sender_id: user.id,
                content,
                file_url: attachmentData?.url || null,
                file_type: attachmentData?.type || null,
                file_name: attachmentData?.name || null,
                file_size: attachmentData?.size || null,
                status: "sent",
                read_at: null,
                reply_to_id: replyToId || null,
            });
            if (error) {
                console.error("Error sending message:", error);
                throw error;
            }
        },
        [user?.id]
    );

    const optimizeImage = useCallback(async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }
                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1080;
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Could not convert canvas to blob"));
                        }
                    },
                    "image/webp",
                    0.8
                );
            };
            img.onerror = () => reject(new Error("Could not load image"));
            img.src = URL.createObjectURL(file);
        });
    }, []);

    const uploadFile = useCallback(
        async (file: File, roomId: string) => {
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `${Date.now()}-${cleanFileName}`;
            const filePath = `${user?.id}/${roomId}/${fileName}`;

            try {
                if (file.type.startsWith("image/")) {
                    const optimizedImage = await optimizeImage(file);
                    const extFilePath = filePath.replace(/\.[^/.]+$/, ".webp");
                    const { error } = await supabase.storage
                        .from("chat-attachments")
                        .upload(extFilePath, optimizedImage);
                    if (error) throw error;
                    return {
                        url: extFilePath,
                        type: "image",
                        name: file.name,
                        size: optimizedImage.size,
                    };
                } else {
                    const { error } = await supabase.storage
                        .from("chat-attachments")
                        .upload(filePath, file);
                    if (error) throw error;
                    return {
                        url: filePath,
                        type: file.type.startsWith("image/") ? "image" : "file",
                        name: file.name,
                        size: file.size,
                    };
                }
            } catch (error) {
                console.error("Error uploading file:", error);
                throw error;
            }
        },
        [optimizeImage, user?.id]
    );

    const editMessage = useCallback(
        async (messageId: string, newContent: string) => {
            if (!user?.id) return;
            const { error } = await supabase.rpc("edit_message", {
                p_message_id: messageId,
                p_new_content: newContent,
            });
            if (error) {
                console.error("Error editing message:", error);
                throw error;
            }
            // Optimistic UI update.
            setMessages((prev) => {
                const updated = { ...prev };
                Object.keys(updated).forEach((roomId) => {
                    updated[roomId] = updated[roomId].map((msg) =>
                        msg.id === messageId
                            ? {
                                ...msg,
                                content: newContent,
                                edited_at: new Date().toISOString(),
                                original_content: msg.original_content || msg.content,
                            }
                            : msg
                    );
                });
                return updated;
            });
        },
        [user?.id]
    );

    const getFileUrl = useCallback(async (filePath: string) => {
        const { data } = await supabase.storage
            .from("chat-attachments")
            .createSignedUrl(filePath, 3600);
        return data?.signedUrl || null;
    }, []);

    const value = {
        isOpen,
        activeChatRoom,
        chatRooms,
        participants,
        messages,
        unreadCounts,
        totalUnreadCount,
        openChat,
        backToRooms,
        closeChat,
        toggleChat,
        sendMessage,
        uploadFile,
        editMessage,
        getFileUrl,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
} 