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

    CURSO_CREATE_REVIEW_REQUEST,
    CURSO_CREATE_REVIEW_SUCCESS,
    CURSO_CREATE_REVIEW_FAIL,
    CURSO_CREATE_REVIEW_RESET,

    EPISODIO_DETAILS_REQUEST,
    EPISODIO_DETAILS_SUCCESS,
    EPISODIO_DETAILS_FAIL,

    EPISODIO_CREATE_COMMENT_REQUEST,
    EPISODIO_CREATE_COMMENT_SUCCESS,
    EPISODIO_CREATE_COMMENT_FAIL,
    EPISODIO_CREATE_COMMENT_RESET,

    EPISODIO_ALL_REQUEST,
    EPISODIO_ALL_SUCCESS,
    EPISODIO_ALL_FAIL,

} from '../constants/cursoConstants';




export const episodioAllReducer = (state = { episodios: [] }, action) => {
    switch (action.type) {
        case EPISODIO_ALL_REQUEST:
            return { loading: true, episodios: [] }

        case EPISODIO_ALL_SUCCESS:
            return { loading: false, episodios: action.payload }

        case EPISODIO_ALL_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const createCommentReducer = (state = {}, action) => {
    switch (action.type) {
        case EPISODIO_CREATE_COMMENT_REQUEST:
            return { loading: true }

        case EPISODIO_CREATE_COMMENT_SUCCESS:
            return { loading: false, success: true }

        case EPISODIO_CREATE_COMMENT_FAIL:
            return { loading: false, error: action.payload }

        case EPISODIO_CREATE_COMMENT_RESET:
            return { episodio: {} }

        default:
            return state
    }
}

export const episodioDetailsReducer = (state = { episodio: { comments: [] } }, action) => {
    switch (action.type) {
        case EPISODIO_DETAILS_REQUEST:
            return { loading: true, ...state }

        case EPISODIO_DETAILS_SUCCESS:
            return { loading: false, episodio: action.payload }

        case EPISODIO_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}


export const createReviewReducer = (state = {}, action) => {
    switch (action.type) {
        case CURSO_CREATE_REVIEW_REQUEST:
            return { loading: true }

        case CURSO_CREATE_REVIEW_SUCCESS:
            return { loading: false, success: true }

        case CURSO_CREATE_REVIEW_FAIL:
            return { loading: false, error: action.payload }

        case CURSO_CREATE_REVIEW_RESET:
            return { curso: {} }

        default:
            return state
    }
}


export const cursoDetailsReducer = (state = { curso: { reviews: [] } }, action) => {
    switch (action.type) {
        case CURSO_DETAILS_REQUEST:
            return { loading: true, ...state }

        case CURSO_DETAILS_SUCCESS:
            return { loading: false, curso: action.payload }

        case CURSO_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const cursoListReducer = (state = { cursos: [] }, action) => {
    switch (action.type) {
        case CURSO_LIST_REQUEST:
            return { loading: true, cursos: [] }

        case CURSO_LIST_SUCCESS:
            return { loading: false, cursos: action.payload }

        case CURSO_LIST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const lastCursoReducer = (state = { cursos: [] }, action) => {
    switch (action.type) {
        case CURSO_LAST_REQUEST:
            return { loading: true, cursos: [] }

        case CURSO_LAST_SUCCESS:
            return { loading: false, cursos: action.payload }

        case CURSO_LAST_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}
