import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormBrokerData } from "./types";
import DatePicker from "@/components/ui/datepicker";
import { Building, Briefcase, MapPin, Info } from "lucide-react";

interface CompanyEditProps {
    formData: FormBrokerData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    onCancel: () => void;
}

export default function CompanyEdit({
    formData,
    handleChange,
    handleSubmit,
    onCancel,
}: CompanyEditProps) {
    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Edit Company Details
                </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                        <Building size={18} />
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                            <Input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                                className="bg-muted/50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>License Number:</label>
                            <Input
                                type="text"
                                name="license_number"
                                value={formData.license_number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Business License Number:</label>
                            <Input
                                type="text"
                                name="business_license_number"
                                value={formData.business_license_number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Business License Expiry:</label>
                            <DatePicker
                                value={formData.business_license_expiry ? new Date(formData.business_license_expiry) : undefined}
                                onChange={(date) => {
                                    handleChange({
                                        target: {
                                            name: "business_license_expiry",
                                            value: date
                                        }
                                    } as any);
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Tax ID:</label>
                            <Input
                                type="text"
                                name="tax_id"
                                value={formData.tax_id}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Business Type:</label>
                            <Input
                                type="text"
                                name="business_type"
                                value={formData.business_type}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Year Established:</label>
                            <Input
                                type="number"
                                name="year_established"
                                value={formData.year_established}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                        <Info size={18} />
                        <CardTitle>Insurance Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <label>Insurance Policy Number:</label>
                            <Input
                                type="text"
                                name="insurance_policy_number"
                                value={formData.insurance_policy_number}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Insurance Expiry:</label>
                            <DatePicker
                                value={formData.insurance_expiry ? new Date(formData.insurance_expiry) : undefined}
                                onChange={(date) => {
                                    handleChange({
                                        target: {
                                            name: "insurance_expiry",
                                            value: date
                                        }
                                    } as any);
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow md:col-span-2">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                        <MapPin size={18} />
                        <CardTitle>Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                                    <p className="font-medium">{formData.location.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">City</p>
                                        <p className="font-medium">{formData.location.city}</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">State</p>
                                        <p className="font-medium">{formData.location.state}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Country</p>
                                    <p className="font-medium">{formData.location.country}</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Postal Code</p>
                                    <p className="font-medium">{formData.location.postal_code}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                        <Briefcase size={18} />
                        <CardTitle>Business Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <label>Description:</label>
                            <Textarea
                                name="business_details.description"
                                value={formData.business_details.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Website:</label>
                            <Input
                                type="text"
                                name="business_details.website"
                                value={formData.business_details.website}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Phone:</label>
                            <Input
                                type="text"
                                name="business_details.phone"
                                value={formData.business_details.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Email:</label>
                            <Input
                                type="email"
                                name="business_details.email"
                                value={formData.business_details.email}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4 pt-6">
                <Button
                    type="submit"
                    className="hover:scale-105 transition-transform"
                >
                    Save Changes
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="hover:scale-105 transition-transform"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
} 