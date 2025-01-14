// types/chat.ts
export type MessageStatus = "sent" | "delivered" | "read";
export type MessageType = "text" | "file" | "system";

export interface ChatRooms {
  chatRooms: ChatRoom[];
  participants: Record<string, ChatParticipant>;
}
export interface ChatRoom {
  id: string;
  broker_id: string;
  trucker_id: string;
  load_id: string;
  created_at: string;
  last_activity_at: string;
  profiles_broker: Profile;
  profiles_trucker: Profile;
}

export interface Message {
  id: string;
  chat_room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  status: "sent" | "delivered" | "read";
  message_type: "text" | "file" | "system";
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  is_deleted?: boolean;
  original_content?: string;
  is_pinned?: boolean;
  reply_to_id?: string;
  thread_participants?: string[];
}

export interface ChatParticipant {
  id: string;
  full_name: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}
