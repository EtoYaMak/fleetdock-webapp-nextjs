"use client";
import { DocumentMetadata } from "@/types/trucker";
import { Eye, AlertCircle, Trash2, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DocumentListProps {
  title: string;
  documents: Record<string, DocumentMetadata>;
  onPreview: (path: string, name: string, bucket: string) => void;
  onDelete: (documentName: string) => Promise<void>;
  onUpdateStatus: (documentName: string, newStatus: string) => Promise<void>;
  isAdmin?: boolean;
}

const DocumentList = ({
  title,
  documents,
  onPreview,
  onDelete,
  onUpdateStatus,
  isAdmin = false,
}: DocumentListProps) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    documentName: string | null;
    documentStatus: string | null;
  }>({
    isOpen: false,
    documentName: null,
    documentStatus: null,
  });
  const { toast } = useToast();

  const handleDelete = async (documentName: string) => {
    setIsDeleting(documentName);
    try {
      await onDelete(documentName);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete document",
      });
    } finally {
      setIsDeleting(null);
      setDeleteDialog({
        isOpen: false,
        documentName: null,
        documentStatus: null,
      });
    }
  };

  const handleStatusUpdate = async (
    documentName: string,
    newStatus: string
  ) => {
    setIsUpdating(documentName);
    try {
      await onUpdateStatus(documentName, newStatus);
    } catch (error) {
      console.error("Error updating document status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update document status",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {title}
            <Badge variant="secondary">{Object.keys(documents).length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(documents).length > 0 ? (
            Object.entries(documents).map(([name, doc]) => (
              <div
                key={name}
                className="flex items-center justify-between group border-b border-border pb-2 rounded-b-lg px-4 shadow-md"
              >
                <div className="space-y-1">
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      doc.verification_status === "verified"
                        ? "default"
                        : "secondary"
                    }
                    className="fade-in-10"
                  >
                    {doc.verification_status}
                  </Badge>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() =>
                        onPreview(doc.url, name, "trucker-documents")
                      }
                    >
                      <Eye className="h-4 w-4 text-white" />
                    </Button>

                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(name, "verified")}
                            disabled={
                              doc.verification_status === "verified" ||
                              isUpdating === name
                            }
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Mark as Verified
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(name, "pending")}
                            disabled={
                              doc.verification_status === "pending" ||
                              isUpdating === name
                            }
                          >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Mark as Pending
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          documentName: name,
                          documentStatus: doc.verification_status,
                        })
                      }
                      disabled={isDeleting === name}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No {title.toLowerCase()} uploaded yet
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteDialog({
            isOpen,
            documentName: null,
            documentStatus: null,
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              This action cannot be undone. This will permanently delete{" "}
              <strong className="text-foreground">
                {deleteDialog.documentName}
              </strong>{" "}
              and remove it from our servers.
              {deleteDialog.documentStatus === "verified" && (
                <p className="mt-2 text-yellow-500 font-medium">
                  Warning: This document is verified. Deleting it will require
                  re-verification of any new document you upload.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteDialog.documentName &&
                handleDelete(deleteDialog.documentName)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocumentList;
