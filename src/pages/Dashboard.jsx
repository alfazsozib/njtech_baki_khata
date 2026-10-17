import React from 'react';

function Dashboard({ user }) {
  return (
    <div className="mx-auto max-w-7xl p-6 sm:p-8">
      {/* Welcome Header */}
      <div className="mb-8 rounded-xl border border-[#1e204a] bg-[#05072e] p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white">
          Welcome, {user?.name || "Shopkeeper"}!
        </h1>
        <p className="mt-1 text-xs text-gray-400">
          Store: <span className="text-[#6d5eff] font-medium">{user?.shopName}</span> • Role: <span className="capitalize">{user?.role}</span>
        </p>
      </div>

      {/* Placeholder Cards for Customer Dues & Transactions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#1e204a] bg-[#05072e] p-5">
          <p className="text-xs text-gray-400">Total Customers</p>
          <p className="mt-2 text-2xl font-bold text-white">0</p>
        </div>
        <div className="rounded-xl border border-[#1e204a] bg-[#05072e] p-5">
          <p className="text-xs text-gray-400">Total Outstanding Due</p>
          <p className="mt-2 text-2xl font-bold text-red-400">৳0</p>
        </div>
        <div className="rounded-xl border border-[#1e204a] bg-[#05072e] p-5">
          <p className="text-xs text-gray-400">Default Risk Alerts</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">All Safe</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
