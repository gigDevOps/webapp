import React from "react";
import Avatar from "react-avatar";
import styled from "styled-components";

export default function ({name}) {
    return(
        <Container>
                <Label>Organization: </Label>
                <Avatar size={24} name={name} round />
                <Text>{name}</Text>
        </Container>
    )
};

const Container = styled.div`
    padding: 0 2rem;
    display: flex;
    font-weight: 400;
    align-items: center;
    border-left: 1px solid #ddd;
`

const Label = styled.span`
    font-size: 0.8rem;
    opacity: 0.75;
    text-transform: capitalize;
    padding-right: 1rem;
`

const Text = styled.span`
    padding-left: 0.5rem;
`;