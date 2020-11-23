import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useForm, Controller} from "react-hook-form";
import _ from "lodash";

import {InputGroup} from "../../interface/forms/InputGroup";
import Autoselect from "../../interface/forms/Autoselect";
import RRule from "rrule";
import {Button} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {create, fetch} from "../../actions/generics";
import moment from "moment";
import {useModal} from "react-modal-hook";
import AddEmployee from "../fragments/AddEmployee";
import GModal from "../../interface/GModal";
import PositionCreate from "../fragments/PositionCreate";
import LocationCreate from "../fragments/LocationCreate";

export default function AddShifts({onCreation, afterCreation, onCancel}) {
    const employeesData = useSelector((store) => store.employees.data);
    const isFetchingEmployees = useSelector((store) => store.employees.isFetching);
    const locations = useSelector((store) => store.locations.data);
    const isFetchingLocations = useSelector((store) => store.locations.isFetching);
    const positions = useSelector((store) => store.positions.data);
    const isFetchingPositions = useSelector((store) => store.positions.isFetching);
    const timezones = useSelector((store) => store.timezones.data);
    const isFetchingTimezones = useSelector((store) => store.timezones.isFetching);

    const dispatch = useDispatch();

    const {register, errors, handleSubmit, watch, control, setValue} = useForm({
        defaultValues: {
            repeatable: "no",
            terminationDate: "sameDay",
            employees: []
        }
    });

    const {
        hasTemporaryWorkers, repeatable, nemployees, beginningDate,
        terminationTime, repeatPattern, timezone,
        untilWhen, RSun, RMon, RTue, RWed, RThu, RFri, RSat
    } = watch();

    const onSubmit = data => {
        dispatch(create('shifts', '/shifts', data, () => {
            afterCreation();
        }))
    }
    useEffect(() => {
        register({name: "employees"});
        dispatch(fetch("employees", "/employees"));
        dispatch(fetch("locations", "/locations"));
        dispatch(fetch("positions", "/positions"));
        getTimezones();
    }, [dispatch, register]);

    const onEmployeeChange = (e) => {
        const employees = e.map((emp) => {
            return { id: emp.key, name: emp.value };
        })
        setValue("employees", employees);
    }

    const onPositionChange = (e) => {
        const positions = e.map((v) => ({ id: v.key, name: v.value}));
        setValue("positions", positions);
    }

    const onLocationChange = (e) => {
        const location = _.find(locations, { id: _.get(e, '0.key', null) });
        console.log(e.key, location);
        setValue("timezone", _.get(location, 'timezone', null));
    }

    const getTimezones = () => {
        if(!timezones || timezones.length < 1) {
            dispatch(fetch('timezones', '/timezones'), {},  () => {
                setValue('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
            });
        }
    }

    const onIntervalChange = () => {
        if(repeatable === 'weekly' && untilWhen && beginningDate && terminationTime) {
            const dtstart = moment(beginningDate);
            const dtend = moment(untilWhen);
            if(dtstart.isValid() && dtend.isValid()) {
                var frequency = [];
                if(RSun) frequency.push(RRule.SU);
                if(RMon) frequency.push(RRule.MO);
                if(RTue) frequency.push(RRule.TU);
                if(RWed) frequency.push(RRule.WE);
                if(RThu) frequency.push(RRule.TH);
                if(RFri) frequency.push(RRule.FR);
                if(RSat) frequency.push(RRule.SA);

                const rule = new RRule({
                    freq: RRule.WEEKLY,
                    until: dtend.toDate(),
                    byweekday: frequency,
                    interval: 1,
                    dtstart: dtstart.toDate()

                }, true);

                setValue("repeatPattern", rule);
            }

        } else if(repeatable === "no") {
            setValue("repeatPattern", undefined);
        }
    }

    const repeat = repeatPattern && moment(repeatPattern).isValid() ? RRule.fromString(repeatPattern) : undefined;
    const timetable = repeat ? repeat.all().slice(0, 10).map((date) => {
        return <p key={date.toString()}>{date.toString()}</p>;
    }) : "";

    const employeesOptions = !isFetchingEmployees ? employeesData.map((e) => {
        return {key: e.id, value: `(${e.ext_ref || e.id.substr(0, 8)}) ${e.first_name} ${e.other_names}`}
    }) : [];
    const employees = watch("employees");

    const locationsOptions = !isFetchingLocations ? locations.map((e) => {
        return {key: e.id, value: `(${e.ext_ref || e.id.substr(0, 8)}) ${e.name}`, timezone: e.timezone }
    }) : [];

    const positionsOptions = !isFetchingPositions ? positions.map((e) => {
        return {key: e.id, value: `(${e.ext_ref || e.id.substr(0, 8)}) ${e.name}`}
    }) : [];

    const [showCreateEmployee, hideCreateEmployee] = useModal(() => (
        <GModal autoResize title="Create a new Employee" onClose={hideCreateEmployee}>
            <AddEmployee onCancel={hideCreateEmployee} onSuccess={() => {
                dispatch(fetch("employees", "/employees"));
                hideCreateEmployee()
            }} />
        </GModal>
    ))

    const [showCreatePosition, hideCreatePosition] = useModal(() => (
        <GModal autoResize title="Create new position/role" onClose={hideCreatePosition}>
            <PositionCreate onSuccess={() => {
                dispatch(fetch('positions', '/positions'));
                hideCreatePosition();
            }} />
        </GModal>
    ));
    const [showCreateLocation, hideCreateLocation] = useModal(() => (
        <GModal title="Create new Location" onClose={hideCreateLocation}>
            <LocationCreate onSuccess={() => {
                dispatch(fetch('locations', '/locations'));
                hideCreateLocation();
            }} />
        </GModal>
    ));

    return (
        <div style={{display: "flex"}}>
            <div style={{width: "65%"}}>
                <form key={"AddShiftForm"} onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup label="No. Employees" tooltip="Number of employees with this shift">
                        <input name="nemployees" type="integer" ref={register({require: true})}/>
                        {errors.nemployees && <span>You need to input how many employees for this shift</span>}
                    </InputGroup>
                    <InputGroup label="Employee" tooltip="Nothing to help">
                        <Controller
                            as={
                                <Autoselect
                                    options={employeesOptions}
                                    isCreatable={true}
                                    renderCreation={(query) => {
                                        showCreateEmployee();
                                    }}
                                    onChange={onEmployeeChange}
                                />
                            } control={control} name="employees"/>
                    </InputGroup>
                    <InputGroup label="Locations" tooltip="Nothing to help">
                        <Controller
                            render={({ onChange }) => (
                                <Autoselect
                                    options={locationsOptions}
                                    isCreatable={true}
                                    renderCreation={(query) => {
                                        showCreateLocation();
                                    }}
                                    onChange={(e) => {
                                        onChange(e);
                                        onLocationChange(e);
                                    }}
                                />
                            )} control={control} name="locations" defaultValue={null}/>
                    </InputGroup>
                    <InputGroup label="Positions/Roles" tooltip="Nothing to help">
                        <Controller
                            as={
                                <Autoselect
                                    options={positionsOptions}
                                    isCreatable={true}
                                    renderCreation={(query) => {
                                        showCreatePosition();
                                    }}
                                    onChange={onPositionChange}
                                />
                            } control={control} name="positions" defaultValue={null}/>
                    </InputGroup>
                    <InputGroup label="Shift Duration">
                        <input name="beginningDate" onChange={onIntervalChange} type="date" ref={register({required: true})}/>
                        <input name="beginningTime" onChange={onIntervalChange} type="time" ref={register({required: true})}/>
                        to
                        <select ref={register} onChange={onIntervalChange} name="terminationDate">
                            <option value="sameDay">Same day</option>
                            <option value="nextDay">Next day</option>
                        </select>
                        <input name="terminationTime" onChange={onIntervalChange} type="time" ref={register({required: true})}/>
                    </InputGroup>
                    {errors.beginning && <span>You must select the shift</span>}
                    <InputGroup label="Timezone" tooltip="Select the timezone for this location">
                        { isFetchingTimezones && <p>Loading timezones...</p> }
                        {
                            !isFetchingTimezones && timezones && (
                                <select name="timezone" ref={register} >
                                    {
                                        timezones.map((t) => {
                                            return <option key={t.key} value={t.key}>{t.value}</option>
                                        })
                                    }
                                </select>
                            )
                        }
                        <p>{errors.name?.message}</p>
                    </InputGroup>
                    <InputGroup label="Repeat">
                        <select ref={register} name="repeatable" onChange={onIntervalChange}>
                            <option value="weekly">Weekly</option>
                            <option value="no">Never</option>
                        </select>
                    </InputGroup>
                    {
                        repeatable !== 'no' && (
                            <>
                                <textarea hidden={true} ref={register} name="repeatPattern" />
                            <InputGroup label={"Days"}>
                                {
                                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((e) => {
                                        return <React.Fragment key={e}>
                                            <input type="checkbox" onChange={onIntervalChange} name={`R${e}`} ref={register} /> {e}
                                        </React.Fragment>
                                    })
                                }
                            </InputGroup>
                            <InputGroup label="Repeat until">
                                <input type="date" name="untilWhen" onChange={onIntervalChange} ref={register}/>
                            </InputGroup>
                            </>
                        )
                    }

                    <InputGroup label="Minimum Hours">
                        <input name="hours" type="integer" ref={register({required: true})}/>
                    </InputGroup>
                    {errors.hours && <span className="input-error">You need to set a minimum amount of hours</span>}

                    <InputGroup label="Temporary Workers">
                        <input type="checkbox" name="hasTemporaryWorkers" ref={register}/> Send a temporary worker if
                        shift
                        is empty
                    </InputGroup>
                    {
                        !hasTemporaryWorkers
                            ? ""
                            :
                            <>
                                <p>Send confirmation request to employee at</p>
                                <InputGroup label="Confirm at">
                                    <input type="time" ref={register({required: true})} name="timeToAdvertise"/>
                                </InputGroup>
                                <p>Send temporary worker candidates if confirmation not received by</p>
                                <InputGroup label="Send by">
                                    <input type="time" ref={register({required: true})} name="sendCandidateBy"/>
                                </InputGroup>
                                <InputGroup label="Number of candidates">
                                    <input type="integer" ref={register({required: true})} name="candidatesMax"/>
                                </InputGroup>
                            </>
                    }
                    <Button type="submit" appearance="primary">Save shift(s)</Button>
                </form>
            </div>
            <div style={{padding: "1rem", margin: "0 0 0 1rem", background: "#F3F4F3", flexGrow: "1"}}>
                <p style={{color: '#555', fontWeight: 500}}><em>Preview of the shift</em></p>
                { nemployees && <p>You are creating a shift for {nemployees} employee{nemployees > 1 ? "s" : ""}.</p> }
                { employees.length > 0 && <p>{(employees.map((e) => e.value)).join(", ")} will be assigned to this shift.</p> }
                {
                    nemployees && (
                        nemployees - employees.length === 0
                        ? <p>All the shifts have been filled up</p>
                        : nemployees - employees.length > 0
                        ? <p>There are {nemployees - employees.length} shifts remaining to be filled out, which { hasTemporaryWorkers ? "will be filled out with temporary workers" : "are still unassigned."}</p>
                        : <p>You have too many employees for this shift</p>
                    )
                }
                { repeat && <p>You are creating {repeat.all().length} shifts</p>}
                { timetable }
            </div>
        </div>
    )
}
AddShifts.prototype.propTypes = {
    onCancel: PropTypes.func
}
AddShifts.defaultProps = {
    onCancel: () => {
    }
}
