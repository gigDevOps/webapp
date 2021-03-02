import React, {useState} from 'react';
import _ from 'lodash';
import moment from "moment";
import {Button, ButtonToolbar} from "rsuite";
import {useDispatch} from "react-redux";
import {create} from "../../actions/generics";
import {useHistory, useParams} from "react-router-dom";
import AssignEmployeeToShift from "../fragments/AssignEmployeeToShift";
import GModal from "../../interface/GModal";

export default function ShiftContainer({ shift, onClose }) {
    const [isAssigningEmployee, setIsAssigningEmployee] = useState(false);
    console.log(shift);
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();

    const startDate = shift.shiftstartdate ? moment.utc(shift.shiftstartdate) : '';
    const startTime = shift.shiftstartdate ? moment.utc(shift.shiftstartdate) : '';
    const endTime = shift.shiftenddate ? moment.utc(shift.shiftenddate) : '';
    const employeeName =  [_.get(shift, 'user_assigned.first_name'), _.get(shift, 'user_assigned.other_names')].join(" ");

    return(
        <GModal autoResize title="Shift details" onClose={onClose}>
            <table>
                <tbody>
                    <Row value={employeeName.length < 2 ? "Not Assigned" : employeeName} label="Employee" />
                    <Row value={startDate.format('LL')} label="Date" />
                    <Row value={startTime.format('LL')} label="Time" />
                    <Row value={shift.location ? shift.location.name : "Not assigned"} label="Location" />
                    <Row value={shift.position ? shift.position.name : "Not assigned"} label="Position (role)" />
                    <Row value={shift.is_fullfilled ? "Yes" : "No"} label="Fullfilled" />
                    <Row value={shift.minutes_worked} label="Minutes worked" />
                    <Row value={shift.shift_clock_in_time} label="Clock-in time" />
                    <Row value={shift.shift_clock_out_time} label="Clock-out time" />
                </tbody>
            </table>
            <ButtonToolbar style={{marginTop: '1rem'}}>
                    {
                        !shift.is_finished && !shift.is_started && _.has(shift, 'user_assigned.id') && (
                            <Button appearance="primary" color="red" onClick={() => {
                                const path = ['/shifts', params.id, 'unassign'].join("/");
                                dispatch(create('shift', path, {}, (res) => {
                                    history.push('/schedules/shifts/' + res.data.shift.id + history.location.search);
                                }));
                            }}>Mark as unassigned</Button>
                        )
                    }
                    {
                        !shift.is_finished && !shift.is_started && !_.has(shift, 'user_assigned.id') && (
                            <Button appearance="primary" onClick={() => {
                                setIsAssigningEmployee(!isAssigningEmployee);
                            }}>Assign shift</Button>
                        )
                    }
                    {
                        !shift.is_finished && !shift.is_started && _.has(shift, 'user_assigned.id') && (
                            <Button appearance="primary" color="cyan">Mark as sick leave</Button>
                        )
                    }
                    {
                        !shift.is_finished && !shift.is_started && _.has(shift, 'user_assigned.id') && (
                            <Button appearance="ghost" color="cyan">Mark as no show</Button>
                        )
                    }
                    <Button appearance="link">Edit</Button>
            </ButtonToolbar>
            { isAssigningEmployee && <AssignEmployeeToShift
                onSuccess={(res) => {
                    setIsAssigningEmployee(false);
                    window.location.reload();
                    history.push('/schedules/shifts/' + res.data.shift.id + history.location.search);
                }}
                shiftID={params.id}
            /> }
        </GModal>
    )
}

const Row = ({ label, value}) => {
    return (
        <tr style={{paddingBottom: '1rem'}}>
            <td style={{fontWeight: 500, paddingRight: '2rem'}}>{label}:</td>
            <td>{value}</td>
        </tr>
    )
}
