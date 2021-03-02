import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import PersonalDetails from "./PersonalDetails";
import CompanyDetails from "./CompanyDetails";
import LoadingPage from "../LoadingPage";
import _ from "lodash";
import DeparmentDetails from "./DeparmentDetails";
import {Redirect} from "react-router-dom";


export default function ProfileSetup () {
    const [step, setStep] = useState(1);
    const setup = useSelector((store) => store.setup);
    const user = useSelector((store) => store.user.data);
    const company = useSelector((store) => store.company);
    const profile = useSelector((store) => store.profile);
    const departments = useSelector((store) => store.departments);


    useEffect(() => {
        if (!_.get(profile, 'data.id', false)) {
            setStep(1);
            return
        }
        if (!_.get(company, 'data.id', false) && _.get(user, 'role.name') === 'Admin') {
            setStep(2);
            return;
        }
        if (_.get(departments, 'data', []).length === 0 && _.get(user, 'role.name') === 'Admin') {
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
        return <LoadingPage loading={isLoading}/>;
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
