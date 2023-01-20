import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'

import { listCursoDetails } from '../../actions/cursoActions'

import Error from "../utils/Error";
import Loader from '../utils/Loader'
import Rating from '../utils/Rating'

import { RiUserStarFill } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import { TbWorld } from "react-icons/tb";



const Curso = ({ match }) => {

    useEffect(() => {
        document.title = 'Tech con Agust | Curso'
    }, []);

    const [noPremium, setNoPremium] = useState('')


    const URL = (process.env.REACT_APP_API_URL)

    let history = useHistory();

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const detailsCurso = useSelector(state => state.detailsCurso)
    const { loading, error, curso } = detailsCurso

    useEffect(() => {
        dispatch(listCursoDetails(match.params.id))
    }, [dispatch, match])

    const errorMessage = () => {
        setNoPremium('Debes tener una cuenta premium para acceder!')

    }




    return (
        <>
            {error && <Error>{error}</Error>}
            {noPremium && <Error>{noPremium}</Error>}
            {loading ?
                <Loader />
                : (
                    <>
                        <>

                            <>
                                <div className="bg-blue h-[2000px]">
                                    <div className="flex items-center justify-between ">
                                        <h2 className="text-3xl text-grey-1 font-mono mt-7">{curso.title}</h2>
                                    </div>
                                    <div className=" p-8 mt-[50px] grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-16">
                                        <div className="bg-grey-3 p-8 rounded-xl flex flex-col items-center gap-2 text-center text-gray-300">
                                            <img
                                                src={`${URL}${curso.image}`}
                                                className="w-40 h-40 object-cover -mt-20 shadow-2xl rounded-full"
                                            />
                                            <p className="font-mono text-white text-xl my-6">Episodios</p>

                                            {userInfo && userInfo.premium == false ? (

                                                <div className="mb-10">

                                                    <ul className="object-cover -mb-[100px] md:-mb-[100px] lg:-mb-[100px] ">
                                                        {curso.episodios && curso.episodios.map((epi) => (
                                                            <li className='mt-3 '>
                                                                <a onClick={errorMessage}  >
                                                                    <div className='flex space-x-2 px-10 items-center transition-colors  text-white hover:text-grey-3 bg-grey-2 hover:bg-grey font-bold font-mono  p-2 rounded-lg'>
                                                                        <img className='w-12 h-12 rounded-full mr-5' src={`${URL}${epi.file}`} />

                                                                        <span className=' '>
                                                                            {epi.title}
                                                                        </span>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                            ) : (

                                                <div className="mb-10">

                                                    <ul className="object-cover -mb-[100px] md:-mb-[100px] lg:-mb-[100px] ">
                                                        {curso.episodios && curso.episodios.map((epi) => (
                                                            <li className='mt-3 '>
                                                                <a href={`/video/${epi.id}/${curso.id}`} >
                                                                    <div className='flex space-x-2 px-10 items-center transition-colors  text-white hover:text-grey-3 bg-grey-2 hover:bg-grey font-bold font-mono  p-2 rounded-lg'>
                                                                        <img className='w-12 h-12 rounded-full mr-5' src={`${URL}${epi.file}`} />

                                                                        <span className=' '>
                                                                            {epi.title}
                                                                        </span>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                            )}


                                        </div>
                                        <div className="bg-grey-3 p-8 rounded-xl flex flex-col items-center gap-10 text-center">
                                            <p className="text-xl text-white font-mono font-bold">{curso.title}</p>
                                            <span className="text-grey font-mono">{curso.description}</span>
                                            <p className="mt-1  text-white font-mono"> <Rating value={curso.rating} /></p>

                                            {userInfo && userInfo.premium === true ? (
                                                <a className="text-white hover:text-orange font-mono" href={`/reviews/${curso.id}/`}>{`${curso.num_reviews} reviews`}</a>
                                            ) : (
                                                <a className="text-white hover:text-orange font-mono" href={`/reviews/all/${curso.id}/`}>{`${curso.num_reviews} reviews`}</a>
                                            )}

                                            {userInfo && userInfo.premium === true ? (
                                                <>
                                                </>

                                            ) : (

                                                <div className='flex items-center   gap-1'>

                                                    <a href='/premium/user/payment' >
                                                        <div className='flex space-x-2 items-center px-5  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 '>
                                                            <span>
                                                                Premium $14.99
                                                            </span>
                                                            <RiUserStarFill className='w-7 h-7' />
                                                        </div>
                                                    </a>
                                                </div>


                                            )}

                                            <span className="text-grey font-mono">Creado por <span className="text-white">Agustin Fricke</span></span>
                                            <div className='flex space-x-2 items-center   text-white font-bold font-mono'>
                                                <p className="mt-1 text-sm text-gray-300 pl-4">
                                                    <TbWorld />
                                                </p>
                                                <p className="mt-1 text-sm text-gray-300">
                                                    Espanol
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        </>
                    </>
                )}
        </>

    )
}

export default Curso