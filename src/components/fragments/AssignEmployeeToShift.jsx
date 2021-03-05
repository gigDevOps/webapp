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
    const user = useSelector((store) => store.user.data);
    const isFetchingEmployees = useSelector((store) => store.employees.isFetching);
    const {register, errors, handleSubmit, watch, control, setValue} = useForm({
        defaultValues: {
            employee_id: null,
        }
    });
    const dispatch = useDispatch();

    useEffect(() => {
        register("employee_id");
        dispatch(fetch("employees", "/candidate_profile"));
    }, [dispatch, register]);

    const onEmployeeChange = (e) => {
        setValue("employee_id", e[0].key);
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
        return {key: e.user.id, value: `${e.first_name} ${e.other_names}`}
    }) : [];

    const onSubmit = (data) => {
        dispatch(create('shift_allocation', '/shift_allocation', {
            shift_id: shiftID,
            supervisor_id: user.id,
            ...data
        }, () => {
            onSuccess();
        }));
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="none" style={{ maxWidth: "30rem"}}>
            <InputGroup label="Employee" tooltip="Nothing to help">
                <Autoselect
                    options={employeesOptions}
                    isCreatable={true}
                    maxSelection={1}
                    renderCreation={(query) => {
                        showCreateEmployee();
                    }}
                    onChange={onEmployeeChange}
                />
            </InputGroup>
            <Button appearance="ghost" type="submit">Assign</Button>
        </form>
    )
}

AssignEmployeeToShift.prototype.propTypes = {
    shiftID: PropTypes.string.isRequired
}
