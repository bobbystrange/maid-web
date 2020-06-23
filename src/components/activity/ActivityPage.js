import React, {Fragment, useEffect, useState} from "react";
import HeadArea from "../common/HeadArea";
import SideArea from "../common/SideArea";
import {storage} from "../../config";
import {pushForcibly} from "../../util/module/history";
import LoadingPage from "../common/LoadingPage";
import FileArea from "../home/FileArea";

export default function ActivityPage() {
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
