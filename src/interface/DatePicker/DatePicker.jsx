import React, {useState} from 'react';
import {FiArrowLeft, FiArrowRight} from 'react-icons/fi';

import {Button, DateRangePicker} from 'rsuite';
import moment from "moment";

export default function DatePicker({startDate, endDate, ...props}) {

    const [selection, setSelection] = useState({
        startDate: startDate,
        endDate: endDate,
    });

    const onMoveWeek = (days) => {
        const nextSelection = {
            startDate: moment.utc(selection.startDate).add(days, "days").toDate(),
            endDate: moment.utc(selection.endDate).add(days, "days").toDate(),
        }
        setSelection(nextSelection);
        props.onChange(nextSelection);
    }

    return (
        <div style={{ position: 'relative'}}>
            <div style={{display: 'flex'}}>
                <Button style={{ marginRight: '0.5rem' }} appearance="ghost" size="md" onClick={() => onMoveWeek(props.prevPeriod || -7)}>
                    <FiArrowLeft/>
                </Button>
                <Button style={{ marginRight: '0.5rem' }} appearance="ghost" size="md" onClick={() => onMoveWeek(props.nextPeriod || 7)}>
                    <FiArrowRight/>
                </Button>
                <DateRangePicker
                    oneTap
                    cleanable={false}
                    showOneCalendar
                    isoWeek
                    ranges={[]}
                    hoverRange={props.hoverRange || "week"}
                    value={[moment(selection.startDate).toDate(), moment(selection.endDate).toDate()]}
                    onChange={item => {
                        setSelection({ startDate: item[0], endDate: item[1]});
                        props.onChange({ startDate: item[0], endDate: item[1]});
                    }}
                />
            </div>
        </div>
    )
}