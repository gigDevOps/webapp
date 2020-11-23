import React, {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import Select from "react-select";
import {useDispatch, useSelector} from "react-redux";
import filter from "lodash/filter";
import get from "lodash/get";

import {AccordionContents, AccordionTitle, AccordionWrapper} from "../../../interface/Accordion";
import {InputAlignment, InputGroup, Label} from "../../../interface/FormElements";
import CreateJobReducer from "./CreateJobReducer";
import {fetch} from "../../../actions/generics";
import {API_CLIENTS} from "../../../services/Resources";
import Portal from "../../../interface/Portals/Portal";
import ClientCreationFragment from "../../clients/fragments/ClientCreationFragment";

export default function (props) {
    const [locations, setLocations] = useState([]);
    const client = useState();
    const location = useState();
    const [isCreatingCompany, setIsCreatingCompany]  = useState(false);

    const { action, state } = useStateMachine(CreateJobReducer);
    const companies = useSelector((store) => store.companies.data);
    const {handleSubmit, control} = useForm();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetch('companies', API_CLIENTS));
    }, [dispatch])

    const onSubmit = data => {
        action(data);
        props.onSubmit(1);
    }
    const active = () => {
        props.setActive(0);
    }
    const clients_map = companies.map((c) => {
        return {
            value: c.id, label: c.name
        }
    })
    const locations_map = locations.map((c) => {
        return { value: c.id, label: c.address_1 }
    })

    const keys = ["data.client.name.label", "data.client.address.label"];
    const summary = keys.map((k) => get(state, k)).join(", ");

    return(
        <AccordionWrapper>
            <AccordionTitle title="Client Details" onClick={active}>
                { summary }
            </AccordionTitle>
            <AccordionContents style={{ display: props.isVisible ? "block" : "none"}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputAlignment>
                        <InputGroup>
                            <Label>Client Name</Label>
                            <div style={{width: '100%'}}>
                                <Controller as={Select} name="client.name" options={clients_map} onChange={([selected]) => {
                                    const locs = get(filter(companies, { id: selected.value })[0], 'company_locations');
                                    setLocations(locs);
                                    return selected;
                                }} value={client} control={control}/>
                                <button onClick={() => {
                                    setIsCreatingCompany(true);
                                }}>Create new Client</button>
                            </div>
                        </InputGroup>
                        <InputGroup>
                            <Label>Client Address</Label>
                            <div style={{width: '100%'}}>
                                <Controller as={Select} name="client.address" options={locations_map} onChange={([selected]) => {
                                    return selected;
                                }} value={location} control={control}/>
                                <button disabled>Create new Location</button>
                            </div>
                        </InputGroup>
                        <input type="submit" value="Continue to Job Details" />
                    </InputAlignment>
                </form>
            </AccordionContents>
            <Portal isOpen={isCreatingCompany} onClose={() => setIsCreatingCompany(false)}>
                <ClientCreationFragment onSuccess={() => {
                    setIsCreatingCompany(false);
                    dispatch(fetch('companies', API_CLIENTS));
                    active();
                }} />
            </Portal>
        </AccordionWrapper>
    )
}