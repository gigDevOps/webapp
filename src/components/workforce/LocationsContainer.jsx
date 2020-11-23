import React, {useEffect} from "react";
import {H1} from "../../interface/paragraph/Titles";
import DataTable from "../../interface/DataTable/DataTable";
import {useDispatch, useSelector} from "react-redux";
import LoadingView from "../../interface/LoadingView";
import {fetch} from "../../actions/generics";
import {ActionBar} from "../../interface/ActionBar";
import {Button} from "rsuite";
import {useModal} from "react-modal-hook";
import GModal from "../../interface/GModal";
import LocationCreate from "../fragments/LocationCreate";
import StaticMap from "../../interface/Maps/StaticMap";

export default function LocationsContainer() {
    const locations = useSelector((store) => store.locations.data);
    const isFetching = useSelector((store) => store.locations.isFetching);

    const [showCreateLocation, hideCreateLocation] = useModal(() => (
        <GModal title="Create a new site location" onClose={hideCreateLocation}>
            <LocationCreate onCancel={hideCreateLocation} onSuccess={() => {
                dispatch(fetch('locations', '/locations'));
                hideCreateLocation();
            }} afterCreation={() => {
                hideCreateLocation();
            }} onFailure={() => { alert("Something went wrong with the frontend") }} />
        </GModal>
    ));

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetch('locations', '/locations'));
    }, [dispatch]);

    if(!locations) return <p>Loading locations...</p>

    const locs = locations.map((loc) => loc);
    const columns = [
        { key: 'map', value: '', render: (l) => <StaticMap lat={l.lat} lng={l.lng} radius={l.radius} /> },
        { key: 'description', value: 'Area for geofencing', render: (l) => {
            return (
              <>
                  <p>{l.name}</p>
                  <p>{([l.radius, 'meters radius from', l.address].join(" "))}</p>
              </>
            )}
        },
        { key: 'shifts', value: 'Shifts in this location', render: (l) => l.shifts ? l.shifts : 'none'}
    ]
    return(
        <>
            <H1>Locations</H1>
            <ActionBar>
                <Button
                    style={{marginLeft: '0.5rem'}}
                    appearance="primary"
                    size="md"
                    onClick={() => showCreateLocation()}
                >Create</Button>
            </ActionBar>
            <LoadingView isFetching={isFetching}>
                <DataTable dataSource={locs} columns={columns} isFetching={isFetching} />
            </LoadingView>
        </>
    )
}