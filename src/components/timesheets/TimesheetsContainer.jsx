import React, {useEffect, useState} from 'react';
import {PageTitle} from "../../interface/paragraph/Titles";
import {ActionBar} from "../../interface/ActionBar";
import DatePicker from "../../interface/DatePicker/DatePicker";
import _ from 'lodash';
import moment from "moment";
import {eachDayOfInterval, format} from "date-fns";
import Avatar from "react-avatar";
import {Button, ButtonGroup} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../../actions/generics";
import LoadingView from "../../interface/LoadingView";
import qs from "query-string";
import {useHistory, useLocation} from "react-router-dom";
import {APIClient} from "../../services/APIClient";
import {Table} from "../../interface/Tables/Table";

const formatDateTitle =  'ccc, MMM dd, yyyy';

const minutesToHoursMinute = (min) => {
    var num = min;
    var hours = (min / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return _.padStart(rhours, 2, 0) + ":" + _.padStart(rminutes, 2, 0);
}

export default function () {
    const history = useHistory();
    const location = useLocation();
    const query = qs.parse(location.search);
    const dayStartOfWeek = moment(query.start || new Date()).startOf('isoWeek').startOf('day');
    const dayEndOfWeek = moment(dayStartOfWeek).endOf('isoWeek').endOf('day');
    const [period, setPeriod] = useState({ start: dayStartOfWeek, end: dayEndOfWeek })
    const [granularity, setGranularity] = useState('week');
    const timesheets = useSelector((store) => store.timesheets.data);
    const isFetchingTimesheets = useSelector((store) => store.timesheets.isFetching);
    const days = eachDayOfInterval({ start: moment(period.start).toDate(), end: moment(period.end).toDate()});
    const dispatch = useDispatch();

    const onChangeTimePeriod = (selection) => {
        const start = moment(selection.startDate).startOf('day').toDate();
        const end = moment(selection.endDate).endOf('day').toDate();
        const query = qs.stringify({ start: moment(start).format('YYYY-MM-DD')});
        history.push(['/timesheets', query].join('?'));
        setPeriod({ start: start, end: end });
    }

    useEffect(() => {
        dispatch(fetch('timesheets', '/timesheets', {
                start: moment(period.start).format(),
                end: moment(period.end).format(),
                granularity
            }));
    }, [dispatch, period, granularity])

    const onExport = () => {
        APIClient.get('/export', {
            params: {
                save: true,
                type: 'timesheet',
                start: moment(period.start).format(),
                end: moment(period.end).format()
        }, responseType: 'blob'}).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            const name = `ts${period.start.toISOString()}-${period.end.toISOString()}_export_${(new Date()).toISOString()}.xlsx`;
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
        });
    }

    const subtitle = [format(moment(period.start).toDate(), formatDateTitle), format(moment(period.end).toDate(), formatDateTitle)].join(" - ");
    return(
        <>
            <PageTitle title="Timesheet" sub={subtitle} />
            <ActionBar>
                <div style={{ flexGrow: '1', display: 'flex', alignItems: 'center'}}>
                    <DatePicker
                        onChange={(dates) => {
                            onChangeTimePeriod(dates);
                        }}
                        startDate={period.start}
                        endDate={period.end}
                        nextPeriod={granularity === 'week' ? 7 : 7}
                        prevPeriod={-7}
                        hoverRange={granularity}
                    />
                    <Button style={{marginLeft: '0.5rem'}} appearance="primary" size="md" onClick={onExport}>Export</Button>
                </div>
                <div>
                    <ButtonGroup>
                        <Button appearance={granularity === 'week' ? "primary" : "ghost"} color="green" onClick={() => {
                            setGranularity('week');
                        }}>Weekly</Button>
                        <Button appearance={granularity === 'month' ? "primary" : "ghost"} onClick={() => {
                            setGranularity('month');
                        }}>Monthly</Button>
                    </ButtonGroup>
                </div>
            </ActionBar>
            <div>
                <LoadingView isFetching={isFetchingTimesheets}>
                    <div style={{width: '100%'}}>
                <Table noWrap alternate>
                    <thead>
                    <tr>
                        <th />
                        {days.map((r) => {
                            return <th>{format(r, 'E d/M')}</th>
                        })}
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {timesheets && timesheets.map((ts) => {
                        const name = [ts.user.first_name, ts.user.other_names].join(" ");
                        const total_minutes = ts.timesheet.reduce((minutes, total) => (minutes + total), 0);
                        const display_total = minutesToHoursMinute(total_minutes);

                       return (
                           <tr>
                               <td>
                                   <Avatar name={name} round size={42} />
                                   <span style={{paddingLeft: '1rem'}}>{name}</span>
                               </td>
                               {ts.timesheet.map((r) => {
                                   return <td style={{ fontWeight: r > 0 ? 500 : 200 }}>{minutesToHoursMinute(r)}</td>
                               })}
                               <td style={{ fontWeight: 500}}>{display_total}</td>
                           </tr>
                       )
                    })}
                    </tbody>
                </Table>
                    </div>
                </LoadingView>
            </div>
        </>
    )
}