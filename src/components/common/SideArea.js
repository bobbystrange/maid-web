import React from "react";
import SideCategoryMenu from "./SideCategoryMenu";
import {FormattedMessage} from "react-intl";
import SideTagMenu from "./SideTagMenu";
import './SideArea.css'

export default function SideArea() {

    return (
        <nav className="col-md-2 d-none d-md-block bg-light sidebar mt-1">
            <div className="sidebar-sticky">
                <SideCategoryMenu/>

                <h5 className="d-flex px-3 mt-3 mb-1 text-muted">
                    <FormattedMessage id='common.sidebar.tags'/>
                </h5>
                <SideTagMenu/>
            </div>
        </nav>
    );
}
