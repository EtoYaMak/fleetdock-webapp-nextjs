import {
  Settings,
  FileText,
  CarFront,
  LogOut,
  UserRoundPenIcon,
  LayoutGrid,
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

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/me",
    icon: LayoutGrid,
  },
  {
    title: "Account",
    url: "/me/account",
    icon: UserRoundPenIcon,
  },
  {
    title: "Documents",
    url: "/me/documents",
    icon: FileText,
  },
  {
    title: "Vehicles",
    url: "/me/vehicles",
    icon: CarFront,
  },
  {
    title: "Settings",
    url: "/me/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/me/logout",
    icon: LogOut,
  },
];

export function TruckerSidebar({ open }: { open: boolean }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger
          className={`${open ? "w-full text-left" : "mx-auto"}`}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent
            className={`${open ? "p-4" : "py-4"} transition-all duration-300`}
          >
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`${
                    open ? "p-2" : "py-2"
                  } transition-all duration-300`}
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
