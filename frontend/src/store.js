import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { userLoginReducer,
        userRegisterReducer,
        userDetailsReducer,
        userUpdateProfileReducer,
        userListReducer,
        passwordRestReducer,
        passwordConfirmReducer,
        userActivationReducer,
        userPremumReducer,
        changeEmailReducer,
} from './reducers/userReducers'

import { cursoListReducer,
        lastCursoReducer,
        cursoDetailsReducer,
        createReviewReducer,
        episodioDetailsReducer,
        createCommentReducer,
        episodioAllReducer,
} from './reducers/cursoReducers';


const reducer = combineReducers({

    // User
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    passwordRest:passwordRestReducer,
    passwordConfirm:passwordConfirmReducer,
    userActivation:userActivationReducer,
    userPremium: userPremumReducer,
    changeEmail:changeEmailReducer,

    // Curso
    cursoList: cursoListReducer,
    lastCurso: lastCursoReducer,
    detailsCurso: cursoDetailsReducer,
    createReview: createReviewReducer,
    episodioDetails: episodioDetailsReducer,
    createComment: createCommentReducer,
    episodioAll: episodioAllReducer,

})



const userInfoStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
    userLogin: { userInfo: userInfoStorage }
}

const middleware = [thunk]

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleware)))

export default store

