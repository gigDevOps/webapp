import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from './Button';
import { colors } from './styles';

export default function DropDownBtn(props) {
    const { menuItems, value, size } = props;

    const [showMenu, setShowMenu] = useState(false);
    function toggleShowMenu() {
        setShowMenu(!showMenu);
    }

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            showMenu && setShowMenu(false);
        }
    });

    return (
        <Container>
            <Button onClick={toggleShowMenu} size={size}>
                <DropDownBtnWrapper>
                    {value}

                </DropDownBtnWrapper>
            </Button>
            {showMenu && (
                <DropDownItemsMenu
                    toggleShowMenu={toggleShowMenu}
                    menuItems={menuItems}
                />
            )}
        </Container>
    );
}

DropDownBtn.propTypes = {
    value: PropTypes.string.isRequired,
    menuItems: PropTypes.array.isRequired,
};

const Container = styled.div`
  display: inline;
  position: relative;
`;

const DropDownBtnWrapper = styled.div`
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    margin-left: 1rem;
  }
`;

export function DropDownItemsMenu(props) {
    const { menuItems, toggleShowMenu } = props;

    const handleClick = (menuItem) => {
        toggleShowMenu();
        menuItem.onClick();
    };

    return (
        <MenuItemsWrapper>
            {menuItems.map((menuItem) => (
                <span>
          <Button
              key={menuItem.key}
              value={menuItem.value}
              onClick={() => {
                  handleClick(menuItem);
              }}
          />
        </span>
            ))}
        </MenuItemsWrapper>
    );
}

DropDownItemsMenu.propTypes = {
    menuItems: PropTypes.array.isRequired,
    toggleShowMenu: PropTypes.func.isRequired,
};

const MenuItemsWrapper = styled.div`
  width: fit-content;
  z-index: 1000;
  position: absolute;
  top: 25px;
  right: 0.75rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-shadow: 0 1px 2px #ccc;
  background: ${colors.white};
  padding: 0.5em;

  border: 1px solid ${colors.grey};
  border-radius: 3px;

  button {
    padding: 0.5em;
    background: none;
    border: none;
    outline: none;
    color: ${colors.lightBlack};

    :hover {
      background: ${colors.darkBlue};
      color: ${colors.white};
    }
  }
`;
