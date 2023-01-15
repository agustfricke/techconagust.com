import React from 'react'
import logo from '../../media/logo.png';
import {  HiShoppingBag,  } from "react-icons/hi";
import { RiUserStarFill } from "react-icons/ri";
import { HiArrowUpOnSquareStack } from "react-icons/hi2";
const Curso = () => {

  return (

    <>
    <div className="flex items-center justify-between ">
        <h2 className="text-3xl text-grey-1 font-mono">Django Rest Framework</h2>

    </div>

    <div className=" p-8 mt-[50px] grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div className=' ml-[10px] md:ml-[100px] lg:ml-[100px]'>
            <img
                src={logo}
                className="w-100 h-100 object-cover  shadow-2xl rounded-full"
            />
            </div>
            


        <div className="bg-grey-3 p-8 rounded-xl flex flex-col items-center gap-10 text-center">
            
          

            <p className="text-xl text-white font-mono font-bold">Django Rest Framework</p>

            <span className="text-grey font-mono">Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias error cupiditate deserunt est, quia iusto, quas nisi quo voluptatibus ducimus vitae vero modi? Alias quasi in sit nemo voluptas quas.
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus officia reiciendis molestias saepe unde. Unde impedit minima distinctio, possimus expedita laudantium illo omnis, mollitia quaerat quae aperiam earum quisquam qui. Descripcion muy larga y muy entretenida de Django Rest Fraamework</span>

            <p className="text-gray-600">Rating</p>

<div className='flex items-center   gap-1'>

            <a href=''>
                        <div className='flex space-x-2 items-center px-5 text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 '>
                            <span>
                                Comprar
                            </span>
                            <HiShoppingBag className='w-7 h-7' />

                        </div>
                    </a>

               
                    <a href=''>
                        <div className='flex space-x-2 items-center px-5  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 '>
                            <span>
                                Premium
                            </span>
                            <RiUserStarFill className='w-7 h-7' />

                        </div>
                    </a>
                    </div>


                    <a href=''>
                        <div className='flex space-x-2 items-center   text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-2 px-5'>
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

export default Curso