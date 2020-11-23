import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

export default function RosterCalendar({ ...props }) {
    return(
        <Table>
            <thead>

            </thead>
        </Table>
    )
}

RosterCalendar.prototype.propTypes = {

}

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 80%;
    
    th {
        font-weight: 600;
    }
    th {
        padding: 0.5rem;
    }
    td {
        border: 1px solid #d5d6d5;
        font-weight: 600;
        &:first-child {
            border-right-width: 3px;
            width: 20%;
            font-weight: 400;
        }
    }
`