import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { listCursos } from "../../actions/cursoActions";

import Rating from '../utils/Rating';
import Error from '../utils/Error';
import ContentLoader from "../utils/ContentLoader";

import { HiArrowUpOnSquareStack } from "react-icons/hi2";


const FullStack = () => {

    useEffect(() => {
        document.title = 'Tech con Agust | Full Stack'
      }, []);

    let history = useHistory();

    const URL = (process.env.REACT_APP_API_URL)

    const dispatch = useDispatch();

    const cursoList = useSelector((state) => state.cursoList);
    const { error, loading, cursos } = cursoList;

    let keysearch = history.location.search;
    console.log(keysearch);
    useEffect(() => {
        dispatch(listCursos(keysearch));
    }, [dispatch, keysearch]);

    return (
        <>
            {error && <Error>{error}</Error>}
            {loading ?
                <ContentLoader />
                : (
                    <>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl text-grey-1 font-mono mt-7">Desarrollo Backend</h2>
                        </div>
                        <div className="p-8 mt-[50px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                            {cursos && cursos.map((c) => (
                                <>
                                {c.category === 'Full Stack' ? (

                            <div className="bg-grey-3 p-8 rounded-xl flex flex-col items-center gap-2 text-center text-gray-300">
                                    <img
                                        src={`${URL}${c.image}`}
                                        className="w-40 h-40 object-cover -mt-20 shadow-2xl rounded-full"
                                    />
                                    <p className="text-xl text-white font-mono font-bold">{c.title}</p>
                                    <span className="text-grey font-mono">{c.description}</span>
                                    <p className="mt-1 text-sm text-white"> <Rating value={c.rating} />
                                        <a href={`/revisiones/all/${c.id}/`}>{`${c.num_reviews} reviews`}</a></p>
                                    <a href={`/curso/${c.id}`}>
                                        <div className='flex space-x-2 items-center   text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 px-10'>
                                            <span>
                                                Enter
                                            </span>
                                            <HiArrowUpOnSquareStack className='w-7 h-7' />
                                        </div>
                                    </a>
                                </div>

                                ) : (
                                    
                                    <>
                                     <Error>{'Aun no hay cursos de Full Stack'}</Error>
                                    </>

                                )}
                                
                                </>
                            ))}
                        </div>
                    </>
                )}
        </>
    )
}
export default FullStack