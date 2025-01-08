"use client";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiEdit2, FiEye } from "react-icons/fi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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
import { useAuth } from "@/context/AuthContext";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useToast } from "@/hooks/use-toast";
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
  const { user } = useAuth();
  const router = useRouter();
  const { checkAccess } = useFeatureAccess();
  const { toast } = useToast();
  //get Current Month in format Jan etc
  const currentMonth = format(new Date(), "MMM");
  const brokerLoads = loads
    .filter((load) => load.broker_id === user?.id)
    .sort(
      (a, b) =>
        new Date(b.pickup_date).getTime() - new Date(a.pickup_date).getTime()
    );
  // Stats calculation
  const stats = {
    totalLoads: brokerLoads.length,
    activeLoads: brokerLoads.filter(
      (load) => load.load_status === LoadStatus.ACCEPTED
    ).length,
    biddingLoads: brokerLoads.filter((load) => load.bid_enabled).length,
    [`${currentMonth}'s Loads`]: brokerLoads.filter(
      (load) =>
        new Date(load.pickup_date).getMonth() === new Date().getMonth() &&
        new Date(load.pickup_date).getFullYear() === new Date().getFullYear()
    ).length,
  };

  const handleView = (loadId: string) => {
    router.push(`/dashboard/loads/${loadId}`);
  };

  const handleCreate = async () => {
    const canCreate = await checkAccess("load_posts_per_month");
    if (canCreate) {
      router.push("/dashboard/loads/create");
    } else {
      toast({
        title: "You have reached your limit for creating loads.",
        description: "Please upgrade your plan to create more loads.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (loadId: string) => {
    router.push(`/dashboard/loads/${loadId}/edit`);
  };

  const handleDelete = async (loadId: string) => {
    if (window.confirm("Are you sure you want to delete this load?")) {
      await deleteLoad(loadId);
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-background">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen ">
      {/* Header */}
      <div className="flex justify-end items-center">
        {/*  <h1 className="text-xl font-bold">Loads Dashboard</h1> */}

        <Button onClick={handleCreate} variant="default" className="text-white">
          <FiPlus className="mr-2 h-5 w-5" />
          Create New Load
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-card p-6 rounded-lg border border-border"
          >
            <h3 className="text-sm text-primary uppercase font-semibold">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </h3>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Loads Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border">
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
              <TableRow key={load.id} className="border-b border-border">
                <TableCell className="font-medium">
                  {load.id.slice(0, 8)}
                </TableCell>
                <TableCell>{load.load_type_name}</TableCell>
                <TableCell>{load.weight_kg}</TableCell>
                <TableCell>
                  {formatDate(load.pickup_date.toString()) || "Loading..."}
                </TableCell>
                <TableCell>
                  {formatDate(load.delivery_date.toString()) || "Loading..."}
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
                    className="bg-primary/20 text-primary font-semibold uppercase w-full flex justify-center items-center text-center"
                  >
                    {load.bid_enabled ? "Bidding" : load.load_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {load.budget_amount
                    ? `${load.budget_amount.toLocaleString()}`
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleView(load.id)}
                    >
                      <FiEye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(load.id)}
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(load.id)}
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
