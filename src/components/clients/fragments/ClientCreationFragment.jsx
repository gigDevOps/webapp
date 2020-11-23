import React from "react";
import PageTitle from "../../../interface/PageTitle";
import {useFieldArray, useForm} from "react-hook-form";
import {Input, InputGroup, Label} from "../../../interface/FormElements";
import {useDispatch} from "react-redux";
import {create} from "../../../actions/generics";
import {API_CLIENTS} from "../../../services/Resources";

export default function (props) {
    const { onSuccess } = props;
    const { register, handleSubmit, control } = useForm();
    const { fields, append, remove } = useFieldArray(
        {
            control, // control props comes from useForm (optional: if you are using FormContext)
            name: "company_locations", // unique name for your Field Array
            // keyName: "id", default to "id", you can change the key name
        }
    );
    const dispatch = useDispatch();

    const onSubmit = (data) => {
        console.log(data);
        dispatch(create('company', API_CLIENTS, data, () => {
            onSuccess();
        }));
    }
    return(
        <>
            <PageTitle>Create new Client</PageTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup>
                    <Label>Company Name</Label>
                    <Input name="name" ref={register({required: true})} />
                </InputGroup>
                <p>Locations</p>
                {fields.map((field, index) => (
                    <div key={field.id} style={{ borderBottom: "1px solid #000"}}>
                        <InputGroup>
                            <Label>Address 1</Label>
                            <Input type="text" name={`company_locations[${index}].address_1`} ref={register({required: true})} />
                        </InputGroup>
                        <InputGroup>
                            <Label>Address 2</Label>
                            <Input type="text" name={`company_locations[${index}].address_2`} ref={register({required: false})} />
                        </InputGroup>
                        <InputGroup>
                            <Label>Latitude</Label>
                            <Input type="text" name={`company_locations[${index}].latitude`} ref={register({required: true})} />
                        </InputGroup>
                        <InputGroup>
                            <Label>Longitude</Label>
                            <Input type="text" name={`company_locations[${index}].longitude`} ref={register({required: true})} />
                        </InputGroup>
                        <InputGroup>
                            <Label>Headquarter</Label>
                            <Input type="checkbox"  name={`company_locations[${index}].headquarter`} ref={register} />
                        </InputGroup>
                        <button onClick={() => remove(index)}>Delete</button>
                    </div>
                    ))}
                    <button onClick={() => {
                        append({
                            address: '',
                            headquarter: false
                        })
                    }}>Add Location</button>

                <Input type="submit" />
            </form>
        </>
    )
}