import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {InputGroup} from "../../interface/forms/InputGroup";
import {Button} from "rsuite";
import LoadingPage from "../LoadingPage";
import {useDispatch, useSelector} from "react-redux";
import {create, fetch} from "../../actions/generics";

export default function QuestionCreate({ onSuccess, onFailure }) {
    const { register, handleSubmit, errors } = useForm({});
    const dispatch = useDispatch();
    const isQuestionCreating = useSelector((store)=>store.question.form.isPosting);
    const isFetchingDepartments = useSelector((store)=>store.organizations.isFetching);
    const departments = useSelector((store)=>store.organizations.data);
    const isFetchingShifts = useSelector((store)=>store.shifts.isFetching);
    const shifts = useSelector((store)=>store.shifts.data);
    
    useEffect(() => {
        dispatch(fetch('organizations', '/organization'));
        dispatch(fetch('shifts', '/shifts'));
    }, []);
    
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("question", data.question1);
        formData.append("dept_id", data.dept_id);
        formData.append("shift_id", data.shift_id);
        dispatch(create('question', '/performance_questions', formData, onSuccess, onFailure));
    }

    return(
        <>
            <LoadingPage loading={isQuestionCreating} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup label="Question 1">
                    <input ref={register} name="question1" placeholder="Question 1" />
                    <p>{errors.question1?.message}</p>
                </InputGroup>
                <InputGroup label="Question 2">
                    <input ref={register} name="question2" placeholder="Question 2" />
                    <p>{errors.question2?.message}</p>
                </InputGroup>
                <InputGroup label="Department" tooltip="Select the relevant department">
                    { isFetchingDepartments && <p>Loading departments...</p> }
                    {
                        !isFetchingDepartments && departments && (
                            <select name="dept_id" ref={register} >
                                {
                                    departments.map((d) => {
                                        return <option value={d.id}>{d.name}</option>
                                    })
                                }
                            </select>
                        )
                    }
                    <p>{errors.dept_id?.message}</p>
                </InputGroup>
                <InputGroup label="Shift" tooltip="Select the relevant shift">
                    { isFetchingShifts && <p>Loading shifts...</p> }
                        {
                            !isFetchingShifts && shifts && (
                                <select name="shift_id" ref={register} >
                                    {
                                        shifts.map((s) => {
                                            return <option value={s.id}>{s.shiftstarttime} to {s.shiftendtime}</option>
                                        })
                                    }
                                </select>
                            )
                        }
                    <p>{errors.shift_id?.message}</p>
                </InputGroup>
                <Button appearance="primary" type="submit">Save</Button>
            </form>
        </>
    )
}