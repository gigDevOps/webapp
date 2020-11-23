import React from "react";
import _ from "lodash";
import Avatar from "react-avatar";
import {format, parseISO} from "date-fns";
import styled from "styled-components";

export default function ActivityLogFactory({ hasExternalPadding, activity, index }) {
    switch (activity.type) {

        case 'shift.clock_in':
        case 'shift.clock_out':
            const userName = [
                _.get(activity, 'context.userCreator.first_name'),
                _.get(activity, 'context.userCreator.other_names')
            ].join(" ");
            const userBehalf = [
                _.get(activity, "context.userCreator.first_name"),
                _.get(activity, "context.userCreator.other_names")
            ].join(" ");
            const shift = format(parseISO(_.get(activity, "context.shift.shift_start_time")), 'YYY-MM-dd HH:mm');
            const text = [
                <strong>{userName}</strong>,
                activity.type === 'shift.clock_in' ? 'clocked-in' : 'clocked-out',
                activity.context.isOnBehalf ? <span>on behalf of <strong>{userBehalf}</strong></span> : '',
                'for shift ', shift

            ];
            const via = _.get(activity, "context.via") === 'app' ? 'Gigsasa TimeTracker' : _.get(activity, "context.via");
            return <ActivityItem hasExternalPadding={hasExternalPadding} key={index}
                                 index={index} via={via} text={text}
                                 time={new Date(activity.time)} user_name={userName} />

        default:
            return <p>No Template</p>
    }
}


const ActivityItem = ({ hasExternalPadding, text, user_name, time, index, via}) => {
    return(
        <Wrapper index={index} hasExternalPadding={hasExternalPadding}>
            <WrapperInner>
                <div style={{flexGrow: 1, display: 'flex'}}>
                    <div style={{ paddingRight: '1rem', alignSelf: 'center'}}>
                        <Avatar name={user_name} round size={32} />
                    </div>
                    <div style={{ flexGrow: 1}}>
                        <p style={{ margin: 0, marginBottom: '0.25rem'}}>{text.map((e) => e).reduce((prev, curr) => [prev, ' ', curr])}</p>
                        <p style={{ margin: 0, fontSize: '90%', color: '#666'}}>Entry: via {via}</p>
                    </div>
                </div>
                <div>
                    <p>{format(time, 'YYY-MM-dd HH:mm')}</p>
                </div>
            </WrapperInner>
        </Wrapper>
    )
}

const WrapperInner = styled.div`
    display: flex;
`

const Wrapper = styled.div`
    padding: 1rem 2rem 1rem 2rem;
    background-color: ${props => props.index % 2 === 0 ? "#f7f8f7" : "#ffffff"};
    border-top: ${props => props.index === 0 ? "none" : "none"};
    border-bottom: 1px solid #ccc;
    align-items: center;
    
    &:last-child {
        border-bottom: 0;
    }
    
    strong {
        font-weight: 500;
    } 
`