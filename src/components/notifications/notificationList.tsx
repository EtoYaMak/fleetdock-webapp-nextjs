// components/NotificationList.js
import { useState, useEffect, useMemo } from "react";
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
  KeyRoundIcon,
  MailIcon,
  MailOpenIcon,
  MessageCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface Notification {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  is_read: boolean;
  type: string;
  load_id?: string;
  bid_id?: string;
  reference_id?: string;
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
  auth_alert: KeyRoundIcon,
  new_message: MessageCircleIcon,
} as const;

// Add color mapping for notification types
const NotificationColors = {
  load_status: "text-blue-500",
  document_verification: "text-green-500",
  bid_status: "text-yellow-500", // Default bid status color
  bid_accepted: "text-green-500",
  bid_rejected: "text-red-500",
  general_alert: "text-orange-500",
  account_verification: "text-purple-500",
  password_change: "text-cyan-500",
  profile_update: "text-indigo-500",
  security_alert: "text-red-500",
  auth_alert: "text-amber-500",
  new_message: "text-blue-500",
} as const;

export const NotificationList = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      //fetch all types except new_message
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .neq("type", "new_message")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data as Notification[]);
      }
    };

    // Real-time subscription for notifications
    const channel = supabase.channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [payload.new as Notification, ...prev];
              case 'UPDATE':
                return prev.map((n) =>
                  n.id === payload.new.id ? (payload.new as Notification) : n
                );
              case 'DELETE':
                return prev.filter((n) => n.id !== payload.old.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    fetchNotifications();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);


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
  const markAsUnread = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: false })
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: false } : n
        )
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


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {notifications.filter((n) => !n.is_read).length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {notifications.filter((n) => !n.is_read).length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-b-lg" align="end">
        <div className="flex items-center justify-between px-3 py-3 border-b bg-primary rounded-t-lg max-h-12">
          <h4 className="font-semibold text-white my-auto">Notifications</h4>
          {notifications.filter((n) => !n.is_read).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs hover:bg-muted/10 text-white hover:text-white bg-muted/5"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[calc(80vh-8rem)] bg-muted/20">
          {/* Unread Notifications */}
          {notifications.filter((n) => !n.is_read).length > 0 && (
            <div className="p-4 pb-2">
              <h5 className="text-xs font-medium text-muted-foreground mb-3">
                NEW
              </h5>
              <div className="space-y-4">
                {notifications.filter((n) => !n.is_read)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                      onUnread={markAsUnread}
                      setOpen={setOpen}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Read Notifications */}
          {notifications.filter((n) => n.is_read).length > 0 && (
            <div className="p-4 pt-4">
              <h5 className="text-xs font-medium text-muted-foreground mb-3">
                EARLIER
              </h5>
              <div className="space-y-4">
                {notifications.filter((n) => n.is_read)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                      onUnread={markAsUnread}
                      setOpen={setOpen}
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
  onUnread,
  setOpen,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onUnread: (id: string) => void;
  setOpen: (open: boolean) => void;
}) => {
  const Icon =
    NotificationIcons[notification.type as keyof typeof NotificationIcons];
  const router = useRouter();

  // Determine icon color based on notification type and status
  const getIconColor = () => {
    if (notification.type === "bid_status") {
      // Check message content for bid status
      if (notification.message.toLowerCase().includes("accepted")) {
        return NotificationColors.bid_accepted;
      }
      if (notification.message.toLowerCase().includes("rejected")) {
        return NotificationColors.bid_rejected;
      }
    }
    return NotificationColors[
      notification.type as keyof typeof NotificationColors
    ];
  };

  const handleClick = () => {
    if (notification.type === "load_status" && notification.load_id) {
      router.push(`/loads/${notification.load_id}`);
    }
    if (notification.type === "bid_status" && notification.bid_id) {
      router.push(`/loads/${notification.load_id}`);
    }
    onRead(notification.id);
    setOpen(false);
  };

  const handleReadToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click
    if (notification.is_read) {
      onUnread(notification.id);
    } else {
      onRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        "px-2 py-2 rounded-lg transition-colors hover:bg-muted/60 bg-muted/30",
        !notification.is_read &&
        "bg-muted/80 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
      )}
    >
      <div className="flex items-start gap-1">
        <div className="my-auto">
          <Icon className={cn("h-5 w-5", getIconColor())} />
        </div>
        <div className="flex-1" onClick={handleClick}>
          <p
            className={cn(
              "text-sm hover:underline cursor-pointer",
              !notification.is_read && "font-medium"
            )}
          >
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(notification.created_at), "MMM d, h:mm a")}
          </p>
        </div>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className=" my-auto"
                onClick={handleReadToggle}
              >
                {notification.is_read ? (
                  <MailOpenIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <MailIcon className="h-4 w-4 text-primary" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white">
              {notification.is_read ? "Mark as unread" : "Mark as read"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default NotificationList;
