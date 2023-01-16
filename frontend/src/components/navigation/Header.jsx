import React from 'react'
import { HiSearch, HiBadgeCheck } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin


  return (
    <header>
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <div className='flex items-center'>
      {userInfo ? (
        <>
       <HiBadgeCheck className='text-orange w-8 h-8 mr-4'/> 
        <h1 className="text-2xl text-grey font-mono ">{userInfo.username}</h1>
        </>
        ) : (
          <>
        <a href='login' className=' ml-10 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 '>
          Iniciar Session</a>
        <a href='register' className=' ml-10  items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 '>Crear cuenta</a>
        </>
        )}
      </div>
      <form>
        <div className="w-full relative">
          <HiSearch className="absolute text-white left-3 top-1/2 -translate-y-1/2 " />
          <input
            type="text"
            className="bg-grey-2 w-full py-2 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none"
            placeholder="Buscar ..."
          />
        </div>
      </form>
    </div>
    {/* Tabs */}
      <div className='flex flex-row gap-4 overflow-y-auto '>
      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
        Django
      </a>
      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors  font-semibold">
        Django Rest Framework
      </a>
      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
        Hacking
      </a>
      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
        Django & React
      </a>
      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
        Tailwind css
      </a>

      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
        HTML & CSS
      </a>

      <a href="#" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
        Blockchain
      </a>
      </div>
  </header>
  )
}

export default Header