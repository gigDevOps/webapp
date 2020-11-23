import React, {useEffect, useState} from "react";
import { PageTitle } from "../../interface/paragraph/Titles";
import DatePicker from "../../interface/DatePicker/DatePicker";

import WhosIn from "../../interface/ActivityFeed/WhosIn";
import {ActionBar} from "../../interface/ActionBar";
import {startOfDay, endOfDay, format} from "date-fns";
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../../actions/generics";
import ActivityLogWidget from "./widgets/ActivityLogWidget";
import Card from "../../interface/Card/Card";
import {Button, ButtonGroup} from "rsuite";
import moment from "moment";
import qs from "query-string";
import {useHistory} from "react-router-dom";

const formatDateTitle =  'ccc, MMM dd, yyyy';

export default function ActivitiesContainer() {

    const history = useHistory();
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());
    const [period, setPeriod] = useState({ start, end });
    const activities = useSelector((store) => store.activities.data);
    const isFetchingActivities = useSelector((store) => store.activities.isFetching);
    const dispatch = useDispatch();

    const onChangeTimePeriod = (selection) => {
        const start = moment(selection.startDate).startOf('day').toDate();
        const end = moment(selection.endDate).endOf('day').toDate();
        const query = qs.stringify({ start: moment(start).format('YYYY-MM-DD')});
        history.push(['/activities', query].join('?'));
        setPeriod({ start: start, end: end });
    }

    useEffect(() => {
        dispatch(fetch('activities', '/activities', { isAll: true, ...period }));
    }, [dispatch, period])

    if(isFetchingActivities || !activities) return <p>Loading activities...</p>;

    const subtitle = [format(period.start, formatDateTitle), format(period.end, formatDateTitle)].join(" - ");
    return(
        <>
            <PageTitle title="Activities" sub={subtitle} />
            <ActionBar>
                <div style={{ flexGrow: '1', display: 'flex', alignItems: 'center'}}>
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
                </div>
            </ActionBar>
            <div style={{display: 'flex'}}>
                <div style={{flexGrow: 1, paddingRight: '2rem'}}>
                    <Card title="Activity Logs" hasPadding={false}>
                        <ActivityLogWidget showTitle={false} hasExternalPadding={false} hasToBeFetched={false} filters={{ isAll: true}} />
                    </Card>
                </div>
                <div style={{flex: '1 0 20rem', maxWidth: '30%'}}>
                    <Card title="Who's In/Out?" hasPadding={false} right={(
                            <ButtonGroup>
                                <Button appearance="ghost" color="orange">All</Button>
                                <Button appearance="ghost">In</Button>
                                <Button appearance="ghost">Out</Button>
                            </ButtonGroup>
                        )
                    }>
                        <WhosIn data={[]} filters={{...period}} />
                    </Card>
                </div>
            </div>
        </>
    )
}