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

import AddShifts from "./AddShifts";
import {H1, PageTitle} from "../../interface/paragraph/Titles";
import {fetch} from "../../actions/generics";
import ShiftInCalendar from "../../interface/Scheduler/ShiftInCalendar";
import DatePicker from '../../interface/DatePicker/DatePicker';
import { CGridBlock, CGridWrapper } from "../../interface/Scheduler/CGrid";
import LoadingView from "../../interface/LoadingView";
import AddEmployee from "../fragments/AddEmployee";
import ShiftContainer from "./ShiftContainer";
import GModal from "../../interface/GModal";
import {ActionBar} from "../../interface/ActionBar";
import GroupCardsStats from "../../interface/Card/GroupCardsStats";
import Card from "../../interface/Card/Card";
import {SimpleTable} from "../../interface/Tables/SimpleTable";
import Avatar from "react-avatar";

const formatDateTitle =  'ccc, MMM dd, yyyy';

export default function SchedulesContainer() {

    const rosters = useSelector((store) => store.rosters.data);
    const isFetchingRosters = useSelector((store) => store.rosters.isFetching);
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
        dispatch(fetch('rosters', '/rosters', {
            start: moment(period.start).format(),
            end: moment(period.end).format()
        }));
        dispatch(fetch('rosters_stats', '/rosters_stats', {
            start: moment(period.start).format(),
            end: moment(period.end).format()
        }));
    }

    const [showCreateShift, hideCreateShift] = useModal(() => (
        <GModal title="Create a new shift" onClose={hideCreateShift}>
            <AddShifts onCancel={hideCreateShift} afterCreation={() => {
                update();
                hideCreateShift();
            }} />
        </GModal>
    ));

    const [showCreateEmployee, hideCreateEmployee] = useModal(() => (
        <GModal title="Create employee" onClose={hideCreateEmployee} autoResize>
            <AddEmployee onCancel={hideCreateEmployee} onSuccess={hideCreateEmployee} />
        </GModal>
    ))

    useEffect(() => {
        if(params.id) {
            const path = ['/shifts', params.id].join("/");
            dispatch(fetch('shift', path));
        } else {
            dispatch(fetch('rosters', '/rosters', {
                start: moment(period.start).format(),
                end: moment(period.end).format()
            }));
            dispatch(fetch('rosters_stats', '/rosters_stats', {
                start: moment(period.start).format(),
                end: moment(period.end).format()
            }));
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
    const groups = _.groupBy(rosters, 'user_assigned.id');

    let tunassigned = [];
    let tassigned = [];

    _.forEach(groups, (value, key) => {
        if(key === "undefined") {
            tunassigned.push({
                shifts: mapToCalendar(days, value)
            });
        } else {
            tassigned.push({
                employee: {
                    name: [_.get(value, '0.user_assigned.first_name'), _.get(value, '0.user_assigned.other_names')].join(" "),
                    first_name: _.get(value, '0.user_assigned.first_name'),
                    other_names: _.get(value, '0.user_assigned.other_names'),
                    id: _.get(value, '0.user_assigned.id'),
                    cost: _.reduce(value, (cost, v) => cost + _.get(v, 'price_per_hour', 0), 0)
                },
                shifts: mapToCalendar(days, value)
            });
        }
    });

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
                    <Button style={{ marginRight: '0.5rem'}} appearance="primary" size="md" onClick={showCreateShift}>Create shifts</Button>
                    <Button size="md" appearance="primary" color="blue" onClick={() => showCreateEmployee()}>Add employee</Button>
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