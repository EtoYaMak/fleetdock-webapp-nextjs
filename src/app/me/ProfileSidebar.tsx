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
    url: "/me",
    icon: LayoutGrid,
    status: "completed",
  },
  {
    title: "Account",
    url: "/me/account",
    icon: UserRoundPenIcon,
    status: "completed",
  },
  {
    title: "Documents",
    url: "/me/documents",
    icon: FileText,
    status: "completed",
  },
  {
    title: "Vehicles",
    url: "/me/vehicles",
    icon: CarFront,
    status: "completed",
  },
  {
    title: "Settings",
    url: "/me/settings",
    icon: Settings,
    status: "todo",
  },
  {
    title: "Tools",
    url: "/me/settings",
    icon: Hammer,
    status: "todo",
  },
];

export function ProfileSidebar({ open }: { open: boolean }) {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof items)[0]
  ) => {
    if (item.status === "wip" || item.status === "todo") {
      e.preventDefault();
      toast({
        title: item.status === "wip" ? "Work in Progress" : "Coming Soon",
        description:
          item.status === "wip"
            ? `The ${item.title} section is currently under development.`
            : `The ${item.title} section will be available soon.`,
        variant: "warning",
      });
    }
  };

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
                  className={`${
                    open ? "p-2" : "py-2"
                  } transition-all duration-300`}
                >
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      onClick={(e) => handleNavigation(e, item)}
                      className={`${
                        item.status === "wip" || item.status === "todo"
                          ? " opacity-50"
                          : ""
                      } flex items-center gap-2`}
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
                className={`${
                  open ? "p-2" : "py-2"
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
