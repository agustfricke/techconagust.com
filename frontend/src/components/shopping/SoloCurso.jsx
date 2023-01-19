import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import { listCursoDetails, cursoPagadoAction } from '../../actions/cursoActions'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import Loader from '../utils/Loader'
import Error from "../utils/Error";
import Success from "../utils/Success";



const SoloCurso = ({ match }) => {

  let history = useHistory();

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const [user] = useState(userInfo.id)
  const [c] = useState(match.params.id)


  const dispatch = useDispatch()

  const detailsCurso = useSelector(state => state.detailsCurso)
  const { loading, error, curso } = detailsCurso

  useEffect(() => {
    dispatch(listCursoDetails(match.params.id))
  }, [dispatch, match])

  const cursoPagado = useSelector(state => state.cursoPagado)
  const { loading: loadingPago, error: errorPago, success: successPago } = cursoPagado

  const precio = curso.price

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: precio
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING"
      }
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture(handlePay());
  };

  function handlePay() {
    history.push(`/curso/${curso.id}/`)
    dispatch(cursoPagadoAction(
      match.params.id, {
      user,
      c,
    }
    ))
  }

  return (
    <>
      {error && <Error>{error}</Error>}
      {errorPago && <Error>{errorPago}</Error>}
      {successPago && <Success>{`Pago Completado, ya puedes entrar a ${curso.title}!`}</Success>}
      {loading || loadingPago ?
        <Loader />
        : (
          <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
              <div className=' m-5 p-10 bg-grey-3'>
                <div className="w-[400px] max-w-md space-y-8 ">
                  <div >
                    <h2 className="mt-2 text-center text-xl font-mono  text-white">
                      {curso.title}
                    </h2>
                    <p className='text-grey text-center font-mono mt-4'>
                      $ {curso.price}
                    </p>
                  </div>
                  <PayPalScriptProvider
                    options={{
                      "client-id": "AagP4ONe8aPmVkKC1TiFz8QxceRQEMlyxFILAR84-Ws9X0NwRtwFOrAfx-dcprZ2Cy3R1txtYErnHpI8",
                      components: "buttons",
                      currency: "USD"
                    }}>
                    <PayPalButtons
                      createOrder={(data, actions) => createOrder(data, actions)}
                      onApprove={(data, actions) => onApprove(data, actions)}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            </div>
          </>
        )}
    </>
  )
}

export default SoloCurso