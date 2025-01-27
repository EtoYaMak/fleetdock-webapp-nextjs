"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface DocumentViewerProps {
    url: string;
    fileName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function DocumentViewer({ url, fileName, isOpen, onClose }: DocumentViewerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [fileType, setFileType] = useState<"pdf" | "image" | null>(null);
    const [fullUrl, setFullUrl] = useState<string>("");

    useEffect(() => {
        if (url && isOpen) {
            // Reset loading state when URL changes
            setIsLoading(true);

            // Get the signed URL from Supabase storage
            const getSignedUrl = async () => {
                try {
                    const { data, error } = await supabase.storage
                        .from('trucker-documents')
                        .createSignedUrl(url, 300); // URL valid for 5 minutes to allow for viewing in new tab

                    if (error) throw error;
                    setFullUrl(data.signedUrl);

                    // Determine file type from URL or file extension
                    if (url.toLowerCase().endsWith(".pdf")) {
                        setFileType("pdf");
                    } else if (url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                        setFileType("image");
                    }
                } catch (error) {
                    console.error("Error getting signed URL:", error);
                }
            };

            getSignedUrl();
        }
    }, [url, isOpen]);

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>{fileName}</DialogTitle>
                    {fullUrl && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(fullUrl, '_blank')}
                            title="Open in new tab"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    )}
                </DialogHeader>
                <div className="relative flex-1 w-full h-full min-h-[60vh] bg-muted rounded-md overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    )}
                    {fullUrl && fileType === "pdf" ? (
                        <iframe
                            src={`${fullUrl}#toolbar=0`}
                            className="w-full h-full"
                            onLoad={handleLoad}
                        />
                    ) : fullUrl && fileType === "image" ? (
                        <img
                            src={fullUrl}
                            alt={fileName}
                            className="w-full h-full object-contain"
                            onLoad={handleLoad}
                        />
                    ) : !fullUrl && !isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            Failed to load document
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
} 