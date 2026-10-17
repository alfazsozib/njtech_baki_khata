import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({onLoginSuccess}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: "", password: "" });
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
    setLoading(true);

    try {
      const res = await fetch("https://njtechbakikhata-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (onLoginSuccess) onLoginSuccess(data.user);


      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-[#1e204a] bg-[#05072e] p-6 sm:p-8">
        
        <h1 className="text-xl font-bold text-white text-center">Sign In</h1>
        <p className="text-xs text-gray-400 text-center mt-1">
          Enter your phone and password to access your ledger
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
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              required
              placeholder="017XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#1e204a] bg-[#01021d] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#2914e7]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Password
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#6d5eff] hover:underline font-medium">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
