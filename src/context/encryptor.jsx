import jwt from 'jsonwebtoken';

require('dotenv').config();

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

/**
 * @description Encrypt value and save as a jwt with 8hr validity
 * period
 * @param {object} value
 */
export function encryptValue(value) {
    if (!value) return;

    try {
        /*
         * Remove the exp property to prevent
         * `value already has exp..` error
         */

        // eslint-disable-next-line no-param-reassign
        value.exp && delete value.exp;

        return jwt.sign(value, SECRET_KEY, {
            expiresIn: '8h',
        });
    } catch (error) {
        /* eslint-disable-next-line no-console */
        console.log('ERR @encryption', error.message);
    }
}

/**
 * @description Decrypt string
 * @param {string} value
 */
export function decryptValue(token) {
    if (!token) return;

    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        /* eslint-disable-next-line no-console */
        console.log('ERR @decryption', error.message);
    }
}