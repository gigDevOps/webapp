import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Avatar from "react-avatar";
import { format } from "date-fns";
import styled from "styled-components";
import {ButtonToolbar, Dropdown} from 'rsuite';

import {H4} from "../../../interface/paragraph/Titles";

const ACTIONS = {
    CLOCK_IN: 'checked-in',
    CLOCK_OUT: 'checked-out',
    DATA_ENTRY: 'updated information'
}

const ActivityItem = ({ item, index }) => {
    const get_object = (object) => {
        switch (object.type) {
            case 'CLOCK_IN':
                return format(object.shift.shift_start_time, 'PPp')
            case 'CLOCK_OUT':
                return format(object.shift.shift_end_time, 'PPp')
            default:
                return [
                    format(object.shift.shift_start_time, 'PPp'),
                    format(object.shift.shift_start_time, '- hh:mm a'),
                ].join(" ")
        }
    }
    const isOnBehalf = !(item.user_creator.id === item.entry.subject.id);
    const text = [
        <strong>{item.user_creator.name}</strong>,
        _.get(ACTIONS, item.entry.type, ''),
        isOnBehalf ? <span>on behalf of <strong>{item.entry.subject.name}</strong></span> : '',
        'for', get_object(item.entry.object)

    ];
    console.log("index", index);
    return(
        <Wrapper index={index}>
            <WrapperInner>
                <div style={{flexGrow: 1, display: 'flex'}}>
                    <div style={{ paddingRight: '1rem', alignSelf: 'center'}}>
                        <Avatar name={item.user_creator.name} round size={32} />
                    </div>
                    <div style={{ flexGrow: 1}}>
                        <p style={{ margin: 0, marginBottom: '0.25rem'}}>{text.map((e) => e).reduce((prev, curr) => [prev, ' ', curr])}</p>
                        <p style={{ margin: 0, fontSize: '90%', color: '#666'}}>Entry: {_.get(item, 'entry.object.extra', 'N/A')}</p>
                    </div>
                </div>
                <div>
                    <p>{format(item.time, 'YYY-MM-dd HH:mm')}</p>
                </div>
            </WrapperInner>
        </Wrapper>
    )
}

const ActionsDropDown = ({ options, title }) => {
    return(
        <Dropdown title={title}>
            {options.map((o) => (<Dropdown.Item>{o}</Dropdown.Item>) )}
        </Dropdown>
    )
}

export default function ActivityFeed({ data, title }) {
    const categories = _.chain(data).map('entry.type').uniq().value();
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center'}}>
                <div style={{flexGrow: 1}}>
                    <H4>{title}</H4>
                </div>
                <div style={{marginRight: '2rem'}}>
                    <ButtonToolbar>
                        <ActionsDropDown title="Actions" options={categories} />
                        <ActionsDropDown title="Locations" options={categories} />
                        <ActionsDropDown title="Roles" options={categories} />
                    </ButtonToolbar>
                </div>
            </div>
            {
                data.map((d, i) => {
                    return <ActivityItem key={i} item={d} index={i} />
                })
            }
        </div>
    )
}

ActivityFeed.prototype.propTypes = {
    data: PropTypes.array.isRequired
}


const WrapperInner = styled.div`
    display: flex;
`

const Wrapper = styled.div`
    padding: 0.5rem 1rem 0.5rem 1rem;
    background-color: ${props => props.index % 2 === 0 ? "#ffffff" : "#f3f3f8"};
    border-top: ${props => props.index === 0 ? "1px solid #ccc" : "none"};
    border-bottom: 1px solid #ccc;
    align-items: center;
    
    strong {
        font-weight: 500;
    } 
`