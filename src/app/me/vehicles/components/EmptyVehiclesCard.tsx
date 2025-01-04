import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function EmptyVehiclesCard() {
  return (
    <Card className="text-center py-12">
      <CardHeader>
        <CardTitle className="text-xl text-muted-foreground">
          No vehicles registered
        </CardTitle>
        <CardDescription>
          Register your first vehicle to get started
        </CardDescription>
      </CardHeader>
    </Card>
  );
} 