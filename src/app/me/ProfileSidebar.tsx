import {
  Settings,
  FileText,
  CarFront,
  LogOut,
  UserRoundPenIcon,
  LayoutGrid,
  Hammer,
  BriefcaseBusiness,
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
import { User } from "@/types/auth";

// Example sidebar component that creates items based on role (broker or trucker)
export function ProfileSidebar({ open, user }: { open: boolean; user?: User | null }) {
  const { signOut } = useAuth();
  const { toast } = useToast();

  // If no user data or user role hasn't loaded yet,
  // render a skeleton preview so the final sidebar layout isn't "flashing" later.
  if (!user || !user.role) {
    return (
      <Sidebar collapsible="icon" side="left" variant="floating">
        <SidebarHeader>
          <SidebarTrigger className={`${open ? "w-full text-left" : "mx-auto"}`} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className={`${open ? "p-2" : "py-2"} transition-all duration-300`}>
              <SidebarMenu>
                {/* Rendering a couple of skeleton items */}
                <SidebarMenuItem className={`${open ? "p-2" : "py-2"} transition-all duration-300`}>
                  <div className="flex items-center  animate-pulse">
                    <div className="w-4 h-4 bg-gray-300 rounded opacity-50" />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem className={`${open ? "p-2" : "py-2"} transition-all duration-300`}>
                  <div className="flex items-center  animate-pulse">
                    <div className="w-4 h-4 bg-gray-300 rounded opacity-50" />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem className={`${open ? "p-2" : "py-2"} transition-all duration-300`}>
                  <div className="flex items-center  animate-pulse">
                    <div className="w-4 h-4 bg-gray-300 rounded opacity-50" />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem className={`${open ? "p-2" : "py-2"} transition-all duration-300`}>
                  <div className="flex items-center  animate-pulse">
                    <div className="w-4 h-4 bg-gray-300 rounded opacity-50" />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem className={`${open ? "p-2" : "py-2"} transition-all duration-300`}>
                  <div className="flex items-center  animate-pulse">
                    <div className="w-4 h-4 bg-gray-300 rounded opacity-50" />
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Build the sidebar items dynamically based on the user's role.
  const items =
    user.role === "broker"
      ? [
        {
          title: "Overview",
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
          title: "Company",
          url: "/me/company",
          icon: BriefcaseBusiness, // You can swap this icon with a more appropriate one for "Company"
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
          url: "/me/tools",
          icon: Hammer,
          status: "todo",
        },
      ]
      : [
        // Default to trucker sidebar
        {
          title: "Overview",
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
          url: "/me/tools",
          icon: Hammer,
          status: "todo",
        },
      ];

  // Handle menu item clicks if feature is not yet implemented.
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: typeof items[number]
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
        <SidebarTrigger className={`${open ? "w-full text-left" : "mx-auto"}`} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className={`${open ? "p-2" : "py-2"} transition-all duration-300`}>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`${open ? "p-2" : "py-2"} transition-all duration-300`}
                >
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      onClick={(e) => handleNavigation(e, item)}
                      className={`flex items-center gap-2 ${item.status === "wip" || item.status === "todo" ? "opacity-50" : ""
                        }`}
                    >
                      <item.icon />
                      <span className="flex items-center gap-1 w-full justify-between">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem className={`${open ? "p-2" : "py-2"} transition-all duration-300`}>
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
