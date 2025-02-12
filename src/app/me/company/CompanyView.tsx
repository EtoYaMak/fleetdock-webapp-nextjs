import React from "react";
import { BrokerBusiness } from "@/types/broker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, Briefcase, MapPin, Info } from "lucide-react";

interface CompanyViewProps {
    brokerData: BrokerBusiness;
    onEdit: () => void;
}

export default function CompanyView({ brokerData, onEdit }: CompanyViewProps) {
    return (
        <div className="space-y-8 max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {brokerData.company_name}
                </h1>
                <Button
                    onClick={onEdit}
                    className="flex items-center gap-2 hover:scale-105 transition-transform"
                >
                    <Briefcase size={18} />
                    Edit Company Details
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                        <Building size={18} />
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-3">
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-muted-foreground">License Number</span>
                                <span className="font-medium">{brokerData.license_number}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-muted-foreground">Business License</span>
                                <span className="font-medium">{brokerData.business_license_number}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-muted-foreground">License Expiry</span>
                                <span className="font-medium">{new Date(brokerData.business_license_expiry).toLocaleDateString()}</span>
                            </div>
                            {brokerData.tax_id && (
                                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-muted-foreground">Tax ID</span>
                                    <span className="font-medium">{brokerData.tax_id}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                        <Info size={18} />
                        <CardTitle>Insurance Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-3">
                            {brokerData.insurance_policy_number && (
                                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-muted-foreground">Policy Number</span>
                                    <span className="font-medium">{brokerData.insurance_policy_number}</span>
                                </div>
                            )}
                            {brokerData.insurance_expiry && (
                                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-muted-foreground">Expiry Date</span>
                                    <span className="font-medium">{new Date(brokerData.insurance_expiry).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {brokerData.location && (
                    <Card className="hover:shadow-lg transition-shadow md:col-span-2">
                        <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                            <MapPin size={18} />
                            <CardTitle>Location & Contact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    {brokerData.location.address && (
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">Address</p>
                                            <p className="font-medium">{brokerData.location.address}</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        {brokerData.location.city && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-1">City</p>
                                                <p className="font-medium">{brokerData.location.city}</p>
                                            </div>
                                        )}
                                        {brokerData.location.state && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-1">State</p>
                                                <p className="font-medium">{brokerData.location.state}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {brokerData.business_details && (
                                    <div className="space-y-4">
                                        {brokerData.business_details.phone && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                                                <p className="font-medium">{brokerData.business_details.phone}</p>
                                            </div>
                                        )}
                                        {brokerData.business_details.email && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-1">Email</p>
                                                <p className="font-medium">{brokerData.business_details.email}</p>
                                            </div>
                                        )}
                                        {brokerData.business_details.website && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-1">Website</p>
                                                <a href={brokerData.business_details.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-primary hover:underline">
                                                    {brokerData.business_details.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
} 