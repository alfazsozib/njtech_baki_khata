import React, { useState, useEffect } from 'react';

function Dashboard({ user }) {
  const [customers, setCustomers] = useState([]);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals state
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [selectedCustomerForTx, setSelectedCustomerForTx] = useState(null);

  // Form states
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    address: "",
    creditLimit: 15000,
    notes: "",
  });

  const [txForm, setTxForm] = useState({
    type: "credit", // "credit" or "payment"
    amount: "",
    note: "",
  });

  const [feedbackMessage, setFeedbackMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");

  // Fetch Customers & Risk on load
  const fetchData = async () => {
    try {
      setLoading(true);
      const [custRes, riskRes] = await Promise.all([
        fetch("http://localhost:5001/api/customer", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5001/api/risk/evaluate", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const custData = await custRes.json();
      const rData = await riskRes.json();

      if (custData.success) setCustomers(custData.customers || []);
      if (rData.success) setRiskData(rData);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Handle Create or Update Customer
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setFeedbackMessage({ type: "", text: "" });

    try {
      const url = editingCustomer
        ? `http://localhost:5001/api/customer/${editingCustomer._id}`
        : "http://localhost:5001/api/customer";
      const method = editingCustomer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(customerForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save customer");

      setCustomerModalOpen(false);
      setEditingCustomer(null);
      setCustomerForm({ name: "", phone: "", address: "", creditLimit: 15000, notes: "" });
      setFeedbackMessage({ type: "success", text: editingCustomer ? "Customer updated!" : "Customer added successfully!" });
      fetchData();
    } catch (err) {
      setFeedbackMessage({ type: "error", text: err.message });
    }
  };

  // Handle Delete Customer
  const handleDeleteCustomer = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name} and all their records?`)) return;

    try {
      const res = await fetch(`http://localhost:5001/api/customer/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      setFeedbackMessage({ type: "success", text: "Customer removed." });
      fetchData();
    } catch (err) {
      setFeedbackMessage({ type: "error", text: err.message });
    }
  };

  // Handle Add Transaction (Baki / Payment)
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setFeedbackMessage({ type: "", text: "" });

    try {
      const res = await fetch("http://localhost:5001/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: selectedCustomerForTx._id,
          type: txForm.type,
          amount: Number(txForm.amount),
          note: txForm.note,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to record transaction");

      setTxModalOpen(false);
      setTxForm({ type: "credit", amount: "", note: "" });
      setFeedbackMessage({ type: "success", text: data.message });
      fetchData();
    } catch (err) {
      setFeedbackMessage({ type: "error", text: err.message });
    }
  };

  // Helper for customer's risk profile
  const getCustomerRisk = (customerId) => {
    if (!riskData?.allEvaluations) return null;
    return riskData.allEvaluations.find((e) => e.customerId === customerId);
  };

  // Calculations for stats
  const totalDueAmount = customers.reduce((sum, c) => sum + (c.currentDue || 0), 0);
  const totalPaidAmount = customers.reduce((sum, c) => sum + (c.totalPaid || 0), 0);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-['Poppins'] pb-16">
      
      {/* Top Banner */}
      <div className="bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {user?.shopName || "My Shop"}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{user?.name}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCustomer(null);
                setCustomerForm({ name: "", phone: "", address: "", creditLimit: 15000, notes: "" });
                setCustomerModalOpen(true);
              }}
              className="inline-flex items-center justify-center rounded-xl bg-[#2914e7] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1f0ebb] transition-all cursor-pointer"
            >
              + Add New Customer
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
      
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Customers</span>
            <p className="mt-2 text-2xl font-bold text-slate-900">{customers.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Outstanding Dues</span>
            <p className="mt-2 text-2xl font-bold text-slate-800">৳{totalDueAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Collected</span>
            <p className="mt-2 text-2xl font-bold text-slate-800">৳{totalPaidAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">High Risk Accounts</span>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {riskData?.summary?.highRisk || 0}
            </p>
          </div>
        </div>

        {/* Customer Table Section */}
        <div className="bg-white rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-5">Customer</th>
                  <th className="py-3.5 px-4">Contact & Address</th>
                  <th className="py-3.5 px-4">Credit Limit</th>
                  <th className="py-3.5 px-4">Current Due</th>
                  <th className="py-3.5 px-4">AI Risk Level</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">Loading ledger data...</td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">No customers found</td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => {
                    const risk = getCustomerRisk(cust._id);
                    return (
                      <tr key={cust._id} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* Name */}
                        <td className="py-4 px-5">
                          <p className="font-semibold text-slate-900">{cust.name}</p>
                          {cust.notes && <p className="text-[11px] text-slate-400 line-clamp-1">{cust.notes}</p>}
                        </td>

                        {/* Phone & Address */}
                        <td className="py-4 px-4 text-slate-600">
                          <p className="font-medium text-slate-800">{cust.phone}</p>
                          <p className="text-[11px] text-slate-400">{cust.address || "No address"}</p>
                        </td>

                        {/* Limit */}
                        <td className="py-4 px-4 text-slate-600">
                          ৳{(cust.creditLimit || 15000).toLocaleString()}
                        </td>

                        {/* Current Due */}
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg font-semibold ${
                            cust.currentDue > 0 ? " text-slate-800" : " text-slate-800"
                          }`}>
                            ৳{cust.currentDue.toLocaleString()}
                          </span>
                        </td>

                        {/* AI Risk Score */}
                        <td className="py-4 px-4">
                          {risk ? (
                            <span
                              title={risk.recommendation}
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                risk.riskLevel === "High"
                                  ? " text-slate-800"
                                  : risk.riskLevel === "Medium"
                                  ? " text-slate-800"
                                  : " text-slate-800"
                              }`}
                            >
                              {risk.riskLevel} Risk ({risk.defaultProbability})
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Evaluating...</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedCustomerForTx(cust);
                              setTxModalOpen(true);
                            }}
                            className="mr-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 font-medium transition-colors cursor-pointer"
                          >
                            Transaction
                          </button>
                          <button
                            onClick={() => {
                              setEditingCustomer(cust);
                              setCustomerForm({
                                name: cust.name,
                                phone: cust.phone,
                                address: cust.address || "",
                                creditLimit: cust.creditLimit || 15000,
                                notes: cust.notes || "",
                              });
                              setCustomerModalOpen(true);
                            }}
                            className="mr-2 text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          {user?.role === "owner" && (
                            <button
                              onClick={() => handleDeleteCustomer(cust._id, cust.name)}
                              className="text-rose-500 hover:text-rose-700 font-medium px-2 py-1 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* MODAL 1: ADD / EDIT CUSTOMER */}
      {customerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl animate-in fade-in duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingCustomer ? "Edit Customer Details" : "Add New Customer"}
            </h3>
            <p className="text-xs text-slate-400 mb-5">Fill in the customer information for your ledger.</p>

            <form onSubmit={handleSaveCustomer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim Mia"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2914e7]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="017XXXXXXXX"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2914e7]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Credit Limit (৳)</label>
                  <input
                    type="number"
                    value={customerForm.creditLimit}
                    onChange={(e) => setCustomerForm({ ...customerForm, creditLimit: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2914e7]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Road/Area"
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2914e7]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="Additional notes"
                  value={customerForm.notes}
                  onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2914e7]/20"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCustomerModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2914e7] hover:bg-[#1f0ebb] text-xs font-semibold text-white shadow-sm transition-colors"
                >
                  {editingCustomer ? "Update Details" : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD TRANSACTION (BAKI / PAYMENT) */}
      {txModalOpen && selectedCustomerForTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900">
              Record for {selectedCustomerForTx.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Current Due: <span className="font-semibold text-slate-800">৳{selectedCustomerForTx.currentDue}</span>
            </p>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTxForm({ ...txForm, type: "credit" })}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    txForm.type === "credit" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500"
                  }`}
                >
                  + Add Baki (Credit)
                </button>
                <button
                  type="button"
                  onClick={() => setTxForm({ ...txForm, type: "payment" })}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    txForm.type === "payment" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500"
                  }`}
                >
                  - Pay Due (Payment)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (৳) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Enter amount"
                  value={txForm.amount}
                  onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2914e7]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Note / Item description</label>
                <input
                  type="text"
                  placeholder="e.g. 2kg Rice, Oil"
                  value={txForm.note}
                  onChange={(e) => setTxForm({ ...txForm, note: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#2914e7]/20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTxModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-colors ${
                    txForm.type === "credit" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
