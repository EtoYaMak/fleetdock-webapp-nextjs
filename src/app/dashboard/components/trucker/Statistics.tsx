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
      color: "hsl(142, 76%, 36%)", // Green
    },
    pending: {
      label: "Pending",
      color: "hsl(48, 96%, 53%)", // Yellow
    },
    rejected: {
      label: "Rejected",
      color: "hsl(0, 84%, 60%)", // Red
    },
  };

  return (
    <BarChartWithLegends
      data={chartData}
      config={chartConfig}
      title="Your Bids Statistics"
    />
  );
};

export default Statistics;
