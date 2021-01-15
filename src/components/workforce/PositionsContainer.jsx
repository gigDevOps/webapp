import React, {useEffect} from "react";
import {H1} from "../../interface/paragraph/Titles";
import {ActionBar} from "../../interface/ActionBar";
import {Button} from "rsuite";
import LoadingView from "../../interface/LoadingView";
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../../actions/generics";
import DataTable from "../../interface/DataTable/DataTable";
import {useModal} from "react-modal-hook";
import GModal from "../../interface/GModal";
import PositionCreate from "../fragments/PositionCreate";

export default function PostionsContainer() {
    const positions = useSelector((store) => store.roles.data);
    const isFetchingPositions = useSelector((store) => store.roles.isFetching);
    const dispatch = useDispatch();
    const [showPositionsCreation, hidePositionCreation] = useModal(() => (
        <GModal onClose={hidePositionCreation} autoResize>
            <PositionCreate onSuccess={() => {
                dispatch(fetch('roles', '/role'));
                hidePositionCreation();
            }} onFailure={()=>{}} />
        </GModal>
    ));
    useEffect(() => {
        dispatch(fetch('roles', '/role'));
    }, [dispatch]);
    if(!positions) return <p>Loading positions/roles...</p>;
    const columns = [
        { key: 'name', value: 'Title' },
        { key: 'shifts_assigned', value: 'Shifts (assigned)' },
        { key: 'shifts_unassigned', value: '(unassigned)'}
    ]
    return(
        <>
            <H1>Positions (Roles)</H1>
            <ActionBar>
                <Button
                    style={{marginLeft: '0.5rem'}}
                    appearance="primary"
                    size="md"
                    onClick={() => showPositionsCreation()}
                >Create</Button>
            </ActionBar>
            <LoadingView isFetching={isFetchingPositions}>
                <DataTable dataSource={positions} columns={columns} isFetching={isFetchingPositions} />
            </LoadingView>
        </>
    )
}