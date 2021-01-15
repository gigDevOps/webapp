import React, { useState } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import {useDispatch, useSelector} from 'react-redux';
import {create} from "../../actions/generics";
import {H1} from "../../interface/paragraph/Titles";
import Button from "../../interface/Button";
import SuccessModal from "../modals/Success";
import Dropzone from "../../interface/Dropzone";
import { toInteger } from 'lodash';

/**
 * @description Assemble inputs to form a personalDetailsForm
 */
export default function (props) {
    const setup = useSelector((store) => store.setup);
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    const [formValues, setValue] = useState({
        fullName: '',
        role: '-1',
        phoneNo: '',
    });
    const { getRootProps, getInputProps, open, isDragActive, acceptedFiles } = useDropzone({
        noClick: true,
        noKeyboard: true,
        accept: 'image/jpg, image/jpeg, image/png',
        maxFiles: 1
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

    const splitName = () => {
        const spaceIndex = fullName.indexOf(' ');
        if(spaceIndex>0) {
            return {
                first_name: fullName.slice(0, spaceIndex),
                other_names: fullName.slice(spaceIndex+1, fullName.length)
            }
        }
        return {
            first_name: fullName,
            other_names: ""
        }
    }

    const onModalDoneHandler = () => {
        setModalVisible(false);
        props.nextHandler();
    }

    const onCreateProfileHandler = async(e) => {
        e.preventDefault();
        if (fullName && role!=="-1" && phoneNo && acceptedFiles.length) {
            const {first_name, other_names} = splitName();
            let formData = new FormData();
            formData.append("first_name", first_name);
            formData.append("other_names", other_names);
            formData.append("phone", phoneNo);
            formData.append("profile_pic", acceptedFiles[0]);
            formData.append("role_id", toInteger(role));
            dispatch(create('setup', '/profile', formData, ()=>setModalVisible(true)));
            console.log({setup});
        }
    }

    const { fullName, role, phoneNo } = formValues;

    return (
        <div className="w-full bg-white">
            <div className="flex min-h-screen bg-white m-auto p-8 md:p-16 lg:p-24 sm:w-full md:w-4/5 lg:w-7/12">
                <LoginFormContainer>
                    <header className="-mt-7">
                        <H1>Complete Your Profile</H1>
                        <p className="text-lg mt-8 mb-2 text-gray-800">Personal Details</p>
                        <div className="border-b-2 border-gray-200 pb-3">
                            <p className="text-gray-500">Please enter the following details to complete your profile</p>
                        </div>
                    </header>

                    <form autoComplete="noop" onSubmit={onCreateProfileHandler}>
                        <input
                            type="text"
                            value={fullName}
                            className="focus:outline-none"
                            placeholder="Your full name"
                            name="fullName"
                            onChange={(e) => handleFormInput(e)}
                        />

                        <input
                            type="phone"
                            value={phoneNo}
                            className="focus:outline-none"
                            placeholder="Your phone number"
                            name="phoneNo"
                            onChange={(e) => handleFormInput(e)}
                        />
                        <select
                            style={styles.select}
                            className="focus:outline-none w-full mr-4"
                            name="role" value={role}
                            onChange={(e) => handleFormInput(e)}
                        >
                            <option value="-1">What is your role at company?</option>
                            <option value="2">Company</option>
                            <option value="3">Employer</option>
                            <option value="4">Supervisor</option>
                        </select>
                        <p className="mt-2 text-gray-800">Upload your profile photo</p>
                        <Dropzone
                            open={open}
                            getRootProps={getRootProps}
                            isDragActive={isDragActive}
                            getInputProps={getInputProps}
                            acceptedFiles={acceptedFiles}
                        />
                        <div className="flex justify-between items-end">
                            <p className="text-gray-500">Step <span className="text-green-500 text-lg">1</span> Of 2</p>
                            <Button
                                className="focus:outline-none mt-4"
                                style={{paddingRight: "3.2em", paddingLeft: "3.2em"}}
                                onClick={onCreateProfileHandler}
                            >
                                Create Profile
                            </Button>
                        </div>
                    </form>
                </LoginFormContainer>
            </div>
            <SuccessModal
                visible={modalVisible}
                message="Your account has been created successfully."
                onDoneHandler={onModalDoneHandler}
            />
        </div>
    );
}

const styles = {
    select: {
        padding: "1rem",
        margin: "0.5rem 0",
        border: "1px solid #eee",
        borderRadius: "3px",
        backgroundColor: "#F6F6F6"
    }
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
  }
`;