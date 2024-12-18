import {
  Settings,
  FileText,
  CarFront,
  Truck,
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
    url: "#",
    icon: LayoutGrid,
  },
  {
    title: "Account",
    url: "#",
    icon: UserRoundPenIcon,
  },
  {
    title: "Documents",
    url: "#",
    icon: FileText,
  },
  {
    title: "Vehicles",
    url: "#",
    icon: CarFront,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
  },
];

export function SidebarTruckerProfile({ open }: { open: boolean }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span className="flex py-4 w-full justify-between">
          {open && (
            <h1 className="text-md font-bold flex min-w-max items-center justify-center gap-2 w-full ">
              <Truck />
              My Profile
            </h1>
          )}
          <SidebarTrigger />
        </span>
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
