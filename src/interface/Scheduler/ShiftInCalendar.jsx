import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import { AiOutlineClockCircle } from "react-icons/ai";

export default function ShiftInCalendar({ id, beginning, termination, shift, showHours, color, textColor, border, ...props }) {
    const workingHours = showHours ? termination.diff(beginning, 'hours') + 'H' : '';
    const history = useHistory();
    const opacity = shift.is_finished ? 1 : 1;
    const isNoShow = shift.is_finished && !shift.is_fullfilled;
    const clock = shift.is_finished ? <><AiOutlineClockCircle /> {shift.minutes_worked}</> : "";
    const location = shift.location ? shift.location.name : "N/A";
    const position = shift.location ? shift.location.address : "N/A";

    return(
        <Wrapper color={isNoShow ? 'red' : color} opacity={opacity} border={border} textColor={textColor} onClick={() => {
            history.push('/schedules/shifts/' + id + history.location.search);
        }}>
            <Row>{beginning.format( 'h:m a')} - {termination.format( 'h:m a')} <Emp>{workingHours}</Emp> { shift.is_started && clock}</Row>
            <Row>{location} ({position})</Row>
        </Wrapper>
    )
}

ShiftInCalendar.prototype.propTypes = {
    beginning: PropTypes.object.isRequired,
    termination: PropTypes.object.isRequired,
    showHours: PropTypes.bool,
    role: PropTypes.string,
    location: PropTypes.string,
}

ShiftInCalendar.defaultProps = {
    showHours: true,
    role: 'Mechanic',
    location: 'Workshop'

}

const Wrapper = styled.div`
    padding: 0.15rem 0 0.15rem 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0rem 0 0.25rem 0;
    background: ${props => props.color};
    border: 1px ${props => props.border || "solid"} ${props => props.textColor};
    opacity: ${props => props.opacity};
    color: ${props => props.textColor};
    border-radius: 1px;
    font-size: 0.7rem; 
    cursor: pointer;
`
const Row = styled.p`
    margin: 0;  
    text-overflow: ellipsis;
    display: block; 
    font-weight: 600;
`

const Emp = styled.span`
    font-weight: 600;
`
