import React from 'react'
import { HiHome, HiUser, HiOutlineLogout } from "react-icons/hi";
import logo from '../../media/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/userActions'


const Lowbar = () => {

  const dispatch = useDispatch()

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin


  const logoutHandler = (e) => {
    dispatch(logout())
}


  return (
    <nav className="bg-grey-3 lg:hidden fixed w-full bottom-0 left-0 text-3xl text-gray-400  flex items-center justify-between rounded-tl-xl rounded-tr-xl">
     
     <h1 className="ml-3 my-5">
                            <img src={logo} style={{ maxHeight: "70px" }}/>
                        </h1>
    <div className="bg-grey-2 p-4 rounded-tl-xl rounded-tr-xl ">
    <a
                            href="#"
                            className="bg-orange p-4 flex justify-center rounded-xl text-grey-2"
                        >
                            <HiHome className="text-2xl" />
                        </a>
    </div>
    <div className="hover:bg-grey-2 p-4 rounded-tl-xl rounded-tr-xl group transition-colors">
    <a
      href="#"
      className="
      group-hover:bg-orange p-4 flex justify-center rounded-xl text-orange group-hover:text-grey-2 transition-colors"
    >
      <HiUser className="text-2xl" />
    </a>
    </div>
    <div className="hover:bg-grey-2 p-4 rounded-tl-xl rounded-tr-xl group transition-colors">
    <a
    onClick={logoutHandler}
      href="#"
      className="
      group-hover:bg-orange p-4 flex justify-center rounded-xl text-orange group-hover:text-grey-2 transition-colors"
    >
      <HiOutlineLogout className="text-2xl" />

    </a>
    </div>

   


</nav>
  )
}

export default Lowbar