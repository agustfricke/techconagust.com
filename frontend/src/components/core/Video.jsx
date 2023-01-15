import React from 'react'
import logo from '../../media/logo.png';




const Video = () => {


    return (


        <>


            <div className="bg-blue w-full min-h-screen">
                <div className=" p-8  grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-16">

                    <div className=" col-span-1 md:col-span-2 lg:col-span-2">
                        <iframe src="https://www.youtube.com/watch?v=JcyE2dbm1HQ"
                            width="100%"
                            height="100%"
                            loading="lazy"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowfullscreen="true">

                        </iframe>


                        <p className='font-mono text-white text-xl mt-3'>Django Rest Framework</p>

                        <p className='font-mono text-grey mt-1'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit porro nemo doloribus aut sequi perspiciatis eum optio </p>



                        <form className='mb-5'>
                            <input
                                type="text"
                                className="bg-grey-2 mt-4 w-full py-2 pl-10 pr-4 rounded-lg text-grey  outline-none"
                                placeholder="Añade un comentario"
                            />
                        </form>

                        <div className='mt-[50px] md:mt-10 lg:mt-10'>
                            <div className="overflow-y-auto h-60">
                                <ul>
                                    <li className='mt-1'>
                                        <a href=''>
                                            <div className='flex space-x-2 items-center px-5 text-grey-3 font-bold font-mono p-2 mb-2'>
                                                <img className='w-8 h-8' src={logo} />

                                                <span className='text-white '>

                                                    Agustin Fricke:

                                                </span>


                                            </div>
                                            <div className='ml-[60px] text-start'>
                                                <span className='text-grey '>
                                                    Muy buien video, seguire viendo la parte 2
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore animi praesentium odit tempore expedita, quia atque maiores impedit, doloribus ipsum commodi itaque possimus voluptate dignissimos at quibusdam, iusto rem illum?
                                                </span>
                                            </div>
                                        </a>
                                    </li>

                                    <li className='mt-1'>
                                        <a href=''>
                                            <div className='flex space-x-2 items-center px-5 text-grey-3 font-bold font-mono p-2 mb-2'>
                                                <img className='w-8 h-8' src={logo} />

                                                <span className='text-white '>

                                                    Agustin Fricke:

                                                </span>


                                            </div>
                                            <div className='ml-[60px] text-start'>
                                                <span className='text-grey '>
                                                    Muy buien video, seguire viendo la parte 2
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore animi praesentium odit tempore expedita, quia atque maiores impedit, doloribus ipsum commodi itaque possimus voluptate dignissimos at quibusdam, iusto rem illum?
                                                </span>
                                            </div>
                                        </a>
                                    </li>

                                    <li className='mt-1'>
                                        <a href=''>
                                            <div className='flex space-x-2 items-center px-5 text-grey-3 font-bold font-mono p-2 mb-2'>
                                                <img className='w-8 h-8' src={logo} />

                                                <span className='text-white '>

                                                    Agustin Fricke:

                                                </span>


                                            </div>
                                            <div className='ml-[60px] text-start'>
                                                <span className='text-grey '>
                                                    Muy buien video, seguire viendo la parte 2
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore animi praesentium odit tempore expedita, quia atque maiores impedit, doloribus ipsum commodi itaque possimus voluptate dignissimos at quibusdam, iusto rem illum?
                                                </span>
                                            </div>
                                        </a>
                                    </li>


                                </ul>
                            </div>
                        </div>
                    </div>



                    <div className='mt-[500px]  md:mt-0 lg:mt-0'>
                        <div className="flex-none overflow-y-scroll h-[575px]">
                            <ul>
                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                1- Instalacion
                                            </span>

                                        </div>
                                    </a>
                                </li>

                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                2- Programar Projecto
                                            </span>

                                        </div>
                                    </a>
                                </li>

                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                3- Modelos
                                            </span>

                                        </div>
                                    </a>
                                </li>

                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                3- Modelos
                                            </span>

                                        </div>
                                    </a>
                                </li>


                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                3- Modelos
                                            </span>

                                        </div>
                                    </a>
                                </li>


                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                3- Modelos
                                            </span>

                                        </div>
                                    </a>
                                </li>

                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                1- Instalacion
                                            </span>

                                        </div>
                                    </a>
                                </li>

                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                2- Programar Projecto
                                            </span>

                                        </div>
                                    </a>
                                </li>

                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                3- Modelos
                                            </span>

                                        </div>
                                    </a>
                                </li>

                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                1- Instalacion
                                            </span>

                                        </div>
                                    </a>
                                </li>

                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                2- Programar Projecto
                                            </span>

                                        </div>
                                    </a>
                                </li>

                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span>
                                                3- Modelos
                                            </span>

                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>






                </div>
            </div>
        </>


    )
}

export default Video