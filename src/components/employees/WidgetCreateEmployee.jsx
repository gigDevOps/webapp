import React from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";

export default function WidgetCreateEmployee({full_name}) {
    const guessName = full_name.split(' ');
    const {
        register: regWCE,
        handleSubmit: submitWCE
    } = useForm({
        defaultValues: {
            first_name: guessName.length === 1 ? guessName : guessName.slice(0, -1).join(' '),
            last_name: guessName.length === 1 ? "" : guessName.slice(-1).join(' ')
        }
    });

    const onSubmitWCE = data => {
        console.log(data);
        // onCancel();
    }
    return(
        <>
            <p>Create a new employee</p>
            <form key={"WCE"} onSubmit={submitWCE(onSubmitWCE)} style={{display: "flex", flexDirection: "column"}}>
                <input type="text" name="first_name" placeholder="First name" ref={regWCE({required: true})} />
                <input type="text" name="last_name" placeholder="Last name" ref={regWCE({required: true})} />
                <input type="text" name="email" placeholder="Email" ref={regWCE({required: true})} />
                <input type="text" name="employee_id" placeholder="Employee ID" ref={regWCE({required: true})} />
                <input type="submit" ref={regWCE} />
            </form>
        </>
    )
}

WidgetCreateEmployee.prototype.propTypes = {
    full_name: PropTypes.string
}

WidgetCreateEmployee.defaultProps = {
    full_name: "",
    first_name: ""
}