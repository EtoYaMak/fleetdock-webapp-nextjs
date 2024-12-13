"use client";

import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiEdit2, FiEye } from "react-icons/fi";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Load, LoadStatus } from "@/types/load";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useUserData } from "@/context/UserDataContext";

const BrokerDashboard = ({
  loads,
  isLoading,
  error,
  deleteLoad,
}: {
  loads: Load[];
  isLoading: boolean;
  error: string;
  deleteLoad: (loadId: string) => Promise<void>;
}) => {
  const router = useRouter();
  const user = useUserData();
  // Filter loads for current broker
  const brokerLoads = loads.filter((load) => load.broker_id === user?.id);

  // Stats calculation
  const stats = {
    totalLoads: brokerLoads.length,
    activeLoads: brokerLoads.filter(
      (load) => load.load_status === LoadStatus.ACCEPTED
    ).length,
    biddingLoads: brokerLoads.filter((load) => load.bid_enabled).length,
  };

  const handleView = (loadId: string) => {
    router.push(`/dashboard/loads/${loadId}`);
  };

  const handleCreate = () => {
    router.push("/dashboard/loads/create");
  };

  const handleEdit = (loadId: string) => {
    router.push(`/dashboard/loads/${loadId}/edit`);
  };

  const handleDelete = async (loadId: string) => {
    if (window.confirm("Are you sure you want to delete this load?")) {
      await deleteLoad(loadId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#203152]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-[#203152]">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#203152] min-h-screen text-[#f1f0f3]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Loads Dashboard</h1>
        <Button
          onClick={handleCreate}
          className="bg-[#4895d0] hover:bg-[#4895d0]/90 text-white"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Create New Load
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-[#1a2b47] p-6 rounded-lg border border-[#4895d0]/30"
          >
            <h3 className="text-sm font-medium text-[#4895d0] uppercase">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </h3>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Loads Table */}
      <div className="bg-[#1a2b47] rounded-lg border border-[#4895d0]/30 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#4895d0]/30">
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>Pickup Date</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brokerLoads.map((load) => (
              <TableRow key={load.id} className="border-b border-[#4895d0]/30">
                <TableCell className="font-medium">
                  {load.id.slice(0, 8)}
                </TableCell>
                <TableCell>{load.load_type_id}</TableCell>
                <TableCell>{load.weight_kg}</TableCell>
                <TableCell>
                  {format(new Date(load.pickup_date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(load.delivery_date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      load.bid_enabled
                        ? "secondary"
                        : load.load_status === LoadStatus.ACCEPTED
                        ? "default"
                        : "outline"
                    }
                    className="bg-[#4895d0]/20 text-[#f1f0f3]"
                  >
                    {load.bid_enabled ? "Bidding" : load.load_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {load.budget_amount
                    ? `${
                        load.budget_currency || "$"
                      }${load.budget_amount.toLocaleString()}`
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(load.id)}
                      className="bg-[#1a2b47] border-[#4895d0]/30 hover:bg-[#4895d0]/20"
                    >
                      <FiEye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(load.id)}
                      className="bg-[#1a2b47] border-[#4895d0]/30 hover:bg-[#4895d0]/20"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(load.id)}
                      className="bg-red-500/20 hover:bg-red-500/30"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

BrokerDashboard.displayName = "BrokerDashboard";

export default BrokerDashboard;
