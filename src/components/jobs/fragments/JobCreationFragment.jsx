import React, {useState} from "react";
import PageTitle from "../../../interface/PageTitle";

import {StateMachineProvider, createStore} from "little-state-machine";
import CreateJobClientFragment from "./CreateJobClientFragment";
import CreateJobDetailsFragment from "./CreateJobDetailsFragment";
import CreateJobBillingFragment from "./CreateJobBillingFragment";
import CreateJobPreviewFragment from "./CreateJobPreviewFragment";

createStore(
    { data: {} },
    {
        middleWares: [],
        syncStores: {
            // you can sync with external store and transform the data
            externalStoreName: 'initial',
            transform: ({ externalStoreData, currentStoreData }) => {
                return { data: {}};
            }
        }
    }
);

export default function (props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const updateIndex = (increment) => {
        setCurrentIndex(currentIndex + increment);
    }
    const getActive = (index) => {
        return currentIndex === index;
    }
    const setActive = (index) => {
        setCurrentIndex(index);
    }
    return (
        <>
            <PageTitle>Create new job</PageTitle>
            <StateMachineProvider>
                <CreateJobClientFragment isVisible={getActive(0)} onSubmit={updateIndex} setActive={setActive} />
                <CreateJobDetailsFragment isVisible={getActive(1)} onSubmit={updateIndex} setActive={setActive} />
                <CreateJobBillingFragment isVisible={getActive(2)} onSubmit={updateIndex} setActive={setActive} />
                <CreateJobPreviewFragment onSuccess={() => {
                    props.onSuccess();
                }} />
            </StateMachineProvider>
        </>
    )
}