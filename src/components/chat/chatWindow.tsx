"use client"

import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChevronDown, File, Paperclip } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface ChatWindowProps {
  chatRoomId: string;
  messages: Message[];
}

export function ChatWindow({ chatRoomId, messages }: ChatWindowProps) {
  const { sendMessage, participants, editMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      if (editingMessageId) {
        await editMessage(editingMessageId, newMessage);
        setEditingMessageId(null);
      } else {
        await sendMessage(chatRoomId, newMessage);
      }
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send/edit message:", error);
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

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setNewMessage(message.content);
    textareaRef.current?.focus();
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setNewMessage("");
  };

  const canEditMessage = (message: Message) => {
    if (!user) return false;
    const messageDate = new Date(message.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    return message.sender_id === user.id && hoursDiff <= 24 && !message.is_deleted;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender_id === user?.id;
          const showSeparator =
            index === 0 ||
            new Date(message.created_at).toDateString() !==
            new Date(messages[index - 1].created_at).toDateString();

          return (
            <React.Fragment key={message.id}>
              {showSeparator && renderDateSeparator(message.created_at)}
              <div className={`flex relative  ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                {isCurrentUser && canEditMessage(message) && (
                  <div className="absolute right-0 top-0 z-10">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-accent/50 bg-transparent rounded-full"
                        >
                          <ChevronDown className="h-4 w-4 text-white" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[140px] p-0"
                        align="end"
                        side="top"
                      >
                        <button
                          onClick={() => startEditing(message)}
                          className="w-full px-2 py-1.5 text-sm text-left hover:bg-accent"
                        >
                          Edit message
                        </button>
                        {/* TODO: Add delete option */}
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[90%] rounded-lg p-3",
                    message.is_deleted ? "bg-muted" : isCurrentUser ? "bg-primary text-primary-foreground" : "bg-accent",
                    isCurrentUser ? "rounded-br-sm" : "rounded-bl-sm"
                  )}
                >
                  {message.is_deleted ? (
                    <p className="text-sm italic">Message deleted</p>
                  ) : (
                    <>
                      <p className="break-words text-sm max-w-[90%]">{message.content}</p>
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
                    "text-xs mt-1 flex items-center gap-2",
                    isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    <span>{formatMessageDate(message.created_at)}</span>
                    {message.edited_at && (
                      <span className="italic">(edited)</span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        {editingMessageId && (
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-sm text-muted-foreground">Editing message</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={cancelEditing}
            >
              Cancel
            </Button>
          </div>
        )}
        <div className="flex gap-2 w-full">
          <span className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={editingMessageId ? "Edit message..." : "Type a message..."}
              className="flex-1 min-h-[40px] max-h-[150px] resize-none bg-background rounded-md border px-3 py-2 text-sm
              ring-offset-background placeholder:text-muted-foreground
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button type="button" size="icon" variant="ghost" className="absolute right-2 top-2 hover:bg-accent/50 rounded-full">
              <Paperclip size={18} />
            </Button>
          </span>
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
}
