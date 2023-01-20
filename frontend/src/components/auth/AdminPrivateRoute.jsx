import {Route, Redirect} from 'react-router-dom';
import { useSelector } from 'react-redux';



const AdminPrivateRoute = ({children, ...rest}) => {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    return (
        <Route {...rest}>
            {userInfo.is_superuser ? (
                children
               )   : (
                <Redirect to='/'/>
                )
            }
        </Route>
    )
}

export default AdminPrivateRoute;