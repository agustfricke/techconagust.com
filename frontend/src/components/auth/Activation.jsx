import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import { activation } from '../../actions/userActions';

import Error from '../utils/Error';
import Success from "../utils/Success";
import Loader from '../utils/Loader';

const Activate = ({ match }) => {

  useEffect(() => {
    document.title = 'Activate | Tech con Agust'
  }, []);

  let history = useHistory();

  const dispatch = useDispatch()

  const [exito, setExito] = useState('');

  const userActivation = useSelector(state => state.userActivation)
  const { error, loading, success } = userActivation

  const verify_account = (e) => {
    dispatch(activation(match.params.uid, match.params.token))
    setExito(`Cuenta Activada... Inicia Session`)
    history.push('/login/')
  }

  return (
    <>
      {error && <Error>{error}</Error>}
      {exito && <Success>{exito}</Success>}
      {loading ?
        <Loader />
        : (
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
  )
}

export default Activate