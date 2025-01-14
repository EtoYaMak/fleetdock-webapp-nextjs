"use client"

import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  chatRoomId: string;
  messages: Message[];
}

export function ChatWindow({ chatRoomId, messages }: ChatWindowProps) {
  const { sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(chatRoomId, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "h:mm a");
    }
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return format(messageDate, "MMM d");
  };

  const renderDateSeparator = (date: string) => (
    <div className="flex items-center justify-center my-4">
      <div className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
        {formatMessageDate(date)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender_id === user?.id;
          const showSeparator =
            index === 0 ||
            new Date(message.created_at).toDateString() !==
            new Date(messages[index - 1].created_at).toDateString();

          return (
            <React.Fragment key={message.id}>
              {showSeparator && renderDateSeparator(message.created_at)}
              <div className={`flex relative group ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3",
                    message.is_deleted ? "bg-muted" : isCurrentUser ? "bg-primary text-primary-foreground" : "bg-accent",
                    isCurrentUser ? "rounded-br-sm" : "rounded-bl-sm"
                  )}
                >
                  {message.is_deleted ? (
                    <p className="text-sm italic">Message deleted</p>
                  ) : (
                    <>
                      <p className="break-words text-sm">{message.content}</p>
                      {message.file_url && (
                        <div className="mt-2">
                          <a
                            href={message.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {message.file_name}
                          </a>
                        </div>
                      )}
                    </>
                  )}
                  <div className={cn(
                    "text-xs mt-1",
                    isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {formatMessageDate(message.created_at)}
                  </div>
                </div>
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
            className="flex-1 bg-background rounded-md border px-3 py-2 text-sm
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
}
