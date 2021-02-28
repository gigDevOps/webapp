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
import QuestionCreate from "../fragments/QuestionCreate";

export default function QuestionsContainer() {
    const questions = useSelector((store) => store.questions.data);
    const isFetching = useSelector((store) => store.questions.isFetching);

    const [showCreateQuestion, hideCreateQuestion] = useModal(() => (
        <GModal title="Create a new question" onClose={hideCreateQuestion}>
            <QuestionCreate
                onCancel={hideCreateQuestion}
                onSuccess={() => {
                    dispatch(fetch('questions', '/performance_questions'));
                    hideCreateQuestion();
                }}
                afterCreation={() => {
                    hideCreateQuestion();
                }}
                onFailure={() => { alert("Something went wrong with the frontend") }}
            />
        </GModal>
    ));

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetch('questions', '/performance_questions'));
    }, [dispatch]);

    if(!questions) return <p>Loading questions...</p>

    const locs = questions.map((loc) => loc);
    const columns = [
        { key: 'question', value: 'Question' },
        { key: 'question_type', value: 'Question Type' },
        { key: 'job_type.name', value: 'Job Type' },
        { key: 'department.name', value: 'Department' },
    ]

    return(
        <>
            <H1>Questions</H1>
            <ActionBar>
                <Button
                    style={{marginLeft: '0.5rem'}}
                    appearance="primary"
                    size="md"
                    onClick={() => showCreateQuestion()}
                >Create</Button>
            </ActionBar>
            <LoadingView isFetching={isFetching}>
                <DataTable
                    dataSource={locs}
                    columns={columns}
                    isFetching={isFetching}
                />
            </LoadingView>
        </>
    )
}
