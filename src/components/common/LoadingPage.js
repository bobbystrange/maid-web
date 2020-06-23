import React from "react";
import {Spinner} from "@blueprintjs/core";


export default function LoadingPage() {
    return (
        <div style={{
            position: "absolute",
            left: "50%",
            top: "calc(50vh - 25px)",
        }}>
            <Spinner size={Spinner.SIZE_STANDARD}/>
        </div>

    )
}
