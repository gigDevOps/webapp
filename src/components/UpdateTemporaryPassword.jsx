import React from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {InputGroup} from "../interface/forms/InputGroup";
import {Button} from "rsuite";
import {create} from "../actions/generics";
import {H1} from "../interface/paragraph/Titles";

export default function UpdateTemporaryPassword({ user, onSuccess }) {
    const { register, errors, watch, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const onSubmit = (data) => {
        dispatch(create('user', '/user', data, () => {
            window.location.reload();
        }));
    }

    const { password, repeat } = watch();

    return (
        <div style={{ width: "100%"}}>
            <div style={{ width: "90%", maxWidth: '40rem', margin: '5% auto'}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <H1>Please update your temporary password</H1>

                    <InputGroup label="New password">
                        <input type="password" name="password" ref={register({
                             required: "You must specify a password"
                        })} />
                    </InputGroup>
                    {errors.password && <p>{errors.password.message}</p>}
                    <InputGroup label="Repeat password">
                        <input type="password" name="repeat" ref={register({
                            validate: (value) => value === watch('password')
                        })} />
                    </InputGroup>
                    <p>{errors.repeat && "Passwords must match"}</p>

                    <Button appearance="primary" type="submit">Save</Button>
                </form>
            </div>
        </div>
    )
}