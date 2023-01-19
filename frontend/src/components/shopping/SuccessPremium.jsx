import React from 'react'



const SuccessPremium = () => {
  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className=' m-5 p-10 bg-grey-3'>
        <div className="w-[400px] max-w-md space-y-8 ">
          <div>
            <h2 className="mt-6 text-center text-xl font-mono  text-white">
              ¡ Felicitaciones !
            </h2>
            <h2 className="mt-6 text-center text-xl font-mono  text-grey">
              Ya eres un Usuario Permium
            </h2>
          </div>
          <div className='items-center'>
            <a href='/'
              type="submit"
              className=" space-x-2 block w-full transition-colors text-center  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
            >
              Comenzar a aprender
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessPremium