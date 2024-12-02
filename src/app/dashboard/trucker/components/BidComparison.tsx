import { useState } from "react";
import { Bid } from "@/types/bids";
import { FiEdit2, FiX, FiCheck } from "react-icons/fi";

interface BidComparisonProps {
  ownBid: Bid | null;
  competingBids: Bid[];
  loadBudget: number;
  onUpdateBid: (amount: number) => Promise<void>;
}

export default function BidComparison({
  ownBid,
  competingBids,
  loadBudget,
  onUpdateBid,
}: BidComparisonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(ownBid?.bid_amount || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const lowestCompetingBid = competingBids.length > 0 
    ? Math.min(...competingBids.map(bid => bid.bid_amount))
    : null;

  const handleUpdateBid = async () => {
    try {
      setIsUpdating(true);
      await onUpdateBid(newAmount);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bid:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {/* Own Bid Section */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">Your Bid</h3>
            {ownBid && ownBid.bid_status === "pending" && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800"
              >
                {isEditing ? <FiX className="h-5 w-5" /> : <FiEdit2 className="h-5 w-5" />}
              </button>
            )}
          </div>
          
          {ownBid ? (
            <div className="mt-2">
              {isEditing ? (
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-32 rounded-md border-gray-300"
                    min="0"
                    step="0.01"
                  />
                  <button
                    onClick={handleUpdateBid}
                    disabled={isUpdating}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${ownBid.bid_amount}
                  </span>
                  <span className={`px-2 py-1 text-sm rounded-full
                    ${ownBid.bid_status === "accepted" ? "bg-green-100 text-green-800" : 
                      ownBid.bid_status === "rejected" ? "bg-red-100 text-red-800" : 
                      "bg-yellow-100 text-yellow-800"}`}>
                    {ownBid.bid_status}
                  </span>
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Placed on {new Date(ownBid.created_at!).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">You haven't placed a bid yet</p>
          )}
        </div>

        {/* Market Overview Section */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Market Overview</h3>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Load Budget</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                ${loadBudget}
              </dd>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Lowest Bid</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {lowestCompetingBid ? `$${lowestCompetingBid}` : 'No bids'}
              </dd>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Total Bids</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {competingBids.length + (ownBid ? 1 : 0)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 