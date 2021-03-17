import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputGroup } from '../../interface/forms/InputGroup';
import { Button } from 'rsuite';
import LoadingPage from '../LoadingPage';
import { useDispatch, useSelector } from 'react-redux';
import { create, fetch } from '../../actions/generics';

export default function CreateShift({ onSuccess, onFailure }) {
  const { register, handleSubmit, errors } = useForm({});
  const dispatch = useDispatch();
  const isShiftCreating = useSelector((store) => store.shift.form.isPosting);
  const isFetchingLocations = useSelector(
    (store) => store.locations.isFetching
  );
  const locations = useSelector((store) => store.locations.data);

  useEffect(() => {
    dispatch(fetch('locations', '/location'));
  }, []);

  const onSubmit = (data) => {
    dispatch(create('shift', '/shifts', data, onSuccess, onFailure));
  };

  return (
    <>
      <LoadingPage loading={isShiftCreating} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup label="Shift Start">
          <input
            ref={register({ required: true })}
            name="shiftstartdate"
            placeholder="Start Date"
            type="date"
          />
          <input
            ref={register({ required: true })}
            name="shiftstarttime"
            placeholder="Start Time"
            type="time"
          />
        </InputGroup>
        <InputGroup label="Shift End">
          <input
            ref={register({ required: true })}
            name="shiftenddate"
            placeholder="End Date"
            type="date"
          />
          <input
            ref={register({ required: true })}
            name="shiftendtime"
            placeholder="End Time"
            type="time"
          />
        </InputGroup>
        <InputGroup
          label="Minimum Working Hours"
          tooltip="Minimum Woking Hours"
        >
          <input
            name="minimum_hours"
            type="integer"
            ref={register({ required: true })}
          />
          {errors.nemployees && (
            <span>You need to input how many employees for this shift</span>
          )}
        </InputGroup>
        <InputGroup label="Location" tooltip="Select the relevant location">
          {isFetchingLocations && <p>Loading locations...</p>}
          {!isFetchingLocations && locations && (
            <select name="location_id" ref={register}>
              {locations.map((d) => {
                return (
                  <option value={d.id}>
                    {d.name} ({d.address})
                  </option>
                );
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
