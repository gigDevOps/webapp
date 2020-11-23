import React from "react";
import styled from "styled-components";
import { H2 } from "../paragraph/Titles";

export default function Card({ children, width, hasPadding, title, right, ...props }) {
    return (
        <CardWrapper width={width} hasPadding={hasPadding}>
            <CardWrapperInner>
                {
                    title && (
                        <CardTitle>
                            <H2 style={{flexGrow: 1}}>{ title }</H2>
                            <div style={{textAlign: 'right', fontSize: '85%', fontWeight: 500}}>{ right }</div>
                        </CardTitle>
                    )
                }
                <CardBody hasPadding={hasPadding}>
                    {children}
                </CardBody>
            </CardWrapperInner>
        </CardWrapper>
    )
}

Card.defaultProps = {
    hasPadding: true
};

const CardWrapper = styled.div`
    width: ${(props) => props.width};
    padding: 1rem 1rem 1rem 0rem;   
    display: flex;
    
    &:nth-of-type(1) {
        padding-left: 0;
    }
    &:last-child {
        padding-right: 0;
    }
`
const CardWrapperInner = styled.div`
    background: #ffffff;
    border: 0;
    box-shadow: 0 0 3px #E2E2E2;
    border-radius: 3px;
    width: 100%;
    height: 100%;
`

const CardTitle = styled.div`
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #E2E2E2;
    display: flex;
    align-items: center;
    h2 {
        flex-grow: 1;
    }
    `;
const CardBody = styled.div`
    padding: ${(props) => props.hasPadding ? '1rem' : '0'};
   `