import React from "react";
import styled from "styled-components";

export function ActionBar({ children }) {
    return <ActionBarWrapper>{children}</ActionBarWrapper>
}

const ActionBarWrapper = styled.div`
    display: flex;
    flexDirection: row; 
    padding: 1rem 0;
    border: 1px solid #d5d6d5;
    border-right: none; 
    border-left: none;
    margin-bottom : 1rem;
    margin-top: 0.5rem;
`