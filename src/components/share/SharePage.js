import React, {Fragment, useEffect, useState} from "react";
import {storage} from "../../config";
import {pushForcibly} from "../../util/module/history";
import LoadingPage from "../common/LoadingPage";
import HeadArea from "../common/HeadArea";
import SideArea from "../common/SideArea";
import ShareListArea from "./ShareListArea";
import {fetchShare, visualizeShareFiles} from "../../actions";

const size = 100

export default function SharePage() {
    const [loading, setLoading] = useState(true)
    const [last, setLast] = useState(undefined)
    const [hasMore, setHasMore] = useState(true)
    const [files, setFiles] = useState([])

    // only load once
    useEffect(() => {
        if (!storage.hasToken()) {
            pushForcibly("/login")
            return
        }
        setLoading(false)

        fetchShare({size}).then(res => {
            // {id, fid, name, ctime, password, ttl}
            let {items, last: nextLast, hasMore: nextHasMore} = res.data.data
            items = visualizeShareFiles(items);
            console.log(items)
            setFiles(items)
            setLast(nextLast)
            setHasMore(nextHasMore)
        })
    }, [])

    if (loading) return (<LoadingPage/>)

    return (
        <Fragment>
            <HeadArea/>
            <SideArea/>
            <div>
                <div className="mr-0" style={{
                    marginTop: "4rem",
                    marginLeft: "15rem"
                }}>
                    <ShareListArea files={files} setFiles={setFiles}/>
                </div>
            </div>
        </Fragment>
    )

}
