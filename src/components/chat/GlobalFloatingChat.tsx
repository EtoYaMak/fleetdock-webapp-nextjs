"use client"
import { FloatingChat } from './FloatingChat';
import { useAuth } from '@/context/AuthContext';
import { useChatRooms } from '@/hooks/useChat';

export const GlobalFloatingChat = () => {
  const { user } = useAuth();
  const { chatRooms, participants, isLoading } = useChatRooms(user?.id || '');

  if (!user || isLoading) return null;

  return (
    <FloatingChat
      chatRooms={chatRooms}
      participants={participants}
      user={user}
    />
  );
}; 