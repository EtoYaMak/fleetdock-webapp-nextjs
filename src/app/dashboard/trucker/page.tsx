"use client";

import { useState } from "react";

interface Load {
  id: string;
  pickup: string;
  delivery: string;
  distance: string;
  price: number;
  weight: string;
  pickupDate: string;
  deliveryDate: string;
  loadType: string;
}

export default function TruckerDashboard() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Placeholder data
  const loads: Load[] = [
    {
      id: "1",
      pickup: "Miami, FL",
      delivery: "Atlanta, GA",
      distance: "662 miles",
      price: 2800,
      weight: "15,000 lbs",
      pickupDate: "2024-03-25",
      deliveryDate: "2024-03-26",
      loadType: "Dry Van"
    },
    {
      id: "2",
      pickup: "Los Angeles, CA",
      delivery: "Phoenix, AZ",
      distance: "373 miles",
      price: 1900,
      weight: "22,000 lbs",
      pickupDate: "2024-03-24",
      deliveryDate: "2024-03-25",
      loadType: "Refrigerated"
    },
    {
      id: "3",
      pickup: "Chicago, IL",
      delivery: "Detroit, MI",
      distance: "282 miles",
      price: 1200,
      weight: "18,000 lbs",
      pickupDate: "2024-03-26",
      deliveryDate: "2024-03-27",
      loadType: "Flatbed"
    },
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Loads</h1>
        <p className="text-gray-600 mt-2">Browse and book available loads</p>
      </div>

      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Load Type</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="dryvan">Dry Van</option>
              <option value="reefer">Refrigerated</option>
              <option value="flatbed">Flatbed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input 
              type="text" 
              placeholder="Enter city or state"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="">Any Price</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="2000+">$2,000+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loads.map((load) => (
          <div key={load.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{load.pickup} → {load.delivery}</h3>
                  <p className="text-gray-600 text-sm">{load.distance}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  ${load.price}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Load Type:</span>
                  <span className="font-medium">{load.loadType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{load.weight}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pickup Date:</span>
                  <span className="font-medium">{new Date(load.pickupDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">{new Date(load.deliveryDate).toLocaleDateString()}</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Book Load
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
