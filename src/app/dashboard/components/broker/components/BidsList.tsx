import { memo, useEffect, useState } from "react";
import { FiCheck, FiX, FiUser } from "react-icons/fi";
import { useBids } from "@/hooks/useBids";
import { BidWithProfile } from "@/types/bids";
import { useAuth } from "@/context/AuthContext";
import { TruckerProfile } from "@/types/profile";
import supabase from "@/lib/supabase";

const BidsList = memo(
  ({ bids, loading }: { bids: BidWithProfile[]; loading: boolean }) => {
    const { updateBidStatus, isLoading } = useBids();
    const { user } = useAuth();
    const [truckerProfile, setTruckerProfile] = useState<TruckerProfile | null>(
      null
    );
    const [hasFetched, setHasFetched] = useState(false);
    useEffect(() => {
      if (user?.id && bids.length > 0 && !hasFetched) {
        try {
          const fetchTruckerProfile = async () => {
            const { data, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", bids[0].trucker_id);
            if (error) throw error;
            console.log(data);
            setTruckerProfile(data[0]);
          };
          fetchTruckerProfile();
          setHasFetched(true);
        } catch (error) {
          console.error(error);
        }
      }
    }, [bids]);

    //transform the trucker name to intials
    const truckerName = truckerProfile?.full_name
      ? truckerProfile?.full_name
          .split(" ")
          .map((name) => name[0])
          .join("")
      : "Unknown Trucker";
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }
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
              {user?.role === "broker" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* if bid row belongs to user (bid.trucker_id === user.id) then show a slightly different color bg */}
            {bids.map((bid) => (
              <tr
                key={bid.id}
                className={
                  bid.trucker_id === user?.id ? "bg-blue-50" : " bg-white"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.role === "broker"
                          ? truckerProfile?.full_name
                          : truckerName}
                      </div>
                      {truckerProfile?.phone && user?.role === "broker" && (
                        <div className="text-sm text-gray-500">
                          {truckerProfile?.phone}
                        </div>
                      )}
                      {truckerProfile?.license_number && (
                        <div className="text-xs text-gray-500">
                          {truckerProfile?.license_number}
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
                {user?.role === "broker" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bid.bid_status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateBidStatus(bid.id, "accepted")}
                          disabled={loading}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiCheck className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => updateBidStatus(bid.id, "rejected")}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

export default BidsList;
