import React from "react";
import styled from "styled-components";

export default function Box({ children }) {
    return (
        <BoxWrapper>
            {children}
        </BoxWrapper>
    )
}

const BoxWrapper = styled.div`
    padding: 1.5rem;
    margin: 1rem 0;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #f3f3fe;
    box-shadow: 0px 3px 3px 0px rgba(0,0,0,0.05);
`