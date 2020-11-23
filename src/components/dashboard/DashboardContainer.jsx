import React, {useEffect, useState} from "react";
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';
import Plot from 'react-plotly.js';
import {PageTitle} from "../../interface/paragraph/Titles";
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../../actions/generics";
import { get } from "lodash";
import ActivityLogWidget from "../activities/widgets/ActivityLogWidget";
import Card from "../../interface/Card/Card";
import {NavLink} from "react-router-dom";
import {SimpleTable} from "../../interface/Tables/SimpleTable";
import GroupCardsStats from "../../interface/Card/GroupCardsStats";

const formatDateTitle =  'ccc, MMM dd, yyyy';

export default function DashboardContainer() {
    const startDayOfMonth = startOfWeek(new Date());
    const endDayOfMonth = endOfWeek(new Date());
    const dashboard = useSelector((store) => store.dashboard.data);
    const isFetchingDashboard = useSelector((store) => store.dashboard.isFetching);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetch('dashboard', '/dashboard'));
    }, [dispatch]);

    if(isFetchingDashboard || (typeof dashboard === "undefined") || !dashboard.charts) return <p>Loading dashboard...</p>;

    const data = {
        useResizeHandler: true,
        config: {
            displayModeBar: false,
            responsive: true
        },
        layout: {
            autosize: true,
            legend: { orientation: 'h'},
            margin: { t: 15, l: 15, r: 15, b: 15},
            colorway: ["#F7951D"],
            yaxis: {
                rangemode: 'tozero',
                visible: false
            },
        },
        style: {width: '100%', height: '250px'},
        data: [
            { ...get(dashboard, 'charts.week', { }) }
        ]
    };


    const subtitle = [format(startDayOfMonth, formatDateTitle), format(endDayOfMonth, formatDateTitle)].join(" - ");
    return (
        <div>
            <PageTitle title={"Dashboard"} sub={subtitle} />
            <GroupCardsStats stats={get(dashboard, 'stats', [])} />
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <Card title="Current Week (hours)" width="35%" right={<NavLink to={"/timesheets"}>View Report ></NavLink>}>
                    <Plot {...data} />
                </Card>
                <Card title="Current month (hours)" width="30%">
                    <SimpleTable>
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th style={{textAlign: 'right'}}>Hours Worked</th>
                            </tr>
                        </thead>
                        <tbody>
                            { dashboard.charts.month.map((m) => {
                                return (
                                    <tr>
                                        <td>{m.text}</td>
                                        <td style={{textAlign: 'right'}}>{m.formatted}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </SimpleTable>
                </Card>
                <Card title="Upcoming shifts" width="35%" right={<NavLink to={"/schedules"}>View Schedule ></NavLink>}>
                    <UpcomingShifts shifts={dashboard.upcomings} />
                </Card>
            </div>
            <Card title="Recent Activity Logs" hasPadding={false}>
                <ActivityLogWidget showTitle={false} hasExternalPadding={false} hasToBeFetched={true} />
            </Card>
        </div>
    )
}

const UpcomingShifts = ({ shifts }) => {
    const [index, setIndex] = useState(0);
   return (
       <>
           <SimpleTable>
               <thead>
               <tr>
                   <th>Time</th>
                   <th>Shift</th>
               </tr>
               </thead>
               <tbody>
                    {shifts.map((s, i) => <DisplayShift key={i} shift={s} />)}
               </tbody>
           </SimpleTable>
       </>
   )
}

const DisplayShift = ({shift}) => {
    return (
        <tr>
            <td style={{color: "#4388DC", fontWeight: 600}}>
                <p>{ format(parseISO(shift.shift_start_time), 'hh:mm a') }</p>
                <p>{ format(parseISO(shift.shift_end_time), 'hh:mm a') }</p>
            </td>
            <td style={{fontWeight: 400}}>
                <p>{ format(parseISO(shift.shift_start_time), 'PPPP') }</p>
                <p>{ get(shift, 'location.name')} { get(shift, 'location.address')}</p>
            </td>
        </tr>
    );
}