import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { get } from 'lodash';
import { colors } from '../styles';
import Button from '../Button';

export default function InfoBox(props) {

    return (
        <>
            <StyledWrapper>
                <StyledTableWrapper>
                    <StyledTable>
                        <tbody>
                        {props.columns.map((c) => (
                            <tr key={c.key}>
                                {c.map((d) => {
                                    const value = get(props.dataSource, d.key);
                                    return (
                                        <React.Fragment key={d.key}>
                                            <StyledLineHeader>{d.value}{d.value ? ':' : ''}</StyledLineHeader>
                                            <StyledLine>
                                                {d.render ? d.render(props.dataSource) : (value || (d.value ? '-' : ''))}
                                            </StyledLine>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </StyledTable>
                </StyledTableWrapper>
                <StyledActionsBox>
                    {props.actions.map((a) => {
                        if (a.condition && !a.condition(props.dataSource)) {
                            return <></>;
                        }
                        /** Pass the context from the parent to the function. **/
                        const onClick = () => a.onClick(props.dataSource);
                        return <Button key={a.value} onClick={onClick} value={a.value} />;
                    })}
                </StyledActionsBox>
            </StyledWrapper>
            {
                props.debug
                    ? (
                        <div>
                            <pre>{JSON.stringify(props.dataSource, undefined, 2)}</pre>
                        </div>
                    ) : ''
            }
        </>
    );
}
InfoBox.propTypes = {
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.any.isRequired,
    actions: PropTypes.array,
};

InfoBox.defaultProps = {
    actions: [],
    debug: false,
};

const StyledActionsBox = styled.div`
  text-align: right;
  flex-grow: 1;

  button {
    display: inline-block;
    margin-right: 1rem;
    border-radius: 3px;

    :last-child {
      margin-right: 0;
    }
  }
`;

const StyledTableWrapper = styled.div``;

const StyledTable = styled.table`
  width: 100%;
  color: ${colors.lightBlack} td {
    padding: 0.5rem 2rem 0.5rem 0;
  }
`;

const StyledLineHeader = styled.td`
  font-weight: 600;
  padding: 0.5rem 1rem 0.5rem 0;
`;

const StyledLine = styled.td`
  padding: 0.5rem 2rem 0.5rem 0;
`;

const StyledWrapper = styled.div`
  font-size: 0.9rem;
  width: 100%;
  padding: 1rem;
  display: flex;
`;
