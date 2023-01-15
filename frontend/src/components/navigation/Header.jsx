import React from 'react'
import { HiSearch, HiBadgeCheck } from "react-icons/hi";


const Header = () => {
  return (
    <header>
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <div className='flex items-center'>
      <HiBadgeCheck className='text-grey w-8 h-8 mr-4'/> 
        <h1 className="text-2xl text-grey font-mono "> Agustin Fricke</h1>
      </div>
      <form>
        <div className="w-full relative">
          <HiSearch className="absolute text-white left-3 top-1/2 -translate-y-1/2 " />
          <input
            type="text"
            className="bg-grey-2 w-full py-2 pl-10 pr-4 rounded-lg text-grey  outline-none"
            placeholder="Search"
          />
        </div>
      </form>
    </div>
    {/* Tabs */}
    <nav className="text-grey-2 flex items-center justify-between md:justify-start md:gap-8 border-b mb-6">
      
      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange">
        Backend
      </a>
      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange">
        Frontend
      </a>
      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange">
        Hacking
      </a>
      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange">
        Full Stack
      </a>
    
    </nav>
  </header>
  )
}

export default Header