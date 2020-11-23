import React from "react";
import ReactModal from "react-modal";
import {H1Spacer} from "./paragraph/Titles";
import {AiOutlineClose} from "react-icons/ai";
import styled from "styled-components";

export default function GModal({children, title, help, onClose, mStyle, autoResize, ...props}) {
    const size = autoResize ? {
        right: 'auto',
        top: '50%',
        left: '50%',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        outline: 0
    } : {};
    const style = {
        overlay: {
            zIndex: 9,
            backgroundColor: 'rgba(0,0,0,0.5)'
        },
        content: {
            padding: '0',
            ...mStyle,
            ...size
        }
    }
    return (
        <ReactModal isOpen style={style} ariaHideApp={false} {...props}>
            <ModalWrapper>
                <HeaderWrapper>
                    <HeaderH1>{title}</HeaderH1>
                    { help && <HeaderHelpText>{help}</HeaderHelpText> }
                </HeaderWrapper>
                <div style={{alignSelf: 'center', fontSize: '125%', cursor: 'pointer'}}>
                    <AiOutlineClose onClick={onClose}/>
                </div>
            </ModalWrapper>
            <H1Spacer/>
            <ModalBody>
                {children}
            </ModalBody>
        </ReactModal>
    )
}

const ModalWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 1.5rem;
`

const ModalBody = styled.div`
    max-height: 90vh;
    max-width: 90vw;
    min-width: 30vw;
    padding: 0 2rem 1.5rem 2rem;
`

const HeaderWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: center;
`

const HeaderH1 = styled.p`
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: #333;
`

const HeaderHelpText = styled.p`
    font-size: 0.8rem;
    line-height: 2rem;
    font-weight: 600;
    border-left: 1px solid #e5e5ea;
    margin: 0;
    margin-left: 1rem;
    padding-left: 1rem;
    color: #333;
`