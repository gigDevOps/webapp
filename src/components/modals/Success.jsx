import React from 'react';
import {H1} from "../../interface/paragraph/Titles";
import Button from "../../interface/Button";
import checkMark from "../../assets/check.png";

export default ({visible, message, onDoneHandler}) => {
    return (
        visible
            &&
                <div
                    style={{backgroundColor: "rgba(0, 0, 0, 0.6)"}}
                    className="flex items-center justify-center fixed min-h-full left-0 right-0 top-0 bottom-0"
                >
                    <div className="bg-white rounded-md px-8 py-6 w-full mx-5 md:mx-0 md:max-w-sm lg:max-w-md" >
                        <img src={checkMark} alt="Success" width="50px" className="m-auto" />
                        <H1 className="text-center">Success!</H1>
                        <div className="bg-secondary rounded h-1 w-12 my-3 mx-auto" />
                        <p className="text-center">{message}</p>
                        <Button
                            className="focus:outline-none mt-4 mb-2 p-4 w-full"
                            onClick={onDoneHandler}
                        >
                            Done
                        </Button>
                    </div>
                </div>
    );
}
