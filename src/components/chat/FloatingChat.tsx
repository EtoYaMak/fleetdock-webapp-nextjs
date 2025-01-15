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
import { motion, AnimatePresence } from "framer-motion";
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


  const getParticipantName = (roomId: string) => {
    const room = chatRooms.find((r) => r.id === roomId);
    if (!room || !user) return "";

    // If the user is the broker, show trucker's name, and vice versa
    const participantId = room.broker_id === user.id ? room.trucker_id : room.broker_id;
    return participants[participantId]?.full_name || "Unknown User";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            className={`
              bg-card border rounded-lg shadow-lg 
              ${minimized ? "h-[80px]" : "h-[500px]"}
              w-[360px]
              flex flex-col
            `}
            initial={{ opacity: 0, y: 450 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 400, transition: { duration: 0.2 } }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between shrink-0 bg-primary rounded-t-lg">
              <div className="flex items-center gap-2 min-w-0 text-white">
                {activeChatRoom && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => backToRooms()}
                    className="hover:bg-accent shrink-0 text-white"
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
                  className="hover:bg-accent text-white"
                >
                  {minimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeChat}
                  className="hover:bg-accent text-white"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Content */}
            <motion.div
              className={`
                ${minimized ? "hidden" : "flex-grow overflow-hidden flex flex-col"}
              `}
              animate={{ height: minimized ? 0 : "auto" }}
              transition={{ duration: 0.3 }}
            >
              {activeChatRoom ? (
                <ChatWindow
                  chatRoomId={activeChatRoom}
                  messages={messages[activeChatRoom] || []}
                />
              ) : (
                <div className="p-4 space-y-3 overflow-y-auto flex-grow">
                  {chatRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs">Your chat conversations will appear here</p>
                    </div>
                  ) : (
                    chatRooms.map((room) => {
                      const unreadCount = unreadCounts[room.id] || 0;
                      return (
                        <div
                          key={room.id}
                          onClick={() => openChat(room.id)}
                          className="group p-4 hover:bg-accent rounded-lg cursor-pointer
                            transition-all duration-200 flex items-center gap-3 border border-border/50"
                        >
                          <MessageCircle className="h-5 w-5 text-primary" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="font-medium truncate text-sm">
                                {getParticipantName(room.id)}
                              </p>
                              {unreadCount > 0 && (
                                <Badge variant="default" className="ml-2 bg-primary">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground truncate">
                                Load #{room.load_id.slice(0, 8)}
                              </p>
                              <span className="text-xs text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">
                                {new Date(room.last_activity_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="chat-button"
            className="relative"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={toggleChat}
              size="iconlg"
              className="rounded-full shadow-lg hover:scale-105 
                transition-transform duration-200"
            >
              <MessageCircle className="text-white" size={26} />
            </Button>
            {totalUnreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 min-w-[20px] h-5"
              >
                {totalUnreadCount}
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
