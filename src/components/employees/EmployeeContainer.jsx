import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import _ from 'lodash';

import {H1} from "../../interface/paragraph/Titles";
import {fetch} from "../../actions/generics";
import LoadingView from "../../interface/LoadingView";

export default function EmployeeContainer({ props }) {
    const employee = useSelector((store) => store.employee.data);
    const isFetchingEmployee = useSelector((store) => store.employee.isFetching);

    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        const path = ['/employees', params.id].join('/');
        dispatch(fetch('employee', path));
    }, [dispatch, params]);

    return (
        <LoadingView isFetching={isFetchingEmployee}>
            <H1>{_.get(employee, 'first_name')} {_.get(employee, 'other_names')}</H1>
        </LoadingView>
    )
}