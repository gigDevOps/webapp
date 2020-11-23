import React from "react";
import { useAuthContext } from "./context/auth";
import {Route, Switch, Redirect, BrowserRouter} from "react-router-dom";
import PropTypes from "prop-types";
import Layout from "./components/Layout";
import ROUTES from "./routes";
import LayoutNoShell from "./components/LayoutNoShell";
import LoginPage from "./components/LoginPage";


export default function() {
    const auth = useAuthContext();
    const { user } = auth.authState;

    return(
        <BrowserRouter>
            <Switch>
                <RouteItem exact name="login" path="/login" component={LoginPage} layout={LayoutNoShell} perms="" />
                {user ? (
                    Object.values(ROUTES).map((res) => (
                        <RouteItem  exact={res.exact || true} key={res.path} name={res.name} path={res.path} component={res.component} perms={res.perms}/>
                    ))
                ) : (
                    <Redirect to="/login" />
                )}
                <RouteItem name="not-found" path="*" component={() => <p>Feature coming soon</p>} layout={Layout} perms="" />
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
    } = props;

    const auth = useAuthContext();
    const {isFetching} = auth.authState;

    const accessGranted = true; // isAllowedAccess(user, perms);

    return (
        <>
            {accessGranted ? (
                <Route
                    exact={exact}
                    path={path}
                    render={() => (
                        <Layout>
                            {isFetching ? <p>Loading...</p> : <Component/>}
                        </Layout>
                    )}
                />
            ) : (
                <Layout user={{}}>
                    <p>Not found</p>
                </Layout>
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