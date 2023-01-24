import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import { Reset } from '../../actions/userActions'

import Error from '../utils/Error';
import Success from "../utils/Success";
import Loader from '../utils/Loader';


const ResetPassword = () => {

  useEffect(() => {
    document.title = 'Tech con Agust | Restablecer Contraseña'
  }, []);

  let history = useHistory();

  const [email, setEmail] = useState('')
  const [exito,  setExito] = useState('')
  const dispatch = useDispatch()
  

  const passwordRest = useSelector(state => state.passwordRest)
  const { error, loading, success } = passwordRest

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(Reset(email))
      setExito(`Verifica tu Correo de spam ${email}`)
  }

  return (
    <>
      {error && <Error>{error}</Error>}
      {exito && <Success>{exito}</Success>}
      {loading ?
        <Loader />
        : (
          <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
              <div className=' m-5 p-10 bg-grey-3'>
                <div className="w-[400px] max-w-md space-y-8 "></div>
                <h4 className="text-center m-6 font-mono text-white text-xl">Recuperar Contraseña</h4>
                <form className='mb-5' onSubmit={submitHandler}>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    className="bg-grey-2 mt-4 w-full py-2 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono placeholder:text-center font-mono outline-none"
                    placeholder="Tu Correo Electronico ..."
                  />
                  <div className='items-center mt-4 flex min-h-full justify-center'>
                    <button
                      type="submit"
                      className=" space-x-2 mt-5 items-center justify-center transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
                    >
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
    </>

  )
}

export default ResetPassword;
