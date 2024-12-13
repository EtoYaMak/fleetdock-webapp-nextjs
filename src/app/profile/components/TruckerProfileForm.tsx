import React, { useState } from "react";
import {
  TruckerFormData,
  TruckerDetails,
  DocumentMetadata,
  ContactDetails,
} from "@/types/trucker";
import DocumentUpload from "@/app/profile/components/components/DocumenUploadForm";
import { Plus } from "lucide-react"; // or whatever icon library you're using
import { useAuth } from "@/context/AuthContext";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
}

export default function TruckerProfileForm({
  initialData,
  onSubmit,
  isLoading,
  trucker,
}: TruckerProfileFormProps) {
  const { user } = useAuth();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof TruckerFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

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
            verification_status: "pending",
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
            verification_status: "pending",
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
        newLicenses[index] = { ...newLicenses[index], url };
        setLicenses(newLicenses);
        if (newLicenses[index].name) {
          await handleDocumentMetadataUpdate(
            type,
            newLicenses[index].name,
            url,
            "pending"
          );
        }
      } else {
        const newCertifications = [...certifications];
        newCertifications[index] = { ...newCertifications[index], url };
        setCertifications(newCertifications);
        if (newCertifications[index].name) {
          await handleDocumentMetadataUpdate(
            type,
            newCertifications[index].name,
            url,
            "pending"
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

  const renderDocumentUpload = (
    doc: Document,
    index: number,
    type: "licenses" | "certifications"
  ) => {
    const isExistingDocument = doc.url && doc.name;
    console.log(doc);
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
            className="border border-[#4895d0]/30 bg-[#111a2e] rounded-lg"
          >
            <AccordionTrigger className="hover:no-underline ">
              <div className="flex justify-between items-center w-full px-6   ">
                <span className="font-medium text-[#4895d0]">{doc.name}</span>
                <span className="text-sm text-[#f1f0f3]/70 px-2 py-1 rounded">
                  {doc.verification_status}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-[#111a2e]/50">
              <div className="space-y-4 p-4">
                <div className="border-t border-[#4895d0]/20 pt-4">
                  <DocumentUpload
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
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <div>
        <label className="block text-sm font-medium text-[#4895d0]">
          Contact Details
        </label>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#f1f0f3]">Work Phone</label>
            <input
              type="tel"
              value={contactDetails.work_phone}
              onChange={handleContactChange("work_phone")}
              className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            />
          </div>
          <div>
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
          <div>
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
