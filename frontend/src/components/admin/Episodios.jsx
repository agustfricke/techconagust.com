import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import { listCursoDetails, episodioCreate, deleteEpisodio } from '../../actions/cursoActions'
import { CURSO_CREATE_EPISODIO_RESET } from "../../constants/cursoConstants";

import Error from '../utils/Error';
import Loader from '../utils/Loader'

import { HiOutlineTrash } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";



const Episodios = ({ match }) => {

    useEffect(() => {
        document.title = 'Tech con Agust | Admin'
      }, []);


    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    let history = useHistory();

    const dispatch = useDispatch()

    const detailsCurso = useSelector(state => state.detailsCurso)
    const { loading, error, curso } = detailsCurso

    const createEpisodio = useSelector(state => state.createEpisodio)
    const { loading: loadingEpisodio, error: errorEpisodio, success: successEpisodio } = createEpisodio

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const episodioDelete = useSelector(state => state.episodioDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = episodioDelete

    useEffect(() => {
        if (userInfo.is_superuser === false) {
            history.push('/');
        }
        if (successEpisodio) {
            setUrl('')
            setTitle('')
            setDescription('')
            dispatch({ type: CURSO_CREATE_EPISODIO_RESET })
        }
        dispatch(listCursoDetails(match.params.id))

    }, [dispatch, match, successEpisodio, successDelete])

    const deleteHandler = (id) => {
        if (window.confirm('Esta seguro de borrar este episodio?')) {
            dispatch(deleteEpisodio(id))
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(episodioCreate(
            match.params.id, {
            title,
            url,
            description,
        }
        ))
    }


    return (
        <>
            {errorEpisodio && <Error>{errorEpisodio}</Error>}
            {errorDelete && <Error>{errorDelete}</Error>}
            {loading || loadingEpisodio || loadingDelete ? <Loader /> : error ? <Error>{error}</Error>
                : (
                    <div className="bg-blue h-[2000px]">
                        <div className=" p-8  grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-16 xl:grid-cols-1 2xl:grid-cols-3">
                            <div className="flex min-h-full items-center justify-center sm:px-6  lg:px-8">
                                <div className=' m-5 p-10 bg-grey-3'>
                                    <div className="w-[400px] max-w-md space-y-8 ">
                                        <div>
                                            <h2 className="mt-6 text-center text-3xl font-mono  text-grey">
                                                Crear Episodios
                                            </h2>
                                        </div>
                                        <form onSubmit={submitHandler} className="mt-8 space-y-6" action="#" method="POST">
                                            <div className="">
                                                <div className='mb-2'>
                                                    <input
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        type="text"
                                                        required
                                                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                                                        placeholder="Titulo"
                                                    />
                                                </div>
                                                <div className='mb-2'>
                                                    <input
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        type="text"
                                                        required
                                                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                                                        placeholder="Descripcion"
                                                    />
                                                </div>
                                                <div className='mb-2'>
                                                    <input
                                                        value={url}
                                                        onChange={(e) => setUrl(e.target.value)}
                                                        type="text"
                                                        required
                                                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                                                        placeholder="URL"
                                                    />
                                                </div>
                                            </div>
                                            <div className='items-center'>
                                                <button
                                                    type="submit"
                                                    className=" space-x-2 block w-full transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
                                                >
                                                    Crear Episodio
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-span-1 md:col-span-2 lg:col-span-2">
                                <table class="w-full text-sm text-left p-8 ">
                                    <thead class="text-xs text-gray-700 uppercase">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 text-white font-mono">
                                                Titulo
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-white font-mono">
                                                URL
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-white font-mono">
                                                Eliminar
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-white font-mono">
                                                Editar
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {curso.episodios && curso.episodios.map((epi) => (
                                            <tr class=" border-b bg-grey-3 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td class="px-6 py-4 text-grey font-mono">
                                                    {epi.title}
                                                </td>
                                                <td class="px-6 py-4 text-grey font-mono">
                                                    {epi.url}
                                                </td>
                                                <td class="px-6 py-4 text-grey font-mono hover:text-orange">
                                                    <button onClick={() => deleteHandler(epi.id)}>
                                                        <HiOutlineTrash className='w-7 h-7' />
                                                    </button>
                                                </td>
                                                <td class="px-6 py-4 text-grey font-mono hover:text-orange">
                                                    <a href={`/episodio/${epi.id}/form`} >
                                                        <FaEdit className='w-7 h-7' />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Episodios