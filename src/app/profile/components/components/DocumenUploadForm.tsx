"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function DocumentUpload({
  uid,
  url,
  size,
  type,
  onUpload,
  name,
  acceptedFileTypes = "application/pdf,image/*",
  previewSize = { width: 200, height: 200 },
}: {
  uid: string | null;
  url: string | null;
  size: number;
  type: string;
  onUpload: (url: string) => void;
  name?: string;
  acceptedFileTypes?: string;
  previewSize?: { width: number; height: number };
}) {
  const { user } = useAuth();
  const [documentUrl, setDocumentUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);

  useEffect(() => {
    async function downloadDocument(path: string) {
      try {
        const cleanPath = path.replace(/^\/+/, "");

        const { data, error } = await supabase.storage
          .from("trucker-documents")
          .download(cleanPath);

        if (error) {
          console.error("Download error:", error);
          throw error;
        }

        const url = URL.createObjectURL(data);
        setDocumentUrl(url);
      } catch (error) {
        console.error("Error downloading document: ", error);
      }
    }

    if (url) downloadDocument(url);
  }, [url]);

  useEffect(() => {
    if (documentUrl) {
      setFileType(documentUrl.toLowerCase().includes(".pdf") ? "pdf" : "image");
    }
  }, [documentUrl]);

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
      const fileExt = file.name.split(".").pop();
      const fileName = `${type}/${
        name ? `${name}-` : ""
      }${uid}-${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
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
      console.error("Error uploading document:", error);
      alert("Error uploading document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {documentUrl ? (
        fileType === "image" ? (
          <div className="relative w-full h-[200px] bg-[#203152]/50 rounded-lg overflow-hidden">
            <Image
              src={documentUrl}
              alt={`${type} document`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-full p-4 bg-[#203152]/50 rounded-lg flex flex-col items-center gap-2">
            <p className="text-[#f1f0f3]">PDF Document Uploaded</p>
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4895d0] hover:text-[#4895d0]/80"
            >
              View PDF
            </a>
          </div>
        )
      ) : (
        <div className="w-full h-[200px] bg-[#203152]/50 rounded-lg flex items-center justify-center">
          <p className="text-[#f1f0f3]/70">No {type} uploaded</p>
        </div>
      )}
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
    </div>
  );
}
