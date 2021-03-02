import {
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_ERROR,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOG_OUT,
    LOGIN_ERROR,
} from '../actions/auth';

export const INIT_AUTH_STATE = {
    isFetching: false,
    user: null,
    error: null,
};

/**
 * @description Reducer to resolve auth actions
 * @param {Object} prevState The current value of state
 * @param {Object} action The {type, data} to be deployed to store
 */
export default function authReducer(prevState = INIT_AUTH_STATE, action) {
    switch (action.type) {
        case REGISTER_REQUEST:
            return { ...prevState, isFetching: true, error: null };

        case REGISTER_SUCCESS:
            return {
                ...prevState,
                isFetching: false,
                error: null
            };

        case REGISTER_ERROR:
            return {
                ...prevState,
                isFetching: false,
                error: action.error,
            };

        case LOGIN_REQUEST:
            return { ...prevState, isFetching: true, error: null };

        case LOGIN_SUCCESS:
            return {
                ...prevState,
                isFetching: false,
                user: action.user,
                error: null
            };

        case LOGIN_ERROR:
            return {
                ...prevState,
                isFetching: false,
                error: action.error,
            };

        case LOG_OUT:
            return INIT_AUTH_STATE;

        default:
            return prevState;
    }
}
