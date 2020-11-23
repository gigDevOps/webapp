import React from "react";
import get from "lodash/get";
import sum from "lodash/sum";
import moment from "moment";

import {AccordionContents, AccordionTitle, AccordionWrapper} from "../../../interface/Accordion";
import {useForm} from "react-hook-form";
import {useStateMachine} from "little-state-machine";
import CreateJobReducer from "./CreateJobReducer";
import {Input, InputAlignment, InputGroup, Label} from "../../../interface/FormElements";

export default function (props) {
    const { register, handleSubmit, watch } = useForm();
    const { action, state } = useStateMachine(CreateJobReducer);
    const onSubmit = data => {
        action(data);
        props.onSubmit(3);
    }
    const active = () => {
        props.setActive(2);
    }
    const keys = ["data.hour", "data.rate"];
    const summary = keys.map((k) => get(state, k)).join(", ");
    const shifts = get(state, "data.shifts", []).map((shift) => {
        return moment(shift.to).diff(shift.from, 'hours') * watch("rate")
    });

    return(
        <AccordionWrapper>
            <AccordionTitle title="Billing Details" onClick={active}>
                { summary }
            </AccordionTitle>
            <AccordionContents style={{ display: props.isVisible ? "block" : "none"}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputAlignment>
                        <InputGroup>
                            <Label>Hour rate</Label>
                            <Input type="number" name="rate" ref={register({ required: true })} />
                        </InputGroup>
                        <InputGroup>
                            <Label>Booking fee</Label>
                            <Input type="number" name="fee" ref={register({ required: true })} />
                        </InputGroup>
                        <InputGroup>
                            <Label>Total rate</Label>
                            <Input type="number" disabled value={watch("rate") * sum(shifts)} />
                        </InputGroup>
                        <input type="submit" />
                    </InputAlignment>
                </form>
            </AccordionContents>
        </AccordionWrapper>
    )
}