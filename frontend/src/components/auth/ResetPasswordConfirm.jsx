import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { Confirm } from '../../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../utils/Error';
import Success from "../utils/Success";
import Loader from '../utils/Loader';

const ResetPasswordConfirm = ({ match, history }) => {

  useEffect(() => {
    document.title = 'Tech con Agust | Confirmar Contraseña'
  }, []);

  const dispatch = useDispatch()


  const [re_password, setNewPassword] = useState('');
  const [re_new_password, setre_new_password] = useState('');
  const [exito, setExito] = useState('');

  const passwordConfirm = useSelector(state => state.passwordConfirm)
  const { error, loading, success } = passwordConfirm


  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(Confirm(match.params.uid, match.params.token, re_password, re_new_password))
    setExito(`Cuenta Resablecida... Incia Session`)
  }


  return (
    <>
      {error && <Error>{error}</Error>}
      {exito && <Success>{exito}</Success>}

      {loading ?
        <Loader />
        : (

          <>
            {success ? (

              <>


                <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                  <div className=' m-5 p-10 bg-grey-3'>
                    <div className="w-full max-w-md space-y-8 ">
                      <div >

                        <h2 className="mt-6 text-center text-3xl font-mono  text-grey">
                          Exelente... Ahora Puedes Iniciar Session
                        </h2>
                      </div>
                      <div className='items-center flex min-h-full justify-center'>
                        <button
                          type="submit"
                          className=" space-x-2 items-center justify-center transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
                        >
                          Enviar

                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </>

            ) : (

              <>

                <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                  <div className=' m-5 p-10 bg-grey-3'>
                    <div className="w-[400px] max-w-md space-y-8 ">
                      <div >

                        <h2 className="mt-6 text-center text-3xl font-mono  text-white">
                          Nueva Contraseña
                        </h2>
                      </div>
                      <form onSubmit={submitHandler} className="mt-8 space-y-6" action="#" method="POST">

                        <div className="">
                          <div className='mb-2'>

                            <input
                              value={re_password}
                              onChange={(e) => setNewPassword(e.target.value)}
                              type="password"
                              required
                              class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                              placeholder="Contraseña"
                            />
                          </div>

                          <div className='mt-7'>

                            <input
                              value={re_new_password}
                              onChange={(e) => setre_new_password(e.target.value)}
                              type="password"
                              required
                              class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                              placeholder="Confirmar Contraseña"
                            />
                          </div>
                        </div>

                        <div className='items-center flex min-h-full justify-center'>
                          <button
                            type="submit"
                            className=" space-x-2 items-center justify-center transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
                          >
                            Confirmar

                          </button>
                        </div>
                      </form>


                    </div>
                  </div>
                </div>
              </>

            )}
          </>

        )}
    </>
  )
}

export default ResetPasswordConfirm
