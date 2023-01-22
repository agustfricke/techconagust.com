import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'

import { HiSearch, HiBadgeCheck } from "react-icons/hi";



const Header = () => {

  const [keysearch, setKeysearch] = useState('')

  let history = useHistory()

  const submitHandler = (e) => {
    e.preventDefault()
    if (keysearch) {
      history.push(`/?keysearch=${keysearch}`)
    } else {
      history.push(history.push(history.location.pathname))
    }
  }

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  return (
    <header>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className='flex items-center'>
          {userInfo ? (
            <>
              <HiBadgeCheck className='text-orange w-8 h-8 mr-4' />
              <h1 className="text-2xl text-grey font-mono ">{userInfo.username}</h1>
            </>
          ) : (
            <>
              <a href='/login' className=' ml-5 items-center text-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 '>
                Iniciar Session</a>
              <a href='/register/' className=' ml-5 text-center  items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 '>Crear cuenta</a>
            </>
          )}
        </div>
        <form onSubmit={submitHandler}>
          <div className="w-full relative">
            <HiSearch className="absolute text-white left-3 top-1/2 -translate-y-1/2 " />
            <input
              onChange={(e) => setKeysearch(e.target.value)}
              type="text"
              className="bg-grey-2 w-full py-2 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none"
              placeholder="Buscar ..."
            />
          </div>
        </form>
      </div>
      {/* Tabs */}
      <div className='flex flex-row gap-4 overflow-y-auto '>
        <a href="/frontend/" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
          Frontend
        </a>
        <a href="/backend/" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors  font-semibold">
          Backend
        </a>
        <a href="/fullstack/" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
          Full Stack
        </a>
        <a href="/hacking/" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
          Hacking
        </a>
        <a href="/blockchain/" className="py-2 pr-4 font-mono text-grey-1 hover:text-orange transition-colors font-semibold">
          Blockchain
        </a>
      </div>
    </header>
  )
}

export default Header