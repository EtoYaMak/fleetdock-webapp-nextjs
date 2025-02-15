"use client"
import { useState, useEffect, useMemo } from "react";
import { MessageCircle, MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MailIcon, MailOpenIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";


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
    new_message: MessageCircleIcon,
} as const;

// Add color mapping for notification types
const NotificationColors = {
    new_message: "text-blue-500",
} as const;
export const MessageNotifications = ({ userId }: { userId: string }) => {
    const { openChat } = useChat();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [open, setOpen] = useState(false);

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

        const channel = supabase
            .channel(`notifications:${userId}`)
            .on(
                "postgres_changes" as const,
                {
                    event: "*",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    switch (payload.eventType) {
                        case "INSERT":
                            setNotifications((prev: Notification[]) => [
                                payload.new as Notification,
                                ...prev,
                            ]);
                            break;
                        case "DELETE":
                            console.log("DELETE", payload.old);
                            setNotifications((prev: Notification[]) =>
                                prev.filter(
                                    (notification) => notification.id !== payload.old.id
                                )
                            );
                            break;
                    }
                }
            )
            .subscribe();
        fetchNotifications();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);
    // Filter to only message notifications
    const messageNotifications = notifications.filter(
        notif => notif.type === 'new_message'
    ) as Notification[];
    // Split and sort notifications
    const sortedNotifications = useMemo(() => {
        const unread = messageNotifications
            .filter((n) => !n.is_read)
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

        const read = messageNotifications
            .filter((n) => n.is_read)
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

        return { unread, read };
    }, [messageNotifications]);

    const unreadCount = sortedNotifications.unread.length;
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
    const handleMessageClick = async (notification: Notification) => {
        await markAsRead(notification.id);
        if (notification.reference_id) {
            openChat(notification.reference_id);
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <MessageCircle className="h-5 w-5" />
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
            <PopoverContent className="w-80 p-0 rounded-b-lg" align="end">
                <div className="flex items-center justify-between px-3 py-3 border-b bg-primary rounded-t-lg max-h-12">
                    <h4 className="font-semibold text-white my-auto">Notifications</h4>
                    {unreadCount > 0 && (
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
                    {sortedNotifications.unread.length > 0 && (
                        <div className="p-4 pb-2">
                            <h5 className="text-xs font-medium text-muted-foreground mb-3">
                                NEW
                            </h5>
                            <div className="space-y-4">
                                {sortedNotifications.unread.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onRead={markAsRead}
                                        onUnread={markAsUnread}
                                        messageClick={handleMessageClick}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Read Notifications */}
                    {sortedNotifications.read.length > 0 && (
                        <div className="p-4 pt-4">
                            <h5 className="text-xs font-medium text-muted-foreground mb-3">
                                EARLIER
                            </h5>
                            <div className="space-y-4">
                                {sortedNotifications.read.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onRead={markAsRead}
                                        onUnread={markAsUnread}
                                        messageClick={handleMessageClick}
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
    messageClick,
}: {
    notification: Notification;
    onRead: (id: string) => void;
    onUnread: (id: string) => void;
    messageClick: (notification: Notification) => void;
}) => {
    const Icon =
        NotificationIcons[notification.type as keyof typeof NotificationIcons];

    // Determine icon color based on notification type and status
    const getIconColor = () => {
        return NotificationColors[
            notification.type as keyof typeof NotificationColors
        ];
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
                <div className="flex-1" onClick={() => messageClick(notification)}>
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