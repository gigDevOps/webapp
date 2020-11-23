import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export default function GroupCardsStats({stats}) {
    return (
        <GroupCardsWrapper>
            {stats.map((s) => {
                return (
                    <StatBox>
                        <h3>{s.text}</h3>
                        <p>{s.value}</p>
                    </StatBox>
                )
            })}
        </GroupCardsWrapper>
    )
};

GroupCardsStats.prototype.propTypes = {
    stats: PropTypes.array.isRequired
};

const GroupCardsWrapper = styled.div`
    background: #ffffff;
    border: 1px solid #E2E2E2;
    padding: 1.5rem 1rem;
    display: flex;
    flex-wrap: wrap;
    border-radius: 3px;
    margin-top: 1rem;
`

const StatBox = styled.div`
   border-right: 1px solid #eee;
   border-left: 1px solid #eee;
   padding: 0.25rem 2rem;
   flex-grow: 1;
   
   
    &:first-child {
        border-left: none;
    }
    &:last-child {
        border-right: none;
    }
       
   h3 {
    font-size: 1.35rem;
    font-weight: 400; 
    color: #666666;
   }
   
   p {
    color: #448be0;
    font-weight: 400;
    font-size: 2rem;
   }
`