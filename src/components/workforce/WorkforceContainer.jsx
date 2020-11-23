import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import _ from 'lodash';
import Plot from 'react-plotly.js';
import qs from "query-string";
import {useHistory, useLocation} from "react-router-dom";
import 'status-indicator/styles.css'
import { differenceInMinutes } from "date-fns";
import { AiOutlineInfoCircle } from "react-icons/ai";

import {fetch} from "../../actions/generics";
import DataTable from "../../interface/DataTable/DataTable";
import LoadingView from "../../interface/LoadingView";
import DatePicker from "../../interface/DatePicker/DatePicker";
import {H1} from "../../interface/paragraph/Titles";
import {ActionBar} from "../../interface/ActionBar";
import {minutesToHoursMinutes} from "../../utils/time";

const defaultChart = {
    useResizeHandler: true,
    config: {
        displayModeBar: false,
        responsive: true
    },
    layout: {
        autosize: true,
        legend: { orientation: 'h'},
        barmode: 'stack',
        margin: { t: 30, l: 15, r: 15, b: 45}
    },
    style: {width: '100%', height: '250px'}
}

const columns = [
    { key: 'user_assigned.name', value: 'Name',
        render: (shift) => _.has(shift, 'user_assigned.first_name')
            ? [_.get(shift, 'user_assigned.first_name'), _.get(shift, 'user_assigned.other_names')].join(" ")
            : <span style={{ color: 'red'}}>Not assigned</span>
    },
    { key: 'role', value: 'Position (Role)' },
    {
        key: 'shift_start_time', value: 'Shift',
        render: (shift) => {
            return [
                moment.utc(shift.shift_start_time).format('hh:mm A'),
                moment.utc(shift.shift_end_time).format('hh:mm A'),
                ].join(" - ")
        }
    },
    { key: 'location.name', value: 'Location' },
    { key: 'status', value: 'Status', render: (s) => <ShiftStatus shift={s} /> },
    { key: 'user_assigned.wage', value: 'Est. Wages'}
];

const ShiftStatus = ({shift}) => {
    if(_.get(shift, 'shift_clock_out_time')) {
        return <><status-indicator active /> { minutesToHoursMinutes(_.get(shift, 'minutes_worked')) } <AiOutlineInfoCircle /></>
    }
    if(_.get(shift, 'shift_clock_in_time')) {
        const diffMinutes = differenceInMinutes(new Date(_.get(shift, 'shift_clock_in_time')), new Date());
        return <><status-indicator positive pulse /> { minutesToHoursMinutes(diffMinutes) } <AiOutlineInfoCircle /> </>
    }

    return '';
}

export default function WorkforceContainer() {
    const rosters = useSelector((store) => store.rosters.data);
    const isFetchingRosters = useSelector((store) => store.rosters.isFetching);
    const workforce_chart = useSelector((store) => store.workforce_chart.data);
    const location = useLocation();
    const query = qs.parse(location.search);
    const start = moment(query.start || new Date()).startOf('day');
    const end = moment(query.start ||  new Date()).endOf('day');
    const [period, setPeriod] = useState({ start, end })

    const history = useHistory();
    const dispatch = useDispatch();

    const onChangeTimePeriod = (selection) => {
        const start = moment(selection.startDate).startOf('day').toDate();
        const end = moment(selection.endDate).endOf('day').toDate();
        const query = qs.stringify({ start: moment(start).format('YYYY-MM-DD')});
        history.push(['/workforce', query].join('?'));
        setPeriod({ start: start, end: end });
    }

    useEffect(() => {
        dispatch(fetch('rosters', '/rosters', {
            start: moment(period.start).format(),
            end: moment(period.end).format()
        }));
        dispatch(fetch('workforce_chart', '/workforce_chart', {
            start: moment(period.start).format(),
            end: moment(period.end).format()
        }));
    }, [dispatch, period])

    return (
        <>
            <H1>Workforce Overview</H1>
            <ActionBar>
                <DatePicker
                    onChange={(dates) => {
                        onChangeTimePeriod(dates);
                    }}
                    startDate={period.start}
                    endDate={period.end}
                    nextPeriod={1}
                    prevPeriod={-1}
                    hoverRange="day"
                />
            </ActionBar>
        <LoadingView isFetching={isFetchingRosters}>
            <div style={{width: '100%'}}>
                {
                    !isFetchingRosters && (
                        <Plot
                            data={workforce_chart}
                            {...defaultChart}
                        />
                    )
                }
            </div>
            <DataTable dataSource={rosters} isFetching={isFetchingRosters} columns={columns} />
        </LoadingView>
        </>
    )
}