import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { useAuthContext } from '../context/auth';
import {APIClient} from '../services/APIClient';
import {H1} from "../interface/paragraph/Titles";

import bgLogin from "./../interface/assets/login-background.jpg";
import Button from "../interface/Button";

/**
 * @description Assemble inputs to form a loginForm
 */
export default function () {
    const authContext = useAuthContext();

    const [formValues, setValue] = useState({
        username: '',
        password: '',
    });

    /**
     * @description Respond to onChange event in form
     * @param {*} e Event
     */
    function handleFormInput(e) {
        e.preventDefault();

        if (authContext.authState.error) clearLoginErrors();

        setValue({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    }

    /**
     * @description Respond to onSubmit event in form
     * @param {*} e
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        const { username, password } = formValues;

        try {
            if (username && password) {
                await authContext.onLoginRequest();

                const res = await APIClient.auth({ username, password });
                res && res.status === 200
                    ? authContext.onLoginSuccess({
                        username,
                        token: res.data.access_token,
                        refreshToken: res.data.refresh_token,
                        expiresAt: moment(new Date()).add(res.data.expires_in, 'seconds'),
                    })
                    : handleError({ message: 'CREDENTIALS_INVALID', status: res.status });
                return;
            }
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * @description Add error to auth context when one appears
     * @param {object} err Error
     */
    function handleError(err) {
        err.response && err.response.status
            ? authContext.onLoginFailure({
                status: err.response.status,
                message:
                    err.response.status === 401
                        ? 'CREDENTIALS_INVALID'
                        : err.response.statusText,
            })
            : authContext.onLoginFailure({
                status: 500,
                message: 'NO_RESPONSE',
            });
    }

    /**
     * @description Clear errors
     */
    function clearLoginErrors() {
        authContext.onLoginFailure(null);
    }

    const { user, error } = authContext.authState;
    const { username, password } = formValues;

    if (!user) {
        sessionStorage.clear();

        return (
            <div style={{ display: 'flex', height: '100vh'}}>
            <LoginFormContainer>
                <header>
                    {error ? (
                        <H1>Error</H1>
                    ) : (
                        <>
                            <H1>Hi! Welcome</H1>
                            <p>Please enter your credentials</p>
                        </>
                    )}
                </header>

                <form autoComplete="noop" onSubmit={(e) => handleFormSubmit(e)}>
                    <input
                        type="text"
                        value={username}
                        placeholder="Enter your email"
                        name="username"
                        onChange={(e) => handleFormInput(e)}
                    />

                    <input
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        name="password"
                        onChange={(e) => handleFormInput(e)}
                    />
                    <small style={{paddingRight: '1rem', textAlign: 'right'}}><a>Forgot your password?</a></small>
                    <Button
                        onClick={(e) => handleFormSubmit(e)}
                    >Sign in</Button>
                </form>
                <small style={{marginTop: '1rem'}}>By proceeding, you agree on our <a>Terms and Condition</a>
                    <br /> and you confirm you have read our <a>privacy policy</a>
                </small>
            </LoginFormContainer>
                <BackgroundImage>
                    <div style={{ width :'100%', height: '100%', background: 'rgba(225, 100, 35, 0.15)'}} />
                </BackgroundImage>
            </div>
        );
    }

    return <Redirect to="/" />;
}

const BackgroundImage = styled.div`
  box-shadow: inset 5px 0px 10px 0px rgba(0,0,0,0.25);
  flex-grow: 1;
  background-image: url('${bgLogin}');
  background-size: cover; 
`

const LoginFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  min-width: 32.5rem;
  margin: auto;
  background: #ffffff;
  height: 100%;
  padding: 4rem;

  header {
    padding: 2rem 0 1rem 0;
  }

  form {
    width: 100%;
  display: flex;
  flex-direction: column;
    
    input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  border: 1px solid #f69425;
  -webkit-text-fill-color: #000;
  -webkit-box-shadow: 0 0 0px 1000px #F6F6F6 inset;
  transition: background-color 5000s ease-in-out 0s;
}
    
    input {
        padding: 1rem;
        margin: 0.5rem 0;
        border: 1px solid #eee;
        border-radius: 3px;
        background-color: #F6F6F6;
        color: #333;
    }
    button {
        display: block;
      margin: 0.5rem 0;
      padding: 1rem;
    }
  }
`;