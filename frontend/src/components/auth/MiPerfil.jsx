import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listCursos } from "../../actions/cursoActions";

import Loader from '../utils/Loader';
import Error from '../utils/Error';
import Rating from '../utils/Rating';

import { RiCheckboxMultipleBlankLine, RiCheckboxMultipleFill } from "react-icons/ri";



const MiPerfil = () => {

  useEffect(() => {
    document.title = `Tech con Agust | Mi Perfil`
  }, []);

  const URL = (process.env.REACT_APP_API_URL)

  const dispatch = useDispatch();

  const cursoList = useSelector((state) => state.cursoList);
  const { errorCursos, loadingCursos, cursos } = cursoList;

  const userLogin = useSelector(state => state.userLogin)
  const { error, loading, userInfo } = userLogin

  useEffect(() => {
    dispatch(listCursos());
  }, [dispatch]);


  return (
    <>
      {error && <Error>{error}</Error>}
      {errorCursos && <Error>{errorCursos}</Error>}
      {loading || loadingCursos ?
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
                        <img className="h-40 w-55 rounded-full my-4 ml-[50px]" src={`${URL}${userInfo.avatar}`} alt="" />
                        <h3 className="text-lg font-mono leading-6 text-white">{userInfo.username}
                          <a
                            href={"/edit/profile"}
                            className=" text-sm font-mono ml-3 text-orange font-semibold hover:text-grey-1  "
                          >
                            EDITAR
                          </a>
                          <a
                            href={"/update/email/"}
                            className=" text-sm font-mono m-4 text-orange font-semibold hover:text-grey-1  "
                          >
                            CAMBIAR EMAIL
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
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-mono text-grey-1">Premium</dt>
                        <dd className="mt-1 text-sm text-white tracking-widest font-semibold text-space sm:col-span-2 sm:mt-0">
                        {userInfo.premium === true ? (
                                                <p className='text-grey'>
                                                <RiCheckboxMultipleFill className='w-7 h-7' />

                                                </p>
                                            ) : (
                                                <RiCheckboxMultipleBlankLine className='w-7 h-7'/>
                                            )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
           
          </>
        )}
    </>
  )
}
export default MiPerfil