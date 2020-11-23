import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {fetch} from "../../actions/generics";
import {API_ASSIGNMENTS} from "../../services/Resources";
import DataTable from "../../interface/DataTable/DataTable";
import PageTitle from "../../interface/PageTitle";
import Portal from "../../interface/Portals/Portal";
import {
    ActionButton, ListViewActionActions,
    ListViewActionSelect,
    ListViewActionWrapper,
    RefreshActionButton,
    XXLButton
} from "../../interface/Utils";

export default function (props) {
    const assignments = useSelector((store) => store.assignments.data);
    const isFetching = useSelector((store) => store.assignments.isFetching);

    const [isCreating, setIsCreating] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetch('assignments', API_ASSIGNMENTS));
    }, [dispatch])

    const refresh = () => {
        dispatch(fetch('assignments', API_ASSIGNMENTS));
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

    const clients_rev = assignments.map((c) => {
        return { ...c, short_id: c.id.slice(0, 8)}
    });

    return(
        <>
            <PageTitle>Assignments</PageTitle>
            <ListViewActionWrapper>
                <ListViewActionSelect>
                    <XXLButton>All Assignments </XXLButton>
                    <RefreshActionButton onClick={refresh}>⟳</RefreshActionButton>
                </ListViewActionSelect>
                <ListViewActionActions>
                    <ActionButton>View Roster</ActionButton>
                    <ActionButton onClick={() => setIsCreating(true)}>New</ActionButton>
                    <ActionButton>Export</ActionButton>
                </ListViewActionActions>

            </ListViewActionWrapper>
            <DataTable columns={columns} dataSource={clients_rev} isFetching={isFetching} />
            <Portal isOpen={isCreating} onClose={() => {
                setIsCreating(false);
            }}>

            </Portal>
        </>
    )
}

