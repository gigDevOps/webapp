import styled from "styled-components";

export const SimpleTable = styled.table`
    width: 100%;
    border-bottom: 1px solid #ececec;
    overflow-x: auto;
    font-size: 85%;
    font-weight: 500;
    white-space: ${(props) => props.noWrap ? 'nowrap' : 'inherit'};
    
    
    thead {
        tr {
            th {
                
                text-align: left;
                padding: 0rem 0 0.75rem 0;
                margin-bottom: 0.5rem;
                border-bottom: 1px solid #DFDFDF;
                font-weight: 500;
                
                &:first-child {
                    padding-left: 1rem;
                }
            }
        }
    }
    
    tbody {
        tr {
            &:nth-child(even) {
                background: ${(props) => props.alternate ? '#f3f3f8' : ''};
            }
            td {
                font-weight: 500;
                padding: 0.5rem 0;
                border-bottom: 1px solid #DFDFDF;
                vertical-align: top;
                
                &:first-child {
                    padding-left: 1rem;
                }
            }
        }
    }
`