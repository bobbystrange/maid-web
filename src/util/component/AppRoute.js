import {BrowserRouter, Switch} from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import {renderReactRoutes} from "../module/router";

export default function AppRoute({routes}) {
    const children = renderReactRoutes(routes, "/");
    return (
        <BrowserRouter>
            <Switch>{children}</Switch>
        </BrowserRouter>

    );
}
AppRoute.propTyps = {
    routes: PropTypes.array.isRequired
};
