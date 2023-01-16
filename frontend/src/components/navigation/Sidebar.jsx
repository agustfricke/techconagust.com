import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { HiHome, HiUser, HiOutlineLogout } from "react-icons/hi";
import logo from '../../media/logo.png';
import { logout } from '../../actions/userActions'

const Sidebar = (props) => {

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
  
  
    const logoutHandler = (e) => {
      dispatch(logout())
  }

    const { showMenu } = props;


    return (
        <div
            className={`bg-grey-3 fixed lg:left-0 top-0 w-28 h-full flex flex-col justify-between py-6 rounded-tr-xl rounded-br-xl z-50 transition-all ${showMenu ? "left-0" : "-left-full"
                }`}>
            <div>
                <ul className="pl-4">

                    <li>
                        <h1 className="ml-3 my-5">
                            <img src={logo} style={{ maxHeight: "70px" }}/>
                        </h1>
                    </li>

                    <li className="bg-grey-2 p-4 rounded-tl-xl rounded-bl-xl ">
                        <a
                            href="/"
                            className="bg-orange p-4 flex justify-center rounded-xl text-grey-2 group transition-colors"
                        >
                            <HiHome className="text-2xl" />
                        </a>
                    </li>

                    <li className="hover:bg-grey-2 p-4 rounded-tl-xl rounded-bl-xl group transition-colors">
                        <a
                            href={`/MiPerfil/`}
                            className="group-hover:bg-orange p-4 flex justify-center rounded-xl text-orange group-hover:text-grey-2 transition-colors"
                        >
                            <HiUser className="text-2xl" />
                        </a>
                    </li>

                    <li className="hover:bg-grey-2 p-4 rounded-tl-xl rounded-tr-xl group transition-colors">
                        <a
                        onClick={logoutHandler}
                            href="#"
                            className="group-hover:bg-orange p-4 flex justify-center rounded-xl text-orange group-hover:text-grey-2 transition-colors"
                        >
                            <HiOutlineLogout className="text-2xl" />
                        </a>
                    </li>

                    

                </ul>
            </div>
        </div>
    )
}

export default Sidebar