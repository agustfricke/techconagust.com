import React, { useEffect } from 'react';
import logo from '../../media/logo.png';
import { HiFolderPlus, HiOutlineTrash } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";
import { listCursos, deleteCurso, createCurso } from '../../actions/cursoActions'
import { useDispatch, useSelector } from 'react-redux'
import { CURSO_CREATE_RESET } from '../../constants/cursoConstants'
import Message from '../utils/Message';
import Loader from '../utils/Loader'
import { useHistory } from "react-router-dom";

const AdminCursos = () => {

    let history = useHistory();

    const dispatch = useDispatch()

    const cursoList = useSelector(state => state.cursoList)
    const { loading, error, cursos } = cursoList

    const cursoDelete = useSelector(state => state.cursoDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = cursoDelete

    const cursoCreate = useSelector(state => state.cursoCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, curso: createdCurso } = cursoCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        dispatch({ type: CURSO_CREATE_RESET })

        if (userInfo.is_superuser === false) {
            history.push('/login')
        }

        if (successCreate) {
            history.push(`/cursos/${createdCurso.id}/form`)
        } else {
            dispatch(listCursos())
        }

    }, [dispatch, history, userInfo, successDelete, successCreate, createCurso])

    const deleteHandler = (id) => {
        if (window.confirm('Are you shure you want to delete this Curso?')) {
            dispatch(deleteCurso(id))
        }
    }

    const createCursoHandler = (curso) => {
        dispatch(createCurso())
    }


    return (

        <div class="relative overflow-x-auto  sm:rounded-lg mt-7">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div className='flex items-center'>
                    <h1 className="text-2xl text-grey font-mono ">Admin Panel: Cursos</h1>
                </div>
                <button onClick={createCursoHandler} >
                    <div className='flex space-x-2 items-center  mr-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 px-10'>
                        <span>
                            Crear
                        </span>
                        <HiFolderPlus className='w-7 h-7' />

                    </div>
                </button>
            </div>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {loading
                ? (<Loader />)
                : error
                    ? (<Message variant='danger'>{error}</Message>)
                    : (


            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-white font-mono">
                            Imagen
                        </th>

                        <th scope="col" class="px-6 py-3 text-white font-mono">
                            Nombre
                        </th>
                        <th scope="col" class="px-6 py-3 text-white font-mono">
                            Categoria
                        </th>
                        <th scope="col" class="px-6 py-3 text-white font-mono">
                            Precio
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
                {cursos.map(curso => (
                    <tr class=" border-b bg-grey-3 hover:bg-gray-50 dark:hover:bg-gray-600">

                        <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            <img class="w-10 h-10 rounded-full" src={logo} alt="Jese image" />

                        </th>
                        <td class="px-6 py-4 text-grey font-mono">
                            {curso.title}
                        </td>
                        <td class="px-6 py-4 text-grey font-mono">
                            {curso.category}
                        </td>
                        <td class="px-6 py-4 text-grey font-mono">
                            $ {curso.price}
                        </td>

                        <td class="px-6 py-4 text-grey font-mono hover:text-orange">

                            
                            <button  onClick={() => deleteHandler(curso.id)}>
                                <HiOutlineTrash className='w-7 h-7' />

                            </button>


                        </td>

                        <td class="px-6 py-4 text-grey font-mono hover:text-orange">

                            
                        <a href={`/cursos/${curso.id}/form`} >
                        <FaEdit className='w-7 h-7' />

                            </a>


                        </td>




                    </tr>


))}

                </tbody>
            </table>
             )}
        </div>

    )
}

export default AdminCursos