import React, { memo, useState } from "react";
import { TruckerDetails } from "@/types/trucker";
import { DocumentMetadata } from "@/types/trucker";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { User } from "@/types/auth";
interface ViewTruckerProfileDataProps {
  trucker: TruckerDetails;
  user: User;
}

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

const ViewTruckerProfileData = memo(function ViewTruckerProfileData({
  trucker,
  user,
}: ViewTruckerProfileDataProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    url: string | null;
    documentName: string;
    isPDF: boolean;
  }>({
    isOpen: false,
    url: null,
    documentName: "",
    isPDF: false,
  });

  const openDocument = async (path: string, name: string) => {
    try {
      const cleanPath = path.replace(/^\/+/, "");
      const { data, error } = await supabase.storage
        .from("trucker-documents")
        .download(cleanPath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const isPDF = cleanPath.toLowerCase().endsWith(".pdf");

      setModalState({
        isOpen: true,
        url,
        documentName: name,
        isPDF,
      });
    } catch (error) {
      console.error("Error opening document:", error);
      alert("Error opening document. Please try again.");
    }
  };

  const closeModal = () => {
    if (modalState.url) {
      URL.revokeObjectURL(modalState.url);
    }
    setModalState({
      isOpen: false,
      url: null,
      documentName: "",
      isPDF: false,
    });
  };

  const renderDocuments = (
    documents: Record<string, DocumentMetadata> | null | undefined
  ) => {
    if (!documents)
      return <p className="text-sm text-[#f1f0f3]">No documents listed</p>;

    return Object.entries(documents).map(([name, metadata]) => (
      <div key={name} className="mb-2 p-2 bg-[#203152]/50 rounded">
        <p className="font-medium text-[#4895d0]">{name}</p>
        <button
          onClick={() => openDocument(metadata.url, name)}
          className="text-sm text-[#4895d0] hover:text-[#4895d0]/80"
        >
          View Document
        </button>
        <p className="text-xs text-[#f1f0f3]/70">
          Uploaded: {new Date(metadata.uploadedAt).toLocaleDateString()}
        </p>
      </div>
    ));
  };

  if (!trucker) {
    return <div>No trucker data available</div>;
  }

  return (
    <div className="space-y-6">
      <DocumentViewerModal
        url={modalState.url}
        isOpen={modalState.isOpen}
        onClose={closeModal}
        documentName={modalState.documentName}
        isPDF={modalState.isPDF}
      />

      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Account Information
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20">
            <dt className="text-sm font-medium text-[#4895d0]">Full Name</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap">
              {user?.full_name || "No full name listed"}
            </dd>
          </div>
          <div className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20">
            <dt className="text-sm font-medium text-[#4895d0]">Email</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap">
              {user?.email || "No email listed"}
            </dd>
          </div>
          <div className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20">
            <dt className="text-sm font-medium text-[#4895d0]">Role</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap capitalize">
              {user?.role || "No role listed"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Certifications & Licenses
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20">
            <dt className="text-sm font-medium text-[#4895d0]">
              Certifications
            </dt>
            <dd className="mt-1 space-y-2">
              {renderDocuments(trucker.certifications)}
            </dd>
          </div>
          <div className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20">
            <dt className="text-sm font-medium text-[#4895d0]">Licenses</dt>
            <dd className="mt-1 space-y-2">
              {renderDocuments(trucker.licenses)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Contact Information
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20">
            <dt className="text-sm font-medium text-[#4895d0]">Work Phone</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3]">
              {trucker.contact_details?.work_phone || "Not provided"}
            </dd>
          </div>
          <div className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20">
            <dt className="text-sm font-medium text-[#4895d0]">
              Personal Phone
            </dt>
            <dd className="mt-1 text-sm text-[#f1f0f3]">
              {trucker.contact_details?.personal_phone || "Not provided"}
            </dd>
          </div>
          <div className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20">
            <dt className="text-sm font-medium text-[#4895d0]">Email</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3]">
              {trucker.contact_details?.email || "Not provided"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Status Information
        </h3>
        <dl className="grid grid-cols-1 gap-4">
          <div className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20">
            <dt className="text-sm font-medium text-[#4895d0]">
              Verification Status
            </dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] uppercase">
              {trucker.verification_status}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
});

ViewTruckerProfileData.displayName = "ViewTruckerProfileData";

export default ViewTruckerProfileData;