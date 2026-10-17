import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


function Register({onRegisterSuccess}) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        ownerName: "",
        shopName: "",
        phone: "",
        password: "",
        address: "",
        role: "owner",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

     const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!/^\d{11}$/.test(formData.phone.trim())) {
            setError("Phone number must be exactly 11 digits (e.g. 01712345678)");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("https://njtechbakikhata-production.up.railway.app/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");
            
            
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            if (onRegisterSuccess) onRegisterSuccess(data.user);

            
            
            setSuccess("Account created successfully! Redirecting...");
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-xl border border-[#1e204a] bg-[#05072e] p-6 sm:p-8">
        
        <h1 className="text-xl font-bold text-white text-center">Create Shop Account</h1>
        <p className="text-xs text-gray-400 text-center mt-1">
          Register your shop to manage customer dues digitally
        </p>
        {/* Error State */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}
        {/* Success State */}
        {success && (
          <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                required
                placeholder="e.g. Bhai Bhai Store"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#1e204a] bg-[#01021d] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#2914e7]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                required
                placeholder="Owner's Name"
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#1e204a] bg-[#01021d] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#2914e7]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#1e204a] bg-[#01021d] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#2914e7]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Phone Number (11 digits)
            </label>
            <input
              type="text"
              name="phone"
              required
              maxLength={11}
              placeholder="017XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#1e204a] bg-[#01021d] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#2914e7]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Shop Address (Optional)
            </label>
            <input
              type="text"
              name="address"
              placeholder="e.g. Mirpur-10, Dhaka"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#1e204a] bg-[#01021d] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#2914e7]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Password (Min 6 characters)
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#1e204a] bg-[#01021d] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#2914e7]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2914e7] py-2.5 text-sm font-semibold text-white shadow hover:bg-[#0b0355] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6d5eff] hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
    )
}

export default Register