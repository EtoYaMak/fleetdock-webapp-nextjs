//
import {
    Settings,
    FileText,
    CarFront,
    LogOut,
    UserRoundPenIcon,
    LayoutGrid,
    BoxIcon,
    User2,
    ChevronUp,
    ChevronRight,
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
    SidebarFooter,
    SidebarMenuBadge,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { TruckerDetails } from "@/types/trucker";
import { User } from "@/types/auth";

interface MenuItemProps {
    title: string;
    url?: string;
    subItems?: MenuItemProps[];
    badge?: number;
}

function RecursiveMenuItem({ item }: { item: MenuItemProps }) {
    if (item.subItems) {
        return (
            <Collapsible className="w-full">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full" >
                        <div className="flex items-center gap-2 w-full">
                            <span className="flex items-center gap-1 w-full justify-between">
                                {item.title}
                                <ChevronRight className="ml-auto h-4 w-4 group-data-[state=open]/collapsible:rotate-90 transition-transform" />
                            </span>
                        </div>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.subItems.map((subItem, index) => (
                            <RecursiveMenuItem key={index} item={subItem} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuButton asChild >
            <a href={item.url}>
                <span className="flex items-center gap-1 w-full justify-between relative">
                    {item.title}


                    {item.badge && <SidebarMenuBadge className="bg-accent-foreground/10 text-accent-foreground absolute right-0">{item.badge}</SidebarMenuBadge>}
                </span>
            </a>
        </SidebarMenuButton>
    );
}

export function AdminSidebar({ open, user, signOut }: { open: boolean, user: User, signOut: () => void }) {
    const router = useRouter();
    const { loads, users, truckers } = useAdmin();
    const loadsCount = loads.length;
    const usersCount = users.length;
    const truckersCount = truckers.length;
    const truckerCertificationsCount = truckers.filter((trucker: TruckerDetails) => Object.keys(trucker.certifications).length > 0).length;
    const truckerLicensesCount = truckers.filter((trucker: TruckerDetails) => Object.keys(trucker.licenses).length > 0).length;
    // Menu items with status flags
    const items = [
        {
            title: "Overview ",
            url: "/admin",
            icon: LayoutGrid,
            collapsible: false,
        },
        {
            title: "Loads",
            url: "/admin/loads",
            icon: BoxIcon,
            collapsible: false,
            badge: loadsCount,
        },
        {
            title: "Users",
            url: "/admin/users",
            icon: UserRoundPenIcon,
            collapsible: false,
            badge: usersCount,
        },
        {
            title: "Documents",
            url: "/admin/documents",
            icon: FileText,
            collapsible: true,
            subItems: [
                {
                    title: "Truckers",
                    subItems: [
                        {
                            title: "Certs",
                            url: "/admin/documents/trucker/certifications",
                            badge: truckerCertificationsCount,
                        },
                        {
                            title: "Licenses",
                            url: "/admin/documents/trucker/licenses",
                            badge: truckerLicensesCount,
                        },
                    ],
                    badge: truckersCount,
                },
                /*  {
                     title: "Brokers",
                     subItems: [
                         {
                             title: "Certifications",
                             subItems: [
                                 {
                                     title: "Certifications",
                                 },
                                 {
                                     title: "Licenses",
                                 },
 
                             ],
                         },
                     ],
                 }, */
            ],
        },
        {
            title: "Vehicles",
            url: "/admin/vehicles",
            icon: CarFront,
            collapsible: false,
        },


    ];
    return (
        <Sidebar collapsible="icon" side="left" variant="floating" className="top-14 h-[calc(100vh-14vh)]">
            <SidebarHeader>
                <SidebarTrigger
                    className={`${open ? "w-full text-left" : "mx-auto"}`}
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent
                        className={`${open ? "p-0" : "py-2"} transition-all duration-300`}
                    >
                        <SidebarMenu className="gap-4">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.collapsible ? (
                                        <Collapsible defaultOpen className="w-full">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton className="w-full">
                                                    <div className="flex items-center gap-2 w-full">
                                                        <item.icon className="shrink-0 h-4 w-4" />
                                                        <span className="flex items-center gap-1 w-full justify-between">
                                                            {item.title}
                                                            <ChevronUp className="ml-auto h-4 w-4 group-data-[state=closed]/collapsible:rotate-180 transition-transform" />
                                                        </span>
                                                    </div>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.subItems?.map((subItem, index) => (
                                                        <RecursiveMenuItem key={index} item={subItem} />
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <>
                                            <SidebarMenuButton asChild>
                                                <a href={item.url} className="flex items-center gap-2">
                                                    <item.icon className="shrink-0 h-4 w-4" />
                                                    <span className="flex items-center gap-1 w-full justify-between">
                                                        {item.title}
                                                    </span>
                                                </a>
                                            </SidebarMenuButton>
                                            {item.badge && <SidebarMenuBadge className="bg-accent-foreground/10 text-accent-foreground">{item.badge}</SidebarMenuBadge>}
                                        </>
                                    )}
                                </SidebarMenuItem>
                            ))}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> {user?.full_name}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] "
                            >
                                <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                                    <Settings />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()}>
                                    <LogOut />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
