"use client"
import React, { useEffect, useRef } from "react";
import { ChatParticipant } from "@/types/chat";
import { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChatMessages } from "@/hooks/useChat";
import { ChatLoadingSkeleton } from "./ChatLoadingSkeleton";

interface ChatWindowProps {
  chatRoomId: string;
  otherParticipant: ChatParticipant;
  user: User;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatRoomId,
  otherParticipant,
  user,
}) => {
  const { messages, isLoading, sendMessage } = useChatMessages(chatRoomId, user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = React.useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const formatDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Today
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
    }
    // Yesterday
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    // Other dates
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage("");
  };

  const renderDateSeparator = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let separatorText = '';
    if (messageDate.toDateString() === today.toDateString()) {
      separatorText = 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      separatorText = 'Yesterday';
    } else {
      separatorText = messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    return (
      <div className="flex items-center justify-center my-4">
        <div className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
          {separatorText}
        </div>
      </div>
    );
  };

  if (isLoading) return <ChatLoadingSkeleton />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => {
          // Add separator if it's first message or date changes from previous message
          const showSeparator = index === 0 ||
            new Date(message.created_at).toDateString() !==
            new Date(messages[index - 1].created_at).toDateString();

          return (
            <React.Fragment key={message.id}>
              {showSeparator && renderDateSeparator(message.created_at)}
              <div className={`flex relative ${message.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-lg p-2 mb-5 ${message.sender_id === user.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                    }`}
                >
                  <p className="break-words text-sm flex flex-col">{message.content} </p>
                </div>
                <span className="text-xs text-muted-foreground absolute bottom-0 ">{formatDate(message.created_at)}</span>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-input rounded-md border px-3 py-2 text-sm
              ring-offset-background placeholder:text-muted-foreground
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};
