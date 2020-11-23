import React from "react";
import srcLogo from "./assets/gigsasa-logo.png";
import styled from "styled-components";

export default function () {
    return(
        <Image src={srcLogo} alt="Gigsasa" />
    )
}

const Image = styled.img`
    padding: 0rem 1rem;    
    width: 100%;
    max-width: 9rem;
`