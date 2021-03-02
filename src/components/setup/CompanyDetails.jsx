import React, { useState } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import {useDispatch, useSelector} from 'react-redux';
import {create, fetch} from "../../actions/generics";
import {H1} from "../../interface/paragraph/Titles";
import Button from "../../interface/Button";
import SuccessModal from "../modals/Success";
import Dropzone from "../../interface/Dropzone";
import LoadingPage from "../LoadingPage";

/**
 * @description Assemble inputs to form a personalDetailsForm
 */
export default function (props) {
    const setup = useSelector((store) => store.setup);
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    const [formValues, setValue] = useState({
        companyName: '',
        description: '',
        address: '',
        phoneNo: '',
        webUrl: '',
        email: ''
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

    const onModalDoneHandler = () => {
        setModalVisible(false);
        dispatch(fetch('company', '/get-company'));
        props.nextHandler();
    }

    const onSaveContinueHandler = (e) => {
        e.preventDefault();
        if (companyName && description && address && webUrl && email && phoneNo && acceptedFiles.length) {
            let formData = new FormData();
            formData.append("company_name", companyName);
            formData.append("description", description);
            formData.append("address", address);
            formData.append("website", webUrl);
            formData.append("email", email);
            formData.append("contact", phoneNo);
            formData.append("company_logo", acceptedFiles[0]);
            dispatch(create('setup', '/company', formData, ()=>setModalVisible(true)));
        }
    }

    const { companyName, description, address, webUrl, email, phoneNo } = formValues;

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
                        <H1>Provide your company details</H1>
                        <div className="border-b-2 border-gray-200 pb-3">
                            <p className="text-lg mt-8 mb-2 text-gray-800">Company details</p>
                        </div>
                    </header>

                    <form autoComplete="noop" onSubmit={onSaveContinueHandler}>
                        <p className="mt-2 text-gray-800">Enter Company Name</p>
                        <input
                            type="text"
                            value={companyName}
                            className="focus:outline-none"
                            placeholder="Enter company name"
                            name="companyName"
                            onChange={(e) => handleFormInput(e)}
                        />
                        <p className="mt-2 text-gray-800">Upload Company Logo</p>
                        <Dropzone
                            open={open}
                            getRootProps={getRootProps}
                            isDragActive={isDragActive}
                            getInputProps={getInputProps}
                            acceptedFiles={acceptedFiles}
                        />
                        <p className="mt-2 text-gray-800">Company Description</p>
                        <textarea
                            value={description}
                            rows={5}
                            className="focus:outline-none"
                            placeholder="Enter your company description here"
                            name="description"
                            onChange={(e) => handleFormInput(e)}
                        />
                        <p className="mt-2 text-gray-800">Company Address</p>
                        <textarea
                            value={address}
                            rows={5}
                            className="focus:outline-none"
                            placeholder="Enter your company address here"
                            name="address"
                            onChange={(e) => handleFormInput(e)}
                        />
                        <p className="mt-2 text-gray-800">Company Website</p>
                        <input
                            type="text"
                            value={webUrl}
                            className="focus:outline-none"
                            placeholder="Enter your company's website URL here"
                            name="webUrl"
                            onChange={(e) => handleFormInput(e)}
                        />
                        <p className="mt-2 text-gray-800">Company Email id</p>
                        <input
                            type="text"
                            value={email}
                            className="focus:outline-none"
                            placeholder="Enter your company's Email id here"
                            name="email"
                            onChange={(e) => handleFormInput(e)}
                        />
                        <p className="mt-2 text-gray-800">Company Contact Number</p>
                        <input
                            type="phone"
                            value={phoneNo}
                            className="focus:outline-none"
                            placeholder="Enter your company's contact number here"
                            name="phoneNo"
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
                message="Your company has been created successfully."
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
