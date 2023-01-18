import React, { useState, useEffect } from "react";
import Message from '../utils/Message';
import Loader from '../utils/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { listCursoDetails, cursoPagadoAction } from '../../actions/cursoActions'
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useHistory } from "react-router-dom";

const SoloCurso = ({match}) => {

    let history = useHistory();

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [user, setUser] = useState(userInfo.id)
    const [c, setCurso] = useState(match.params.id)




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
                        value:precio
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
        history.push('/success/curso/')


        dispatch(cursoPagadoAction(
            match.params.id, {
            user,
            c,
        }
        ))
    }


  return (


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
  )
}

export default SoloCurso