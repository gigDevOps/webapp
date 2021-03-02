import React, { useState } from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {create, fetch} from "../../actions/generics";
import {H1} from "../../interface/paragraph/Titles";
import Button from "../../interface/Button";
import SuccessModal from "../modals/Success";
import {Message} from "rsuite";
import { get } from "lodash";
import LoadingPage from "../LoadingPage";

/**
 * @description Assemble inputs to form a department details
 */
export default function (props) {
    const setup = useSelector((store) => store.setup);
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    const [formValues, setValue] = useState({
        name: '',
        team_size: '',
        email: '',
    });

    /**
     * @description Respond to onChange event in form
     * @param {*} e Event
     */
    function handleFormInput(e) {
        e.preventDefault();
        setValue({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    }

    const onModalDoneHandler = () => {
        setModalVisible(false);
        dispatch(fetch('departments', '/organization'));
        props.nextHandler();
    }

    const onSaveContinueHandler = (e) => {
        e.preventDefault();
        dispatch(create('setup', '/organization', formValues, ()=>setModalVisible(true)))
    }

    const { name, team_size, email } = formValues;

    if (setup.form.isPosting){
        return <LoadingPage loading={setup.form.isPosting} />
    }

    return (
        <div className="w-full bg-white">
            <div className="w-full md:w-9/12 pt-8 md:pt-16 lg:pt-24 m-auto">
                <span className="flex items-center text-lg cursor-pointer" onClick={props.backHandler}>
                    <img className="w-2 h-4 mr-2" src={require("../../assets/left_arrow.png")} />
                    <p className="text-xl text-gray-500">Back</p>
                </span>
            </div>
            <div className="flex min-h-screen bg-white m-auto px-8 md:px-16 lg:px-24 pb-8 md:pb-16 lg:pb-24 sm:w-full md:w-4/5 lg:w-7/12">
                <LoginFormContainer>
                    <header className="-mt-7">
                        <H1>Create a Department</H1>
                        <div className="border-b-2 border-gray-200 pb-3">
                            <p className="text-lg mt-8 mb-2 text-gray-800">Department details</p>
                        </div>
                    </header>
                    {setup.form.postError && <Message type="error" description={get(setup, 'form.postError.message', '')} />}

                    <form autoComplete="noop" onSubmit={onSaveContinueHandler}>
                        <p className="mt-2 text-gray-800">Enter Department Name</p>
                        <input
                            type="text"
                            value={name}
                            className="focus:outline-none"
                            placeholder="Enter department name"
                            name="name"
                            onChange={(e) => handleFormInput(e)}
                        />
                        <p className="mt-2 text-gray-800">Department Size</p>
                        <input
                            type="number"
                            value={team_size}
                            className="focus:outline-none"
                            placeholder="Department Size"
                            name="team_size"
                            onChange={(e) => handleFormInput(e)}
                        />
                        <p className="mt-2 text-gray-800">Invite supervisor</p>
                        <input
                            type="email"
                            value={email}
                            className="focus:outline-none"
                            placeholder="Supervisor Email"
                            name="email"
                            onChange={(e) => handleFormInput(e)}
                        />
                        <div className="flex justify-between items-end border-t-2 border-gray-200 pt-1 mt-3">
                            <p className="text-gray-500">Step <span className="text-green-500 text-lg">2</span> Of 2</p>
                            <Button
                                className="focus:outline-none mt-4"
                                style={{paddingRight: "3.2em", paddingLeft: "3.2em"}}
                                onClick={onSaveContinueHandler}
                            >
                                Save & Continue
                            </Button>
                        </div>
                    </form>
                </LoginFormContainer>
            </div>
            <SuccessModal
                visible={modalVisible}
                message="Your department has been created successfully."
                onDoneHandler={onModalDoneHandler}
            />
        </div>
    );
}

const LoginFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
  margin: auto;
  background: #ffffff;
  height: 100%;

  header {
    padding: 2rem 0 1rem 0;
  }

  form {
    width: 100%;
  display: flex;
  flex-direction: column;
    
    input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  border: 1px solid #f69425;
  -webkit-text-fill-color: #000;
  -webkit-box-shadow: 0 0 0px 1000px #F6F6F6 inset;
  transition: background-color 5000s ease-in-out 0s;
}
    
    input {
        padding: 1rem;
        margin: 0.5rem 0;
        border: 1px solid #eee;
        border-radius: 3px;
        background-color: #F6F6F6;
        color: #333;
    }
    textarea {
        padding: 1rem;
        margin: 0.5rem 0;
        border: 1px solid #eee;
        border-radius: 3px;
        background-color: #F6F6F6;
        color: #333;
        resize: none;
    }
  }
`;
