import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { Badge } from "@/components/ui/badge";

export function NewMessageNotfier() {
    const { toggleChat, totalUnreadCount } = useChat();

    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={() => toggleChat()}
            className="relative"
        >
            <MessageCircle className="h-7 w-7" />
            {totalUnreadCount > 0 && (
                <Badge
                    variant="destructive"
                    className={`absolute -top-2 -right-2 min-w-[18px] flex items-center h-5 text-xs justify-center p-0 ${totalUnreadCount > 99 ? 'w-7' : 'w-5'}`}
                >
                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </Badge>
            )}
        </Button>
    );
}
