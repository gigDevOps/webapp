import React, { useState, useEffect } from 'react';
import { Button } from 'rsuite';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import 'yup-phone';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPage from '../LoadingPage';
import { create, fetch } from '../../actions/generics';
import { InputGroup } from '../../interface/forms/InputGroup';

const schema = yup.object().shape({
  first_name: yup.string().required(),
  other_names: yup.string().required(),
  email: yup.string().email(),
  // phone_number: yup.string().phone().required()
});

export default function AddEmployee({ onCancel, onSuccess, ...props }) {
  const isCreatingEmployee = useSelector(
    (store) => store.employee.form.isPosting
  );
  const isFetchingDepartments = useSelector(
    (store) => store.organizations.isFetching
  );
  const departments = useSelector((store) => store.organizations.data);
  const isFetchingRoles = useSelector((store) => store.roles.isFetching);
  const roles = useSelector((store) => store.roles.data);
  const [serverErrors, setServerErrors] = useState({});
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!departments || departments.length < 1) {
      dispatch(fetch('organizations', '/organization'));
    }
    if (!roles || roles.length < 1) {
      dispatch(fetch('roles', '/role'));
    }
  }, []);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('other_names', data.other_names);
    formData.append('dept_id', data.dept_id);
    formData.append('employee_id', data.employee_id);
    formData.append('phone_no', data.phone_number);
    formData.append('email', data.email);
    formData.append('job_type', data.job_type);

    formData.append('role_id', data.role_id);
    dispatch(
      create('employee', '/candidate_profile', formData, onSuccess, (res) => {
        if (res.data) {
          setServerErrors(res.data);
        }
      })
    );
  };

  return (
    <>
      <LoadingPage loading={isCreatingEmployee} />
      {serverErrors.msg && <p>{serverErrors.msg}</p>}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="none">
        <InputGroup label="Name">
          <input
            type="text"
            autoComplete="none"
            placeholder="First name"
            name="first_name"
            ref={register}
          />
          <p>{errors.first_name?.message}</p>
          <input
            type="text"
            autoComplete="none"
            placeholder="Other names"
            name="other_names"
            ref={register}
          />
          <p>{errors.other_names?.message}</p>
        </InputGroup>
        <InputGroup label="Mobile Phone Number">
          <input
            type="text"
            autoComplete="none"
            placeholder="Mobile phone number (254xxx)"
            name="phone_number"
            ref={register}
          />
          <p>{errors.phone_number?.message}</p>
        </InputGroup>
        <InputGroup label="Email">
          <input
            type="email"
            autoComplete="none"
            placeholder="Employee email"
            name="email"
            ref={register}
          />
          <p>{errors.email?.message}</p>
        </InputGroup>
        <InputGroup label="Job Type">
          <input
            type="text"
            autoComplete="none"
            placeholder="Job Type"
            name="job_type_id"
            ref={register}
          />
          <p>{errors.job_type_id?.message}</p>
        </InputGroup>
        <InputGroup label="Role" tooltip="Select the relevant role">
          {isFetchingRoles && <p>Loading roles...</p>}
          {!isFetchingRoles && roles && (
            <select name="role_id" ref={register}>
              {roles.map((r) => {
                return <option value={r.id}>{r.name}</option>;
              })}
            </select>
          )}
          <p>{errors.role_id?.message}</p>
        </InputGroup>
        <InputGroup label="Department" tooltip="Select the relevant department">
          {isFetchingDepartments && <p>Loading departments...</p>}
          {!isFetchingDepartments && departments && (
            <select name="dept_id" ref={register}>
              {departments.map((d) => {
                return <option value={d.id}>{d.name}</option>;
              })}
            </select>
          )}
          <p>{errors.dept_id?.message}</p>
        </InputGroup>
        <Button appearance="primary" type="submit">
          Save
        </Button>
      </form>
    </>
  );
}
