"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
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
    sendMessage: (roomId: string, content: string, attachmentData: { url: string, name: string, size: number, type: string } | null, replyToId?: string) => Promise<void>;
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

    // Calculate total unread count
    const totalUnreadCount = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

    // Fetch initial chat rooms
    useEffect(() => {
        if (!user?.id) return;

        async function fetchChatRooms() {
            const { data: rooms, error } = await supabase
                .from("chat_rooms")
                .select('*')
                .or(`broker_id.eq.${user?.id},trucker_id.eq.${user?.id}`)
                .order("last_activity_at", { ascending: false });

            if (error) {
                console.error("Error fetching chat rooms:", error);
                return;
            }

            setChatRooms(rooms || []);

            // Get unique participant IDs (excluding current user)
            if (rooms?.length) {
                const participantIds = Array.from(new Set(
                    rooms.map(room =>
                        room.broker_id === user?.id ? room.trucker_id : room.broker_id
                    )
                ));

                // Fetch participant profiles
                const { data: profiles, error: profilesError } = await supabase
                    .from("profiles")
                    .select("id, full_name")
                    .in("id", participantIds);

                if (profilesError) {
                    console.error("Error fetching participant profiles:", profilesError);
                } else if (profiles) {
                    // Create a map of participant profiles
                    const participantsMap = profiles.reduce<Record<string, ChatParticipant>>(
                        (acc, profile) => ({
                            ...acc,
                            [profile.id]: {
                                id: profile.id,
                                full_name: profile.full_name
                            }
                        }),
                        {}
                    );
                    setParticipants(participantsMap);
                }
            }

            // Initialize messages state for each room
            const messagesObj: Record<string, Message[]> = {};
            rooms?.forEach((room) => {
                messagesObj[room.id] = [];
            });
            setMessages(messagesObj);
        }

        fetchChatRooms();
    }, [user?.id]);

    // Subscribe to chat rooms changes
    useEffect(() => {
        if (!user?.id) return;

        // Single subscription for all chat room changes
        const chatRoomsSubscription = supabase
            .channel("chat-rooms-changes")
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "chat_rooms",
                },
                (payload) => {

                    // Immediately update rooms without checking user ID
                    setChatRooms((prev) => {
                        const filtered = prev.filter((room) => room.id !== payload.old.id);
                        return filtered;
                    });

                    // Clean up associated state
                    setMessages((prev) => {
                        const newMessages = { ...prev };
                        delete newMessages[payload.old.id];
                        return newMessages;
                    });

                    // Close chat if it was active
                    if (activeChatRoom === payload.old.id) {
                        setActiveChatRoom(null);
                        setIsOpen(false);
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_rooms",
                    filter: `broker_id=eq.${user?.id}`,
                },
                (payload) => {
                    handleChatRoomChange(payload);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_rooms",
                    filter: `trucker_id=eq.${user?.id}`,
                },
                (payload) => {
                    handleChatRoomChange(payload);
                }
            )
            .subscribe();

        function handleChatRoomChange(payload: any) {

            switch (payload.eventType) {
                case "INSERT":
                    setChatRooms((prev) => {
                        // Check if room already exists
                        const exists = prev.some(room => room.id === payload.new.id);
                        if (exists) return prev;
                        return [...prev, payload.new as ChatRoom].sort(
                            (a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime()
                        );
                    });
                    setMessages((prev) => ({
                        ...prev,
                        [payload.new.id]: [],
                    }));
                    break;

                case "UPDATE":
                    setChatRooms((prev) =>
                        prev.map((room) =>
                            room.id === payload.new.id ? payload.new : room
                        ).sort(
                            (a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime()
                        )
                    );
                    break;
            }
        }

        return () => {
            chatRoomsSubscription.unsubscribe();
        };
    }, [user?.id, activeChatRoom, chatRooms]);

    // Subscribe to messages changes
    useEffect(() => {
        if (!user?.id || chatRooms.length === 0) return;

        // Fetch message history for all rooms
        async function fetchMessageHistory() {
            const { data: messageHistory, error } = await supabase
                .from("messages")
                .select("*")
                .in("chat_room_id", chatRooms.map(room => room.id))
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching message history:", error);
                return;
            }

            // Group messages by chat room
            const messagesByRoom = messageHistory?.reduce((acc, message) => {
                if (!acc[message.chat_room_id]) {
                    acc[message.chat_room_id] = [];
                }
                acc[message.chat_room_id].push(message);
                return acc;
            }, {} as Record<string, Message[]>);

            setMessages(messagesByRoom || {});

            // Calculate unread counts based on both read_at and status fields
            const counts: Record<string, number> = {};
            messageHistory?.forEach((message) => {
                if (message.sender_id !== user?.id &&
                    (!message.read_at || message.status !== 'read')) {
                    counts[message.chat_room_id] = (counts[message.chat_room_id] || 0) + 1;
                }
            });
            setUnreadCounts(counts);
        }

        fetchMessageHistory();

        // Subscribe to new messages
        const subscription = supabase
            .channel("messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `chat_room_id=in.(${chatRooms.map(room => room.id).join(",")})`,
                },
                async (payload: any) => {
                    const newMessage = payload.new as Message;
                    const roomId = newMessage.chat_room_id;

                    setMessages((prev) => ({
                        ...prev,
                        [roomId]: [...(prev[roomId] || []), newMessage],
                    }));

                    // Only update unread count if the chat room isn't currently open
                    if (newMessage.sender_id !== user?.id && activeChatRoom !== roomId) {
                        setUnreadCounts((prev) => ({
                            ...prev,
                            [roomId]: (prev[roomId] || 0) + 1,
                        }));
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user?.id, chatRooms]);

    // Mark messages as read when viewing them in an open chat room
    useEffect(() => {
        if (!user?.id || !activeChatRoom) return;

        async function markMessagesAsRead() {
            const timestamp = new Date().toISOString();
            const roomId = activeChatRoom as string;

            const { error } = await supabase
                .from("messages")
                .update({
                    read_at: timestamp,
                    status: 'read'
                })
                .eq("chat_room_id", roomId)
                .eq("status", 'sent')
                .neq("sender_id", user?.id);

            if (error) {
                console.error("Error marking messages as read:", error);
                return;
            }

            // Update local messages state to reflect read status
            setMessages((prev) => {
                if (!roomId) return prev;
                return {
                    ...prev,
                    [roomId]: (prev[roomId] || []).map((msg: Message) =>
                        msg.sender_id !== user?.id && msg.status === 'sent'
                            ? { ...msg, read_at: timestamp, status: 'read' }
                            : msg
                    )
                };
            });

            // Reset unread count for this room
            setUnreadCounts((prev) => {
                const newCounts = { ...prev };
                if (roomId) {
                    newCounts[roomId] = 0;
                }
                return newCounts;
            });
        }

        // Mark messages as read immediately and set up an interval to check periodically
        markMessagesAsRead();
        const interval = setInterval(markMessagesAsRead, 5000);

        return () => clearInterval(interval);
    }, [user?.id, activeChatRoom]);



    const openChat = (roomId: string) => {
        setActiveChatRoom(roomId);
        setIsOpen(true);
    };
    const closeChat = () => {
        setIsOpen(false);
        setActiveChatRoom(null);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setActiveChatRoom(null);
        }
    };

    const backToRooms = () => {
        setIsOpen(true);
        setActiveChatRoom(null);
    };

    const sendMessage = async (
        roomId: string,
        content: string,
        attachmentData: { url: string, name: string, size: number, type: string } | null,
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
            status: 'sent',
            read_at: null,
            reply_to_id: replyToId || null
        });

        if (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    };


    const uploadFile = async (file: File, roomId: string) => {
        // Create a clean filename (remove special characters)
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${cleanFileName}`;
        // Start path with user ID to match the policy
        const filePath = `${user?.id}/${roomId}/${fileName}`;

        try {
            if (file.type.startsWith('image/')) {
                // For images, convert to webp and optimize
                const optimizedImage = await optimizeImage(file);
                const { data, error: uploadError } = await supabase.storage
                    .from('chat-attachments')
                    .upload(filePath.replace(/\.[^/.]+$/, '.webp'), optimizedImage);

                if (uploadError) throw uploadError;

                return {
                    url: filePath.replace(/\.[^/.]+$/, '.webp'),
                    type: 'image',
                    name: file.name,
                    size: optimizedImage.size
                };
            } else {
                // For non-image files, upload as is
                const { data, error: uploadError } = await supabase.storage
                    .from('chat-attachments')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                return {
                    url: filePath,
                    type: file.type.startsWith('image/') ? 'image' : 'file',
                    name: file.name,
                    size: file.size
                };
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    // Helper function to optimize images
    const optimizeImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Set maximum dimensions while maintaining aspect ratio
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
                            reject(new Error('Could not convert canvas to blob'));
                        }
                    },
                    'image/webp',
                    0.8 // quality
                );
            };
            img.onerror = () => reject(new Error('Could not load image'));
            img.src = URL.createObjectURL(file);
        });
    };

    const editMessage = async (messageId: string, newContent: string) => {
        if (!user?.id) return;

        const { error } = await supabase.rpc('edit_message', {
            p_message_id: messageId,
            p_new_content: newContent
        });

        if (error) {
            console.error("Error editing message:", error);
            throw error;
        }

        // Update local state optimistically
        setMessages((prev) => {
            const newMessages = { ...prev };
            Object.keys(newMessages).forEach((roomId) => {
                newMessages[roomId] = newMessages[roomId].map((msg) =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            content: newContent,
                            edited_at: new Date().toISOString(),
                            original_content: msg.original_content || msg.content
                        }
                        : msg
                );
            });
            return newMessages;
        });
    };

    const getFileUrl = async (filePath: string) => {
        const { data } = await supabase.storage
            .from('chat-attachments')
            .createSignedUrl(filePath, 3600); // 1 hour expiry

        return data?.signedUrl || null;
    };

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