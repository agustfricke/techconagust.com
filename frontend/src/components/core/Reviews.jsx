import React from 'react'
import logo from '../../media/logo.png';

const Reviews = () => {
    return (
        <>
            <div className="flex items-center justify-between mt-10 mb-16">
                <h2 className="text-3xl text-grey-1 font-mono">
                    Reviews de 

                    <span className='text-orange ml-3.5'>
                        Django Rest Framework
                    </span>

                </h2>
            </div>
            <div className="flex min-h-full items-center justify-center ">
      <div className=' m-4 p-4 bg-grey-3 rounded-lg'>
        <div className="w-[400px] max-w-md space-y-8 ">
          <div >
           
            <h2 className="mt-6 text-center text-xl font-mono  text-grey">
              Crea una Review
             
            </h2>
          </div>
          <form  className="mt-8 space-y-6" action="#" method="POST">

            <div className="">
              <div className='mb-2'>

                <input
                  type="email"
                  required
                  class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                  placeholder="Escribe aqui ..."
                />
              </div>

              
            </div>

            <div className='items-center'>
              <button
                type="submit"
                className=" space-x-2 block w-full transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
              >

                Publicar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>


<div className='border border-t-white mb-7 mt-7'>

</div>
            <div className="flex items-center mb-4 space-x-4">
                <img className="w-10 h-10 rounded-full" src={logo} alt="" />
                <div className="space-y-1 font-medium text-white text-mono">
                    <p>Agustin Fricke<time datetime="2014-08-16 19:00" className="block text-mono text-sm text-gray-500 text-grey">23 August 2014</time></p>
                </div>
            </div>

            <div className="flex items-center mb-1 ml-[65px]">
                <svg aria-hidden="true" className="w-5 h-5 text-orange" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg aria-hidden="true" className="w-5 h-5 text-orange" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg aria-hidden="true" className="w-5 h-5 text-orange" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg aria-hidden="true" className="w-5 h-5 text-orange" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg aria-hidden="true" className="w-5 h-5 text-orange" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </div>
                <div className="flex items-center mb-1 ml-7">

            <p className="ml-10 mt-1  text-grey text-mono">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio iusto error, aspernatur distinctio, iure natus aperiam sequi officiis quas eveniet maiores asperiores harum, vitae ea ratione eaque dolore. Officia, magnam.
            </p>
            </div>


        </>



    )
}

export default Reviews