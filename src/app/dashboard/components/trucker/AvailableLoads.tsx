import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTruckerDash } from "@/hooks/useTruckerDash";
import LoadCard from "../loads/LoadCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
const AvailableLoads = () => {
  const { loads, isLoading, error } = useTruckerDash();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Available Loads</CardTitle>
          <Badge variant="outline">{loads.length} Available</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {loads.length > 0 ? (
              loads.map((load) => <LoadCard key={load.id} load={load} />)
            ) : (
              <Skeleton><p>No available loads at the moment</p></Skeleton>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AvailableLoads;
