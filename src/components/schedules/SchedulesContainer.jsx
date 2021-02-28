import React, {useEffect, useState} from "react";
import _, {get} from 'lodash';
import {useModal} from "react-modal-hook";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { eachDayOfInterval, format } from 'date-fns'
import moment from "moment";
import { Button } from "rsuite";
import styled from "styled-components";
import qs  from 'query-string';

import {PageTitle} from "../../interface/paragraph/Titles";
import {fetch} from "../../actions/generics";
import ShiftInCalendar from "../../interface/Scheduler/ShiftInCalendar";
import DatePicker from '../../interface/DatePicker/DatePicker';
import LoadingView from "../../interface/LoadingView";
import CreateDepartment from "../fragments/DepartmentCreate";
import ShiftContainer from "./ShiftContainer";
import GModal from "../../interface/GModal";
import {ActionBar} from "../../interface/ActionBar";
import GroupCardsStats from "../../interface/Card/GroupCardsStats";
import Card from "../../interface/Card/Card";
import {SimpleTable} from "../../interface/Tables/SimpleTable";
import Avatar from "react-avatar";
import CreateShift from "./CreateShift";

const formatDateTitle =  'ccc, MMM dd, yyyy';

export default function SchedulesContainer() {

    const [allocatedShifts, setAllocatedShifts] = React.useState([]);
    const [unAllocatedShifts, setUnAllocatedShifts] = React.useState([]);
    const isFetchingRosters = useSelector((store) => store.shifts.isFetching);
    const rostersStats = useSelector((store) => store.rosters_stats.data);
    const isFetchingRostersStats = useSelector((store) => store.rosters_stats.isFetching);
    const shift = useSelector((store) => store.shift.data);
    const isFetchingShift = useSelector((store) => store.shift.isFetching);

    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const location = useLocation();
    const query = qs.parse(location.search);

    const dayStartOfWeek = moment(query.start || new Date()).startOf('isoWeek').startOf('day');
    const dayEndOfWeek = moment(dayStartOfWeek).endOf('isoWeek').endOf('day');
    const [period, setPeriod] = useState({ start: dayStartOfWeek.toDate(), end: dayEndOfWeek.toDate() })

    const onChangeTimePeriod = (selection) => {
        const start = moment(selection.startDate).startOf('day').toDate();
        const end = moment(selection.endDate).endOf('day').toDate();
        const query = qs.stringify({ start: moment(start).format('YYYY-MM-DD')});
        history.push(['/schedules', query].join('?'));
        setPeriod({ start: start, end: end });
    }

    const update = () => {
        dispatch(fetch('shifts', '/shift_allocation', {
            start: moment(period.start).format(),
            end: moment(period.end).format()
        }, data => {
            setAllocatedShifts(data)
        }));
        dispatch(fetch('shifts', '/unallocated_shifts', {
            start: moment(period.start).format(),
            end: moment(period.end).format()
        }, data => {
            // setUnAllocatedShifts(data)
        }));
        dispatch(fetch('rosters_stats', '/rosters_stats', {
            start: moment(period.start).format(),
            end: moment(period.end).format()
        }));
    }

    const [showCreateDepartment, hideCreateDepartment] = useModal(() => (
        <GModal title="Create a new department" onClose={hideCreateDepartment} autoResize>
            <CreateDepartment onSuccess={hideCreateDepartment} onFailure={()=>{}} />
        </GModal>
    ));

    const [showCreateShift, hideCreateShift] = useModal(() => (
        <GModal title="Create a new shift" onClose={hideCreateShift} autoResize>
            <CreateShift
                onSuccess={() => {update(); hideCreateShift()}}
                onFailure={hideCreateShift}
            />
        </GModal>
    ));

    useEffect(() => {
        if(params.id) {
            const path = ['/shifts', params.id].join("/");
            dispatch(fetch('shift', path));
        } else {
            update()
        }
    },[dispatch, period, params])

    const mapToCalendar = (days, shifts) => {
        return _.map(days, (day) => {
            const s = _.filter(shifts, (o) => {
                return format(new Date(o.shift_start_time), 'yMMd') === format(day, 'yMMd');
            })
            return s || {};
        });
    }

    const days = eachDayOfInterval({ start: moment(period.start).toDate(), end: moment(period.end).toDate()});

    let tunassigned = [];
    let tassigned = [];

    tunassigned.push({
        shifts: mapToCalendar(days, unAllocatedShifts)
    })

    _.forEach(allocatedShifts,shift=>{
        tassigned.push({
            employee: {
                name: [_.get(shift.user.employeeprofile, 'first_name'), _.get(shift.user.employeeprofile, 'other_names')].join(" "),
                first_name: _.get(shift.user.employeeprofile, 'first_name'),
                other_names: _.get(shift.user.employeeprofile, 'other_names'),
                id: _.get(shift.user.employeeprofile, 'id'),
            },

            // shifts: mapToCalendar(days,  _.groupBy(allocatedShifts, shift.employee_id))
            shifts: mapToCalendar(days, allocatedShifts.map(al=>al.shift))
        });
    })

    const subtitle = [format(period.start, formatDateTitle), format(period.end, formatDateTitle)].join(" - ");
    const stats = [
        {
            text: 'Scheduled Shifts',
            value: _.reduce(rostersStats, (h, o) => {
                return h + o.scheduled_shifts;
            }, 0)
        },
        {
            text: 'Unscheduled Shifts',
            value: _.reduce(rostersStats, (h, o) => {
                return h + o.unscheduled_shifts;
            }, 0)
        },
        {
            text: 'Scheduled Hours',
            value: _.reduce(rostersStats, (h, o) => {
                return h + o.scheduled_hours;
            }, 0)
        },
        {
            text: 'Unscheduled Hours',
            value: _.reduce(rostersStats, (h, o) => {
                return h + o.unscheduled_hours;
            }, 0)
        },
        {
            text: 'Employees Working',
            value: _.reduce(rostersStats, (h, o) => {
                return ( h === undefined || o.employees > h ) ? o.employees : h
            }, 0)
        },
    ]
    return(
        <>
            {
                shift && shift.shift_start_time && params.id && <ShiftContainer onClose={() => {
                    const query = qs.stringify({ start: moment(period.start).format('YYYY-MM-DD')});
                    history.push(['/schedules', query].join('?'));
                }} shift={shift} />
            }
            <PageTitle title="Schedule" sub={subtitle} />
            <ActionBar>
                <div style={{ flexGrow: '1', display: 'flex', alignItems: 'center'}}>
                    <DatePicker
                        onChange={(dates) => {
                            onChangeTimePeriod(dates);
                        }}
                        startDate={dayStartOfWeek}
                        endDate={dayEndOfWeek}
                    />
                </div>
                <div>
                    <Button style={{ marginRight: '0.5rem'}} appearance="primary" color="green" size="md" onClick={showCreateDepartment}>Create department</Button>
                    <Button style={{ marginRight: '0.5rem'}} appearance="primary" size="md" onClick={showCreateShift}>Create shifts</Button>
                </div>
            </ActionBar>
            <LoadingView isFetching={isFetchingRostersStats}>
                <GroupCardsStats stats={stats} />
            </LoadingView>
            <Card hasPadding={false}>
                <div style={{width: "100%", whiteSpace: "nowrap", overflow: "auto", display: 'block'}}>
                    <SimpleTable>
                        <thead>
                        <tr>
                            <th />
                            {days.map((r) => {
                                return <th style={{fontWeight: 700, padding: "1rem"}}>{format(r, 'E d/M')}</th>
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colSpan={days.length + 1} style={{background: "#f3f8f9"}}>
                                <ScheduleSection>Unassigned Shits</ScheduleSection>
                            </td>
                        </tr>
                        <tr>
                            <td />
                            {
                                tunassigned.map((s) => {
                                    return s.shifts.map((a) => {
                                        if (typeof a.length < 1) {
                                            return <td />
                                        }
                                        return (
                                            <td style={{padding: 0}}>
                                                {
                                                    a.map((sh) => {
                                                        const id = sh.id ? sh.id : [
                                                            _.get(sh, 'shift_pattern.id'),
                                                            moment.utc(sh.shift_start_time).format('YYYY-MM-DD')
                                                        ].join('::');
                                                        return (

                                                            <ShiftInCalendar
                                                                textColor="#c53224"
                                                                borderColor="#c53224"
                                                                border="dashed"
                                                                key={id}
                                                                id={id}
                                                                shift={sh}
                                                                beginning={moment.utc(sh.shift_start_time)}
                                                                termination={moment.utc(sh.shift_end_time)}/>

                                                        )
                                                    })
                                                }
                                            </td>
                                        )
                                    })

                                })
                            }
                        </tr>
                        <tr>
                            <td colSpan={days.length + 1} style={{background: "#f3f8f9"}}>
                                <ScheduleSection>Assigned Shits</ScheduleSection>
                            </td>
                        </tr>
                        {_.sortBy(tassigned, ['employee.other_names', 'employee.first_name']).map((s) => {
                            return (
                                <tr key={s.employee.id}>
                                    <td style={{ whiteSpace: 'nowrap', border: "1px solid #dfdfdf", padding: '1rem'}}>
                                        <Avatar name={s.employee.name} round size={24} /> <span style={{paddingLeft: '1rem'}}>{s.employee.name}</span>
                                    </td>
                                    {s.shifts.map((a) => {
                                        if (typeof a.length < 1) {
                                            return <td key={Math.random(0, 1000)}/>
                                        }
                                        return (
                                            <td style={{ border: "1px solid #dfdfdf", padding: 0, maxWidth: '10rem' }}>
                                                {
                                                    a.map((sh) => {
                                                        const id = sh.id ?? [
                                                            _.get(sh, 'shift_pattern.id'),
                                                            moment.utc(sh.shift_start_time).format('YYYY-MM-DD')
                                                        ].join('::');

                                                        return <ShiftInCalendar
                                                            color="#239B62"
                                                            border="239B62"
                                                            textColor="#ffffff"
                                                            id={id}
                                                            key={id}
                                                            shift={sh}
                                                            beginning={moment.utc(sh.shift_start_time)}
                                                            termination={moment.utc(sh.shift_end_time)}/>
                                                    })
                                                }
                                            </td>
                                        )
                                    })
                                    }
                                </tr>
                            )

                        })
                        }

                        <tr>
                            <td colSpan={days.length + 1} style={{background: "#f3f8f9"}}>
                                <ScheduleSection>Summary</ScheduleSection>
                            </td>
                        </tr>

                        <SummaryRowTable data={rostersStats} field={'scheduled_hours'} title={"Scheduled Hours"} suffix={"hours"} />
                        <SummaryRowTable data={rostersStats} field={'unscheduled_hours'} title={"Unscheduled hours"} suffix={"hours"} />
                        <SummaryRowTable data={rostersStats} field={'employees'} title={"Employees"} suffix={"emp."} />

                        </tbody>
                    </SimpleTable>
                </div>
            </Card>
        </>
    )
}

const SummaryRowTable = ({data, title, field, suffix, prefix}) => {
    return (
        <tr>
            <td>{title}</td>
            { data && data.map((r) => {
                return <td><p>{prefix} {_.get(r, field)} {suffix}</p></td>
            })}
        </tr>
    )
}

const ScheduleSection = styled.p`
  text-transform: uppercase;
  font-size: 85%;
  font-weight: 700;
`
