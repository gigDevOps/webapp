import React from "react";
import styled from "styled-components";

export function AccordionTitle(props) {
    return (
        <H3Wrapper onClick={props.onClick}>
            <H3>{props.title}</H3>
            <span>{props.children}</span>
        </H3Wrapper>
    )
}

export const AccordionWrapper = styled.div`
    padding: 1rem 0;
`;
export const AccordionContents = styled.div`
    padding: 1.5rem 0;
`;

const H3Wrapper = styled.div`
    border-bottom: 1px solid #000;
    padding-bottom: 0.25rem;
    
    span {
        color: #999;
        font-weight: 300
        font-size: 0.7rem;
    }
`
const H3 = styled.h3`
    font-weight: 500;
    display: inline-block;
    padding-right: 1rem;
    margin: 0;
`