import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listCursos } from "../../actions/cursoActions";

import Loader from '../utils/Loader';
import Error from '../utils/Error';
import Rating from '../utils/Rating';

import { HiArrowUpOnSquareStack } from "react-icons/hi2";



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
                        <img className="h-40 w-55 rounded-full my-4 ml-9" src={`${URL}${userInfo.avatar}`} alt="" />
                        <h3 className="text-lg font-mono leading-6 text-white">{userInfo.username} &nbsp;&nbsp;&nbsp;&nbsp;
                          <a
                            href={"/edit/profile"}
                            className=" text-sm font-mono text-orange font-semibold hover:text-grey-1  "
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
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-center text-4xl mt-8 mb-5 text-white font-mono">
              Tus Cursos
            </h1>
            <div className="p-8 mt-[50px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {cursos && cursos.map((c) => (
                <>
                  {c.comprador && c.comprador.map((comprador) => (
                    <>
                      {comprador.usuario === userInfo.id &&
                        <h1>
                          <div className="bg-grey-3 p-8 rounded-xl flex flex-col items-center gap-2 text-center text-gray-300">
                            <img
                              src={`${URL}${c.image}`}
                              className="w-40 h-40 object-cover -mt-20 shadow-2xl rounded-full"
                            />
                             <p className="text-xl text-white font-mono font-bold">{c.title}</p>
                            <span className="text-grey font-mono">{c.description}</span>
                            <p className="mt-1 text-sm text-white"> <Rating value={c.rating} />
                              <a href={`/reviews/${c.id}`}>{`${c.num_reviews} reviews`}</a></p>
                            <a href={`/curso/${c.id}`}>
                              <div className='flex space-x-2 items-center   text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 px-10'>
                                <span>
                                  Enter
                                </span>
                                <HiArrowUpOnSquareStack className='w-7 h-7' />

                              </div>
                            </a>
                          </div>
                        </h1>
                      }
                    </>
                  ))}
                </>
              ))}
            </div>
          </>
        )}
    </>
  )
}
export default MiPerfil