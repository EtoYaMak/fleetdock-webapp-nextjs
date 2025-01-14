"use client"
import { FloatingChat } from './FloatingChat';
import { useChatRooms } from '@/hooks/useChat';

export const GlobalFloatingChat = () => {
  const { chatRooms, participants, isLoading: chatRoomsLoading } = useChatRooms();
  if (chatRoomsLoading) return null;
  return (
    <FloatingChat
      chatRooms={chatRooms}
      participants={participants}
    />
  );
}; 