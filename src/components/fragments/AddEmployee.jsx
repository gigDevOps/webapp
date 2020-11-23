import React, {useState} from 'react';
import { Button } from "rsuite";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import "yup-phone";
import {useDispatch} from "react-redux";
import {create} from "../../actions/generics";
import {InputGroup} from "../../interface/forms/InputGroup";

const schema = yup.object().shape({
    first_name: yup.string().required(),
    other_names: yup.string().required(),
    email: yup.string().email(),
    phone_number: yup.string().phone().required()

});

export default function AddEmployee({ onCancel, onSuccess, ...props}) {
    const [serverErrors, setServerErrors] = useState({});
    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema)
    });
    const dispatch = useDispatch();

    const onSubmit = (data) => {
        dispatch(create('user', '/employees', data, onSuccess, (res) => {
            if(res.data) {
                setServerErrors(res.data);
            }
        }));
    }

    return (
        <>
            { serverErrors.msg && <p>{serverErrors.msg}</p>}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="none">
                <InputGroup label="Name">
                    <input type="text" autoComplete="none" placeholder="First name" name="first_name" ref={register} />
                    <input type="text" autoComplete="none" placeholder="Other names" name="other_names" ref={register} />
                    <p>{errors.first_name?.message}</p>
                    <p>{errors.other_names?.message}</p>
                </InputGroup>
                <InputGroup label="Mobile Phone Number">
                    <input type="text" autoComplete="none" placeholder="Mobile phone number (254xxx)" name="phone_number" ref={register} />
                    <p>{errors.phone_number?.message}</p>
                </InputGroup>
                <InputGroup label="Email">
                    <input type="email" autoComplete="none" placeholder="Employee email" name="email" ref={register} />
                    <p>{errors.email?.message}</p>
                </InputGroup>
                <InputGroup label="Employee ID">
                    <input type="text" autoComplete="none" placeholder="Employee ID" name="ext_ref" ref={register} />
                </InputGroup>
                <InputGroup label="Active account">
                    <input type="checkbox" name="enabled" ref={register} />
                </InputGroup>
                <div style={{display: 'none'}}>
                <InputGroup label="Wages" tooltip="(wages set by company policies)">
                    <input type="text" name="wages" ref={register} value={15} disabled={true}  />
                </InputGroup>
                </div>

                <Button appearance="primary" type="submit">Save</Button>
            </form>
        </>
    )
}