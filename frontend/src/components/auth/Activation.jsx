import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { activation } from '../../actions/userActions';
import Error from '../utils/Error';
import Success from "../utils/Success";
import Loader from '../utils/Loader';

const Activate = ({ match, history }) => {

  useEffect(() => {
    document.title = 'Tech con Agust | Activate'
  }, []);

  const dispatch = useDispatch()

  const [exito, setExito] = useState('');

  const userActivation = useSelector(state => state.userActivation)
  const { error, loading, success } = userActivation

  const verify_account = (e) => {

    dispatch(activation(match.params.uid, match.params.token))
    setExito(`Cuenta Activada... Inicia Session`)

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
                  <div className=' m-5 p-10'>
                    <div className="w-full max-w-md space-y-8">
                      <div >

                        <a
                          style={{ textDecoration: 'none' }}
                          className="mt-2 items-center justify-center bg-grey-2 py-3 px-8 font-mono text-white"
                          href="/login">

                          Inicia Session
                        </a>

                      </div>
                    </div>
                  </div>
                </div>

              </>

            ) : (

              <>
                <div className='container'>
                  <div
                    className=''
                    style={{ marginTop: '200px' }}
                  >
                    <form className="text-center ml-">
                      <button
                        onClick={verify_account}

                        style={{ marginTop: '50px' }}
                        type='button'
                        className="mt-2  bg-grey-2 py-3 px-8 font-mono text-white"
                      >
                        Verificar Cuenta
                      </button>
                    </form>
                  </div>
                </div>
              </>

            )}
          </>

        )}
    </>
  )
}

export default Activate