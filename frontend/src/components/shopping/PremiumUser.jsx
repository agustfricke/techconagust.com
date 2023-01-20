import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import { premiumUser, getUserDetails } from '../../actions/userActions'
import { USER_PREMIUM_RESET } from '../../constants/userConstants'

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import Error from '../utils/Error';
import Success from '../utils/Success';
import Loader from '../utils/Loader';



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

    const userPremium = useSelector(state => state.userPremium)
    const { loading: loadingPremium, error: errorPremium, success } = userPremium

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
                        value: "14.99"
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
        <>
            {error && <Error>{error}</Error>}
            {errorPremium && <Error>{errorPremium}</Error>}
            {success && <Success>{`Pago completado!`}</Success>}
            {loading || loadingPremium ?
                <Loader />
                : (
                    <>
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
                                            $ 14.99
                                        </p>
                                    </div>
                                    <PayPalScriptProvider
                                        options={{
                                            "client-id": "Ac70iUCZRhvgwlOVYAjzWlZiMjin0PqqgxLlhoXHiw8L0oQawa4dSWM2ROljITHCbmuJCl5PjkV20Z5Z",
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

export default PremiumUser