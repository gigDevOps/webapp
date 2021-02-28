import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PersonalDetails from "./PersonalDetails";
import CompanyDetails from "./CompanyDetails";
import LoadingPage from "../LoadingPage";
import _ from "lodash";
import {fetch} from "../../actions/generics";
import DeparmentDetails from "./DeparmentDetails";
import {Redirect} from "react-router-dom";


export default function ProfileSetup () {
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const setup = useSelector((store) => store.setup);
    const company = useSelector((store) => store.company);
    const profile = useSelector((store) => store.profile);
    const departments = useSelector((store) => store.departments);

    useEffect(() => {
        dispatch(fetch('user', '/get-user'));
        dispatch(fetch('profile', '/get-profile'));
        dispatch(fetch('company', '/get-company'));
        dispatch(fetch('departments', '/organization'));
    }, [])

    useEffect(() => {
        if (!_.get(profile, 'data.id', false)) {
            setStep(1);
            return
        }
        if (!_.get(company, 'data.id', false)) {
            setStep(2);
            return;
        }
        if (_.get(departments, 'data', []).length === 0) {
            setStep(3);
            return;
        }
        setStep(4)
    }, [profile, company, departments]);

    const nextHandler = () => {
        setStep(step + 1);
    }

    const backHandler = () => {
        setStep(step - 1);
    }

    const isLoading = company.isFetching || departments.isFetching || profile.isFetching;

    if (isLoading){
        return <LoadingPage loading={setup.form.isPosting || isLoading}/>;
    }

    return (
        <>
            {step === 1 && <PersonalDetails nextHandler={nextHandler}/>}
            {step === 2 && <CompanyDetails backHandler={backHandler} nextHandler={nextHandler}/>}
            {step === 3 && <DeparmentDetails backHandler={backHandler} nextHandler={nextHandler}/>}
            {step === 4 && <Redirect to="/"/>}
        </>
    );
}
