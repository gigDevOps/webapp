import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles';

export default function InfoRow(props) {
    return (
        <StyledTable>
            <tbody>
            {props.columns.map((c) => (
                    <tr key={c.key}>
                        {c.map((d) => (
                                <React.Fragment key={d.key}>
                                    <StyledLineHeader>{d.value}:</StyledLineHeader>
                                    <td>{props.dataSource[d.key]}</td>
                                </React.Fragment>
                            ))}

                    </tr>
                ))}
            </tbody>
        </StyledTable>
    );
}

const StyledTable = styled.table`
    width: 100%;
    color: ${colors.lightBlack}
    
    td {
        padding: 0.5rem 2rem 0.5rem 0;
    }
`;

const StyledLineHeader = styled.td`
    font-weight: 600;
    padding: 0.5rem 0;
`;
