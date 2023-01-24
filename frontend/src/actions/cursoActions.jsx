import axios from 'axios';
import {
    CURSO_LIST_REQUEST,
    CURSO_LIST_SUCCESS,
    CURSO_LIST_FAIL,

    CURSO_LAST_REQUEST,
    CURSO_LAST_SUCCESS,
    CURSO_LAST_FAIL,

    CURSO_DETAILS_REQUEST,
    CURSO_DETAILS_SUCCESS,
    CURSO_DETAILS_FAIL,

    EPISODIO_CREATE_COMMENT_REQUEST,
    EPISODIO_CREATE_COMMENT_SUCCESS,
    EPISODIO_CREATE_COMMENT_FAIL,


    CURSO_CREATE_REVIEW_REQUEST,
    CURSO_CREATE_REVIEW_SUCCESS,
    CURSO_CREATE_REVIEW_FAIL,


    EPISODIO_DETAILS_REQUEST,
    EPISODIO_DETAILS_SUCCESS,
    EPISODIO_DETAILS_FAIL,


    EPISODIO_ALL_REQUEST,
    EPISODIO_ALL_SUCCESS,
    EPISODIO_ALL_FAIL,

    CURSO_PAGADO_REQUEST,
    CURSO_PAGADO_SUCCESS,
    CURSO_PAGADO_FAIL,

} from '../constants/cursoConstants';

const URL = (process.env.REACT_APP_API_URL)


export const listEpisodios = () => async (dispatch) => {
    try {
        dispatch({ type: EPISODIO_ALL_REQUEST })

        const { data } = await axios.get(`${URL}cursos/get/all/`);

        dispatch({
            type: EPISODIO_ALL_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EPISODIO_ALL_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })

    }
}

export const createCommentEpisodio = (episodioId, comment) => async (dispatch, getState) => {
    try {
        dispatch({
            type: EPISODIO_CREATE_COMMENT_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `${URL}cursos/comment/${episodioId}/`,
            comment,
            config
        )

        dispatch({
            type: EPISODIO_CREATE_COMMENT_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: EPISODIO_CREATE_COMMENT_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listEpisodioDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: EPISODIO_DETAILS_REQUEST })

        const { data } = await axios.get(`${URL}cursos/getEpisodio/${id}/`);

        dispatch({
            type: EPISODIO_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EPISODIO_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })

    }
}


export const createCursoReview = (cursoId, review) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CURSO_CREATE_REVIEW_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `${URL}cursos/${cursoId}/reviews/`,
            review,
            config
        )

        dispatch({
            type: CURSO_CREATE_REVIEW_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: CURSO_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}




export const listCursoDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: CURSO_DETAILS_REQUEST })

        const { data } = await axios.get(`${URL}cursos/curso/${id}/`);

        dispatch({
            type: CURSO_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CURSO_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })

    }
}


export const listCursos = (keysearch = '') => async (dispatch) => {
    try {
        dispatch({ type: CURSO_LIST_REQUEST })

        const { data } = await axios.get(`${URL}cursos/${keysearch}`);

        dispatch({
            type: CURSO_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CURSO_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })

    }
}


export const listLastCursos = () => async (dispatch) => {
    try {
        dispatch({ type: CURSO_LAST_REQUEST })

        const { data } = await axios.get(`${URL}cursos/last`);

        dispatch({
            type: CURSO_LAST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CURSO_LAST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })

    }
}


