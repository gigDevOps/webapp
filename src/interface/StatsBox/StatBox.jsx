import React from "react";

export default function ({label, value, variation, tooltip}) {
    return(
        <div>
            <p>{label} {tooltip}</p>
            <p>{value}</p>
            <p>{variation}</p>
        </div>
    )
}