import React, {useEffect} from "react";
import Avatar from "react-avatar";
import 'status-indicator/styles.css'
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../../actions/generics";
import { get } from "lodash";
import styled from "styled-components";

const Indicator = ({ status }) => {
    return status.is_finished
        ? <status-indicator active />
        : status.is_started ? <status-indicator positive pulse /> :  <status-indicator negative />;
}

const Item = ({ item }) => {
    if(!item.user.name) return '';
    return (
        <ItemDiv>
            <Avatar name={item.user.name} size={28} round />
            <div style={{flexGrow: 1, paddingLeft: '0.5rem' }}>
                <p>{item.user.name}</p>
            </div>
            <Indicator status={item} />
        </ItemDiv>
    )
}

const ItemDiv = styled.div`
    display: flex;
    align-items: center;
    margin: 0 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #cccc;
    font-size: 90%;
    font-weight: 500;
    &:last-child {
        border-bottom: none;
        margin-bottom: 0.5rem;
    }
`

export default function WhosIn({title, filters}) {
    const whosonline = useSelector((store) => store.rosters.data);
    const isFetching = useSelector((store) => store.rosters.isFetching);
    const dispatch = useDispatch();

    useEffect(() => {
            dispatch(fetch('rosters', '/rosters', filters));
    }, [dispatch, filters]);

    const data = (!isFetching && whosonline) ? whosonline.map((shift) => {
       return {
           user: { name: [get(shift, 'user_assigned.first_name'), get(shift, 'user_assigned.other_names')].join(" ") },
           clock_in: get(shift, 'shift_clock_in_time'),
           clock_out: get(shift, 'shift_clock_out_time'),
           is_finished: get(shift, 'is_finished'),
           is_started: get(shift, 'is_started')
       }
    }) : [];

    return (
        <div>
            {
                data.length < 1 ? (
                    <p>Nobody working today</p>
                ) : (
                    data.map((d) => <Item item={d} />)
                )
            }
        </div>
    )
}

WhosIn.defaultProps = {
    filters: "all"
}