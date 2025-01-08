import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Component as BarChartWithLegends } from "@/components/ui/barChartwithLegends";

const Statistics = ({
  acceptedBids,
  pendingBids,
  rejectedBids,
}: {
  acceptedBids: any[];
  pendingBids: any[];
  rejectedBids: any[];
}) => {
  const chartData = [
    {
      month: "Current Period",
      accepted: acceptedBids.length,
      pending: pendingBids.length,
      rejected: rejectedBids.length,
    },
  ];

  const chartConfig = {
    accepted: {
      label: "Accepted",
      color: "hsl(142, 76%, 36%)",
    },
    pending: {
      label: "Pending",
      color: "hsl(48, 96%, 53%)",
    },
    rejected: {
      label: "Rejected",
      color: "hsl(0, 84%, 60%)",
    },
  };

  return (
        <BarChartWithLegends
          data={chartData}
      config={chartConfig}
      title="Bids Statistics"
      description="Your recent bids"
    />
  );
};

export default Statistics;
