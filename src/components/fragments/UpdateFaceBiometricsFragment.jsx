import React, {useState} from "react";
import {Button, Message} from "rsuite";
import Webcam from "react-webcam";
import {create} from "../../actions/generics";
import {useDispatch} from "react-redux";

export default function UpdateFaceBiometricsFragment({ user }) {
    const [update, setUpdate] = useState({
        hasFullfilled: true,
        success: null,
        error: null
    });
    const dispatch = useDispatch();
    const webcamRef = React.useRef(null);

    return(
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {
                update.hasFullfilled && update.success && (
                    <Message type="success" description="Success!" />
                )
            }
            {
                update.hasFullfilled && update.success === false && (
                    <Message type="error" description={update.error} />
                )
            }
            <Webcam audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg" />
            <Button color="blue" onClick={() => {
                const imageSrc = webcamRef.current.getScreenshot();
                const image = imageSrc.split("data:image/jpeg;base64,")[1];
                dispatch(create("update_face", "/faces/index", {
                    image: image
                }, () => {
                    setUpdate({
                        hasFullfilled: true,
                        success: true,
                        error: null
                    });
                }, (res) => {
                    setUpdate({
                        hasFullfilled: true,
                        success: false,
                        error: res.data.msg
                    });
                }))
            }}>Update</Button>
        </div>
    )
}