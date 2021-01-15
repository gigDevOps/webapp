import React, {
    createContext,
    useReducer,
    useMemo,
    useContext
} from 'react';
import setupReducer, { INIT_SETUP_STATE } from '../reducers/setup';
import {
    setPersonalDetailsRequest,
    setPersonalDetailsSuccess,
    setPersonalDetailsFailure,
    setCompanyDetailsRequest,
    setCompanyDetailsSuccess,
    setCompanyDetailsFailure
} from '../actions/setup';

/**
 * @description Create the setupContext
 */
const SetupContext = createContext(INIT_SETUP_STATE);

export default function SetupContextProvider(props) {
    const [setupState, dispatch] = useReducer(
        setupReducer,
        INIT_SETUP_STATE
    );

    /**
     * @description Indicate that a request for register
     * is being processed
     * @param {boolean} status Indicates status of register request
     * [true if in progress, false if completed]
     */
    function onSetPersonalDetailsRequest() {
        dispatch(setPersonalDetailsRequest());
    }

    /**
     * @description Add user as authenticatedUser in authContext
     * on successful login
     * @param {object} {token}
     */
    async function onSetPersonalDetailsSuccess(data) {
        dispatch(setPersonalDetailsSuccess(data));
    }

    /**
     * @description Add error to authContext
     * on failed register
     * @param {object} error
     */
    function onSetPersonalDetailsFailure(error) {
        dispatch(setPersonalDetailsFailure(error));
    }

    /**
     * @description Indicate that a request for register
     * is being processed
     * @param {boolean} status Indicates status of register request
     * [true if in progress, false if completed]
     */
    function onSetCompanyDetailsRequest() {
        dispatch(setCompanyDetailsRequest());
    }

    /**
     * @description Add user as authenticatedUser in authContext
     * on successful login
     * @param {object} {token}
     */
    async function onSetCompanyDetailsSuccess(data) {
        dispatch(setCompanyDetailsSuccess(data));
    }

    /**
     * @description Add error to authContext
     * on failed register
     * @param {object} error
     */
    function onSetCompanyDetailsFailure(error) {
        dispatch(setCompanyDetailsFailure(error));
    }

    /**
     * @useMemo optimizes the render/re-render cycle.
     * Read the docs for more
     */
    const setup = useMemo(
        () => ({
            onSetPersonalDetailsRequest,
            onSetPersonalDetailsSuccess,
            onSetPersonalDetailsFailure,
            onSetCompanyDetailsRequest,
            onSetCompanyDetailsSuccess,
            onSetCompanyDetailsFailure,
            setupState
        }),
        [setupState],
    );

    return <SetupContext.Provider value={setup} {...props} />;
}

export const useSetupContext = () => useContext(SetupContext);