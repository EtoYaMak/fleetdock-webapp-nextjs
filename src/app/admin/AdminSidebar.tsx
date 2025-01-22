import {
    Settings,
    FileText,
    CarFront,
    LogOut,
    UserRoundPenIcon,
    LayoutGrid,
    Hammer,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Menu items with status flags
const items = [
    {
        title: "Overview ",
        url: "/admin",
        icon: LayoutGrid,
        status: "completed",
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: UserRoundPenIcon,
        status: "completed",
    },
    {
        title: "Documents",
        url: "/admin/documents",
        icon: FileText,
        status: "completed",
    },
    {
        title: "Vehicles",
        url: "/admin/vehicles",
        icon: CarFront,
        status: "completed",
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
        status: "todo",
    },

];

export function AdminSidebar({ open }: { open: boolean }) {
    const { signOut } = useAuth();

    return (
        <Sidebar collapsible="icon" side="left" variant="floating">
            <SidebarHeader>
                <SidebarTrigger
                    className={`${open ? "w-full text-left" : "mx-auto"}`}
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent
                        className={`${open ? "p-2" : "py-2"} transition-all duration-300`}
                    >
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}

                                >
                                    <SidebarMenuButton asChild>
                                        <a
                                            href={item.url}
                                            className={`flex items-center gap-2`}
                                        >
                                            <item.icon />
                                            <span className="flex items-center gap-1 w-full justify-between">
                                                {item.title}
                                            </span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem
                                className={`${open ? "p-2" : "py-2"
                                    } transition-all duration-300`}
                            >
                                <SidebarMenuButton onClick={signOut}>
                                    <LogOut />
                                    <span>Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
