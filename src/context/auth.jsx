import React, {
    createContext,
    useReducer,
    useMemo,
    useContext,
    useEffect,
} from 'react';
import { encryptValue, decryptValue } from './encryptor';
import authReducer, { INIT_AUTH_STATE } from '../reducers/auth';
import {
    registerRequest,
    registerSuccess,
    registerFailure,
    loginRequest,
    loginSuccess,
    loginFailure,
    logout,
} from '../actions/auth';

/**
 * @description Create the authContext
 */
const AuthContext = createContext(INIT_AUTH_STATE);

export default function AuthContextProvider(props) {
    const cachedState = decryptValue(sessionStorage.getItem('auth'));
    const [authState, dispatch] = useReducer(
        authReducer,
        cachedState || INIT_AUTH_STATE
    );

    // Replace cached state whenever authState is updated
    useEffect(() => {
        sessionStorage.setItem('auth', encryptValue(authState));
    }, [authState]);

    /**
     * @description Indicate that a request for register
     * is being processed
     * @param {boolean} status Indicates status of register request
     * [true if in progress, false if completed]
     */
    function onRegisterRequest() {
        dispatch(registerRequest());
    }

    async function onRegisterSuccess() {
        dispatch(registerSuccess());
    }

    /**
     * @description Add error to authContext
     * on failed register
     * @param {object} error
     */
    function onRegisterFailure(error) {
        dispatch(registerFailure(error));
    }

    /**
     * @description Indicate that a request for login
     * is being processed
     * @param {boolean} status Indicates status of login request
     * [true if in progress, false if completed]
     */
    function onLoginRequest() {
        dispatch(loginRequest());
    }

    /**
     * @description Add user as authenticatedUser in authContext
     * on successful login
     * @param {object} {token}
     */
    async function onLoginSuccess({ token, refreshToken, expiresAt, ...rest }) {
        dispatch(loginSuccess({ token, ...rest }));
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('expiresAt', expiresAt);
    }

    /**
     * @description Add error to authContext
     * on failed login
     * @param {object} error
     */
    function onLoginFailure(error) {
        dispatch(loginFailure(error));
    }

    /**
     * @description Remove authenticatedUser from
     * authContext onLogout
     */
    function onLogout() {
        // Clear session sessionStorage
        sessionStorage.clear();
        dispatch(logout());
    }

    /**
     * @description Replace token on token refresh
     * @param {string} freshToken
     */
    function onRefreshAuthToken(freshToken) {
        sessionStorage.setItem('token', freshToken);
    }

    /**
     * @useMemo optimizes the render/re-render cycle.
     * Read the docs for more
     */
    const auth = useMemo(
        () => ({
            onRegisterRequest,
            onRegisterSuccess,
            onRegisterFailure,
            onLoginRequest,
            onLoginSuccess,
            onLoginFailure,
            onLogout,
            onRefreshAuthToken,
            authState,
        }),
        [authState],
    );

    return <AuthContext.Provider value={auth} {...props} />;
}

/**
 * @description Determine whether the authenticatedUser
 * is allowed access to a resource
 * @param {object} user
 * @param {object} permission
 */
export function isAllowedAccess(user, permission) {
    if(user && user.roles && user.roles.length > 0) {
        if(!user.roles.some(p => permission.includes(p))) {
            return true;
        }
    }

    return false;
}

export const useAuthContext = () => useContext(AuthContext);