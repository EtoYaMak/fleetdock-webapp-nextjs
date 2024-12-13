import React, { useState } from "react";
import {
  TruckerFormData,
  TruckerDetails,
  DocumentMetadata,
  ContactDetails,
} from "@/types/trucker";
import DocumentUpload from "@/app/profile/components/components/DocumenUploadForm";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/auth";
interface Document {
  id?: string;
  uid?: string;
  name: string;
  url: string | null;
  size: number;
  verification_status: string;
}

interface TruckerProfileFormProps {
  initialData?: TruckerFormData;
  onSubmit: (data: TruckerFormData) => Promise<void>;
  isLoading: boolean;
  trucker: TruckerDetails | null;
  user: User | null;
}

export default function TruckerProfileForm({
  initialData,
  onSubmit,
  isLoading,
  trucker,
  user,
}: TruckerProfileFormProps) {
  const [formData, setFormData] = useState<TruckerFormData>(initialData || {});
  const [errors, setErrors] = useState<
    Partial<Record<keyof TruckerFormData, string>>
  >({});
  const [licenses, setLicenses] = useState<Document[]>(() => {
    if (initialData?.licenses) {
      return Object.entries(initialData.licenses).map(([name, metadata]) => ({
        name,
        url: metadata.url,
        size: 0, // You might want to store this in your metadata if needed
        verification_status: metadata.verification_status,
      }));
    }
    return [{ name: "", url: null, size: 0, verification_status: "" }];
  });
  const [certifications, setCertifications] = useState<Document[]>(() => {
    if (initialData?.certifications) {
      return Object.entries(initialData.certifications).map(
        ([name, metadata]) => ({
          name,
          url: metadata.url,
          size: 0,
          verification_status: metadata.verification_status,
        })
      );
    }
    return [{ name: "", url: null, size: 0, verification_status: "" }];
  });
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    work_phone: initialData?.contact_details?.work_phone || "",
    personal_phone: initialData?.contact_details?.personal_phone || "",
    email: initialData?.contact_details?.email || "",
  });

  const handleContactChange =
    (field: keyof ContactDetails) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setContactDetails((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const certificationsObject = {
      ...(initialData?.certifications || {}),
      ...certifications.reduce((acc, cert) => {
        if (cert.name && cert.url) {
          acc[cert.name] = {
            name: cert.name,
            url: cert.url,
            uploadedAt: new Date().toISOString(),
            verification_status: cert.verification_status,
          };
        }
        return acc;
      }, {} as Record<string, DocumentMetadata>),
    };

    const licensesObject = {
      ...(initialData?.licenses || {}),
      ...licenses.reduce((acc, license) => {
        if (license.name && license.url) {
          acc[license.name] = {
            name: license.name,
            url: license.url,
            uploadedAt: new Date().toISOString(),
            verification_status: license.verification_status,
          };
        }
        return acc;
      }, {} as Record<string, DocumentMetadata>),
    };

    const updatedFormData = {
      ...formData,
      certifications: certificationsObject,
      licenses: licensesObject,
      contact_details: contactDetails,
    };

    await onSubmit(updatedFormData);
  };

  const handleDocumentMetadataUpdate = async (
    type: "licenses" | "certifications",
    name: string,
    url: string,
    verification_status: string
  ) => {
    const updatedFormData = { ...formData };
    const metadata = {
      name,
      url,
      uploadedAt: new Date().toISOString(),
      verification_status,
    };

    if (type === "licenses") {
      updatedFormData.licenses = {
        ...(formData.licenses || {}),
        [name]: metadata,
      };
    } else {
      updatedFormData.certifications = {
        ...(formData.certifications || {}),
        [name]: metadata,
      };
    }

    setFormData(updatedFormData);
    await onSubmit(updatedFormData);
  };

  const handleDocumentUpload =
    (type: "licenses" | "certifications", index: number) =>
    async (url: string) => {
      if (type === "licenses") {
        const newLicenses = [...licenses];
        const existingStatus =
          newLicenses[index].verification_status || "pending";
        newLicenses[index] = {
          ...newLicenses[index],
          url,
          verification_status: existingStatus,
        };
        setLicenses(newLicenses);
        if (newLicenses[index].name) {
          await handleDocumentMetadataUpdate(
            type,
            newLicenses[index].name,
            url,
            existingStatus
          );
        }
      } else {
        const newCertifications = [...certifications];
        const existingStatus =
          newCertifications[index].verification_status || "pending";
        newCertifications[index] = {
          ...newCertifications[index],
          url,
          verification_status: existingStatus,
        };
        setCertifications(newCertifications);
        if (newCertifications[index].name) {
          await handleDocumentMetadataUpdate(
            type,
            newCertifications[index].name,
            url,
            existingStatus
          );
        }
      }
    };

  const addDocument = (type: "licenses" | "certifications") => {
    if (type === "licenses") {
      setLicenses([
        ...licenses,
        { name: "", url: null, size: 0, verification_status: "" },
      ]);
    } else {
      setCertifications([
        ...certifications,
        { name: "", url: null, size: 0, verification_status: "" },
      ]);
    }
  };

  const handleDocumentDelete = async (
    type: "licenses" | "certifications",
    docName: string,
    docUrl: string | null
  ) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete this ${
          type === "licenses" ? "license" : "certification"
        }?`
      );

      if (!confirmDelete) return;

      // Remove file from Storage if URL exists
      if (docUrl) {
        // Extract the full path including subfolder
        const fullPath =
          docUrl.includes("certifications/") || docUrl.includes("licenses/")
            ? docUrl
            : `${type}/${docUrl}`;

        console.log("Deleting file:", fullPath); // Debug log

        const { error: storageError } = await supabase.storage
          .from("trucker-documents")
          .remove([fullPath]);

        if (storageError) {
          console.error("Storage deletion error:", storageError); // Debug log
          throw storageError;
        }
      }

      // Remove document metadata from form data
      const updatedFormData = { ...formData };
      if (type === "licenses") {
        const { [docName]: _, ...remainingLicenses } =
          updatedFormData.licenses || {};
        updatedFormData.licenses = remainingLicenses;
        setLicenses(licenses.filter((license) => license.name !== docName));
      } else {
        const { [docName]: _, ...remainingCertifications } =
          updatedFormData.certifications || {};
        updatedFormData.certifications = remainingCertifications;
        setCertifications(
          certifications.filter((cert) => cert.name !== docName)
        );
      }

      // Update the trucker_details table
      await onSubmit(updatedFormData);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  const renderDocumentUpload = (
    doc: Document,
    index: number,
    type: "licenses" | "certifications"
  ) => {
    const isExistingDocument = doc.url && doc.name;

    if (isExistingDocument) {
      return (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          key={`${type}-${index}`}
        >
          <AccordionItem
            value={`${type}-${index}`}
            className=" bg-[#111a2e]/60 border-r-2 border-b-2 border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20"
          >
            <AccordionTrigger className="">
              <div className="flex justify-between items-center w-full px-6">
                <span className="font-medium text-[#4895d0]">{doc.name}</span>
                <span
                  className={`text-sm ${
                    doc.verification_status === "verified"
                      ? "text-[#00ff00]/60"
                      : "text-[#f1f0f3]/70"
                  } ${
                    doc.verification_status === "pending"
                      ? "text-[#f1f0f3]/70"
                      : "text-[#f1f0f3]/70"
                  } ${
                    doc.verification_status === "rejected" ? "text-red-500" : ""
                  }
                   bg-[#203152] px-2 py-1 rounded`}
                >
                  {doc.verification_status || "pending"}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-[#1a2b47]/50">
              <div className="space-y-4 p-4">
                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleDocumentDelete(type, doc.name, doc.url)
                    }
                    className="flex items-center gap-2 text-sm bg-[#203152] px-2 py-1 rounded"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>

                <div className="border-t border-[#4895d0]/20 pt-4">
                  <DocumentUpload
                    user={user}
                    uid={user?.id || trucker?.id || ""}
                    url={doc.url}
                    size={doc.size}
                    type={type}
                    onUpload={handleDocumentUpload(type, index)}
                    acceptedFileTypes="application/pdf,image/*"
                    previewSize={{ width: 200, height: 200 }}
                    isExisting={isExistingDocument}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    // Return the regular upload form for new documents
    return (
      <div
        key={`${type}-${index}`}
        className="bg-[#1a2b47] p-4 rounded-lg border border-[#4895d0]/30"
      >
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder={`${
              type === "licenses" ? "License" : "Certification"
            } Name`}
            value={doc.name}
            onChange={(e) => {
              const newDocs =
                type === "licenses" ? [...licenses] : [...certifications];
              newDocs[index] = { ...newDocs[index], name: e.target.value };
              type === "licenses"
                ? setLicenses(newDocs)
                : setCertifications(newDocs);
            }}
            className="w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
          />
          <DocumentUpload
            uid={user?.id || trucker?.id || ""}
            url={doc.url}
            size={doc.size}
            type={type}
            onUpload={handleDocumentUpload(type, index)}
            acceptedFileTypes="application/pdf,image/*"
            previewSize={{ width: 200, height: 200 }}
            isExisting={isExistingDocument ? doc.name : null}
            user={user}
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-[#111a2e]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#1a2b47] p-6 rounded-lg border border-black">
        {/* Certifications */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#4895d0]">
            Certifications
          </label>
          <div className="space-y-4">
            {certifications.map((cert, index) =>
              renderDocumentUpload(cert, index, "certifications")
            )}
            <button
              type="button"
              onClick={() => addDocument("certifications")}
              className="flex items-center gap-2 px-4 py-2 bg-[#4895d0]/20 text-[#4895d0] rounded-md hover:bg-[#4895d0]/30"
            >
              <Plus size={16} /> Add Another Certification
            </button>
          </div>
        </div>

        {/* Licenses */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#4895d0]">
            Licenses
          </label>
          <div className="space-y-4">
            {licenses.map((license, index) =>
              renderDocumentUpload(license, index, "licenses")
            )}
            <button
              type="button"
              onClick={() => addDocument("licenses")}
              className="flex items-center gap-2 px-4 py-2 bg-[#4895d0]/20 text-[#4895d0] rounded-md hover:bg-[#4895d0]/30"
            >
              <Plus size={16} /> Add Another License
            </button>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-[#1a2b47] p-6 rounded-lg border border-black">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2
           border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20"
          >
            <label className="block text-sm text-[#f1f0f3]">Work Phone</label>
            <input
              type="tel"
              value={contactDetails.work_phone}
              onChange={handleContactChange("work_phone")}
              className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            />
          </div>
          <div
            className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2
           border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20"
          >
            <label className="block text-sm text-[#f1f0f3]">
              Personal Phone
            </label>
            <input
              type="tel"
              value={contactDetails.personal_phone}
              onChange={handleContactChange("personal_phone")}
              className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            />
          </div>
          <div
            className="bg-[#111a2e]/60 px-4 py-3  border-r-2 border-b-2
           border-[#4895d0]/30 rounded-lg shadow-inner shadow-black/20"
          >
            <label className="block text-sm text-[#f1f0f3]">Email</label>
            <input
              type="email"
              value={contactDetails.email}
              onChange={handleContactChange("email")}
              className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-[#4895d0] text-[#f1f0f3] rounded-md hover:bg-[#4895d0]/90 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
