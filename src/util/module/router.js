/*

/a, /e        -->    A
/a/b          -->    AB
/a/c/d        -->    ACD
/f, /g, /h    -->    F

const routes = [
    {
        path: '/a', childRoutes: [
            {path: '/b', components: AB},
            {
                path: "/c", childRoutes: [
                    {path: '/d', components: ACD},
                ],
            },
        ], components: A, redirect: "/e"
    },
    {path: '/f', components: F, redirect: ["/g", "/h"]},

];
*/
import {Route} from "react-router-dom";
import React from "react";
import {Redirect} from "react-router";

const renderRoute = (item, currentPath, children) => {
    let path = `${currentPath}/${item.path}`;
    // replace [/]+ to /, such as /// to /
    path = path.replace(/\/+/g, '/');

    if (item.component) {
        children.push({path: path, component: item.component});
        // children.push(
        //     <Route
        //         key={path}
        //         render={props => <item.components {...props}/>}
        //         exact
        //         path={path}
        //     />
        // );
    }
    if (item.childRoutes) {
        item.childRoutes.forEach(r => renderRoute(r, path, children));
    }
    if (item.redirect) {
        const redirect = item.redirect;
        if (typeof redirect === 'string') {
            children.push({from: redirect, to: path})
            // children.push(<Redirect exact from={redirect} to={path} key={path + '-' + redirect}/>)
        } else {
            redirect.forEach(it => {
                children.push({from: it, to: path})
                // children.push(<Redirect exact from={it} to={path} key={path + '-' + it}/>)
            })
        }
    }
};

export const renderRoutes = (routes, currentPath) => {
    let children = []
    routes.forEach(item => renderRoute(item, currentPath, children));
    return children;
};

export const renderReactRoutes = (routes, currentPath) => {
    let children = renderRoutes(routes, currentPath);
    let reactRoutes = [];
    children.forEach((item, index) => {
        let {path, from, to} = item;
        if (path) {
            reactRoutes.push(
                <Route
                    key={index}
                    render={props => <item.component {...props}/>}
                    exact
                    path={path}
                />
            )
        } else if (from && to) {
            reactRoutes.push(
                <Redirect
                    key={index}
                    exact
                    from={from}
                    to={to}
                />)
        }
    });
    return reactRoutes;
};


