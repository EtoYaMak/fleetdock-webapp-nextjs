"use client";

import React from "react";
import DocumentUpload from "@/app/me/documents/components/DocumentUpload";
import { useProfileSidebar } from "../layout";
import { TruckerDetails } from "@/types/trucker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DocumentsPage = () => {
  const { auth, trucker, broker } = useProfileSidebar();

  if (!auth.user) {
    return null;
  }
  if (auth.user?.role === "trucker") {
    return (
      <div className="w-full">
        <Card className="shadow-none rounded-none border-none">
          <CardHeader>
            <CardTitle>Manage Your Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              trucker={trucker.trucker as TruckerDetails}
              auth={auth}
            />
          </CardContent>
        </Card>
      </div>
    );
  } else if (auth.user?.role === "broker") {
    return (
      <div className="p-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Broker Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add broker-specific document upload component here */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <div>You are not authorized to view this page</div>;
};

export default DocumentsPage;
