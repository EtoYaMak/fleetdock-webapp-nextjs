import React from "react";
import { Bid } from "@/types/bid";
import { Button } from "@/components/ui/button";
import { useBids } from "@/hooks/useBids";
import { FiTrash2 } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
const BidCard = ({ bid }: { bid: Bid }) => {
  const { deleteBid } = useBids();
  const router = useRouter();

  const handleDelete = () => {
    deleteBid(bid.id as string);
  };

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500",
    accepted: "bg-green-500/10 text-green-500",
    rejected: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="group relative rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-border hover:bg-card">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Load ID
            </span>
            <Button
              variant="ghost"
              size="lg"
              className="font-mono text-sm"
              onClick={() => router.push(`/loads/${bid.load_id}`)}
            >
              {bid.load_id.slice(0, 8)}
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Bid Amount
            </span>
            <span className="text-sm font-semibold">
              ${bid.bid_amount.toLocaleString()} USD
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Status
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                statusColors[bid.bid_status as keyof typeof statusColors]
              )}
            >
              {bid.bid_status}
            </span>
          </div>

          {/* Delete Button - Only show for pending bids */}
          {bid.bid_status === "pending" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <FiTrash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Bid</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this bid? This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-background">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidCard;
