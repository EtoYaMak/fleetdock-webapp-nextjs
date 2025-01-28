import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useTruckerDash,
  useBids
} from "@/hooks/useTruckerDash";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BidCard from "../bids/BidCard";

const MyBids = () => {/* 
  const { acceptedBids, isLoading: loadingAccepted } = useAcceptedBids();
  const { pendingBids, isLoading: loadingPending } = usePendingBids();
  const { rejectedBids, isLoading: loadingRejected } = useRejectedBids(); */
  const { loads, isLoading: isLoadingLoads, error: loadError, refetch: refetchLoads } = useTruckerDash();
  const { acceptedBids, pendingBids, rejectedBids, isLoading: isLoadingBids, error: bidError, refetch: refetchBids } = useBids();
  if (isLoadingLoads || isLoadingBids) {
    return <LoadingSpinner />;
  }

  if (loadError) {
    return <div className="text-red-500">Error: {loadError}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Bids</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{pendingBids.length} Pending</Badge>
            <Badge variant="default">{acceptedBids.length} Accepted</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pendingBids.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedBids.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedBids.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="pending" className="space-y-4">
              {pendingBids.length > 0 ? (
                pendingBids.map((bid) => <BidCard key={bid.id} bid={bid} />)
              ) : (
                <EmptyState message="No pending bids" />
              )}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              {acceptedBids.length > 0 ? (
                acceptedBids.map((bid) => <BidCard key={bid.id} bid={bid} />)
              ) : (
                <EmptyState message="No accepted bids" />
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {rejectedBids.length > 0 ? (
                rejectedBids.map((bid) => <BidCard key={bid.id} bid={bid} />)
              ) : (
                <EmptyState message="No rejected bids" />
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default MyBids;
