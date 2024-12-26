"use client";
import React, { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { TruckerDetails, DocumentMetadata } from "@/types/trucker";
import Image from "next/image";
import { FileUp, Eye, AlertCircle, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

    console.log("existingData", existingData);

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

    console.log("existingDocuments", existingDocuments);
    // Merge existing data with new document
    const updatedData: DocumentMap = {
      ...existingDocuments,
      [file.name]: {
        url: data.path,
        name: file.name,
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

  return (
    <div className="w-full flex flex-col gap-4 min-h-screen">
      {auth.user?.role === "trucker" && (
        <Card>
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>
              Add your certifications and licenses here for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 bg-border p-4 rounded-lg">
              <Select value={documentType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full sm:w-[200px] bg-primary text-white font-medium">
                  {documentType || "Select document type"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="license">License</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1 flex gap-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
                <Button
                  onClick={handleUpload}
                  disabled={!file || !documentType}
                  className=" text-white"
                >
                  <FileUp className="mr-2 h-4 w-4 text-white" />
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Certifications
              <Badge variant="secondary">
                {Object.keys(certifications).length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(certifications).length > 0 ? (
              Object.entries(certifications).map(([name, doc]) => (
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
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() =>
                        openPreview(doc.url, name, "trucker-documents")
                      }
                    >
                      <Eye className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No certifications uploaded yet
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Licenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Licenses
              <Badge variant="secondary">{Object.keys(licenses).length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(licenses).length > 0 ? (
              Object.entries(licenses).map(([name, doc]) => (
                <div
                  key={name}
                  className="flex items-center justify-between group  border-b border-border pb-2 rounded-b-lg px-4 shadow-md"
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
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() =>
                        openPreview(doc.url, name, "trucker-documents")
                      }
                    >
                      <Eye className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No licenses uploaded yet</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <DocumentViewerModal
        {...modalState}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </div>
  );
};

export default DocumentUpload;
