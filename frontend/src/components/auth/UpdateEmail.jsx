import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import { updateEmailProfile, logout } from '../../actions/userActions';
import logo from '../../media/logo.png';

import Success from '../utils/Success';
import Error from '../utils/Error';
import Loader from '../utils/Loader';



const UpdateEmail = () => {

  useEffect(() => {
    document.title = 'Tech con Agust | Ediatr Email'
  }, []);

  let history = useHistory();

  const [new_email, setNewEmail] = useState('')
  const [re_new_email, setReNewNewEmail] = useState('')
  const [cuerrent_password, setCurrentPassword] = useState('')

  const dispatch = useDispatch()

  const changeEmail = useSelector(state => state.changeEmail)
  const { error, loading, success } = changeEmail

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateEmailProfile(new_email, re_new_email, cuerrent_password));
    dispatch(logout())
    history.push("/login");
  }

  return (
    <>
      {error && <Error>{error}</Error>}
      {success && <Success>{`Tu nuevo Email ${new_email}`}</Success>}
      {loading ?
        <Loader />
        : (
          <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
              <div className=' m-5 p-10 bg-grey-3'>
                <div className="w-[400px] max-w-md space-y-8 ">
                  <div>
                    <img
                      className="mx-auto h-12 w-auto"
                      src={logo}
                      alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-3xl font-mono  text-grey">
                      Actualizar Email
                    </h2>
                  </div>
                  <form onSubmit={submitHandler} className="mt-8 space-y-6" action="#" method="POST">
                    <div className="">
                      <div className='mb-2'>
                        <input
                          value={new_email}
                          onChange={(e) => setNewEmail(e.target.value)}
                          type="email"
                          required
                          class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                          placeholder="Nuevo Email"
                        />
                      </div>
                      <div className='mb-2'>
                        <input
                          value={re_new_email}
                          onChange={(e) => setReNewNewEmail(e.target.value)}
                          type="email"
                          required
                          class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                          placeholder="Confirmacion de Email"
                        />
                      </div>
                      <div className='mb-2'>
                        <input
                          value={cuerrent_password}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          type="password"
                          required
                          class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                          placeholder="Contraseña"
                        />
                      </div>
                    </div>
                    <div className='items-center'>
                      <button
                        type="submit"
                        className=" space-x-2 block w-full transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
                      >

                        Actualizar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
    </>
  )
}

export default UpdateEmail