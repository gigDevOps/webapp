import React from "react";
import {useStateMachine} from "little-state-machine";
import CreateJobReducer from "./CreateJobReducer";
import get from "lodash/get";
import {useDispatch} from "react-redux";
import {create} from "../../../actions/generics";

export default function (props) {
    const { state } = useStateMachine(CreateJobReducer);
    const dispatch = useDispatch();

    const preview = {
        ...state.data,
        company: {
            id: get(state, "data.client.name.value"),
            name: get(state, "data.client.name.label")
        },
        job_location: {
            id: get(state, "data.client.address.value")
        }
    }
    return(
        <>
            <pre>{JSON.stringify(preview, undefined, 2)}</pre>
            <button onClick={() => {
                dispatch(create('job', '/jobs', preview, () => {
                    props.onSuccess();
                }));
            }}>Save & Continue</button>
        </>
    )
}