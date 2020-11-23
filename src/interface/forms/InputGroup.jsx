import React from "react";
import styled from "styled-components";

export function InputGroup({children, label, tooltip}) {
    return(
        <InputGroupWrapper>
            { label ? <label>{label}</label> : "" }
            <div style={{flexGrow: 1}}>
                <div className="input-container">
                    {children}
                </div>
                { tooltip ? <small>{tooltip}</small> : ""}
            </div>
        </InputGroupWrapper>
    )
}

const InputGroupWrapper = styled.div`
    padding-bottom: 1rem;
    flex-direction: row;
    display: flex;
            
    .input-error {
        display: block;
    }
    .input-container {
        display: flex;
        align-items: center;
        flex-grow: 1;
        input, select {
            margin: 0 0.5rem;
            :first-child {
                margin-left: 0;
            }
            :last-child {
                margin-right: 0;
            }
        }
    }
    label {
        text-transform: uppercase;
        color: #555;
        font-size: 80%;
        display: block;
        width: 20%;
        max-width: 25rem;
    }   

    input, select {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        border: 1px solid #d5d6d5;
        border-radius: 3px;
        padding: 0.5rem 1rem;
        margin: 0.5rem 0;
    }
    
    input[type="checkbox"] {
        width: auto;
        margin-right: 0.5rem !important;
    }
`