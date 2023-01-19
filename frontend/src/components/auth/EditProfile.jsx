import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios'

import { getUserDetails, updateUserProfile } from '../../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../../constants/userConstants'

import Loader from '../utils/Loader'
import Error from "../utils/Error";



const EditProfile = () => {

  useEffect(() => {
    document.title = 'Tech con Agust | Edit Profile'
  }, []);

  const URL = (process.env.REACT_APP_API_URL)

  let history = useHistory();

  const [username, setUserName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [setUploading] = useState(false)

  const dispatch = useDispatch(history)

  const userDetails = useSelector(state => state.userDetails)
  const { error, loading, user } = userDetails

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector(state => state.userUpdateProfile)
  const { error: updateError, loading: updateLoading, success } = userUpdateProfile


  useEffect(() => {
    if (!userInfo.email === "") {
      history.push('/login')
    } else {
      if (!user || !user.name || success || userInfo.id !== user.id) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
      } else {
        setUserName(user.username)
        setName(user.name)
        setEmail(user.email)
        setBio(user.bio)
        setImage(user.image)
      }
    }
  }, [dispatch, history, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()
    history.push('/profile')

    if (password !== confirmPassword) {
      setMessage('Las contraseñas deben conincidir! ')
    } else {
      dispatch(updateUserProfile({
        'id': user.id,
        'username': username,
        'name': name,
        'email': email,
        'bio': bio,
        'image': image,
        'password': password,
      }))
    }
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()

    formData.append('image', file)
    formData.append('user_id', user.id)

    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`
        }
      }

      const { data } = await axios.post(`${URL}users/image/`, formData, config)

      setImage(data)
      setUploading(false)

    } catch (error) {
      setUploading(false)
    }
  }

  return (
    <>
      {loading || updateLoading ?
        <Loader />
        : error
          ? <Error>{error}</Error>
          : (
            <div>
              {message && <Error>{message}</Error>}
              {error && <Error>{error}</Error>}
              <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className=' m-5 p-10 bg-grey-3'>
                  <div className="w-[400px] max-w-md space-y-8 ">
                    <div >

                      <h2 className="mt-6 text-center text-3xl font-mono  text-grey">
                        Edita tu Perfil
                      </h2>
                    </div>
                    <form onSubmit={submitHandler} className="mt-8 space-y-6" action="#" method="POST">
                      <div className="">
                        <p className='mx-4  font-mono text-grey'>Nombre y Apellido</p>
                        <div className='mb-2'>
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"

                            class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                            placeholder="Name"
                          />
                        </div>
                        <p className='mx-4  font-mono text-grey'>Username</p>
                        <div className='mb-2'>

                          <input
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            type="text"

                            class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                            placeholder="Nombre y Apellido"
                          />
                        </div>
                        <p className='mx-4  font-mono text-grey'>Bio</p>
                        <div className='mb-2'>
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            type="text"

                            class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                            placeholder="Escribe algo de ti ..."
                          />
                        </div>
                        <p className='mx-4  font-mono text-grey'>Avatar</p>
                        <div className='mb-2'>
                          <input
                            onChange={uploadFileHandler}
                            type="file"

                            class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                          />
                        </div>
                        <p className='mx-4  font-mono text-grey'>Cambia tu Contraseña</p>
                        <div className='mb-2'>
                          <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"

                            class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                            placeholder="Contraseña"
                          />
                        </div>
                        <div className='mb-2'>
                          <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"

                            class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                            placeholder="Confirmar Contraseña"
                          />
                        </div>
                      </div>
                      <div className='items-center'>
                        <button
                          type="submit"
                          className=" space-x-2 block w-full transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
    </>
  )
}
export default EditProfile;