import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Button} from "rsuite";
import {InputGroup} from "../../interface/forms/InputGroup";
import {useDispatch, useSelector} from "react-redux";
import LoadingPage from "../LoadingPage";
import {create, fetch} from "../../actions/generics";

export default function DepartmentCreate({ onSuccess, onFailure }) {
    const { register, handleSubmit, errors } = useForm({});
    const dispatch = useDispatch();
    const isDepartmentCreating = useSelector((store)=>store.organization.form.isPosting);
    const isFetchingUsers = useSelector((store)=>store.employees.isFetching);
    const users = useSelector((store)=>store.employees.data);
    
    useEffect(() => {
        dispatch(fetch('employees', '/candidate_profile'));
    }, []);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("user_id", data.user_id);
        dispatch(create('organization', '/organization', formData, onSuccess, onFailure));
    }
    
    return(
        <>
            <LoadingPage loading={isDepartmentCreating} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup label="Department name">
                    <input ref={register} name="name" placeholder="Department name" />
                    <p>{errors.name?.message}</p>
                </InputGroup>
                <InputGroup label="User" tooltip="Select the relevant user">
                    { isFetchingUsers && <p>Loading users...</p> }
                        {
                            !isFetchingUsers && users && (
                                <select name="user_id" ref={register} >
                                    {
                                        users.map((u) => {
                                            return <option value={u.user_id}>{u.first_name} {u.other_names}</option>
                                        })
                                    }
                                </select>
                            )
                        }
                    <p>{errors.shift_id?.message}</p>
                </InputGroup>
                <Button appearance="primary" type="submit">Save</Button>
            </form>
        </>
    )
}