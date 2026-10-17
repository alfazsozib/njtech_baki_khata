import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom';

function Navbar({onSignInClick, onSignUpClick}) {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/60 bg-[#01021df1] backdrop-blur-md'>

        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* logo side  */}
          <div className="flex items-center gap-2.5 cursor-pointer">
          
          <div className="flex flex-col">
             <Link to="/" className="flex items-center cursor-pointer">
          <span className="text-lg font-bold tracking-tight text-[#dfdfdf]">
            Baki Khata
          </span>
        </Link>
          </div>
        </div>


        {/* signin side*/}
        <div className="flex items-center gap-3">
        <Link
            to="/login"
            className="text-xs sm:text-sm text-gray-400 hover:text-white font-medium px-3 py-1.5 transition-colors cursor-pointer"
          >
            Sign In
          </Link>
         <Link
            to="/register"
            className="text-xs sm:text-sm rounded-lg bg-[#2914e7] hover:bg-[#0b0355] text-white font-medium px-4 py-1.5 shadow-sm transition-colors cursor-pointer"
          >
            Sign Up
          </Link>
        </div>

        </div>
    </header>
  )
}

export default Navbar