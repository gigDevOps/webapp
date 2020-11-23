import {
    FETCH_REQUEST,
    FETCH_SUCCESS,
    FETCH_FILE_SUCCESS,
    FETCH_FAILURE,
    POST_REQUEST,
    POST_SUCCESS,
    POST_FAILURE,
    DOWNLOAD_FILE_REQUEST,
    DOWNLOAD_FILE_SUCCESS,
    DOWNLOAD_FILE_FAILURE,
    CLEAR_FORM_ERRORS,
    CLEAR_DOWNLOAD_ERR,
} from '../actions/generics';

/**
 * @description Update state in response to an action
 * @param {object} prevState
 * @param {type, payload} action
 */
export default function reducer(prevState = null, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REQUEST:
            return {
                isFetching: true,
                data: undefined,
            };

        case FETCH_SUCCESS:
            return {
                ...prevState,
                isFetching: false,
                data: payload,
            };

        case FETCH_FILE_SUCCESS:
            return {
                ...prevState,
                isFetching: false,
                data: payload.blob,
            };

        case FETCH_FAILURE:
            return {
                ...prevState,
                isFetching: false,
                fetchError: payload,
            };

        case POST_REQUEST:
            return {
                ...prevState,
                form: { ...prevState.form, isPosting: true },
            };

        case POST_SUCCESS:
            return {
                ...prevState,
                data: [...prevState.data, payload],
                form: { ...prevState.form, isPosting: false },
            };

        case POST_FAILURE:
            return {
                ...prevState,
                form: {
                    ...prevState.form,
                    postError: payload,
                    isPosting: false,
                },
            };

        case DOWNLOAD_FILE_REQUEST:
            return {
                ...prevState,
                isDownloading: true,
                downloadErr: false,
            };

        case DOWNLOAD_FILE_SUCCESS:
            return {
                ...prevState,
                isDownloading: false,
            };

        case DOWNLOAD_FILE_FAILURE:
            return {
                ...prevState,
                downloadErr: payload,
                isDownloading: false,
            };

        case CLEAR_DOWNLOAD_ERR:
            return {
                ...prevState,
                downloadErr: false,
            };

        case CLEAR_FORM_ERRORS:
            return {
                ...prevState,
                form: {
                    ...prevState.form,
                    postError: false,
                },
            };

        default:
            return prevState;
    }
}