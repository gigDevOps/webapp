import React from "react";
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export default function(props) {
    return (
        <Loader type="Puff" height={props.h} width={props.w} />
    )
}