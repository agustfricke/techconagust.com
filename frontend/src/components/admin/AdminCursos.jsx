import React from 'react'
import logo from '../../media/logo.png';
import { HiFolderPlus, HiOutlineTrash } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";

const AdminCursos = () => {
    return (

        <div class="relative overflow-x-auto  sm:rounded-lg mt-7">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div className='flex items-center'>
                    <h1 className="text-2xl text-grey font-mono ">Admin Panel: Cursos</h1>
                </div>
                <a href={`/curso/`}>
                    <div className='flex space-x-2 items-center  mr-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 px-10'>
                        <span>
                            Crear
                        </span>
                        <HiFolderPlus className='w-7 h-7' />

                    </div>
                </a>
            </div>


            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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

                    <tr class=" border-b bg-grey-3 hover:bg-gray-50 dark:hover:bg-gray-600">

                        <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            <img class="w-10 h-10 rounded-full" src={logo} alt="Jese image" />

                        </th>
                        <td class="px-6 py-4 text-grey font-mono">
                            E commerce Django & React
                        </td>
                        <td class="px-6 py-4 text-grey font-mono">
                            Full Stack
                        </td>
                        <td class="px-6 py-4 text-grey font-mono">
                            $ 39.99
                        </td>

                        <td class="px-6 py-4 text-grey font-mono hover:text-orange">

                            <a href=''>
                                <HiOutlineTrash className='w-7 h-7' />
                            </a>


                        </td>

                        <td class="px-6 py-4 text-grey font-mono hover:text-orange">

                            <a href=''>
                                <FaEdit className='w-7 h-7' />
                            </a>


                        </td>




                    </tr>




                </tbody>
            </table>
        </div>

    )
}

export default AdminCursos