import React from "react";
import styled from "styled-components";

export function PageTitle({ ...props}) {
    return(
        <>
            <PH1>{props.title}</PH1>
            <PHSubtitle>{props.sub}</PHSubtitle>
        </>
    )
}

export function H1({children, ...props}) {
    return(
        <PH1 {...props}>{children}</PH1>
    )
}

export function H2({children, ...props}) {
    return(
        <PH2 {...props}>{children}</PH2>
    )
}

export function H4({ children }) {
    return <PH4>{children}</PH4>
}

export function H1Spacer({ style }) {
    return <H1spacer style={style} />;
}

const H1spacer = styled.hr`
    margin: 0 0 1rem 0;
`

const PHSubtitle = styled.small`
    color: #666666;
    font-weight: 500;
`

const PH1 = styled.h1`
    font-weight: 400;
    letter-spacing: -1px;
    margin: 0;
    font-size: 1.45rem;
    line-height: 2.5rem;
    color: #303030;
`

const PH2 = styled.h2`
    font-weight: 500;
    font-size: 1.25rem;
    margin: 0;   
    line-height: 2.5rem;
    color: #303030;
`

const PH4 = styled.h4`
    font-weight: 500;
    font-size: 1rem;
    margin: 0;    
`