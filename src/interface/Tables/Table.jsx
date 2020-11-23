import styled from "styled-components";

export const Table = styled.table`
    width: 100%;
    border: 1px solid #cccccc;
    border-radius: 5px;
    background: #ffffff;
    white-space: ${(props) => props.noWrap ? 'nowrap' : 'inherit'};
    
    thead {
        th {
            padding: 1.5rem 1rem;
            font-weight: 500;
            text-align: right;
        }
    }   
    tbody {
        font-size: 90%;
        
        tr {
            border: 1px solid #cccccc;
            &:nth-child(odd) {
               background: ${(props) => props.alternate ? '#f3f3f8' : ''};
            }
            td {
                padding: 1rem 1.5rem;
                text-align: right;
                
                &:first-child {
                    text-align: left;
                    font-weight: 500;
                }
            }
        }
    }
`