import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";

import {fetch} from "../../actions/generics";
import {API_JOBS} from "../../services/Resources";
import DataTable from "../../interface/DataTable/DataTable";
import PageTitle from "../../interface/PageTitle";
import Portal from "../../interface/Portals/Portal";
import JobCreationFragment from "./fragments/JobCreationFragment";
import {NavLink} from "react-router-dom";

export default function (props) {
    const jobs = useSelector((store) => store.jobs.data);
    const isFetching = useSelector((store) => store.jobs.isFetching);

    const [isCreating, setIsCreating] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetch('jobs', API_JOBS));
    }, [dispatch])

    const refresh = () => {
        dispatch(fetch('jobs', API_JOBS));
    }

    const columns = [
        { key: 'short_id', value: '#', render: (a) => <NavLink to={['/jobs', a.id].join('/')}>{a.short_id}</NavLink>},
        { key: 'title', value: 'Role'},
        { key: 'company.name', value: 'Company' },
        { key: 'created_at', value: 'Created'},
        { key: 'updated_at', value: 'Last Update'},
        { key: 'userCreator.email', value: 'Created By'}
    ];

    const jobs_map = jobs.map((job) => {
        return { ...job, short_id: job.id.slice(0,8)}
    })

    return(
        <>
            <PageTitle>Job Listing</PageTitle>
            <ListViewActionWrapper>
                <ListViewActionSelect>
                    <XXLButton>My Job Listing </XXLButton>
                    <RefreshActionButton onClick={refresh}>⟳</RefreshActionButton>
                </ListViewActionSelect>
                <ListViewActionActions>
                    <ActionButton onClick={() => setIsCreating(true)}>New</ActionButton>
                    <ActionButton>Export</ActionButton>
                </ListViewActionActions>

            </ListViewActionWrapper>
            <DataTable columns={columns} dataSource={jobs_map} isFetching={isFetching} />

            <Portal onClose={() => {
                setIsCreating(false);
            }} isOpen={isCreating}>
                <JobCreationFragment onSuccess={() => {
                    setIsCreating(false);
                    dispatch(fetch('jobs', '/jobs'));
                }} />
            </Portal>
        </>
    )
}

const ListViewActionWrapper = styled.div`
    display: flex;
    align-items: center;
`

const ListViewActionSelect = styled.div`
    flex-grow: 1;
`
const ListViewActionActions = styled.div``

const Button = styled.button`
    outline: 0;
    cursor: pointer;
`

const XXLButton = styled(Button)`
    font-size: 1.5rem;
    border: 0;
    background: none;
    padding: 1rem 0;
    font-weight: 300;
`

const ActionButton = styled(Button)`
    border: 1px solid #ccc;
    background: none;
    font-size: 0.85rem;
    padding: 0.5rem 1.25rem;
    text-transform: uppercase;
    
    &:hover {
        background: #eee;
    }
`

const RefreshActionButton = styled(ActionButton)`
    border: 0;
    &:hover { 
        background: none 
    }
`