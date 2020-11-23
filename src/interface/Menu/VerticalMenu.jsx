import React, {useState, createContext} from 'react';
import styled from 'styled-components';
import {NavLink, useLocation} from "react-router-dom";

const VerticalMenuContext = createContext({
    active: '/',
    setActive: () => {}
});

export default function VerticalMenu({menu, perms}) {
    const location = useLocation();
    const [active, setActive] = useState(location.pathname);
    return (
        <VerticalMenuContext.Provider value={{ active, setActive}}>
            <SidebarMenuItem>
                {menu.map((item) => {
                    if(item.perm && !item.perm.some(p => perms.includes(p))) return <></>;
                    return (typeof item.nodes !== 'undefined' && item.nodes.length > 0)
                        ? <MenuItemAccordion key={item.path} item={item}/>
                        : <MenuItemLink key={item.path} item={item}/>
                })}
            </SidebarMenuItem>
        </VerticalMenuContext.Provider>
    )
}
VerticalMenu.defaultProps = {
    perms: ""
}

const MenuItemLink = ({item, onClick}) => {
    return (
        <VerticalMenuContext.Consumer>
            {
                ({ setActive }) => (
                    <p>
                        <NavLink to={item.path} exact={item.exact || true} onClick={() => setActive(item.path)} style={{display: "flex", alignItems: "center"}}>
                            <IconWrapper>{item.icon}</IconWrapper> <span style={{flexGrow: 1}}>{item.text}</span>
                        </NavLink>
                    </p>
                )
            }
        </VerticalMenuContext.Consumer>
    )
}

MenuItemLink.defaultProps = {
    onClick: () => {}
}

const MenuItemAccordion = ({item}) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <VerticalMenuContext.Consumer>
            {
                ({active}) => (
                    <MenuItemAccordionWrapper>
                        <MenuItemLink item={item}/>
                        {
                            active.includes(item.path)
                                ? <SidebarSubMenuItem>
                                    {item.nodes.map((i) => {
                                        return <MenuItemLink key={i.path} item={i} />
                                    })}
                                </SidebarSubMenuItem>
                                : ''
                        }
                    </MenuItemAccordionWrapper>
                )
            }
        </VerticalMenuContext.Consumer>
    )
}

const IconWrapper = styled.span`
    padding-right: 0.75rem;
    font-size: 1rem;
    line-height: 1rem;
`

const MenuItemAccordionWrapper = styled.div`
    width: 100%;
`

const SidebarMenuItem = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    font-size: 80%;
    font-weight: 400;
    
    p {
        flex-grow: 1;
        margin: 0;
        width: 100%;
        
        a {
            padding: 0.5rem 3rem 0.5rem 2rem;
            color: #C7C7CA;
            text-decoration: none;
            display: block;
            margin: 0;
            border-left: 3px solid #203160;
            
            &.active {
                border-left: 3px solid #458de3;
                color: #ffffff;
                background: #294A84;
                font-weight: 700;
            }
        }
    }
    
    button {
        visibility: hidden;
    }
    
    &:hover button {
        visibility: visible;
    }
`

const SidebarSubMenuItem = styled.div`
    width: 100%;
    background: #f3f4f3;
    
    p {
        width: 100%;
        
        a {
            padding-left: 3.5rem;
        }
    }    
`