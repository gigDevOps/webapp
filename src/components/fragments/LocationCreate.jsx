import React, {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers";
import {create, fetch} from "../../actions/generics";
import {InputGroup} from "../../interface/forms/InputGroup";
import * as yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "rsuite";
import GoogleMapReact from 'google-map-react';
import { debounce } from "lodash";

const schema = yup.object().shape({
    name: yup.string().required(),
});

const coords = { lat: -1.2578731, lng: 36.7886223};
let markerRef = null;
let circleRef = null;

export default function LocationCreate({ onSuccess, onFailure}) {
    const [serverErrors, setServerErrors] = useState({});
    const [center, setCenter] = useState(coords);
    const [mapRef, setMapRef] = useState(null);
    const [mapsRef, setMapsRef] = useState(null);
    const timezones = useSelector((store) => store.timezones.data);
    const isFetchingTimezones = useSelector((store) => store.timezones.isFetching);

    const { register, handleSubmit, errors, watch, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            radius: 15
        }
    });
    const dispatch = useDispatch();
    const radius = watch('radius', 15);

    const onSubmit = (data) => {
        dispatch(create('location', '/locations', data, onSuccess, onFailure));
    }

    const getTimezones = () => {
        if(!timezones || timezones.length < 1) {
            dispatch(fetch('timezones', '/timezones'), {},  () => {
                setValue('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
            });
        }
    }

    useEffect(() => {
        markByLatLng(center, radius);
        getTimezones();
    }, [dispatch, mapRef, mapsRef, radius, center]);

    const onGoogleApiLoaded = ({ map, maps }) => {
       setMapRef(map);
       setMapsRef(maps);
    }

    const markByLatLng = debounce((center, radius) => {
        if(mapRef && mapsRef) {
            if(markerRef !== null && circleRef !== null) {
                markerRef.setMap(null);
                circleRef.setMap(null);
            }
            markerRef = new mapsRef.Marker({
                position: center,
                map: mapRef,
                title: 'Location of the site',
                draggable: true
            });


            circleRef = new mapsRef.Circle({
                strokeColor: '#f69425',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#f69425',
                fillOpacity: 0.3,
                map: mapRef,
                center: center,
                radius: parseFloat(radius),
            });
            circleRef.bindTo('center', markerRef, 'position');
            mapsRef.event.addListener(mapRef, 'dblclick', (e) => {
                setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng()});
            })
            mapsRef.event.addListener(markerRef, 'dragend', () => {
                const latLng = { lat: markerRef.position.lat(), lng: markerRef.position.lng()};
                setCenter(latLng);
            });

            const geocoder = new mapsRef.Geocoder();
            geocoder.geocode({ location: center }, (results, status) => {
                if(status === 'OK') {
                    setValue('address', results[0].formatted_address);
                }
            });

            setValue('lng', center.lng);
            setValue('lat', center.lat);
        }
    }, 500);

    const debounceGeocodeByAddress = debounce(( address, isTyping ) => {
        if(mapsRef) {
            const geocoder = new mapsRef.Geocoder();
            geocoder.geocode({ address: address }, (results, status) => {
                if(status === 'OK') {
                    setCenter({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                    })
                }
            });
        }
    }, 2000);

    return(
        <>
            { serverErrors.msg && <p>{serverErrors.msg}</p>}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="none">
                <InputGroup label="Name of the Site" tooltip="Choose a name for you location, so you can easily remember it">
                    <input type="text" autoComplete="none" placeholder="Name of the location" name="name" ref={register} />
                    <p>{errors.name?.message}</p>
                </InputGroup>
                <InputGroup label="Address of the site" tooltip="Pick a nearby point of interest or the exact location">
                    <input type="text" autoComplete="none" onChange={(event) => {
                        if(mapsRef && mapRef && event.target.value.length > 2) {
                            debounceGeocodeByAddress(event.target.value, true);
                        }
                    }}
                           placeholder="Autocomplete point of interest" name="address" ref={register} />
                </InputGroup>
                <InputGroup label="Timezone" tooltip="Select the timezone for this location">
                    { isFetchingTimezones && <p>Loading timezones...</p> }
                        {
                            !isFetchingTimezones && timezones && (
                                <select name="timezone" ref={register} >
                                    {
                                        timezones.map((t) => {
                                            return <option value={t.key}>{t.value}</option>
                                        })
                                    }
                                </select>
                            )
                        }
                    <p>{errors.name?.message}</p>
                </InputGroup>
                <div style={{ height: '350px', width: '100%', position: 'relative' }}>
                    <div style={{ width: "25%", zIndex: 9999, position: 'absolute', left: '1rem', top: '1rem'}}>
                        <InputGroup label="Radius" tooltip="Select the radius in meters for geofencing">
                            <input type="range" min="12" max="500" autoComplete="none" placeholder="Radius (in meters)"
                                   defaultValue={radius} name="radius" ref={register} />
                        </InputGroup>
                        <div style={{ background: 'rgba(255,255,255,0.5', padding: '1rem', border: '1px solid #ccc'}}>
                            <p><small>
                                Latitude: {center.lat} <br />
                                Longitude: {center.lng} <br />
                                Radius {radius} meters
                            </small></p>
                        </div>
                    </div>
                <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={onGoogleApiLoaded}
                    options={{
                        disableDoubleClickZoom: true
                    }}
                    bootstrapURLKeys={{ key: 'AIzaSyCm-QmQdzRsJnp_u7pSypE_E6GfQfS948E' }}
                    center={center}
                    defaultZoom={19}
                >
                </GoogleMapReact>
                </div>
                <input type="text" autoComplete="none" hidden name="lat" ref={register} />
                <input type="text" autoComplete="none" hidden name="lng" ref={register} />
                <Button appearance="primary" type="submit">Save</Button>
            </form>
        </>
    )
}