import React from "react";
import {
  useAcceptedBids,
  usePendingBids,
  useRejectedBids,
} from "@/hooks/useTruckerDash";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarElement,
  CategoryScale,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const { acceptedBids } = useAcceptedBids();
  const { pendingBids } = usePendingBids();
  const { rejectedBids } = useRejectedBids();

  const acceptedBidsCount = acceptedBids.length;
  const pendingBidsCount = pendingBids.length;
  const rejectedBidsCount = rejectedBids.length;

  const data = {
    labels: ["Accepted", "Pending", "Rejected"],
    datasets: [
      {
        label: "# of Bids",
        data: [acceptedBidsCount, pendingBidsCount, rejectedBidsCount],
        backgroundColor: ["#4ade80", "#facc15", "#f87171"],
      },
    ],
  };

  return (
    <div className="bg-[#1a2b47] p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Your Bids Statistics</h2>
      <Bar data={data} />
    </div>
  );
};

export default Statistics;
