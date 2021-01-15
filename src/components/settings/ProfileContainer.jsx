import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {create, fetch, fetchFile} from "../../actions/generics";
import {H1, PageTitle} from "../../interface/paragraph/Titles";
import {useModal} from "react-modal-hook";
import GModal from "../../interface/GModal";
import { Button } from "rsuite";
import UpdateFaceBiometricsFragment from "../fragments/UpdateFaceBiometricsFragment";
import LoadingView from "../../interface/LoadingView";
import Card from "../../interface/Card/Card";
import {InputGroup} from "../../interface/forms/InputGroup";
import {useForm} from "react-hook-form";
import {APIClient, BASE_API_URL} from "../../services/APIClient";
import LoadingPage from "../LoadingPage";

export default function ProfileContainer() {
    const user = useSelector((state) => state.user.data);
    const isFetchingUser = useSelector((state) => state.user.isFetching);
    const [bio, setBio] = useState(null);
    const dispatch = useDispatch();
    const { register, errors, watch, handleSubmit } = useForm();

    const refreshBiometrics = async () => {
        const path = `/files/${user.face_ref}`;
        const res = await APIClient.getFile(path);
        console.log(res);
        if (res && res.status === 200) {
            var arrayBufferView = new Uint8Array( res.data );
            var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL( blob );
            setBio(imageUrl);
        }
    }

    useEffect(() => {
        dispatch(fetch('current_user', '/user', {}, (res) => {
            refreshBiometrics();
        }));
    }, [dispatch]);

    const [showUpdateBiometrics, hideUpdateBiometrics] = useModal(() => (
        <GModal autoResize title="Update Biometrics" onClose={hideUpdateBiometrics}>
           <UpdateFaceBiometricsFragment />
        </GModal>
    ));

    if(isFetchingUser || !user) return <LoadingPage loading={true}/>;
    if(!user.face_ref) {
        showUpdateBiometrics();
    }

    const onSubmit = (data) => {
        dispatch(create('user', '/user', data, () => {
            window.location.reload();
        }));
    }

    const lastUpdate = ["Last update:", user.updated_at].join(" ");
    return (
        <>
            <PageTitle title={[user.first_name, user.other_names].join(" ")} sub={lastUpdate} />
            <LoadingView isFetching={isFetchingUser}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <Card width="65%">
                        <form>
                            <InputGroup label="First Name">
                                <input type="text" value={user.first_name} disabled />
                            </InputGroup>
                            <InputGroup label="Other Names">
                                <input type="text" value={user.other_names} disabled />
                            </InputGroup>
                            <InputGroup label="Email">
                                <input type="text" value={user.email} disabled />
                            </InputGroup>
                            <InputGroup label="Phone Number">
                                <input type="text" value={user.phone} disabled />
                            </InputGroup>
                        </form>
                    </Card>
                    <Card title="Update Biometrics" width="35%">
                        {
                            bio && (
                                <img src={bio} alt="Biometrics" style={{ maxWidth: "100%"}} />
                            )
                        }
                        <Button color="orange" style={{width: "100%"}} appearance="primary" size="sm" onClick={showUpdateBiometrics}>Update Biometrics</Button>
                    </Card>
                </div>
                <Card title="Change Password">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup label="New password">
                            <input type="password" name="password" ref={register({
                                required: "You must specify a password"
                            })} />
                        </InputGroup>
                        {errors.password && <p>{errors.password.message}</p>}
                        <InputGroup label="Repeat password">
                            <input type="password" name="repeat" ref={register({
                                validate: (value) => value === watch('password')
                            })} />
                        </InputGroup>
                        <p>{errors.repeat && "Passwords must match"}</p>
                        <Button appearance="primary" size="sm" type="submit">Update password</Button>
                    </form>
                </Card>
            </LoadingView>
        </>
    )
}