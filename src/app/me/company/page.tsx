'use client'
import React, { useState, useEffect } from "react";
import { useProfileSidebar } from "../layout";
import { BrokerBusiness } from "@/types/broker";
import CompanyView from "./CompanyView";
import CompanyEdit from "./CompanyEdit";
import { FormBrokerData } from "./types";

const emptyFormData: FormBrokerData = {
    company_name: "",
    license_number: "",
    business_license_number: "",
    business_license_expiry: "",
    tax_id: "",
    business_type: "",
    year_established: "",
    insurance_policy_number: "",
    insurance_expiry: "",
    location: {
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
    },
    business_details: {
        description: "",
        website: "",
        phone: "",
        email: "",
    },
};

/**
 * Helper to convert a BrokerBusiness object into our FormBrokerData shape.
 * We convert Date objects into YYYY-MM-DD strings.
 */
const transformBrokerToFormData = (data: BrokerBusiness): FormBrokerData => ({
    company_name: data.company_name || "",
    license_number: data.license_number || "",
    business_license_number: data.business_license_number || "",
    business_license_expiry: data.business_license_expiry
        ? new Date(data.business_license_expiry).toISOString().split("T")[0]
        : "",
    tax_id: data.tax_id || "",
    business_type: data.business_type || "",
    year_established: data.year_established ? data.year_established.toString() : "",
    insurance_policy_number: data.insurance_policy_number || "",
    insurance_expiry: data.insurance_expiry
        ? new Date(data.insurance_expiry).toISOString().split("T")[0]
        : "",
    location: {
        address: data.location?.address || "",
        city: data.location?.city || "",
        state: data.location?.state || "",
        country: data.location?.country || "",
        postal_code: data.location?.postal_code || "",
    },
    business_details: {
        description: data.business_details?.description || "",
        website: data.business_details?.website || "",
        phone: data.business_details?.phone || "",
        email: data.business_details?.email || "",
    },
});

export default function Company() {
    const { broker } = useProfileSidebar();
    const brokerData: BrokerBusiness | null = broker?.broker || null;

    const [editing, setEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormBrokerData>(emptyFormData);

    useEffect(() => {
        if (brokerData) {
            setFormData(transformBrokerToFormData(brokerData));
        } else {
            setFormData(emptyFormData);
        }
    }, [brokerData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof FormBrokerData] as any),
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = { ...formData };

        if (payload.business_license_expiry) {
            payload.business_license_expiry = new Date(payload.business_license_expiry);
        }
        if (payload.insurance_expiry) {
            payload.insurance_expiry = new Date(payload.insurance_expiry);
        }
        if (payload.year_established) {
            payload.year_established = Number(payload.year_established);
        }

        try {
            if (brokerData) {
                await broker?.updateBroker(payload);
            } else {
                await broker?.createBroker(payload);
            }
            setEditing(false);
        } catch (err) {
            console.error("Error submitting form", err);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData(brokerData ? transformBrokerToFormData(brokerData) : emptyFormData);
    };

    if (!broker) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">
                {brokerData ? "Company Business Details" : "Create Company Profile"}
            </h1>

            {editing ? (
                <CompanyEdit
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            ) : brokerData ? (
                <CompanyView brokerData={brokerData} onEdit={() => setEditing(true)} />
            ) : (
                <CompanyEdit
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}

