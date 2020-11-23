import styled from 'styled-components';
import React from 'react';

import { colors } from '../styles';

export default () => (
    <Unfortunately>
        Unfortunately data is not yet available here.
    </Unfortunately>
);

const Unfortunately = styled.p`
    font-size: 1.15rem;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
    color: ${colors.lightBlack}
    opacity: 0.5
`;
