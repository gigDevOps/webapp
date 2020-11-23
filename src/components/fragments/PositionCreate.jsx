import React from "react";
import {useForm} from "react-hook-form";
import {InputGroup} from "../../interface/forms/InputGroup";
import {Button} from "rsuite";
import {useDispatch} from "react-redux";
import {create} from "../../actions/generics";

export default function PositionCreate({ onSuccess, onFailure }) {
    const { register, handleSubmit, errors } = useForm({});
    const dispatch = useDispatch();
    const onSubmit = (data) => {
        dispatch(create('position', '/positions', data, () => {
            onSuccess();
        }, () => {
            onFailure();
        }));
    }
    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup label="Role/Position title">
                    <input ref={register} name="name" placeholder="Role/Position title" />
                </InputGroup>
                <p>{ errors && errors.name}</p>

                <Button appearance="primary" type="submit">Save</Button>
            </form>
        </>
    )
}