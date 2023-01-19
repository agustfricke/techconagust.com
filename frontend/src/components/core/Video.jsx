import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'

import { listEpisodioDetails, createCommentEpisodio, listCursoDetails } from '../../actions/cursoActions'
import { listUsers } from '../../actions/userActions';

import { EPISODIO_CREATE_COMMENT_RESET } from '../../constants/cursoConstants'
import Error from "../utils/Error";
import Loader from '../utils/Loader'
import Success from "../utils/Success";



const Video = ({ match }) => {

    const URL = (process.env.REACT_APP_API_URL)

    const dispatch = useDispatch()

    const [description, setDescription] = useState('')

    const createComment = useSelector(state => state.createComment)
    const { loading: loadingEpisodioComment, error: errorEpisodioComment, success: successEpisodioComment } = createComment

    const episodioDetails = useSelector(state => state.episodioDetails)
    const { loading, error, episodio } = episodioDetails

    const detailsCurso = useSelector(state => state.detailsCurso)
    const { loading: loadingCurso, error: errroCurso, curso } = detailsCurso

    const userList = useSelector(state => state.userList);
    const { users } = userList;

    useEffect(() => {
        if (successEpisodioComment) {
            setDescription('')
            dispatch({ type: EPISODIO_CREATE_COMMENT_RESET })
        }
        dispatch(listEpisodioDetails(match.params.epi))
        dispatch(listCursoDetails(match.params.curso))
        dispatch(listUsers());
    }, [dispatch, match, successEpisodioComment])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createCommentEpisodio(
            match.params.epi, {
            description
        }
        ))
    }

    useEffect(() => {
        document.title = `Tech con Agust | ${episodio.title}`
    }, []);

    return (
        <>
            {error && <Error>{error}</Error>}
            {errroCurso && <Error>{errroCurso}</Error>}
            {error && <Error>{errorEpisodioComment}</Error>}
            {successEpisodioComment && <Success>{successEpisodioComment}</Success>}

            {loading || loadingEpisodioComment || loadingCurso ?
                <Loader />
                : (
                    <>
                        <div className="bg-blue h-[2000px]">
                            <div className=" p-8  grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-16">
                                <div className=" col-span-1 md:col-span-2 lg:col-span-2">
                                    <iframe src={episodio.URL}
                                        width="100%"
                                        height="100%"
                                        loading="lazy"
                                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowfullscreen="true">
                                    </iframe>
                                    <p className='font-mono text-white text-xl mt-3'>{episodio.title}</p>
                                    <p className='font-mono text-grey mt-1'>{episodio.description}</p>
                                    <a className="font-mono text-grey hover:text-orange mt-1" href={`${URL}${curso.file}`}>
                                        Descargar Recurso
                                    </a>
                                    <form className='mb-5' onSubmit={submitHandler}>
                                        <input
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            type="text"
                                            className="bg-grey-2 mt-4 w-full py-2 pl-10 pr-4 rounded-lg text-grey  outline-none"
                                            placeholder="Añade un comentario ..."
                                        />
                                    </form>
                                    <div className='mt-[50px] md:mt-10 lg:mt-10'>
                                        <div className="overflow-y-auto h-60">
                                            <ul>
                                                {episodio.comments && episodio.comments.map((comment) => (
                                                    <>
                                                        {users && users.map(user => (
                                                            <>
                                                                {user.username === comment.user &&
                                                                    <li className='mt-1'>
                                                                        <a href=''>
                                                                            <div className="flex items-center mb-4 space-x-4">
                                                                                <img className="w-10 h-10 rounded-full" src={`${URL}${user.avatar}`} alt="" />
                                                                                <div className="space-y-1 font-medium text-white">
                                                                                    <p>{comment.user}<time className="block text-sm text-gray-500 text-grey">
                                                                                        {comment.date}</time></p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center mb-1 ml-7">

                                                                                <p className="ml-10 mt-1 text-sm text-grey">
                                                                                    {comment.description}
                                                                                </p>
                                                                            </div>
                                                                        </a>
                                                                    </li>
                                                                }
                                                            </>
                                                        ))}
                                                    </>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-[500px]  md:mt-[500px] lg:mt-0'>
                                    <div className="flex-none overflow-y-scroll h-[575px]">
                                        <ul>
                                            {curso.episodios && curso.episodios.map((epi) => (
                                                <li className='mt-1'>
                                                    <a href={`/video/${epi.id}/${curso.id}`}>
                                                        <div className='flex space-x-2 items-center px-5 transition-colors  text-white hover:text-grey-3 bg-grey-2 hover:bg-grey font-bold font-mono  p-2 '>
                                                            <img className='w-12 h-12' src={`${URL}${epi.file}`} />
                                                            <span className=' '>
                                                                {epi.title}
                                                            </span>
                                                        </div>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </>
    )
}

export default Video