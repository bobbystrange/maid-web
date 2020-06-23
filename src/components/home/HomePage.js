import React, {Fragment, useEffect, useState} from "react";
import HeadArea from "../common/HeadArea";
import LoadingPage from "../common/LoadingPage";
import SideArea from "../common/SideArea";
import FileArea from "./FileArea";
import {pushForcibly} from "../../util/module/history";
import {storage} from "../../config";

export default function HomePage() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!storage.hasToken()) {
            pushForcibly("/login")
        } else {
            setLoading(v => false)
        }
    }, [])
    if (loading) return (<LoadingPage/>)

    return (
        <Fragment>
            <HeadArea/>
            <SideArea/>
            <FileArea/>
        </Fragment>
    );
}
