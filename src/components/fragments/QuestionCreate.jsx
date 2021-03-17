import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputGroup } from '../../interface/forms/InputGroup';
import { Button } from 'rsuite';
import LoadingPage from '../LoadingPage';
import { useDispatch, useSelector } from 'react-redux';
import { create, fetch } from '../../actions/generics';

export default function QuestionCreate({ onSuccess, onFailure }) {
  const { register, handleSubmit, errors } = useForm({});
  const dispatch = useDispatch();
  const isQuestionCreating = useSelector(
    (store) => store.question.form.isPosting
  );
  const isFetchingDepartments = useSelector(
    (store) => store.organizations.isFetching
  );
  const departments = useSelector((store) => store.organizations.data);
  const isFetchingJobTypes = useSelector((store) => store.job_type.isFetching);
  const jobTypes = useSelector((store) => store.job_type.data);

  useEffect(() => {
    dispatch(fetch('job_type', '/job_type'));
    dispatch(fetch('organizations', '/organization'));
  }, []);

  const onSubmit = (data) => {
    dispatch(
      create('question', '/performance_questions', data, onSuccess, onFailure)
    );
  };

  return (
    <>
      <LoadingPage loading={isQuestionCreating} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup label="Question">
          <input ref={register} name="question" placeholder="Question" />
          <p>{errors.question?.message}</p>
        </InputGroup>
        <InputGroup
          label="Question Type"
          tooltip="When should users see the question"
        >
          <select name="question_type" ref={register}>
            <option value="Clock In">Clock In</option>
            <option value="Clock Out">Clock Out</option>
          </select>
          <p>{errors.question_type?.message}</p>
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
        {/* <InputGroup label="Job type" tooltip="Select the relevant Job Type">
          {isFetchingJobTypes && <p>Loading job types...</p>}
          {!isFetchingJobTypes && jobTypes && (
            <select name="job_type_id" ref={register}>
              {jobTypes.map((s) => {
                return <option value={s.id}>{s.name}</option>;
              })}
            </select>
          )}
          <p>{errors.job_type_id?.message}</p>
        </InputGroup> */}
        <Button appearance="primary" type="submit">
          Save
        </Button>
      </form>
    </>
  );
}
