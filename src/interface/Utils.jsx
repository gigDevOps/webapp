import styled from "styled-components";

export const ListViewActionWrapper = styled.div`
    display: flex;
    align-items: center;
`

export const ListViewActionSelect = styled.div`
    flex-grow: 1;
`
export const ListViewActionActions = styled.div``

export const Button = styled.button`
    outline: 0;
    cursor: pointer;
`

export const XXLButton = styled(Button)`
    font-size: 1.5rem;
    border: 0;
    background: none;
    padding: 1rem 0;
    font-weight: 300;
`

export const ActionButton = styled(Button)`
    border: 1px solid #ccc;
    background: none;
    font-size: 0.85rem;
    padding: 0.5rem 1.25rem;
    text-transform: uppercase;
    
    &:hover {
        background: #eee;
    }
`

export const RefreshActionButton = styled(ActionButton)`
    border: 0;
    &:hover { 
        background: none 
    }
`