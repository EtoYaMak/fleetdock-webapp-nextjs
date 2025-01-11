// components/AdminNotificationForm.js
import { useState } from "react";
import { broadcastNotification } from "@/hooks/useNotifications";
import { NotificationTypes } from "@/types/notificationTypes";

const AdminNotificationForm = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState(NotificationTypes.GENERAL_ALERT);
  const [userIds, setUserIds] = useState<string[]>([]); // Array of user IDs for targeted notifications

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await broadcastNotification(type, message, userIds);
    setMessage("");
    setUserIds([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold">Send Notification</h2>
      <label>
        Message:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </label>
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {Object.values(NotificationTypes).map((notificationType) => (
            <option key={notificationType} value={notificationType}>
              {notificationType.replace(/_/g, " ").toLowerCase()}
            </option>
          ))}
        </select>
      </label>
      <label>
        Target Users (optional):
        <input
          type="text"
          value={userIds.join(",")}
          onChange={(e) =>
            setUserIds(e.target.value ? e.target.value.split(",") : [])
          }
          placeholder="Comma-separated user IDs"
        />
      </label>
      <button type="submit">Send Notification</button>
    </form>
  );
};

export default AdminNotificationForm;
