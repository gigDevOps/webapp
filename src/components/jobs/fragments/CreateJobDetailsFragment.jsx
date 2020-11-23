import React, {useState} from "react";
import get from "lodash/get";
import {useFieldArray, useForm, Controller} from "react-hook-form";
import {useStateMachine} from "little-state-machine";

import {AccordionContents, AccordionTitle, AccordionWrapper} from "../../../interface/Accordion";
import {Input, InputAlignment, InputGroup, Label, Textarea} from "../../../interface/FormElements";
import CreateJobReducer from "./CreateJobReducer";

export default function (props) {
    const {register, handleSubmit, control} = useForm();
    const {action, state} = useStateMachine(CreateJobReducer);
    const {fields, append, remove} = useFieldArray({control, name: "shifts"});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const onSubmit = data => {
        action(data);
        props.onSubmit(2);
    }
    const active = () => {
        props.setActive(1);
    }

    const keys = ["data.positions", "data.title", "data.description"];
    const summary = keys.map((k) => get(state, k)).join(", ");
    return (
        <AccordionWrapper>
            <AccordionTitle title="Job Details" onClick={active}>
                {summary}
            </AccordionTitle>
            <AccordionContents style={{display: props.isVisible ? "block" : "none"}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputAlignment>
                        <InputGroup>
                            <Label>Job Title</Label>
                            <Input name="title" ref={register({required: true})}/>
                        </InputGroup>
                        <InputGroup>
                            <Label>Job Description</Label>
                            <Textarea name="description" ref={register({required: false})}/>
                        </InputGroup>
                        <InputGroup>
                            <Label>Ref. Order</Label>
                            <Input name="ref_order" ref={register({required: false})}/>
                        </InputGroup>
                        <InputGroup>
                            <Label>Positions to be filled</Label>
                            <Input name="positions" ref={register({required: true})} type="number"/>
                        </InputGroup>
                        <p>Shifts</p>
                        <div style={{background: "#efefef", padding: "1rem", margin: "0 0 1rem 0"}}>
                            {fields.map((field, index) => (
                                <div key={field.id}>
                                    <InputGroup>
                                        <Label>Shift</Label>


                                        <button onClick={() => remove(index)}>Delete</button>
                                    </InputGroup>
                                </div>
                            ))}
                            <button onClick={() => {
                                append({
                                    address: '',
                                    headquarter: false
                                })
                            }}>Add shift
                            </button>
                        </div>
                        <InputGroup>
                            <Label>Job Address</Label>
                            <Input name="address" disabled value={get(state, "data.client.address.label")}/>
                        </InputGroup>
                        <InputGroup>
                            <Label>Job Briefing (Materials, dress code, etc.)</Label>
                            <Textarea name="brief"/>
                        </InputGroup>
                        <InputGroup>
                            <input type="submit"/>
                        </InputGroup>
                    </InputAlignment>
                </form>
            </AccordionContents>
        </AccordionWrapper>
    )
}