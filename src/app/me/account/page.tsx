"use client";

import { useProfileSidebar } from "../layout";
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
import {
  Calendar,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Account() {
  const { auth, broker, trucker } = useProfileSidebar();

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
            <CardTitle className="text-2xl">{auth.user.full_name} <span className="text-sm text-muted-foreground uppercase">#{auth.user.unique_id}</span></CardTitle>
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

          {/* Account Details */}
          <div>
            <h3 className="font-semibold mb-4">Account Details</h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Joined: {new Date(auth.user?.created_at || "").toDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>
                  Last login:{" "}
                  {new Date(auth.user?.last_sign_in_at || "").toDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {auth.user.email_verified ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Email verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span>Email not verified</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Role-specific Information */}
          {auth.user.role === "trucker" && trucker && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-4">Trucker Details</h3>
                <div className="grid gap-4">
                  {/* Add trucker-specific fields here using the trucker context */}
                  <CardDescription>
                    Additional trucker-specific information will be displayed
                    here once completed.
                  </CardDescription>
                </div>
              </div>
            </>
          )}

          {auth.user.role === "broker" && broker && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-4">Broker Details</h3>
                <div className="grid gap-4">
                  {/* Add broker-specific fields here using the broker context */}
                  <CardDescription>
                    Additional broker-specific information will be displayed
                    here once completed.
                  </CardDescription>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
