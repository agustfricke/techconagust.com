import React from 'react'
import logo from '../../media/logo.png';


const Register = () => {
    return (

        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className=' m-5 p-10 bg-grey-3'>
                <div className="w-full max-w-md space-y-8 ">
                    <div >
                        <img
                            className="mx-auto h-12 w-auto"
                            src={logo}
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-mono  text-grey">
                            Crea una Cuenta
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">

                        <div className="">
                            <div className='mb-2'>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                                    placeholder="Correo Electronico"
                                />
                            </div>

                            <div className='mt-7'>

                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    required
                                    class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                                    placeholder="Nombre de usuario"
                                />
                            </div>

                            <div className='mt-7'>

                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    required
                                    class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                                    placeholder="Nombre y Apellido"
                                />
                            </div>

                            <div className='mt-7'>

                                <input
                                    id="email"
                                    name="email"
                                    type="password"
                                    autoComplete="email"
                                    required
                                    class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                                    placeholder="Contraseña"
                                />
                            </div>

                            <div className='mt-7'>

                                <input
                                    id="email"
                                    name="email"
                                    type="password"
                                    autoComplete="email"
                                    required
                                    class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                                    placeholder="Confirmar Contraseña"
                                />
                            </div>

                        </div>

                        <div className='items-center'>
                            <button
                                type="submit"
                                className=" space-x-2 block w-full transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
                            >

                                Crear Cuenta
                            </button>
                        </div>
                    </form>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a style={{ textDecoration: 'none' }} href="/register" className="text-mono font-mono text-grey ">
                                Tienes una cuenta?
                                <span className='hover:text-orange ml-2 transition-colors'>
                                    Inicia Session aqui!
                                </span>

                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}

export default Register