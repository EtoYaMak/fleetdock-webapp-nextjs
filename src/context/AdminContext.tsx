"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { User } from "@/types/auth";
import { supabase } from "@/lib/supabase";
import { useTrucker } from "@/hooks/useTrucker";
import { useLoads } from "@/hooks/useLoads";
import { TruckerDetails } from "@/types/trucker";
import { Load } from "@/types/load";


interface AdminContextType {
    isAdmin: boolean;
    users: User[];
    truckers: TruckerDetails[];
    loads: Load[];
    loading: boolean;
    fetchUsers: () => Promise<void>;
    updateUserStatus: (userId: string, status: boolean) => Promise<void>;
    updateUserRole: (userId: string, role: User["role"]) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    createUser: (userData: Partial<User>) => Promise<void>;
    updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { truckers } = useTrucker();
    const { loads } = useLoads();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const isAdmin = user?.role === "admin";

    const fetchUsers = async () => {

        if (!isAdmin) {
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*");


            if (error) {
                console.error("Supabase error fetching users:", error);
                return;
            }

            if (!data) {
                console.log("No users data received");
                return;
            }

            setUsers(data as User[]);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData: Partial<User>) => {
        if (!isAdmin) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .insert([userData]);

            if (error) throw error;
            await fetchUsers(); // Refresh the users list
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userId: string, userData: Partial<User>) => {
        if (!isAdmin) return;
        setLoading(true);
        try {
            console.log("Updating user:", userId, userData);
            const { error } = await supabase
                .from('profiles')
                .update(userData)
                .eq('id', userId)

            if (error) throw error;
            await fetchUsers(); // Refresh the users list
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUserStatus = async (userId: string, is_active: boolean) => {
        await updateUser(userId, { is_active });
    };

    const updateUserRole = async (userId: string, role: User["role"]) => {
        await updateUser(userId, { role });
    };

    const deleteUser = async (userId: string) => {
        if (!isAdmin) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            await fetchUsers(); // Refresh the users list
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {  // Only fetch if admin
            fetchUsers();
        }
    }, [isAdmin]); // Add isAdmin as dependency

    return (
        <AdminContext.Provider
            value={{
                isAdmin,
                users,
                truckers,
                loads,
                loading,
                fetchUsers,
                updateUserStatus,
                updateUserRole,
                deleteUser,
                createUser,
                updateUser,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
};