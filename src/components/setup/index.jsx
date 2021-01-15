import React, {useEffect, useState} from 'react';
import {Redirect, useHistory} from "react-router-dom";
import {useSelector} from 'react-redux';
import { useAuthContext } from "../../context/auth";
import PersonalDetails from "./PersonalDetails";
import CompanyDetails from "./CompanyDetails";
import LoadingPage from "../LoadingPage";

export default () => {
    const auth = useAuthContext();
    const history = useHistory();
    const company = useSelector((store)=>store.company);
    const profile = useSelector((store)=>store.profile);
    const setup = useSelector((store)=>store.setup);
    const { user } = auth.authState;
    const [step, setStep] = useState(1);

    useEffect(() => {
        if(profile.data && !company.data) {
            setStep(2);
        }
    }, [company]);

    const nextHandler = () => {
        setStep(2);
    }

    const backHandler = () => {
        setStep(1);
    }

    if(user && !company.isFetching && company.data && !profile.isFetching && profile.data) return <Redirect to="/"/>

    return (
        <>
            <LoadingPage loading={setup.form.isPosting} />
            {
                step === 1
                    ?
                        <PersonalDetails nextHandler={nextHandler} />
                    :
                        <CompanyDetails
                            backHandler={backHandler}
                            nextHandler={()=>history.push('/')}
                        />
            }
        </>
    );
}
