"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";

import { useProfileSidebar } from "./layout";
export default function Me() {
  const { auth } = useProfileSidebar();
  if (!auth.user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full p-6">
      {/* Profile Overview Card */}
      <Card className="bg-secondary">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={auth.user?.avatar || undefined} />
            <AvatarFallback>{auth.user.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-2xl">{auth.user.full_name}  <span className="text-sm text-muted-foreground uppercase">#{auth.user.unique_id}</span></CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {auth.user.role}
              </Badge>
              {auth.user.is_active ? (
                <Badge variant="default" className="bg-green-600">
                  Active
                </Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{auth.user.email}</span>
              </div>
              {auth.user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{auth.user.phone}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Role-specific Information */}
          {auth.user.role === "trucker" && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-4">Trucker Details</h3>
                <CardDescription>
                  Additional trucker-specific information will be displayed here
                  once completed.
                </CardDescription>
              </div>
            </>
          )}

          {auth.user.role === "broker" && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-4">Broker Details</h3>
                <CardDescription>
                  Additional broker-specific information will be displayed here
                  once completed.
                </CardDescription>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
