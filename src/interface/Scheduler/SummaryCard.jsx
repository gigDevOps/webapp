import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

export default function SummaryCard ({ label, value, ...props}) {
    return (
        <Wrapper>
            <Value>{value}</Value>
            <Label>{label}</Label>
        </Wrapper>
    )
}

SummaryCard.prototype.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
}
const Wrapper = styled.div`
    font-size: 0.8rem;
    padding: 0 1rem;
    margin: 0. 0.25rem;
    text-align: center;
    
    p {
        margin: 0;
    }
`
const Label = styled.p`
    font-weight: 500;
    text-transform: uppercase;
    font-size: 80%;
    padding-top: 0.25rem;
    color: #555555;
`

const Value = styled.p`
    font-weight: 600;
    font-size: 110%;
    color: #333;   
`