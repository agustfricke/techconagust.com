import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Loader from '../utils/Loader';
import Error from '../utils/Error';
import logo from '../../media/logo.png';
import { HiArrowUpOnSquareStack } from "react-icons/hi2";


export default function MiPerfil() {

  useEffect(() => {
    document.title = `Tech con Agust | Mi Perfil`
  }, []);

  const userLogin = useSelector(state => state.userLogin)
  const { error, loading, userInfo } = userLogin

  useEffect(() => {
    document.title = `Tech con Agust | ${userInfo.username}`
  }, []);

  return (
    <>
      {error && <Error>{error}</Error>}
      {loading ?
        <Loader />
        : (
          <>

            <div className='mx-auto max-w-7xl px-4 sm:px-6 pt-6'>
              <div className='px-4 py-5 sm:px-6'>
                <div className="overflow-hidden bg-grey-3 shadow sm:rounded-lg">
                  <div className="mt-6">
                    <h2 className="text-center text-3xl font-mono text-white">
                      Tu Cuenta Personal
                    </h2>

                    <div className="flex min-h-full items-center justify-center">
                      <div>
                        <img className="h-40 w-55 rounded-full my-4 ml-9" src={logo} alt="" />
                        <h3 className="text-lg font-mono leading-6 text-white">{userInfo.username} &nbsp;&nbsp;&nbsp;&nbsp;
                          <a
                            style={{ textDecoration: 'none' }}
                            href={"/editprofile"}
                            className=" text-sm font-mono text-orange font-semibold hover:text-grey-1  "
                          >
                            EDITAR
                          </a>
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-grey mt-4">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-mono text-grey-1">Nombre de Usuario</dt>
                        <dd className="mt-1 text-sm text-white tracking-widest font-semibold text-space sm:col-span-2 sm:mt-0">{userInfo.username}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-mono text-grey-1">Nombre y Apellido</dt>
                        <dd className="mt-1 text-sm text-white tracking-widest font-semibold text-space sm:col-span-2 sm:mt-0">{userInfo.name}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-mono text-grey-1">Correo Electronico</dt>
                        <dd className="mt-1 text-sm text-white tracking-widest font-semibold text-space sm:col-span-2 sm:mt-0">{userInfo.email}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-mono text-grey-1">Biografia</dt>
                        <dd className="mt-1 text-sm text-white tracking-widest font-semibold text-space sm:col-span-2 sm:mt-0">
                          {userInfo.bio}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-center text-4xl mt-8 mb-5 text-white font-mono">
              Tus Cursos
            </h1>
            <div className="p-8 mt-[50px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">


              <div className="bg-grey-3 p-8 rounded-xl flex flex-col items-center gap-2 text-center text-gray-300">

                <img
                  src={logo}
                  className="w-40 h-40 object-cover -mt-20 shadow-2xl rounded-full"
                />

                <p className="text-xl text-white font-mono font-bold">Django Rest Framework</p>

                <span className="text-grey font-mono">lo Descripcion muy larga y muy entretenida de Django Rest Fraamework</span>

                <a href={`/reviews/`} className="text-gray-600">Rating</a>

                <a href={`/curso/`}>
                  <div className='flex space-x-2 items-center   text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 px-10'>
                    <span>
                      Enter
                    </span>
                    <HiArrowUpOnSquareStack className='w-7 h-7' />

                  </div>
                </a>




              </div>
            </div>


          </>
        )}
    </>
  )
}