"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  ArrowLeft,
} from "lucide-react";
import { ChatWindow } from "./chatWindow";
import { useChat } from "@/context/ChatContext";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export function FloatingChat() {
  const {
    isOpen,
    activeChatRoom,
    chatRooms,
    participants,
    messages,
    unreadCounts,
    totalUnreadCount,
    openChat,
    closeChat,
    backToRooms,
    toggleChat,
  } = useChat();
  const { user } = useAuth();
  const [minimized, setMinimized] = useState(false);

  const handleToggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      setMinimized(false);
      toggleChat();
    }
  };

  const getParticipantName = (roomId: string) => {
    const room = chatRooms.find((r) => r.id === roomId);
    if (!room || !user) return "";

    // If the user is the broker, show trucker's name, and vice versa
    const participantId = room.broker_id === user.id ? room.trucker_id : room.broker_id;
    return participants[participantId]?.full_name || "Unknown User";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div
          className={`
            bg-card border rounded-lg shadow-lg 
            transition-all duration-300 ease-in-out
            ${minimized ? "h-[80px]" : "h-[500px]"}
            w-[360px]
            flex flex-col
          `}
        >
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              {activeChatRoom && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => backToRooms()}
                  className="hover:bg-accent shrink-0"
                >
                  <ArrowLeft size={18} />
                </Button>
              )}
              <h3 className="font-semibold truncate">
                {activeChatRoom
                  ? getParticipantName(activeChatRoom)
                  : "Messages"}
              </h3>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMinimized(!minimized)}
                className="hover:bg-accent"
              >
                {minimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleChat}
                className="hover:bg-accent"
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div
            className={`
              transition-all duration-300 ease-in-out
              ${minimized ? "hidden" : "flex-grow overflow-hidden flex flex-col"}
            `}
          >
            {activeChatRoom ? (
              <ChatWindow
                chatRoomId={activeChatRoom}
                messages={messages[activeChatRoom] || []}
              />
            ) : (
              <div className="p-4 space-y-2 overflow-y-auto flex-grow">
                {chatRooms.map((room) => {
                  const unreadCount = unreadCounts[room.id] || 0;
                  return (
                    <div
                      key={room.id}
                      onClick={() => openChat(room.id)}
                      className="p-3 hover:bg-accent rounded-lg cursor-pointer
                        transition-colors duration-200 flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {getParticipantName(room.id)}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          Load #{room.load_id.slice(0, 8)}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <Badge variant="default" className="ml-2">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <Button
            onClick={toggleChat}
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg hover:scale-105 
              transition-transform duration-200"
          >
            <MessageCircle size={24} />
          </Button>
          {totalUnreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 min-w-[20px] h-5"
            >
              {totalUnreadCount}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
