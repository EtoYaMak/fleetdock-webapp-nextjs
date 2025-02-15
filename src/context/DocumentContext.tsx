import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { TruckerDetails, DocumentMetadata } from "@/types/trucker";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface TruckerWithProfiles extends TruckerDetails {
    profiles?: {
        email: string;
        full_name: string;
    };
}

interface DocumentContextType {
    documents: {
        certifications: DocumentWithTrucker[];
        licenses: DocumentWithTrucker[];
    };
    isLoading: boolean;
    error: string | null;
    updateDocumentStatus: (params: UpdateDocumentParams) => Promise<void>;
}

interface DocumentWithTrucker {
    id: string;
    truckerId: string;
    truckerName: string;
    documentName: string;
    uploadedAt: string;
    verification_status: string;
    url: string;
    name: string;
}

interface UpdateDocumentParams {
    truckerId: string;
    documentName: string;
    documentType: "certifications" | "licenses";
    newStatus: string;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [documents, setDocuments] = useState<DocumentContextType["documents"]>({
        certifications: [],
        licenses: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDocuments = useCallback(async () => {
        if (!user?.id || user.role !== "admin") return;
        setIsLoading(true);
        setError(null);

        try {
            const { data: truckers, error } = await supabase
                .from("trucker_details")
                .select("*, profiles(email, full_name)");

            if (error) throw error;

            const processDocuments = (
                truckerData: TruckerWithProfiles[],
                type: keyof Pick<TruckerWithProfiles, "certifications" | "licenses">
            ): DocumentWithTrucker[] => {
                return truckerData.flatMap((trucker) =>
                    Object.entries(trucker[type] || {}).map(([key, doc]) => ({
                        id: `${trucker.id}-${key}`,
                        truckerId: trucker.id,
                        truckerName: trucker.profiles?.full_name || trucker.profile_id,
                        documentName: key,
                        ...(doc as DocumentMetadata),
                    }))
                );
            };

            setDocuments({
                certifications: processDocuments(truckers as TruckerWithProfiles[], "certifications"),
                licenses: processDocuments(truckers as TruckerWithProfiles[], "licenses"),
            });
        } catch (err) {
            console.error("Error fetching documents:", err);
            setError("Failed to fetch documents");
            toast({
                title: "Error",
                description: "Failed to fetch documents. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, user?.role, toast]);

    const updateDocumentStatus = async ({
        truckerId,
        documentName,
        documentType,
        newStatus,
    }: UpdateDocumentParams) => {
        if (!user?.id || user.role !== "admin") return;

        // Optimistic update
        setDocuments((prev) => ({
            ...prev,
            [documentType]: prev[documentType].map((doc) =>
                doc.truckerId === truckerId && doc.documentName === documentName
                    ? { ...doc, verification_status: newStatus }
                    : doc
            ),
        }));

        try {
            type DocumentResponse = {
                [K in typeof documentType]: Record<string, DocumentMetadata>;
            };

            const { data: truckerData } = await supabase
                .from("trucker_details")
                .select(`${documentType}`)
                .eq("id", truckerId)
                .single();

            if (!truckerData) throw new Error("Trucker not found");

            const currentDocs = (truckerData as DocumentResponse)[documentType];

            const updatedDocs = {
                ...currentDocs,
                [documentName]: {
                    ...currentDocs[documentName],
                    verification_status: newStatus,
                },
            };

            const { error } = await supabase
                .from("trucker_details")
                .update({ [documentType]: updatedDocs })
                .eq("id", truckerId);

            if (error) throw error;

            toast({
                title: "Status updated",
                description: "Document verification status has been updated successfully",
            });
        } catch (err) {
            console.error("Error updating document status:", err);
            // Revert optimistic update
            await fetchDocuments();
            toast({
                title: "Error",
                description: "Failed to update document status. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Set up real-time subscription
    useEffect(() => {
        if (!user?.id || user.role !== "admin") return;

        const channel = supabase
            .channel("document-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "trucker_details",
                },
                () => {
                    fetchDocuments();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, user?.role, fetchDocuments]);

    // Initial fetch
    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    return (
        <DocumentContext.Provider
            value={{
                documents,
                isLoading,
                error,
                updateDocumentStatus,
            }}
        >
            {children}
        </DocumentContext.Provider>
    );
}

export const useDocuments = () => {
    const context = useContext(DocumentContext);
    if (context === undefined) {
        throw new Error("useDocuments must be used within a DocumentProvider");
    }
    return context;
}; 