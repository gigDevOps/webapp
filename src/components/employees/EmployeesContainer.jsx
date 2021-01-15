import React, {useEffect} from "react";
import {H1} from "../../interface/paragraph/Titles";
import DataTable from "../../interface/DataTable/DataTable";
import Avatar from "react-avatar";
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../../actions/generics";
import {Button} from "rsuite";
import {useModal} from "react-modal-hook";
import AddEmployee from "../fragments/AddEmployee";
import {NavLink} from "react-router-dom";
import GModal from "../../interface/GModal";
import {ActionBar} from "../../interface/ActionBar";

const columns = [
    {
        key: 'first_name', value: 'Name', render: (c) => {
            const name = [c.first_name, c.other_names].join(" ");
            return(
                <NavLink to={`/workforce/employees/${c.id}`}><Avatar name={name} round size={24} /> {name} </NavLink>
            )
        }
    },
    { key: 'role', value: 'Role(s)' },
    { key: 'phone_no', value: 'Phone Number'},
    { key: 'email', value: 'Email' },
    { key: 'last_activity', value: 'Last Activity'},
    { key: 'actions', value: 'Actions' }
]

export default function EmployeesContainer() {
    const employees = useSelector((store) => store.employees.data);
    const isFetchingEmployees = useSelector((store) => store.employees.isFetching);

    const dispatch = useDispatch();
    const [showCreateEmployee, hideCreateEmployee] = useModal(() => (
        <GModal title="Create a new Employee" autoResize onClose={hideCreateEmployee}>
            <AddEmployee onCancel={hideCreateEmployee} onSuccess={() => {
                dispatch(fetch('employees', '/candidate_profile'));
                hideCreateEmployee();
            }} />
        </GModal>
    ))
    useEffect(() => {
        dispatch(fetch('employees', '/candidate_profile'));
    }, [dispatch]);
    return(
        <>
        <H1>Employees</H1>
            <ActionBar>
                <Button appearance="primary" onClick={showCreateEmployee}>Create employee</Button>
            </ActionBar>
            <DataTable dataSource={employees} columns={columns} isFetching={isFetchingEmployees} />
        </>
    )
}