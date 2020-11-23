import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../../actions/generics";
import {API_CANDIDATES, API_JOBS} from "../../services/Resources";
import {useParams} from "react-router";
import InfoBox from "../../interface/InfoBox/InfoBox";
import PageTitle from "../../interface/PageTitle";
import styled from "styled-components";
import get from "lodash/get";
// import debounce from "lodash/debounce";
import moment from "moment";

export default function JobContainer(props) {
    const job = useSelector((store) => store.job.data);
//    const isFetching = useSelector((store) => store.job.isFetching);

    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() =>{
        dispatch(fetch('job', [API_JOBS, params.id].join("/")));
    }, [dispatch, params.id]);

    const cols = [
        [{}, { key: 'status', value: 'Status'}],
        [{}, { key: 'ttc', value: 'Time-To-Close', render: (a) => {
            return a.created_at ? moment().diff(moment(a.created_at.slice(0, 19)), "hours") + " hours" : "-";
            }}],
        [{}, { key: 'created_at', value: 'Created'}],
        [{}, { key: 'updated_at', value: 'Last Update'}],
        [{}, { key: 'user_creator.email', value: 'Creator'}]
    ];

    return(
        <>
            <PageTitle>Job Offer</PageTitle>
            <TwoCols>
                <Left>
                    <p>{job.title}</p>
                    <p>{job.description}</p>
                    <p>{get(job, 'job_location.address_1')}</p>
                    <p>{get(job, 'job_location.address_2')}</p>
                    <p>Display Map: {get(job, 'job_location.latitude')}, {get(job, 'job_location.longitude')}</p>
                </Left>
                <Right>
                    <InfoBox dataSource={job} columns={ cols } />
                </Right>
            </TwoCols>
            <PageTitle>Shifts</PageTitle>
            {
                job.shifts ? job.shifts.map((shift) => {
                    return <Shift {...shift} />
                }) : ""
            }
            <PageTitle>Matches</PageTitle>
            {
                job.matches && job.matches.length > 0 ? job.matches.map((match) => {
                    return <p>.</p>
                }) : <NoMatch />
            }
        </>
    )
}

const NoMatch = (props) => {
    const [query, setQuery] = useState('');
    const candidates = useSelector((store) => store.candidates.data);
    const dispatch = useDispatch();

    return(
        <>
            <p><button>Assign Pool of candidates</button></p>
            <p>No matches for this job</p>
            <p>Search for individual candidates</p>
            <input type="text" value={query} onChange={(e) => {
                setQuery(e.target.value);
                dispatch(fetch('candidates', API_CANDIDATES, { query: query }));
            }} />
            <ul>
                { candidates.map((candidate) => {
                    return <li>
                        {[
                            get(candidate, 'user_assigned.first_name'),
                            get(candidate, 'user_assigned.other_names'),
                            get(candidate, 'user_assigned.email')
                        ].join(" ")}
                    </li>
                })}
            </ul>

        </>
    )
}

const Shift = (props) => {
    return(
        <div>
            <p>From {props.start.slice(0, 19)} to {props.terminate.slice(0, 19)} (<small>Closing {moment(props.start.slice(0, 19)).fromNow()}</small>)</p>
            <p><small>Openings: {props.openings}</small></p>
            <small>Worker assigned:</small>
            <ul>
            {
                props.user_assigned.length < 1 ? "None" : props.user_assigned.map((user) => {
                    return <li>{user.email}</li>
                })
            }
            </ul>
            <hr />
        </div>
    )
}

const TwoCols = styled.div`
    display: flex;
`
const Left = styled.div`
    width: 40%;
`
const Right = styled.div`
    width: 60%;
`