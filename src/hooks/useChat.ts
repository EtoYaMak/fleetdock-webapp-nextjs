// hooks/useChat.ts
import { useCallback, useEffect, useState } from "react";
import { ChatRoom, Message, ChatParticipant } from "../types/chat";
import { User } from "@/types/auth";
import { supabase } from "@/lib/supabase";

// Hook for managing multiple chat rooms
export function useChatRooms(userId: string) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [participants, setParticipants] = useState<
    Record<string, ChatParticipant>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchChatRooms() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Using separate queries and combining results
        const { data: brokerRooms, error: brokerError } = await supabase
          .from("chat_rooms")
          .select("*")
          .eq("broker_id", userId)
          .order("last_activity_at", { ascending: false });

        const { data: truckerRooms, error: truckerError } = await supabase
          .from("chat_rooms")
          .select("*")
          .eq("trucker_id", userId)
          .order("last_activity_at", { ascending: false });

        if (brokerError) {
          console.error("Error fetching broker rooms:", brokerError);
          throw brokerError;
        }

        if (truckerError) {
          console.error("Error fetching trucker rooms:", truckerError);
          throw truckerError;
        }

        // Combine and sort rooms
        const allRooms = [...(brokerRooms || []), ...(truckerRooms || [])].sort(
          (a, b) =>
            new Date(b.last_activity_at).getTime() -
            new Date(a.last_activity_at).getTime()
        );

        if (allRooms.length === 0) {
          setChatRooms([]);
          setParticipants({});
          setIsLoading(false);
          return;
        }

        setChatRooms(allRooms);

        // Fetch participants for all rooms
        const participantIds = allRooms
          .map((room) =>
            room.broker_id === userId ? room.trucker_id : room.broker_id
          )
          .filter((id): id is string => Boolean(id)); // Type guard to ensure non-null IDs

        if (participantIds.length === 0) {
          setParticipants({});
          setIsLoading(false);
          return;
        }

        const { data: users, error: usersError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", participantIds);

        if (usersError) {
          console.error("Error fetching users:", usersError);
          throw usersError;
        }

        const participantsMap = (users || []).reduce(
          (acc, user) => ({
            ...acc,
            [user.id]: user,
          }),
          {}
        );
        setParticipants(participantsMap);
      } catch (err) {
        console.error("Error in useChatRooms:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChatRooms();
  }, [userId]);

  return { chatRooms, participants, isLoading, error };
}

// Hook for managing a single chat room
export function useChatRoom(loadId: string | null, user: User | null) {
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [otherParticipant, setOtherParticipant] =
    useState<ChatParticipant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!loadId || !user) {
      setIsLoading(false);
      return;
    }

    const fetchChatRoom = async () => {
      try {
        const { data: chatRoom, error: chatError } = await supabase
          .from("chat_rooms")
          .select("*")
          .eq("load_id", loadId)
          .single();

        if (chatError) throw chatError;
        setChatRoom(chatRoom);

        const { data: participant, error: participantError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq(
            "id",
            chatRoom.broker_id === user.id
              ? chatRoom.trucker_id
              : chatRoom.broker_id
          )
          .single();

        if (participantError) throw participantError;
        setOtherParticipant(participant);
      } catch (err) {
        setError(err as Error);
        console.error("Error in useChatRoom:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRoom();
  }, [loadId, user]);

  return { chatRoom, otherParticipant, isLoading, error };
}

// Hook for managing messages in a chat room
export function useChatMessages(chatRoomId: string | null, user: User | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatRoomId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [chatRoomId]);

  const sendMessage = async (
    content: string,
    options: {
      replyToId?: string;
      fileUrl?: string;
      fileName?: string;
      fileType?: string;
      fileSize?: number;
    } = {}
  ) => {
    if (!chatRoomId || !user) return;

    const message = {
      chat_room_id: chatRoomId,
      sender_id: user.id,
      content,
      message_type: "text",
      file_url: options.fileUrl,
      file_name: options.fileName,
      file_type: options.fileType,
      file_size: options.fileSize,
      reply_to_id: options.replyToId,
    };

    const { error } = await supabase.from("messages").insert(message);
    if (error) throw error;
  };

  const markAsRead = async () => {
    if (!chatRoomId || !user) return;

    const { error } = await supabase
      .from("messages")
      .update({
        status: "read",
        read_at: new Date().toISOString(),
      })
      .eq("chat_room_id", chatRoomId)
      .neq("sender_id", user.id)
      .is("read_at", null);

    if (error) throw error;
  };

  useEffect(() => {
    if (!chatRoomId) return;

    const subscription = supabase
      .channel(`chat:${chatRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chatRoomId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    markAsRead,
  };
}
