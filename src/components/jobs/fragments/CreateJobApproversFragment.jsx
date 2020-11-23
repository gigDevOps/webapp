import React from "react";

import {AccordionContents, AccordionTitle, AccordionWrapper} from "../../../interface/Accordion";

export default function (props) {
    return(
        <AccordionWrapper>
            <AccordionTitle title="Client Approvals">
                summary
            </AccordionTitle>
            <AccordionContents style={{ display: props.isVisible ? "block" : "none"}}>
                <p>Contents</p>
            </AccordionContents>
        </AccordionWrapper>
    )
}