import React from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { useAuthContext } from '../context/auth';
import {APIClient} from '../services/APIClient';
import {H1} from "../interface/paragraph/Titles";

import bgLogin from "./../interface/assets/login-background.jpg";
import Button from "../interface/Button";

const schema = yup.object().shape({
    email: yup.string().email().required(),
    reEmail: yup.string().email().oneOf([yup.ref('email'), null], "emails do not match").required(),
    password: yup.string().required()
});

/**
 * @description Assemble inputs to form a registerForm
 */
export default function () {
    const authContext = useAuthContext();
    const history = useHistory();

    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema)
    });

    const moveOn = () => {
        authContext.onRegisterSuccess();
        history.push("/login");
        alert("Please check your email for account confirmation!");
    }

    /**
     * @description Respond to onSubmit event in form
     * @param {*} e
     */
    async function onSubmit(data) {
        const { email, password } = data;

        try {
            if (email && password) {
                await authContext.onRegisterRequest();

                const res = await APIClient.register({ email, password });
                res && res.status === 200
                    ? moveOn()
                    : handleError(res);
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
            ? authContext.onRegisterFailure({
                status: err.response.status,
                message:
                    err.response.status === 401
                        ? 'CREDENTIALS_INVALID'
                        : err.response.message,
            })
            : authContext.onRegisterFailure({
                status: 500,
                message: 'NO_RESPONSE',
            });
    }

    const { user, error } = authContext.authState;

    if (!user) {
        sessionStorage.clear();

        return (
            <div style={{ display: 'flex', height: '100vh'}}>
                <BackgroundImage>
                    <div style={{ width :'100%', height: '100%', background: 'rgba(225, 100, 35, 0.15)'}} />
                </BackgroundImage>
                <LoginFormContainer>
                    <header>
                        {error ? (
                            <H1>An error occurred</H1>
                        ) : (
                            <>
                                <H1>Hi! Welcome</H1>
                                <p>Please enter your email and password to register.</p>
                            </>
                        )}
                    </header>

                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="noop">
                        <input
                            type="email"
                            className="focus:outline-none"
                            placeholder="Enter your email ID"
                            name="email"
                            ref={register}
                        />
                        <p>{errors.email?.message}</p>
                        <input
                            type="email"
                            className="focus:outline-none"
                            placeholder="Confirm your email ID"
                            name="reEmail"
                            ref={register}
                        />
                        <p>{errors.reEmail?.message}</p>
                        {/* {
                            email.length>0 && reEmail.length>0 && email !== reEmail
                                &&
                                    <span>Emails should match!</span>
                        } */}
                        <input
                            type="password"
                            className="focus:outline-none"
                            placeholder="Enter your password"
                            name="password"
                            ref={register}
                        />
                        <p>{errors.password?.message}</p>
                        <Button
                            className="focus:outline-none"
                            type="submit"
                        >Sign up</Button>
                        <small style={{paddingRight: '1rem', textAlign: 'right'}}>Already have an account?
                            <Link className={styles.link} to="/login"> Sign in</Link>
                        </small>
                    </form>
                    <div className="flex h-full items-center justify-center">
                        <small className="text-center" style={{marginTop: '1rem'}}>By proceeding, you agree on our <Link className={styles.link} to="/terms-conditions">Terms and Condition</Link>,
                            <br /> and you confirm you have read our <Link className={styles.link} to="/privacy-policy">privacy policy</Link>
                        </small>
                    </div>
                </LoginFormContainer>
            </div>
        );
    }

    return <Redirect to="/" />;
}

const styles = {
    link: "text-link hover:text-link hover:no-underline"
};

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