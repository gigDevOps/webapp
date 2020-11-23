import axios from 'axios';
import qs from 'qs';
import moment from 'moment';

require('dotenv').config();

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
export const BASE_API_URL = process.env.REACT_APP_API_URL;

const defaultConfig = {
    baseURL: BASE_API_URL,
};
const RestClient = axios.create(defaultConfig);

/**
 * @description Intercept every request an attach
 * the token currently in authState
 */
RestClient.interceptors.request.use((config) => {
    if (config.url === '/auth/token') {
        return config;
    }
    return insertToken(config);
});

const insertToken = async (config) => {
    const needsRefresh = moment(
        sessionStorage.getItem('expiresAt'),
    ).isSameOrBefore(moment(new Date()));

    if (needsRefresh) {
        return executeSilentRefresh(config);
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
        // fail safe: delete auth header
        delete config.headers.Authorization;
        return config;
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
};

const executeSilentRefresh = async (config) => {
    function handleError(err) {
        // eslint-disable-next-line no-console
        console.log(err);

        // fail safe: delete auth header
        delete config.headers.Authorization;
        return config;
    }

    try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        const res = await APIClient.refreshAuthToken(refreshToken);

        if (res && res.status === 200) {
            const {
                access_token: token,
                expires_in: expiresIn,
                refresh_token: nextRefreshToken,
            } = res.data;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('refreshToken', nextRefreshToken);
            sessionStorage.setItem(
                'expiresAt',
                moment(new Date()).add(expiresIn, 'seconds'),
            );

            config.headers.Authorization = `Bearer ${token}`;
            return config;
        }
        // else
        return handleError(`Error: [${res.status}] ${res.statusText}`);
    } catch (error) {
        return handleError(
            `Error: [${error.response.status || 500}] ${error.response.data.msg ||
            'SERVER_ERROR'}`,
        );
    }
};

export const APIClient = {
    auth: async ({ username, password }) =>
        RestClient.post(
            '/auth/token',
            qs.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'password',
                username,
                password,
            }),
            {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        ),

    refreshAuthToken: async (refreshToken) =>
        RestClient.post(
            '/auth/token',
            qs.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
            {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        ),

    post: async (path, params, onSuccess = () => {}, onFailure = () => {}) => RestClient.post(path, params, onSuccess, onFailure),
    get: async (path, params, onSuccess = () => {}, onFailure = () => {}) => RestClient.get(path, params, onSuccess, onFailure),
    getFile: async (path, params = {}, onSuccess = () => {}, onFailure = () => {}) => RestClient.get(path, { responseType: 'arraybuffer' }, onSuccess, onFailure),
};