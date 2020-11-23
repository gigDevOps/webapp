import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";

import {fetch} from "../../actions/generics";
import {API_CLIENTS} from "../../services/Resources";
import DataTable from "../../interface/DataTable/DataTable";
import PageTitle from "../../interface/PageTitle";
import Portal from "../../interface/Portals/Portal";
import ClientCreationFragment from "./fragments/ClientCreationFragment";

export default function (props) {
    const companies = useSelector((store) => store.companies.data);
    const isFetching = useSelector((store) => store.companies.isFetching);

    const [isCreating, setIsCreating] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetch('companies', API_CLIENTS));
    }, [dispatch])

    const refresh = () => {
        dispatch(fetch('companies', API_CLIENTS));
    }

    const columns = [
        { key: 'short_id', value: '#' },
        { key: 'name', value: 'Company'},
        { key: 'company_locations', value: 'Locations', render: (a) => a.company_locations.length },
        { key: 'created_at', value: 'Created' },
        { key: 'updated_at', value: 'Last Update' },
        { key: 'job_offer.count', value: 'Jobs Advertised', render: (a) => a.job_offer.length },
        { key: 'job_offer.active', value: 'Active Jobs', render: (a) => a.job_offer.length }
    ];

    const clients_rev = companies.map((c) => {
        return { ...c, short_id: c.id.slice(0, 8)}
    });

    return(
        <>
            <PageTitle>Clients</PageTitle>
            <ListViewActionWrapper>
                <ListViewActionSelect>
                    <XXLButton>My Client List </XXLButton>
                    <RefreshActionButton onClick={refresh}>⟳</RefreshActionButton>
                </ListViewActionSelect>
                <ListViewActionActions>
                    <ActionButton onClick={() => setIsCreating(true)}>New</ActionButton>
                    <ActionButton>Export</ActionButton>
                </ListViewActionActions>

            </ListViewActionWrapper>
            <DataTable columns={columns} dataSource={clients_rev} isFetching={isFetching} />
            <Portal isOpen={isCreating} onClose={() => {
                setIsCreating(false);
            }}>
                <ClientCreationFragment onSuccess={() => {
                    setIsCreating(false);
                    refresh();
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