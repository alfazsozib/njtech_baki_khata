import React from 'react'

function Footer() {
  return (
   <footer className="bg-[#01021df1] w-full absolute sticky bottom-0 py-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">

        <div className="flex items-center gap-2">
         <span className="text-lg font-bold tracking-tight text-[#dfdfdf]">
              Baki Khata
            </span>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} NJTech Baki Khata. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer