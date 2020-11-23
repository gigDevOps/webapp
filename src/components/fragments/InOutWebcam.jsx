import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { endOfDay, startOfDay, format, parseISO } from "date-fns";
import {create, fetch} from "../../actions/generics";
import {Button, Message} from "rsuite";
import _ from "lodash";
import moment from "moment";
import {SimpleTable} from "../../interface/Tables/SimpleTable";

const formatClockInOutTime = 'p, E dd LLL'

export default function InOutWebcam() {
    const [rosters, setRosters] = useState([]);
    const [isFetchingRosters, setIsFetchingRosters] = useState(true);
    const [clockInOut, setClockInOut] = useState({
        clock: null,
        image: null,
        shift: null,
        hasFullfilled: false,
        success: null
    })
    const start = startOfDay(new Date());
    const end = endOfDay(start);
    const dispatch = useDispatch();
    const webcamRef = React.useRef(null);
    const capture = React.useCallback(
        (type) => {
            const imageSrc = webcamRef.current.getScreenshot();
            const image = imageSrc.split("data:image/jpeg;base64,")[1];

            setClockInOut({ ...clockInOut, image: imageSrc});

            const URL = [`/clock-${type}`, clockInOut.shift.id].join('/');
            dispatch(create('tracker', URL, { image }, () => {
                setClockInOut({
                    ...clockInOut, hasFullfilled: true, success: true
                })
            }, (res) => {
                setClockInOut({
                    ...clockInOut, hasFullfilled: true, success: false, error: res
                })
            }));
        },
        [webcamRef, setClockInOut, clockInOut]
    );

    useEffect(() => {
        dispatch(fetch('clock-in-rosters', '/rosters', {
            start, end, onlyCurrentUser: true, limit: 2
        }, (res) => {
            console.log(res);
            setIsFetchingRosters(false);
            setRosters(res.rosters);
        }));
    }, [dispatch]);

    if(isFetchingRosters || !rosters) return <p>Loading your informations..</p>
    const shifts = rosters.slice(0, 2);
    const clock = (type) => {
        capture(type);
    }

    return(
        <InOutWrapper>
            {
                rosters.length < 1 && (
                    <Message type="info" description="No shifts today" />
                )
            }
            {
                clockInOut.hasFullfilled && (
                    <div style={{ marginBottom: '1rem'}}>
                    {
                        clockInOut.success === false
                            ? <Message type="error" description={clockInOut.error.data.msg} />
                            : <Message type="success" description="Success! Thank you!" />
                    }
                    </div>
                )
            }
            {
                <>
                    { shifts && shifts.map((sh) => (
                        <div onClick={() => {
                            sh.id = sh.id ?? [
                                _.get(sh, 'shift_pattern.id'),
                                moment.utc(sh.shift_start_time).format('YYYY-MM-DD')
                            ].join('::');
                            setClockInOut({ ...clockInOut, shift: sh});
                        }} style={{
                            background: (clockInOut.shift && clockInOut.shift.id === sh.id) ? '#F2F2F2' : '#FFFFFF',
                            padding: '1rem',
                            cursor: 'pointer',
                            border: '1px solid #F2F2F2',
                            marginBottom: '1rem',
                            fontSize: '0.85rem'
                        }}>
                            <p>From {format(parseISO(sh.shift_start_time), formatClockInOutTime)} to {format(parseISO(sh.shift_end_time), formatClockInOutTime)}</p>
                            <p style={{ fontWeight: 500}}>{sh.location && sh.location.name} - {sh.position && sh.position.name}</p>
                        </div>
                    )) }
                </>
            }
            {

            }
            {
                clockInOut.shift && clockInOut.shift.id && clockInOut.shift.shift_clock_in_time && clockInOut.shift.shift_clock_out_time && (
                    <>
                        <p>This shift has been already completed. You can't alter the time of clock-in and clock-out. </p>
                        <SimpleTable style={{margin: '0.5rem 0'}}>
                            <tbody>
                                <Row value={clockInOut.shift.shift_clock_in_time} label="Clock-in" />
                                <Row value={clockInOut.shift.shift_clock_out_time} label="Clock-out" />
                            </tbody>
                        </SimpleTable>
                        <p>Please contact your supervisor to modify it.</p>
                    </>
                )
            }
            {
                clockInOut.shift && clockInOut.shift.id && (!clockInOut.shift.shift_clock_in_time || !clockInOut.shift.shift_clock_out_time) && (
                    <>
                        {
                            clockInOut.image === null && (
                                <div style={{ position: 'relative'}}>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                    />
                                </div>
                            )
                        }
                        {
                            clockInOut.image && (
                                <img src={clockInOut.image} alt="Snapshot of the camera" />
                            )
                        }
                        {
                            !clockInOut.shift.shift_clock_in_time && (
                                <Button color="green" size={"lg"} appearance="primary" onClick={() => clock('in')}>Clock in</Button>
                            )
                        }
                        {
                            clockInOut.shift.shift_clock_in_time && !clockInOut.shift.shift_clock_out_time && (
                                <Button color="blue" size={"lg"} appearance="primary" onClick={() => clock('out')}>Clock out</Button>
                            )
                        }
                    </>
                )
            }

        </InOutWrapper>
    )
}

const InOutWrapper = styled.div`
    display: flex;  
    flex-direction: column; 
`

const Row = ({ label, value}) => {
    return (
        <tr style={{paddingBottom: '1rem'}}>
            <td style={{ whiteSpace: "nowrap", fontWeight: 500, paddingRight: '2rem'}}>{label}:</td>
            <td style={{ whiteSpace: "nowrap", width: "100%"}}>{value}</td>
        </tr>
    )
}