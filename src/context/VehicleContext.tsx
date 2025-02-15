import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { VehicleWithType } from "@/types/vehicles";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface VehicleContextType {
    vehicles: VehicleWithType[];
    isLoading: boolean;
    error: string | null;
    updateVehicleVerificationStatus: (id: string, status: boolean) => Promise<void>;
    updateVehicle: (data: VehicleWithType) => Promise<void>;
    deleteVehicle: (id: string) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<VehicleWithType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicles = useCallback(async () => {
        if (!user?.id || user.role !== "admin") return;
        setIsLoading(true);
        setError(null);

        try {
            const { data: vehicles, error } = await supabase
                .from("vehicles")
                .select("*, vehicle_type:vehicle_types(*), trucker:profiles(email, full_name)");

            if (error) throw error;
            setVehicles(vehicles as VehicleWithType[]);
        } catch (err) {
            console.error("Error fetching vehicles:", err);
            setError("Failed to fetch vehicles");
            toast({
                title: "Error",
                description: "Failed to fetch vehicles. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, user?.role, toast]);

    const updateVehicleVerificationStatus = async (id: string, status: boolean) => {
        if (!user?.id || user.role !== "admin") return;

        // Optimistic update
        setVehicles((prev) =>
            prev.map((vehicle) =>
                vehicle.id === id
                    ? { ...vehicle, verification_status: status }
                    : vehicle
            )
        );

        try {
            const { error } = await supabase
                .from("vehicles")
                .update({ verification_status: status })
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Status updated",
                description: "Vehicle verification status has been updated successfully",
            });
        } catch (err) {
            console.error("Error updating vehicle status:", err);
            // Revert optimistic update
            setVehicles((prev) =>
                prev.map((vehicle) =>
                    vehicle.id === id
                        ? { ...vehicle, verification_status: !status }
                        : vehicle
                )
            );
            toast({
                title: "Error",
                description: "Failed to update vehicle status. Please try again.",
                variant: "destructive",
            });
        }
    };

    const updateVehicle = async (data: VehicleWithType) => {
        if (!user?.id || user.role !== "admin") return;

        // Extract only the necessary fields for update
        const { id, vehicle_type, trucker, ...updateData } = data;

        // Optimistic update
        setVehicles((prev) =>
            prev.map((vehicle) =>
                vehicle.id === id ? { ...vehicle, ...updateData } : vehicle
            )
        );

        try {
            const { error } = await supabase
                .from("vehicles")
                .update(updateData)
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Vehicle updated",
                description: "Vehicle has been updated successfully",
            });
        } catch (err) {
            console.error("Error updating vehicle:", err);
            // Revert optimistic update
            setVehicles((prev) =>
                prev.map((vehicle) =>
                    vehicle.id === id ? { ...vehicle, ...data } : vehicle
                )
            );
            toast({
                title: "Error",
                description: "Failed to update vehicle. Please try again.",
                variant: "destructive",
            });
        }
    };

    const deleteVehicle = async (id: string) => {
        if (!user?.id || user.role !== "admin") return;

        // Optimistic update
        setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));

        try {
            const { error } = await supabase
                .from("vehicles")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Vehicle deleted",
                description: "Vehicle has been deleted successfully",
            });
        } catch (err) {
            console.error("Error deleting vehicle:", err);
            // Revert optimistic update
            setVehicles((prev) => [...prev, vehicles.find((v) => v.id === id)!]);
            toast({
                title: "Error",
                description: "Failed to delete vehicle. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Set up real-time subscription with efficient updates
    useEffect(() => {
        if (!user?.id || user.role !== "admin") return;

        const channel = supabase
            .channel("vehicle-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "vehicles",
                },
                (payload) => {
                    switch (payload.eventType) {
                        case "UPDATE": {
                            const updatedVehicle = payload.new as VehicleWithType;
                            setVehicles((prev) =>
                                prev.map((vehicle) =>
                                    vehicle.id === updatedVehicle.id
                                        ? { ...vehicle, ...updatedVehicle }
                                        : vehicle
                                )
                            );
                            break;
                        }
                        case "DELETE": {
                            const deletedVehicle = payload.old as VehicleWithType;
                            setVehicles((prev) =>
                                prev.filter((v) => v.id !== deletedVehicle.id)
                            );
                            break;
                        }
                        case "INSERT": {
                            const newVehicle = payload.new as VehicleWithType;
                            setVehicles((prev) => [...prev, newVehicle]);
                            break;
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, user?.role]);

    // Initial fetch
    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    return (
        <VehicleContext.Provider
            value={{
                vehicles,
                isLoading,
                error,
                updateVehicleVerificationStatus,
                updateVehicle,
                deleteVehicle,
            }}
        >
            {children}
        </VehicleContext.Provider>
    );
}

export const useVehicles = () => {
    const context = useContext(VehicleContext);
    if (context === undefined) {
        throw new Error("useVehicles must be used within a VehicleProvider");
    }
    return context;
}; 