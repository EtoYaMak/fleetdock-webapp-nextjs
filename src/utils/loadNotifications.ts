import { createNotification } from "@/hooks/useNotifications";
import { NotificationTypes } from "@/types/notificationTypes";

export const notifyLoadStatusChange = async (
  userId: string,
  loadId: string,
  status: string
) => {
  await createNotification(
    userId,
    NotificationTypes.LOAD_STATUS,
    `Load #${loadId.slice(0, 8)} has been ${status}`,
    loadId, // load_id
    null // bid_id
  );
};
