"use client"
import React, { useState } from "react";
import { ChatRoom, ChatParticipant } from "@/types/chat";
import { User } from "@/types/auth";
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

interface FloatingChatProps {
  chatRooms: ChatRoom[];
  participants: Record<string, ChatParticipant>;
  user: User;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({
  chatRooms,
  participants,
  user,
}) => {
  const { isOpen, activeChatRoom, closeChat, toggleChat, setActiveChatRoom, openChat } = useChat();
  const [minimized, setMinimized] = useState(false);

  const handleToggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      setMinimized(false); // Always open in expanded state
      toggleChat();
    }
  };

  const getParticipantName = (chatRoom: ChatRoom) => {
    const participantId = chatRoom.broker_id === user.id
      ? chatRoom.trucker_id
      : chatRoom.broker_id;
    return participants[participantId]?.full_name;
  };
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className={`
          bg-card border rounded-lg shadow-lg 
          transition-all duration-300 ease-in-out
          ${minimized ? 'h-[80px]' : 'h-[500px]'}
          w-[360px]
          flex flex-col
        `}>
          {/* Unified Header - with truncation */}
          <div className="p-3 border-b flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0"> {/* min-w-0 allows truncation */}
              {activeChatRoom && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveChatRoom(null)}
                  className="hover:bg-accent shrink-0" // shrink-0 prevents button from shrinking
                >
                  <ArrowLeft size={18} />
                </Button>
              )}
              <h3 className="font-semibold truncate"> {/* truncate long text */}
                {activeChatRoom
                  ? getParticipantName(chatRooms.find(room => room.id === activeChatRoom)!)
                  : 'Messages'
                }
              </h3>
            </div>
            <div className="flex gap-2 shrink-0"> {/* shrink-0 prevents buttons from shrinking */}
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

          {/* Chat Content - with flex-grow and overflow handling */}
          <div className={`
            transition-all duration-300 ease-in-out
            ${minimized ? 'hidden' : 'flex-grow overflow-hidden flex flex-col'}
          `}>
            {activeChatRoom ? (
              <ChatWindow
                chatRoomId={activeChatRoom}
                otherParticipant={participants[activeChatRoom]}
                user={user}
              />
            ) : (
              <div className="p-4 space-y-2 overflow-y-auto flex-grow">
                {chatRooms.map((room) => {
                  const participantId = room.broker_id === user.id
                    ? room.trucker_id
                    : room.broker_id;
                  const participant = participants[participantId];

                  return (
                    <div
                      key={room.id}
                      onClick={() => openChat(room.id)}
                      className="p-3 hover:bg-accent rounded-lg cursor-pointer
                        transition-colors duration-200"
                    >
                      <p className="font-medium truncate">
                        {participant?.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        Load #{room.load_id.slice(0, 8)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <Button
          onClick={toggleChat}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:scale-105 
            transition-transform duration-200"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
};
