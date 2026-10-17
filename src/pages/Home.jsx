import React from 'react'

import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
        Digital Baki Khata
      </h1>
      <p className="mt-3 max-w-md text-sm text-gray-400">
        Manage customer credit, record payments, and predict default risk.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/register"
          className="rounded-lg bg-[#2914e7] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#0b0355] transition-colors"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-[#1e204a] bg-[#05072e] px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default Home