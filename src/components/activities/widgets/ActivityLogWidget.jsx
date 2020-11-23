import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../../../actions/generics";
import ActivityLogFactory from "../fragments/ActivityLogFactory";
import {H4} from "../../../interface/paragraph/Titles";

export default function ActivityLogWidget({ hasToBeFetched, hasExternalPadding, showTitle, title, filters }) {
    const activities = useSelector((store) => store.activities.data);
    const isFetching = useSelector((store) => store.activities.isFetching);
    const dispatch = useDispatch();

    useEffect(() => {
        if(hasToBeFetched) {
            dispatch(fetch('activities', '/activities', { ...filters }));
        }
    }, [dispatch, hasToBeFetched, filters]);
    if(isFetching) return <p style={{ padding: '2rem'}}>Loading activities</p>;
    return (
        <>
            <div>
                {
                    showTitle && (
                        <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center'}}>
                            <div style={{flexGrow: 1}}>
                                <H4>{title}</H4>
                            </div>
                        </div>
                    )
                }
                {
                    activities.length < 1 && (
                        <p style={{padding: '1rem', fontWeight: 500}}>No activities recorded.</p>
                    )
                }
            { activities.map((activity, index) => {
                return <ActivityLogFactory activity={activity} index={index} />
            }) }
            </div>
        </>
    )

}

ActivityLogWidget.defaultProps = {
    title: 'Activity Logs',
    showTitle: true,
    hasExternalPadding: true
}