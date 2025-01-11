import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const createNotification = async (
  userId: string,
  type: string,
  message: string,
  loadId: string | null,
  bidId: string | null
) => {
  const { error } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      type: type,
      message: message,
      load_id: loadId,
      bid_id: bidId,
    },
  ]);

  if (error) console.error("Error creating notification:", error);
};

export const broadcastNotification = async (
  type: string,
  message: string,
  userIds: string[] | null
) => {
  if (userIds) {
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      type,
      message,
      is_read: false,
    }));
    const { error } = await supabase
      .from("notifications")
      .insert(notifications);
    if (error) {
      console.error("Error broadcasting notification:", error);
    }
  } else {
    const { data: users } = await supabase.from("profiles").select("id");
    const notifications = users?.map((user) => ({
      user_id: user.id,
      type,
      message,
      is_read: false,
    }));
    const { error } = await supabase
      .from("notifications")
      .insert(notifications);
    if (error) {
      console.error("Error broadcasting notification:", error);
    }
  }
};
