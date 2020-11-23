import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from './styles';

export default function Button(props) {
    const {
        id,
        onClick,
        value,
        children,
        disabled,
        type,
        category,
        size,
        isReversed,
        style,
    } = props;

    const BTN_SIZES = {
        xsmall: { padding: '0.25rem 1rem', fontSize: '0.75rem' },
        small: { padding: '0.5rem 1rem', fontSize: '0.85rem' },
        medium: { padding: '0.85rem 1rem', fontSize: '1rem' },
        large: { padding: '1rem', fontSize: '1.25rem' },
        xlarge: { padding: '1.25rem 1rem', fontSize: '1.25rem' },
    };

    const BTN_COLOR_STYLES = {
        primary: {
            backgroundColor: colors.orange,
            color: colors.white,
            border: `1px solid ${colors.white}`,
        },
        warning: {
            backgroundColor: colors.red,
            color: colors.red,
            border: `1px solid ${colors.red}`,
        },
        soft: {
            backgroundColor: colors.lightGrey,
            color: colors.black,
            border: `1px solid ${colors.grey}`,
        },
        info: {
            backgroundColor: colors.yellow,
            color: colors.white,
            border: `1px solid ${colors.yellow}`,
        },
        link: {
            background: 'none',
            color: colors.black,
            border: `1px solid ${colors.black}`,
        },
    };

    const getReversed = (property) => {
        switch (property) {
            case 'color':
                return isReversed
                    ? BTN_COLOR_STYLES[category].backgroundColor
                    : BTN_COLOR_STYLES[category].color;

            case 'bgColor':
                return isReversed ? 'none' : BTN_COLOR_STYLES[category].backgroundColor;

            default:
                // border-color
                return isReversed
                    ? `1px solid ${BTN_COLOR_STYLES[category].backgroundColor}`
                    : BTN_COLOR_STYLES[category].border;
        }
    };

    return (
        <ButtonContainer
            className={type}
            id={id}
            onClick={onClick}
            {...props}
            disabled={disabled}
            type={type}
            category={category}
            size={size}
            isReversed={isReversed}
            style={{
                border: disabled ? `1px solid ${colors.grey}` : getReversed(''),

                color: disabled ? colors.black : getReversed('color'),

                backgroundColor: disabled
                    ? colors.greyBackground
                    : getReversed('bgColor'),

                ...BTN_SIZES[size],
                ...style, // any overrides
            }}
        >
            {value || children}
        </ButtonContainer>
    );
}

Button.propTypes = {
    id: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    value: PropTypes.any,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.any,
    size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
    category: PropTypes.oneOf(['warning', 'info', 'link', 'primary', 'soft']),
    isReversed: PropTypes.bool,
    style: PropTypes.object,
};

Button.defaultProps = {
    id: '',
    type: 'button',
    disabled: false,
    value: '',
    children: '',
    size: 'medium',
    category: 'primary',
    isReversed: false,
    style: {},
};

const ButtonContainer = styled.button`
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 2rem;
  margin-right: 0.25rem;
  font-family: inherit;
  font-weight: 600;
  font-size: 1em;
  transition: all 0.3s ease;
  box-sizing: border-box;

  background: ${(props) => props.isReversed && 'none'} !important;

`;
