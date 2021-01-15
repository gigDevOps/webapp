import React from "react";
import {useForm} from "react-hook-form";
import {InputGroup} from "../../interface/forms/InputGroup";
import {Button} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {create} from "../../actions/generics";
import LoadingPage from "../LoadingPage";

export default function PositionCreate({ onSuccess, onFailure }) {
    const { register, handleSubmit, errors } = useForm({});
    const isPositionCreating = useSelector((store)=>store.role.form.isPosting);
    const dispatch = useDispatch();
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("display_name", data.display_name);
        formData.append("description", data.description);
        dispatch(create('role', '/role', data, () => {
            onSuccess();
        }, () => {
            onFailure();
        }));
    }
    return(
        <>
            <LoadingPage loading={isPositionCreating} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup label="Role/Position title">
                    <input ref={register} name="name" placeholder="Role/Position title" />
                </InputGroup>
                <p>{ errors.name?.message}</p>
                <InputGroup label="Role/Position display name">
                    <input ref={register} name="display_name" placeholder="Role/Position display name" />
                </InputGroup>
                <p>{ errors.display_name?.message}</p>
                <InputGroup label="Role/Position description">
                    <input ref={register} name="description" placeholder="Role/Position description" />
                </InputGroup>
                <p>{ errors.description?.message}</p>

                <Button appearance="primary" type="submit">Save</Button>
            </form>
        </>
    )
}