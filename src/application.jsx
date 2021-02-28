import React, {useEffect} from "react";
import { useAuthContext } from "./context/auth";
import {Route, Switch, Redirect, BrowserRouter} from "react-router-dom";
import PropTypes from "prop-types";
import Layout from "./components/Layout";
import ROUTES from "./routes";
import LayoutNoShell from "./components/LayoutNoShell";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import LoadingPage from "./components/LoadingPage";
import ProfileSetupPage from "./components/setup";
import {isAllowedAccess} from "./context/auth";


export default function() {
    const auth = useAuthContext();
    const { user } = auth.authState;

    return(
        <BrowserRouter>
            <Switch>
                <RouteItem exact name="login" path="/login" component={LoginPage} layout={LayoutNoShell} perms="" />
                <RouteItem exact name="register" path="/register" component={RegisterPage} layout={LayoutNoShell} perms="" />
                <RouteItem exact name="profileSetup" path="/profile-setup" component={ProfileSetupPage} layout={LayoutNoShell} perms="" />
                <Route>
                    <Layout>
                        <Switch>
                            {user ? (
                                Object.values(ROUTES).map((res) => (
                                    <RouteItem
                                        exact={res.exact || true}
                                        key={res.path}
                                        name={res.name}
                                        path={res.path}
                                        component={res.component}
                                        user={user}
                                        perms={res.perms}
                                    />
                                ))
                            ) : (
                                <Redirect to="/login" />
                            )}
                            <RouteItem name="not-found" path="*" component={() => <p>Feature coming soon</p>} layout={Layout} perms={[]} />
                        </Switch>
                    </Layout>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

function RouteItem(props) {
    const {
        exact,
        component: Component,
        layout: Layout,
        path,
        user,
        perms
    } = props;

    const auth = useAuthContext();
    const {isFetching} = auth.authState;

    // const accessGranted = isAllowedAccess(user, perms);
    const accessGranted = true;

    return (
        <>
            {accessGranted ? (
                <Route
                    exact={exact}
                    path={path}
                    render={() => (
                        <>
                            <LoadingPage loading={isFetching} />
                            <Component/>
                        </>
                    )}
                />
            ) : (
                <p>Not found</p>
            )}
        </>
    );
}

RouteItem.propTypes = {
    exact: PropTypes.bool,
    layout: PropTypes.any,
    path: PropTypes.any.isRequired,
    component: PropTypes.any.isRequired,
    perms: PropTypes.string.isRequired,
};

RouteItem.defaultProps = {
    exact: false,
    layout: Layout,
};
