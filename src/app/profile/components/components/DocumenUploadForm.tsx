"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 min-h-[90vh]">
      <div className="bg-[#1a2b47] rounded-lg p-4 w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-[#f1f0f3]">{documentName}</h3>
          <button
            onClick={onClose}
            className="text-[#f1f0f3] hover:text-[#4895d0]"
          >
            Close
          </button>
        </div>
        <div className="flex-1 min-h-0 relative">
          {isPDF ? (
            <iframe
              src={url || ""}
              className="w-full h-full rounded"
              title={documentName}
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={url || ""}
                alt={documentName}
                fill
                className="object-contain"
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

export default function DocumentUpload({
  uid,
  url,
  type,
  onUpload,
  name,
  acceptedFileTypes = "application/pdf,image/*",
  isExisting,
}: {
  uid: string | null;
  url: string | null;
  size: number;
  type: string;
  onUpload: (url: string) => void;
  name?: string;
  acceptedFileTypes?: string;
  previewSize?: { width: number; height: number };
  isExisting?: string | null;
}) {
  const { user } = useAuth();
  const [documentUrl, setDocumentUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    url: null as string | null,
  });

  useEffect(() => {
    async function downloadDocument(path: string) {
      try {
        const cleanPath = path.replace(/^\/+/, "");
        const { data, error } = await supabase.storage
          .from("trucker-documents")
          .download(cleanPath);

        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setDocumentUrl(url);
        setFileType(getFileTypeFromUrl(cleanPath));
      } catch (error) {}
    }

    if (url) downloadDocument(url);
  }, [url]);

  const uploadDocument: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!user) {
        throw new Error("No authenticated session found");
      }

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select a file to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      setFileType(fileExt === "pdf" ? "pdf" : "image");

      if (isExisting) {
        const confirmReplace = window.confirm(
          "You are about to replace the existing document. Do you want to continue?"
        );
        if (!confirmReplace) {
          setUploading(false);
          return;
        }
      }

      const fileName = `${type}/${
        name ? `${name}-` : ""
      }${uid}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("trucker-documents")
        .upload(fileName, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(fileName);
    } catch (error) {
      alert("Error uploading document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const openPreview = () => {
    if (documentUrl) {
      setModalState({ isOpen: true, url: documentUrl });
    }
  };

  const closePreview = () => {
    setModalState({ isOpen: false, url: null });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <DocumentViewerModal
        url={modalState.url}
        isOpen={modalState.isOpen}
        onClose={closePreview}
        documentName={type}
        isPDF={fileType === "pdf"}
      />

      {documentUrl ? (
        <div className="w-full p-4 bg-[#203152]/50 rounded-lg flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {fileType === "pdf" ? (
              <svg
                className="w-6 h-6 text-[#4895d0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-[#4895d0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
            <span className="text-[#f1f0f3]">
              {fileType === "pdf" ? "PDF Document" : "Image Document"}
            </span>
          </div>
          <button
            onClick={openPreview}
            className="text-[#4895d0] hover:text-[#4895d0]/80"
          >
            View Document
          </button>
        </div>
      ) : (
        <div className="w-full h-[200px] bg-[#203152]/50 rounded-lg flex items-center justify-center">
          <p className="text-[#f1f0f3]/70">No {type} uploaded</p>
        </div>
      )}
      {isExisting ? null : (
        <div className="w-full">
          <label
            className="w-full px-4 py-2 bg-[#4895d0]/20 text-[#4895d0] rounded-md hover:bg-[#4895d0]/30 cursor-pointer flex items-center justify-center"
            htmlFor={`upload-${type}`}
          >
            {uploading ? "Uploading ..." : `Upload ${type}`}
          </label>
          <input
            className="hidden"
            type="file"
            id={`upload-${type}`}
            accept={acceptedFileTypes}
            onChange={uploadDocument}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
