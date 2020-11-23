import React from "react";
import styled from "styled-components";

export default function() {
    return(
        <SearchInput placeholder={"Type in to search..."} />
    )
}

const SearchInput = styled.input`
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin: 0 1rem;
`