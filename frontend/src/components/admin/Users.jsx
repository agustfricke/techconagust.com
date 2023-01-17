import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom";

import Loader from "../utils/Loader";
import Message from "../utils/Message";
import { listUsers, deleteUser } from '../../actions/userActions'
import { useHistory } from "react-router-dom";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";

const Users = () => {

    let history = useHistory();

    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.deleteUser)
    const { success: successDelete } = userDelete

    useEffect(() => {
        if (userInfo && userInfo.is_admin) {
            dispatch(listUsers())
        } else {
            history.push('/')
        }
    }, [dispatch, history, successDelete, userInfo])



  return (

<>


    {loading
        ? (<Loader />)
        : error
            ? (<Message variant='danger'>{error}</Message>)
            : (


    <table class="w-full text-sm text-left">
        <thead class="text-xs text-gray-700 uppercase">
            <tr>
            <th scope="col" class="px-6 py-3 text-white font-mono">
                    ID
                </th>
                <th scope="col" class="px-6 py-3 text-white font-mono">
                    Imagen
                </th>
                <th scope="col" class="px-6 py-3 text-white font-mono">
                    Username
                </th>

                <th scope="col" class="px-6 py-3 text-white font-mono">
                    Nombre
                </th>
                <th scope="col" class="px-6 py-3 text-white font-mono">
                    Email
                </th>
                <th scope="col" class="px-6 py-3 text-white font-mono">
                    Admin
                </th>
                <th scope="col" class="px-6 py-3 text-white font-mono">
                    Premium
                </th>
                

            </tr>
        </thead>
        <tbody>
        {users.map(u => (
            <tr class=" border-b bg-grey-3 hover:bg-gray-50 dark:hover:bg-gray-600">
 <td class="px-6 py-4 text-grey font-mono">
                    {u.id}
                </td>
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                    <img class="w-10 h-10 rounded-full"  alt="Jese image" />

                </th>
                <td class="px-6 py-4 text-grey font-mono">
                    {u.username}
                </td>
                <td class="px-6 py-4 text-grey font-mono">
                    {u.name}
                </td>
                <td class="px-6 py-4 text-grey font-mono">
                     {u.email}
                </td>

               

                <td class="px-6 py-4 text-grey ">
                {u.is_admin ? (
                                            <GrCheckboxSelected />


                                        ) : (
                                            <GrCheckbox />


                                            

                                        )}
                </td>

                <td class="px-6 py-4 text-grey font-mono">
                {u.premium === 'premium' ? (
                                            <GrCheckboxSelected />
                                        ) : (
                                            <GrCheckbox />
                                        )}
                </td>

                

               





            </tr>


))}

        </tbody>
    </table>
     )}

</>
  )
}

export default Users