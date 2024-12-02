import { useState, useEffect } from "react";
import { Bid, BidStatus } from "@/types/bids";
import { FiCheck, FiX, FiUser } from "react-icons/fi";
import { Profile } from "@/types/profile";

interface BidWithTrucker extends Bid {
  trucker_profile?: Profile;
}

interface BidsListProps {
  bids: Bid[];
  onUpdateBidStatus: (bidId: string, status: BidStatus) => Promise<void>;
}

export default function BidsList({ bids, onUpdateBidStatus }: BidsListProps) {
  const [bidsWithProfiles, setBidsWithProfiles] = useState<BidWithTrucker[]>(
    []
  );
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchTruckerProfiles = async () => {
      const updatedBids = await Promise.all(
        bids.map(async (bid) => {
          try {
            const response = await fetch(`/api/profiles/${bid.trucker_id}`);
            const data = await response.json();
            return {
              ...bid,
              trucker_profile: data.profile,
            };
          } catch (error) {
            console.error(
              `Error fetching profile for trucker ${bid.trucker_id}:`,
              error
            );
            return bid;
          }
        })
      );
      setBidsWithProfiles(updatedBids);
    };

    fetchTruckerProfiles();
  }, [bids]);

  const handleStatusUpdate = async (bidId: string, status: BidStatus) => {
    setUpdating(bidId);
    try {
      await onUpdateBidStatus(bidId, status);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trucker
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bid Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bidsWithProfiles.map((bid) => (
            <tr key={bid.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {bid.trucker_profile?.full_name || 'Unknown Trucker'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {bid.trucker_profile?.email}
                    </div>
                    {bid.trucker_profile?.company_name && (
                      <div className="text-xs text-gray-500">
                        {bid.trucker_profile.company_name}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${bid.bid_amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    bid.bid_status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : bid.bid_status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {bid.bid_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(bid.created_at!).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {bid.bid_status === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(bid.id, "accepted")}
                      disabled={!!updating}
                      className="text-green-600 hover:text-green-900"
                    >
                      <FiCheck className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(bid.id, "rejected")}
                      disabled={!!updating}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
