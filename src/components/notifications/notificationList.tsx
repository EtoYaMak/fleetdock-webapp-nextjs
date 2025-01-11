// components/NotificationList.js
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  BellIcon,
  TruckIcon,
  FileCheckIcon,
  DollarSignIcon,
  AlertCircleIcon,
  UserCheckIcon,
  KeyIcon,
  UserIcon,
  ShieldIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  is_read: boolean;
  type: string;
  load_id?: string;
  bid_id?: string;
}

// Add icon mapping
const NotificationIcons = {
  load_status: TruckIcon,
  document_verification: FileCheckIcon,
  bid_status: DollarSignIcon,
  general_alert: AlertCircleIcon,
  account_verification: UserCheckIcon,
  password_change: KeyIcon,
  profile_update: UserIcon,
  security_alert: ShieldIcon,
} as const;

const NotificationList = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // Split and sort notifications
  const unreadNotifications = notifications
    .filter((n) => !n.is_read)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const readNotifications = notifications
    .filter((n) => n.is_read)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const unreadCount = unreadNotifications.length;

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "bid_status" && notification.load_id) {
      router.push(`/loads/${notification.load_id}`);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching notifications:", error);
      else setNotifications(data as Notification[]);
    };

    fetchNotifications();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload: { new: Notification }) => {
          setNotifications((prev: Notification[]) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[calc(80vh-8rem)]">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div className="p-4 pb-2">
              <h5 className="text-xs font-medium text-muted-foreground mb-3">
                NEW
              </h5>
              <div className="space-y-4">
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div className="p-4 pt-2">
              <h5 className="text-xs font-medium text-muted-foreground mb-3">
                EARLIER
              </h5>
              <div className="space-y-4">
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {notifications.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

// Separate component for notification items
const NotificationItem = ({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) => {
  const Icon =
    NotificationIcons[notification.type as keyof typeof NotificationIcons];
  const router = useRouter();

  const handleClick = async () => {
    await onRead(notification.id);
    if (notification.type === "load_status" && notification.load_id) {
      router.push(`/loads/${notification.load_id}`);
    }
    if (notification.type === "bid_status" && notification.bid_id) {
      router.push(`/loads/${notification.load_id}`);
    }
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted bg-muted/30",
        !notification.is_read && "bg-muted/50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1">
          <p className={cn("text-sm", !notification.is_read && "font-medium")}>
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(notification.created_at), "MMM d, h:mm a")}
          </p>
        </div>
        {!notification.is_read && (
          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
        )}
      </div>
    </div>
  );
};

export default NotificationList;
