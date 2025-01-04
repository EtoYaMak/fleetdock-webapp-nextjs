"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { TruckerDetails, DocumentMetadata } from "@/types/trucker";
import Image from "next/image";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DocumentList from "./DocumentList";

interface DocumentViewerModalProps {
  url: string | null;
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  isPDF: boolean;
}

function DocumentViewerModal({
  url,
  isOpen,
  onClose,
  documentName,
  isPDF,
}: DocumentViewerModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 min-h-screen ${
        isLoading ? "opacity-0" : "delay-700 opacity-100"
      }`}
    >
      <div className="bg-transparent rounded-lg p-4 w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-medium text-muted-foreground">
            {documentName}
          </h3>

          <Button variant="destructive" onClick={onClose} size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 min-h-0 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-muted-foreground" />
            </div>
          )}
          {isPDF ? (
            <iframe
              src={url || ""}
              className={`w-full h-full rounded transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              title={documentName}
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={url || ""}
                alt={documentName}
                fill
                className={`object-contain transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoadingComplete={() => setIsLoading(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const getFileTypeFromUrl = (url: string): "pdf" | "image" => {
  const extension = url.split(".").pop()?.toLowerCase();
  return extension === "pdf" ? "pdf" : "image";
};

interface TruckerDocumentData {
  certifications?: Record<string, DocumentMetadata>;
  licenses?: Record<string, DocumentMetadata>;
}

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-200  ${
            step === currentStep
              ? "bg-primary w-8"
              : step < currentStep
              ? "bg-primary/50"
              : "bg-muted-foreground/50"
          }`}
        />
      ))}
    </div>
  );
};

const DocumentUpload = ({
  trucker,
  auth,
}: {
  trucker: TruckerDetails;
  auth: ReturnType<typeof useAuth>;
}) => {
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [certifications, setCertifications] = useState<
    Record<string, DocumentMetadata>
  >({});
  const [licenses, setLicenses] = useState<Record<string, DocumentMetadata>>(
    {}
  );
  const [modalState, setModalState] = useState({
    isOpen: false,
    url: null as string | null,
    documentName: "",
    isPDF: false,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (trucker) {
      setCertifications(trucker.certifications);
      setLicenses(trucker.licenses);
    }
  }, [trucker]);

  const handleTypeChange = (value: string) => {
    setDocumentType(value);
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !documentType) return;

    let bucket = "";
    let folder = "";
    let table = "";
    let column: string | undefined;

    if (auth.user?.role === "trucker") {
      bucket = "trucker-documents";
      folder = documentType === "certificate" ? "certificates" : "licenses";
      table = "trucker_details";
      column = documentType === "certificate" ? "certifications" : "licenses";
    } else if (auth.user?.role === "broker") {
      bucket = "broker-documents";
      folder = "businessLicenses";
      table = "broker_businesses";
      column = "example1";
    }

    const filePath = `${folder}/${file.name}`;
    console.log("filePath", filePath);
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading file:", error);
      return;
    }

    // Fetch existing data
    const { data: existingData, error: fetchError } = await supabase
      .from(table)
      .select(column)
      .eq("profile_id", auth.user?.id)
      .single();

    if (fetchError) {
      console.error("Error fetching existing data:", fetchError);
      return;
    }

    // Ensure existingData is typed correctly
    type DocumentMap = Record<
      string,
      {
        url: string;
        name: string;
        uploadedAt: string;
        verification_status: string;
      }
    >;

    const existingDocuments = (existingData[
      column as keyof typeof existingData
    ] || {}) as DocumentMap;

    // Merge existing data with new document
    const updatedData: DocumentMap = {
      ...existingDocuments,
      [fileName]: {
        url: data.path,
        name: fileName,
        uploadedAt: new Date().toISOString(),
        verification_status: "pending",
      },
    };

    // Update the database with the merged data
    const { error: dbError } = await supabase
      .from(table)
      .update({ [column as string]: updatedData })
      .eq("profile_id", auth.user?.id);

    if (dbError) {
      console.error("Error updating database:", dbError);
    } else {
      console.log("File uploaded and database updated successfully");
    }
  };

  const openPreview = async (path: string, name: string, bucket: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24 * 365);

    if (error) {
      console.error("Error creating signed URL:", error);
      return;
    }

    setModalState({
      isOpen: true,
      url: data?.signedUrl || null,
      documentName: name,
      isPDF: getFileTypeFromUrl(path) === "pdf",
    });
  };

  const closePreview = () => {
    setModalState({ isOpen: false, url: null, documentName: "", isPDF: false });
  };

  const showToast = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    toast({
      variant:
        type === "error"
          ? "destructive"
          : type === "success"
          ? "success"
          : "warning",
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
    });
  };

  const handleDelete = async (documentName: string) => {
    const documentType =
      documentName in certifications ? "certificate" : "license";
    const bucket = "trucker-documents";
    const folder = documentType === "certificate" ? "certificates" : "licenses";
    const columnName =
      documentType === "certificate" ? "certifications" : "licenses";

    // Get the document URL
    const documents =
      documentType === "certificate" ? certifications : licenses;
    const documentUrl = documents[documentName]?.url;

    if (!documentUrl) {
      showToast("error", "Document not found");
      return;
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([documentUrl]);

    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      showToast("error", "Failed to delete document from storage");
      return;
    }

    // Get existing documents
    const { data: existingData, error: fetchError } = await supabase
      .from("trucker_details")
      .select(columnName)
      .eq("profile_id", auth.user?.id)
      .single();

    if (fetchError) {
      console.error("Error fetching existing data:", fetchError);
      showToast("error", "Failed to fetch document data");
      return;
    }

    const typedData = existingData as TruckerDocumentData;
    const currentDocuments = typedData[columnName] || {};
    const updatedDocuments = { ...currentDocuments };
    delete updatedDocuments[documentName];

    // Update database
    const { error: dbError } = await supabase
      .from("trucker_details")
      .update({ [columnName]: updatedDocuments })
      .eq("profile_id", auth.user?.id);

    if (dbError) {
      console.error("Error updating database:", dbError);
      showToast("error", "Failed to update document list");
      return;
    }

    // Update local state
    if (documentType === "certificate") {
      setCertifications(updatedDocuments);
    } else {
      setLicenses(updatedDocuments);
    }

    showToast("success", "Document deleted successfully");
  };

  const handleUpdateStatus = async (
    documentName: string,
    newStatus: string
  ) => {
    if (auth.user?.role !== "admin") {
      showToast("error", "Only admins can update document status");
      return;
    }

    const documentType =
      documentName in certifications ? "certificate" : "license";
    const columnName =
      documentType === "certificate" ? "certifications" : "licenses";

    // Get existing documents
    const { data: existingData, error: fetchError } = await supabase
      .from("trucker_details")
      .select(columnName)
      .eq("profile_id", auth.user?.id)
      .single();

    if (fetchError) {
      console.error("Error fetching existing data:", fetchError);
      showToast("error", "Failed to fetch document data");
      return;
    }

    const typedData = existingData as TruckerDocumentData;
    const currentDocuments = typedData[columnName] || {};
    const updatedDocuments = {
      ...currentDocuments,
      [documentName]: {
        ...currentDocuments[documentName],
        verification_status: newStatus,
      },
    };

    // Update database
    const { error: dbError } = await supabase
      .from("trucker_details")
      .update({ [columnName]: updatedDocuments })
      .eq("profile_id", auth.user?.id);

    if (dbError) {
      console.error("Error updating database:", dbError);
      showToast("error", "Failed to update document status");
      return;
    }

    // Update local state
    if (documentType === "certificate") {
      setCertifications(updatedDocuments);
    } else {
      setLicenses(updatedDocuments);
    }

    showToast("success", "Document status updated successfully");
  };

  return (
    <div className="w-full flex flex-col gap-6 min-h-screen">
      {auth.user?.role === "trucker" && (
        <Card className="appearance-none bg-transparent border-none shadow-none">
          <CardHeader className="pb-4  bg-primary rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-white">
              Upload New Document
            </CardTitle>
            <CardDescription className="text-white">
              Add your certifications and licenses here for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xl mx-auto w-full mt-2">
              <StepIndicator currentStep={currentStep} />

              <div className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground/90">
                      Select Document Type
                    </h3>
                    <Select
                      value={documentType}
                      onValueChange={(value) => {
                        setDocumentType(value);
                        setCurrentStep(2);
                      }}
                    >
                      <SelectTrigger className="w-full h-12 ">
                        <span className="text-muted-foreground">
                          {documentType || "Choose type of document"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="license">License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground/90">
                      Name Your Document
                    </h3>
                    <Input
                      placeholder="Enter a descriptive name"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="h-12 bg-background/50 border-border/50 focus:bg-background/80 transition-colors"
                    />
                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="h-11"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(3)}
                        disabled={!fileName.trim()}
                        className="h-11"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground/90">
                      Upload Document
                    </h3>
                    <div className="grid gap-4">
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="w-full h-32 rounded-lg border-2 border-dashed border-border/50 
                                   bg-background/50 cursor-pointer file:hidden
                                   hover:bg-background/80 transition-colors
                                   flex items-center justify-center"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <FileUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {file
                                ? file.name
                                : "Drop your file here or click to browse"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="h-11"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={async () => {
                            try {
                              await handleUpload();
                              showToast(
                                "success",
                                "Document uploaded successfully!"
                              );
                              setCurrentStep(1);
                              setFileName("");
                              setFile(null);
                              setDocumentType("");
                            } catch (error) {
                              showToast("error", "Failed to upload document");
                            }
                          }}
                          disabled={!file}
                          className="h-11"
                        >
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <DocumentList
          title="Certifications"
          documents={certifications}
          onPreview={openPreview}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
          isAdmin={auth.user?.role === "admin"}
        />
        <DocumentList
          title="Licenses"
          documents={licenses}
          onPreview={openPreview}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
          isAdmin={auth.user?.role === "admin"}
        />
      </div>
      <DocumentViewerModal
        {...modalState}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </div>
  );
};

export default DocumentUpload;
