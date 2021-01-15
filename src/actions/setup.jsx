/*
 * @action types
 */
export const SET_PERSONAL_DETAILS_REQUEST = 'SET_PERSONAL_DETAILS_REQUEST';
export const SET_PERSONAL_DETAILS_SUCCESS = 'SET_PERSONAL_DETAILS_SUCCESS';
export const SET_PERSONAL_DETAILS_ERROR = 'SET_PERSONAL_DETAILS_ERROR';
export const SET_COMPANY_DETAILS_REQUEST = 'SET_COMPANY_DETAILS_REQUEST';
export const SET_COMPANY_DETAILS_SUCCESS = 'SET_COMPANY_DETAILS_SUCCESS';
export const SET_COMPANY_DETAILS_ERROR = 'SET_COMPANY_DETAILS_ERROR';

/*
 * @action creators
 */
export const setPersonalDetailsRequest = () => ({
    type: SET_PERSONAL_DETAILS_REQUEST,
});

export const setPersonalDetailsSuccess = (data) => ({
    type: SET_PERSONAL_DETAILS_SUCCESS,
    payload: data
});

export const setPersonalDetailsFailure = (error) => ({
    type: SET_PERSONAL_DETAILS_ERROR,
    error,
});

export const setCompanyDetailsRequest = () => ({
    type: SET_COMPANY_DETAILS_REQUEST,
});

export const setCompanyDetailsSuccess = (data) => ({
    type: SET_COMPANY_DETAILS_SUCCESS,
    payload: data
});

export const setCompanyDetailsFailure = (error) => ({
    type: SET_COMPANY_DETAILS_ERROR,
    error,
});