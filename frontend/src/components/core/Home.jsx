import React from 'react'
import logo from '../../media/logo.png';
import { HiArrowUpOnSquareStack } from "react-icons/hi2";


const Home = () => {
    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl text-grey-1 font-mono mt-7">Todos los Cursos</h2>
            </div>

            <div className="p-8 mt-[50px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">


                <div className="bg-grey-3 p-8 rounded-xl flex flex-col items-center gap-2 text-center text-gray-300">

                    <img
                        src={logo}
                        className="w-40 h-40 object-cover -mt-20 shadow-2xl rounded-full"
                    />

                    <p className="text-xl text-white font-mono font-bold">Django Rest Framework</p>

                    <span className="text-grey font-mono">lo Descripcion muy larga y muy entretenida de Django Rest Fraamework</span>

                    <a href={`/reviews/`} className="text-gray-600">Rating</a>

                    <a href={`/curso/`}>
                        <div className='flex space-x-2 items-center   text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 px-10'>
                            <span>
                                Enter
                            </span>
                            <HiArrowUpOnSquareStack className='w-7 h-7' />

                        </div>
                    </a>




                </div>
            </div>
        </>
    )
}

export default Home