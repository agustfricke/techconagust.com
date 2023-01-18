import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { premiumUser, getUserDetails } from '../../actions/userActions'
import { USER_PREMIUM_RESET } from '../../constants/userConstants'
import logo from '../../media/logo.png';
import { useHistory } from "react-router-dom";


const PremiumUser = () => {

    let history = useHistory();

    useEffect(() => {
        document.title = `Tech con Agust | Se Premium`
    }, []);


    const [premium, setPremium] = useState('')

    const dispatch = useDispatch(history)

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userPremum = useSelector(state => state.userPremum)
    const { success } = userPremum





    useEffect(() => {
        if (userInfo.email === "") {
            history.push('/login')
        } else {
            if (!user || success || userInfo.id !== user.id) {
                dispatch({ type: USER_PREMIUM_RESET })
                dispatch(getUserDetails('profile'))
            } else {
                setPremium(user.premium)
            }
        }
    }, [dispatch, history, userInfo, user, success])



    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: "39.99"
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
        history.push('/success/premium/')


        dispatch(premiumUser({
            'id': user.id,
            'premium': premium,
        }))
    }

    return (


    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className=' m-5 p-10 bg-grey-3'>
      <div className="w-[400px] max-w-md space-y-8 ">
        <div >
          <h2 className="mt-2 text-center text-xl font-mono  text-white">
            
            Convietete en Usuario Premium
           
          </h2>
          <p className='text-grey text-center font-mono mt-4'>
            Acceso de por vida a todos los cursos y proyectos con codigo fuente
          </p>

          <p className='text-grey text-center font-mono mt-4'>
            $ 39.99 
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

export default PremiumUser