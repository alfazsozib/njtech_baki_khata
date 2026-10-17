import React from 'react'
import { Button } from './ui/button'

function Navbar({onSignInClick, onSignUpClick}) {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/60 bg-[#01021df1] backdrop-blur-md'>

        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* logo side  */}
          <div className="flex items-center gap-2.5 cursor-pointer">
          
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#dfdfdf]">
              Baki Khata
            </span>
          </div>
        </div>


        {/* signin side*/}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignInClick}
            className="text-muted-foreground hover:text-foreground font-medium cursor-pointer"
          >
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={onSignUpClick}
            className="bg-[#2914e7] hover:bg-[#0b0355] text-white font-medium shadow-sm cursor-pointer"
          >
            Sign Up
          </Button>
        </div>

        </div>
    </header>
  )
}

export default Navbar