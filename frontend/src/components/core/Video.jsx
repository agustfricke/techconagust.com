import React from 'react'
import logo from '../../media/logo.png';




const Video = () => {


    return (


        <>


            <div className="bg-blue h-[2000px]">
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
                                placeholder="Añade un comentario ..."
                            />
                        </form>

                        <div className='mt-[50px] md:mt-10 lg:mt-10'>
                            <div className="overflow-y-auto h-60">
                                <ul>
                                    <li className='mt-1'>
                                        <a href=''>
                                            <div className="flex items-center mb-4 space-x-4">
                                                <img className="w-10 h-10 rounded-full" src={logo} alt="" />
                                                <div className="space-y-1 font-medium text-white">
                                                    <p>Agustin Fricke<time datetime="2014-08-16 19:00" className="block text-sm text-gray-500 text-grey">24 August 2014</time></p>
                                                </div>
                                            </div>


                                            <div className="flex items-center mb-1 ml-7">

                                                <p className="ml-10 mt-1 text-sm text-grey">
                                                    Reviewed in the United Kingdom on
                                                </p>
                                            </div>
                                        </a>
                                    </li>




                                </ul>
                            </div>
                        </div>
                    </div>



                    <div className='mt-[500px]  md:mt-[500px] lg:mt-0'>
                        <div className="flex-none overflow-y-scroll h-[575px]">
                            <ul>
                                <li className='mt-1'>
                                    <a href=''>
                                        <div className='flex space-x-2 items-center px-5 transition-colors  text-white hover:text-grey-3 bg-grey-2 hover:bg-grey font-bold font-mono  p-2 '>
                                            <img className='w-12 h-12' src={logo} />

                                            <span className=' '>
                                                1- Instalacion
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