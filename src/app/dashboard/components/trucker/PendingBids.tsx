import React, { memo } from "react";
import { Bid } from "@/types/bid";
import BidCard from "../bids/BidCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FiClock } from "react-icons/fi";

const PendingBids = ({
  pendingBids,
  isLoading,
  error,
}: {
  pendingBids: Bid[];
  isLoading: boolean;
  error: string | null;
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiClock className="h-5 w-5 text-yellow-500" />
            <CardTitle>Pending Bids</CardTitle>
          </div>
          <Badge variant="outline">{pendingBids.length} Pending</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {pendingBids.length > 0 ? (
              pendingBids.map((bid) => <BidCard key={bid.id} bid={bid} />)
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">No pending bids at the moment.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default memo(PendingBids);
