import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/userActions';
import logo from '../../media/logo.png';

const Login = ({ location, history }) => {

  useEffect(() => {
    document.title = 'Tech con Agust | Login'
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userLogin = useSelector(state => state.userLogin);
  const { error, loading, userInfo } = userLogin;


  useEffect(() => {
    if (userInfo) {
      history.push(redirect);

    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  }



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
              Iniciar Session
            </h2>
          </div>
          <form onSubmit={submitHandler} className="mt-8 space-y-6" action="#" method="POST">

            <div className="">
              <div className='mb-2'>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="email"
                  name="email"
                  type="password"
                  autoComplete="email"
                  required
                  class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div className='items-center'>
              <button
                type="submit"
                className=" space-x-2 block w-full transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
              >

                Iniciar Session
              </button>
            </div>
          </form>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a style={{ textDecoration: 'none' }} href="/register" className="text-mono font-mono text-grey ">
                No tienes una cuenta?
                <span className='hover:text-orange ml-2 transition-colors'>
                  Crea una aqui!
                </span>

              </a>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a style={{ textDecoration: 'none' }} href="/reset-password" className="text-mono font-mono text-grey ">
                Olvidaste tu contraseña?
                <span className='hover:text-orange ml-2 transition-colors'>
                  Recuperala aqui!
                </span>

              </a>
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}

export default Login