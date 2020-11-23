import React from "react";
import {Controller, useForm} from "react-hook-form";
import {InputGroup} from "../../interface/forms/InputGroup";
import {Button} from "rsuite";
import Autoselect from "../../interface/forms/Autoselect";
import {USER_ROLES} from "../../permissions";
import {useDispatch} from "react-redux";
import {create} from "../../actions/generics";

export default function MembersPermissionUpdate({ onSuccess, user }) {
    const dispatch = useDispatch();
    const { setValue, errors, control, handleSubmit } = useForm({
        defaultValues: {
            roles: user.roles
        }
    });

    const onSubmit = (data) => {
        dispatch(create('member', `/users/${user.id}`, data, () => {
            onSuccess();
        }))
    }

    const options = USER_ROLES.map((r) => ({ key: r, value: r.substring(5).toUpperCase()}));
    const onPermissionChange = (e) => {
        const permissions = e.map((v) => ({ id: v.key, name: v.value}));
        setValue("roles", permissions);
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup label="Roles">
                    <Controller
                        as={
                            <Autoselect
                                options={options}
                                onChange={onPermissionChange}
                            />
                        } control={control} name="roles"/>
                </InputGroup>

                <Button appearance="primary" type="submit">Save</Button>
            </form>
        </>
    )
}