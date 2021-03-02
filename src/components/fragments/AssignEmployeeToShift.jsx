import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Controller, useForm} from "react-hook-form";
import Autoselect from "../../interface/forms/Autoselect";
import {create, fetch} from "../../actions/generics";
import {useDispatch, useSelector} from "react-redux";
import {useModal} from "react-modal-hook";
import ReactModal from "react-modal";
import {H1} from "../../interface/paragraph/Titles";
import AddEmployee from "./AddEmployee";
import {InputGroup} from "../../interface/forms/InputGroup";
import {Button} from "rsuite";

export default function AssignEmployeeToShift({ shiftID, onSuccess }) {
    const employeesData = useSelector((store) => store.employees.data);
    const isFetchingEmployees = useSelector((store) => store.employees.isFetching);
    const {register, errors, handleSubmit, watch, control, setValue} = useForm({
        defaultValues: {
            employees: []
        }
    });
    const dispatch = useDispatch();

    useEffect(() => {
        register({name: "employees"});
        dispatch(fetch("employees", "/candidate_profile"));
    }, [dispatch, register]);

    const onEmployeeChange = (e) => {
        const employees = e.map((emp) => {
            return { id: emp.key, name: emp.value };
        })
        setValue("employees", employees.pop());
    }
    const [showCreateEmployee, hideCreateEmployee] = useModal(() => (
        <ReactModal isOpen style={{overlay: { zIndex: 9 }}} ariaHideApp={false}>
            <H1>Create a new employee</H1>
            <hr />
            <AddEmployee onCancel={hideCreateEmployee} onSuccess={() => {
                dispatch(fetch("employees", "/employees"));
                hideCreateEmployee()
            }} />
        </ReactModal>
    ))
    const employeesOptions = !isFetchingEmployees ? employeesData.map((e) => {
        return {key: e.id, value: `(${e.ext_ref || e.id.substr(0, 8)}) ${e.first_name} ${e.other_names}`}
    }) : [];

    const onSubmit = (data) => {
        const path = ['/shifts', shiftID, 'assign'].join("/");
        const res = dispatch(create('shift', path, data, () => {
            onSuccess();
        }));
        console.log("dispatch", res);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="none" style={{ maxWidth: "30rem"}}>
            <InputGroup label="Employee" tooltip="Nothing to help">
            <Controller
                as={
                    <Autoselect
                        options={employeesOptions}
                        isCreatable={true}
                        maxSelection={1}
                        renderCreation={(query) => {
                            showCreateEmployee();
                        }}
                        onChange={onEmployeeChange}
                    />
                } control={control} name="employees"/>
            </InputGroup>
            <Button appearance="ghost" type="submit">Assign</Button>
        </form>
    )
}

AssignEmployeeToShift.prototype.propTypes = {
    shiftID: PropTypes.string.isRequired
}
