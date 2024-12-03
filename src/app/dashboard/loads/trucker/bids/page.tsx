"use client";

import { useState, useEffect } from "react";
import { Bid } from "@/types/bids";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function TruckerBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch("/api/bids/my-bids");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setBids(data.bids);
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link
            href="/dashboard/trucker"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Loads
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bids</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Load
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </td>
                </tr>
              ) : bids.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No bids placed yet
                  </td>
                </tr>
              ) : (
                bids.map((bid) => (
                  <tr key={bid.id}>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/trucker/loads/${bid.load_id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Load
                      </Link>
                    </td>
                    <td className="px-6 py-4">${bid.bid_amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
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
                    <td className="px-6 py-4">
                      {new Date(bid.created_at!).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
