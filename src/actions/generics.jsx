import { APIClient } from "../services/APIClient";
import _ from "lodash";

const saveAs = () => {}

/*
 * @action types
 */
export const FETCH_REQUEST = 'FETCH_REQUEST';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';
export const POST_REQUEST = 'POST_REQUEST';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAILURE = 'POST_FAILURE';
export const FORM_VALIDATION_ERR = 'FORM_VALIDATION_ERR';
export const CLEAR_FORM_ERRORS = 'CLEAR_FORM_ERRORS';
export const FETCH_FILE_SUCCESS = 'FETCH_FILE_SUCCESS';
export const DOWNLOAD_FILE_REQUEST = 'DOWNLOAD_FILE_REQUEST';
export const DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD_FILE_SUCCESS';
export const DOWNLOAD_FILE_FAILURE = 'DOWNLOAD_FILE_FAILURE';
export const CLEAR_DOWNLOAD_ERR = 'CLEAR_DOWNLOAD_ERR';

/*
 * @actions
 */

/**
 * @description Indicate that a GET request is in progress
 @param {string} stateName Slice of state that this action targets
 */
export function initiateFetchRequest(stateName) {
    return { type: FETCH_REQUEST, stateName };
}

/**
 * @description Indicate that a POST request is in progress
 * @param {string} stateName Slice of state that this action targets
 */
export function initiatePostRequest(stateName) {
    return { type: POST_REQUEST, stateName };
}

/**
 * @description Load all fetched items into the store
 * @param {array} items
 * @param {string} stateName Slice of state that this action targets
 */
export function fetchSuccess(items, stateName) {
    return { type: FETCH_SUCCESS, payload: items, stateName };
}

/**
 * @description Add a GET err to the store
 * @param {object} err
 * @param {string} stateName Slice of state that this action targets
 */
export function fetchFailure(err, stateName) {
    return { type: FETCH_FAILURE, payload: err, stateName };
}

/**
 * @description Load a newly minted item to the store
 * @param {object} item
 * @param {string} stateName Slice of state that this action targets
 */
export function postSuccess(item, stateName) {
    return { type: POST_SUCCESS, payload: item, stateName };
}

/**
 * @description Add a POST error to the store
 * @param {object} err
 * @param {string} stateName Slice of state that this action targets
 */
export function postFailure(err, stateName) {
    return { type: POST_FAILURE, payload: err, stateName };
}

/**
 * @description Remove errors from store
 * @param {string} stateName Slice of state that this action targets
 */
export function clearFormErrors(stateName) {
    return { type: CLEAR_FORM_ERRORS, stateName };
}

export function fetchFileSuccess(blob, stateName) {
    return { type: FETCH_FILE_SUCCESS, payload: blob, stateName };
}

export function initiateDownloadFileRequest(stateName) {
    return { type: DOWNLOAD_FILE_REQUEST, stateName };
}

export function downloadFileSuccess(stateName) {
    return { type: DOWNLOAD_FILE_SUCCESS, stateName };
}

export function downloadFileFailure(error, stateName) {
    return { type: DOWNLOAD_FILE_FAILURE, payload: error, stateName };
}

export function clearDownloadErrs(stateName) {
    return { type: CLEAR_DOWNLOAD_ERR, stateName };
}

/*
 * @thunks
 */

/**
 * @description Make API request to fetch all resources
 * && dispatch appropriate actions to store depending on
 * API response
 * @param {string} stateName Slice of state that this action targets
 * @param path
 * @param params
 * @param onSuccess
 * @param onFailure
 */
export function fetch(
    stateName,
    path,
    params = {},
    onSuccess = () => {},
    onFailure = () => {},
) {
    return async (dispatch) => {
        // toggle isFetching to true to show loader
        dispatch(initiateFetchRequest(stateName));

        try {
            const res = await APIClient.get(path, { params });
            if (res && res.status === 200) {
                if (stateName === 'user'){
                    dispatch(fetchSuccess(res.data[stateName][0], stateName));
                } else {
                    if (_.keys(res.data).includes(stateName)){
                        dispatch(fetchSuccess(res.data[stateName], stateName));
                    } else {
                        dispatch(fetchSuccess(res.data, stateName));
                    }
                }
                onSuccess(res.data);
            }
        } catch (error) {
            dispatch(fetchFailure(handleApiError(error), stateName));
            onFailure(error);
        }
    };
}

/**
 * @description Make API request to create a resource
 * && dispatch appropriate actions to store depending on
 * API response
 * @param {string} stateName Slice of state that this action targets
 * @param path
 * @param {object} resource
 * @param onSuccess
 * @param onFailure
 */
export function create(
    stateName,
    path,
    resource,
    onSuccess = () => {},
    onFailure = () => {},
) {
    return async (dispatch) => {
        // toggle isPosting to disable buttons
        dispatch(initiatePostRequest(stateName));

        try {
            const res = await APIClient.post(path, resource);
            console.log({res});
            if (res && res.status === 200) {
                onSuccess(res);
                await dispatch(postSuccess(res.data[resource], stateName));
                return res;
            }
        } catch (error) {
            dispatch(postFailure(handleApiError(error), stateName));
            onFailure(error.response);
        }
    };
}

/**
 * @description Dispatch an error action to the store
 * @param {object} error
 * @param {string} stateName Slice of state that this action targets
 */
export function addError(error, stateName) {
    return (dispatch) => dispatch(postFailure(handleFormError(error), stateName));
}

/**
 * @description Dispatch an action to reset error to false
 * @param {string} stateName Slice of state that this action targets
 */
export function removeFormErrors(stateName) {
    return (dispatch) => dispatch(clearFormErrors(stateName));
}

/**
 * @description Helper to determine what kind of err to report
 * after bad (NOT OK) API response
 * @param {object} error
 */
function handleApiError(error) {
    if (error.response && error.response.status === 401) {
        // fail safe: kick user out.
        sessionStorage.clear();
        window.location.reload();

        return { status: 401, message: 'UNAUTHORIZED' };
    }

    if (error.response && error.response.status === 404) {
        return { status: 404, message: 'NOT_FOUND' };
    }

    return error.response && error.response.data
        ? {
            status: error.response.status || 500,
            message: error.response.data.message || 'SERVER_ERR',
        }
        : { status: 500, message: 'NO_RESPONSE' };
}

/**
 * @description Determine error to report a validation failure
 * @param {object} error
 */
function handleFormError(error) {
    return { ...error /* status: 400 <Bad Request> */ };
}

/**
 * @description Fetch a file from the server
 * @param {string} path
 * @param {string} filename
 * @param {string} stateName
 * @param {function} onSuccess
 * @param {function} onFailure
 */
export function fetchFile(
    path,
    filename,
    stateName,
    onSuccess = () => {},
    onFailure = () => {},
) {
    return async (dispatch) => {
        dispatch(initiateFetchRequest(stateName));

        try {
            const res = APIClient.getFile(path);

            if (res && res.status === 200) {
                dispatch(fetchFileSuccess(res.data, stateName));
                onSuccess(res.data);
            }
        } catch (error) {
            dispatch(fetchFailure(handleApiError(error), stateName));
            onFailure();
        }
    };
}

/**
 * @description Save a file to disk
 * @param {blob} blob
 * @param {string} filename
 * @param {string} stateName
 * @param {function} onSuccess
 * @param {function} onFailure
 */
export function downloadFile(
    blob,
    filename,
    stateName,
    onSuccess = () => {},
    onFailure = () => {},
) {
    return async (dispatch) => {
        dispatch(initiateDownloadFileRequest(stateName));

        try {
            await saveAs(blob, filename);
            dispatch(downloadFileSuccess(stateName));
            onSuccess();
        } catch (error) {
            dispatch(downloadFileFailure(handleApiError(error), stateName));
            onFailure();
        }
    };
}
