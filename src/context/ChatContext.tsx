"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ChatContextType {
    isOpen: boolean;
    activeChatRoom: string | null;
    openChat: (chatRoomId?: string) => void;
    closeChat: () => void;
    toggleChat: () => void;
    setActiveChatRoom: (chatRoomId: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);

    useEffect(() => {
        // Subscribe to chat_rooms changes
        const subscription = supabase
            .channel('chat_rooms')
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'chat_rooms',
            }, (payload) => {
                // If the deleted room was active, close the chat
                if (payload.old.id === activeChatRoom) {
                    closeChat();
                }
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_rooms',
            }, (payload) => {
                // If the inserted room was active, open the chat
                if (payload.new.id === activeChatRoom) {
                    openChat(payload.new.id);
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [activeChatRoom]);

    const openChat = (chatRoomId?: string) => {
        if (chatRoomId) {
            setActiveChatRoom(chatRoomId);
        }
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setActiveChatRoom(null);
    };

    const toggleChat = () => {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    };

    return (
        <ChatContext.Provider value={{
            isOpen,
            activeChatRoom,
            setActiveChatRoom,
            openChat,
            closeChat,
            toggleChat
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}; 