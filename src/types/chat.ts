// types/chat.ts
export type MessageStatus = "sent" | "delivered" | "read";
export type MessageType = "text" | "file" | "system";

export interface ChatRooms{
  chatRooms: ChatRoom[];
  participants: Record<string, ChatParticipant>;
}
export interface ChatRoom {
  id: string;
  load_id: string;
  bid_id: string;
  broker_id: string;
  trucker_id: string;
  created_at: string;
  archived_by_broker: boolean;
  archived_by_trucker: boolean;
  last_activity_at: string;
}

export interface Message {
  id: string;
  chat_room_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  status: MessageStatus;
  created_at: string;
  read_at: string | null;
  edited_at: string | null;
  is_deleted: boolean;
  is_pinned: boolean;
  file_url: string | null;
  file_type: string | null;
  file_name: string | null;
  file_size: number | null;
  original_content: string | null;
  reply_to_id: string | null;
}

export interface ChatParticipant {
  id: string;
  full_name: string;
  avatar_url?: string | null;
}
