import React from "react";
import styled from "styled-components";

export default function ({children}) {
    return(
        <StatBox>{children}</StatBox>
    )
}

const StatBox = styled.div`
    display: flex;
    flex-direction: row;    
`