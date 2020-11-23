/*
 * @action types
 */
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOG_OUT = 'LOG_OUT';

/*
 * @action creators
 */
export const loginRequest = () => ({
    type: LOGIN_REQUEST,
});

export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    user,
});

export const loginFailure = (error) => ({
    type: LOGIN_ERROR,
    error,
});

export const logout = () => ({ type: LOG_OUT });