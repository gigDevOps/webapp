import React, {useEffect, useState} from "react";
import {H1} from "../../interface/paragraph/Titles";
import LoadingView from "../../interface/LoadingView";
import {ActionBar} from "../../interface/ActionBar";
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../../actions/generics";
import DataTable from "../../interface/DataTable/DataTable";
import {useModal} from "react-modal-hook";
import GModal from "../../interface/GModal";
import {Button} from "rsuite";
import MembersPermissionUpdate from "../fragments/MembersPermissionUpdate";

export default function MembersContainer() {
    const members = useSelector((store) => store.members.data);
    const isFetchingMembers = useSelector((store) => store.members.isFetching);
    const [updating, setUpdating] = useState({});
    const dispatch = useDispatch();

    const [showUpdatePermissions, hideUpdatePermissions] = useModal(() => {
        const name = [updating.first_name, updating.other_names].join(" ");
        return <GModal autoResize title={`Update permissions for ${name}`} onClose={hideUpdatePermissions}>
            <MembersPermissionUpdate user={updating} onSuccess={() => {
                dispatch(fetch('members', '/users'));
                hideUpdatePermissions();
            }}/>
        </GModal>
    }, [ updating ]);

    useEffect(() => {
        dispatch(fetch('members', '/users'));
    }, [dispatch]);

    const columns = [
        { key: 'id', value: 'ID', render: (u) => u.id.substring(0, 8)},
        { key: 'name', value: 'Name', render: (u) => [u.first_name, u.other_names].join(" ")},
        { key: 'email', value: 'Email' },
        { key: 'phone', value: 'Phone' },
        { key: 'roles', value: 'Permissions', render: (u) => u.roles.map((r) => r.substring(5)).join(", ")},
        { key: 'updated_at', value: 'Last Update' },
        { key: 'actions', value: '',
            options: [
                {
                    value: 'Change permissions',
                    onClick: (u) => {
                        setUpdating(u);
                        showUpdatePermissions();
                    },
                    condition: (u) => !u.roles.includes('ROLE_SUPER')
                }
            ]
        }
    ];
    if(!members) return <p>Fetching members...</p>;
    return(
        <>
            <H1>Users</H1>
            <ActionBar>

            </ActionBar>
            <LoadingView isFetching={isFetchingMembers}>
                <DataTable dataSource={members} columns={columns} isFetching={isFetchingMembers} />
            </LoadingView>
        </>
    )
}