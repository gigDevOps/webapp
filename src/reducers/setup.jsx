import {
    SET_PERSONAL_DETAILS_REQUEST,
    SET_PERSONAL_DETAILS_SUCCESS,
    SET_PERSONAL_DETAILS_ERROR,
    SET_COMPANY_DETAILS_REQUEST,
    SET_COMPANY_DETAILS_SUCCESS,
    SET_COMPANY_DETAILS_ERROR,
} from "../actions/setup";
import { LOG_OUT } from "../actions/auth";

export const INIT_SETUP_STATE = {
    isFetching: false,
    userDetails: null,
    companyDetails: null,
    error: null
};

/**
 * @description Reducer to resolve setup actions
 * @param {Object} prevState The current value of state
 * @param {Object} action The {type, data} to be deployed to store
 */
export default function setupReducer(prevState = INIT_SETUP_STATE, action) {
    switch (action.type) {
        case SET_PERSONAL_DETAILS_REQUEST:
            return { ...prevState, isFetching: true };

        case SET_PERSONAL_DETAILS_SUCCESS:
            return {
                ...prevState,
                userDetails: action.payload,
                isFetching: false
            };

        case SET_PERSONAL_DETAILS_ERROR:
            return {
                ...prevState,
                isFetching: false,
                error: action.error,
            };

        case SET_COMPANY_DETAILS_REQUEST:
            return { ...prevState, isFetching: true };

        case SET_COMPANY_DETAILS_SUCCESS:
            return {
                ...prevState,
                isFetching: false,
                companyDetails: action.payload
            };

        case SET_COMPANY_DETAILS_ERROR:
            return {
                ...prevState,
                isFetching: false,
                error: action.error,
            };

        case LOG_OUT:
            return INIT_SETUP_STATE;

        default:
            return prevState;
    }
}