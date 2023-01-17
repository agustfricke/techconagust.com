import React, { useState, useEffect } from "react";
import Message from '../utils/Message';
import Loader from '../utils/Loader'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../utils/Rating'
import { listCursoDetails, createCursoReview } from '../../actions/cursoActions'
import { CURSO_CREATE_REVIEW_RESET } from '../../constants/cursoConstants'
import ContentLoader from "../utils/ContentLoader";
import Error from "../utils/Error";
import logo from '../../media/logo.png';
import { HiShoppingBag, } from "react-icons/hi";
import { RiUserStarFill } from "react-icons/ri";
import { HiArrowUpOnSquareStack } from "react-icons/hi2";
import { useHistory } from "react-router-dom";
import { TbWorld } from "react-icons/tb";


const Curso = ({ match }) => {

    const URL = 'http://127.0.0.1:8000'
    // const URL = 'https://techconagust.com/'


    let history = useHistory();


    const dispatch = useDispatch()

    const detailsCurso = useSelector(state => state.detailsCurso)
    const { loading, error, curso } = detailsCurso

    useEffect(() => {

        dispatch(listCursoDetails(match.params.id))

    }, [dispatch, match])

    const addToCartHandler = () => {
        history.push('/payment')

    }


    useEffect(() => {
        document.title = `Tech con Agust `
    }, []);

    return (

        <>
        <div className="bg-blue h-[2000px]">

            <div className="flex items-center justify-between ">
                <h2 className="text-3xl text-grey-1 font-mono mt-7">{curso.title}</h2>

            </div>

            <div className=" p-8 mt-[50px] grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-16">

             
                <div className="bg-grey-3 p-8 rounded-xl flex flex-col items-center gap-2 text-center text-gray-300">

                    <img
                        src={logo}
                        className="w-40 h-40 object-cover -mt-20 shadow-2xl rounded-full"
                    />
                    <p className="font-mono text-white text-xl my-6">Episodios</p>

<ul className="object-cover -mb-[400px]  ">
{curso.episodios && curso.episodios.map((epi) => (
                                <li className='mt-3 '>
                                    <a href={`/video/${epi.id}/${curso.id}`} >
                                        <div className='flex space-x-2 px-10 items-center transition-colors  text-white hover:text-grey-3 bg-grey-2 hover:bg-grey font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span className=' '>
                                                {epi.title}
                                            </span>

                                        </div>
                                    </a>
                                </li>
                                ))}

                               

                               
                                

                               
                                

                                
                            </ul>

                   




                </div>



                <div className="bg-grey-3 p-8 rounded-xl flex flex-col items-center gap-10 text-center">



                    <p className="text-xl text-white font-mono font-bold">{curso.title}</p>

                    <span className="text-grey font-mono">{curso.description}</span>

                    <p className="mt-1  text-white font-mono"> <Rating value={curso.rating} />
                        <a href="">{`${curso.num_reviews} reviews`}</a></p>

                    <div className='flex items-center   gap-1'>



                        




                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 '>
                            <button onClick={addToCartHandler} type="submit">
                                Comprar $19.99
                            </button>
                            <HiShoppingBag className='w-7 h-7' />
                            

                        </div>
                        


                        <a href=''>
                            <div className='flex space-x-2 items-center px-5  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 '>
                                <span>
                                    Premium $49.99
                                </span>
                                <RiUserStarFill className='w-7 h-7' />

                            </div>
                        </a>

                    </div>

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
    )
}

export default Curso