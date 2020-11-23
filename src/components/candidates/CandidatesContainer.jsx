import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {fetch} from "../../actions/generics";
import {API_CANDIDATES} from "../../services/Resources";
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
    const candidates = useSelector((store) => store.candidates.data);
    const isFetching = useSelector((store) => store.candidates.isFetching);

    const [isCreating, setIsCreating] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetch('candidates', API_CANDIDATES));
    }, [dispatch])

    const refresh = () => {
        dispatch(fetch('candidates', API_CANDIDATES));
    }

    const columns = [
        { key: 'short_id', value: '#' },
        { key: 'name', value: 'Name'},
        { key: 'user_assigned.email', value: 'Primary Email'},
        { key: 'user_assigned.phone', value: 'Primary Phone Number' }
    ];

    const clients_rev = candidates.map((c) => {
        return { ...c, short_id: c.id.slice(0, 8)}
    });

    return(
        <>
            <PageTitle>Candidates</PageTitle>
            <ListViewActionWrapper>
                <ListViewActionSelect>
                    <XXLButton>All Candidates </XXLButton>
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

            </Portal>
        </>
    )
}

