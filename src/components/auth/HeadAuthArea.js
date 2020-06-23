import React from "react";
import PropTypes from 'prop-types';
import {Icon} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";

export default function HeadAuthArea({headnote, href}) {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            zIndex: 3,
        }}>
            <nav className="navbar navbar-dark bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand mr-0 py-2" style={{
                    width: '15rem',
                    fontSize: "1rem",
                    background: "rgba(0, 0, 0, .25)",
                    boxShadow: "inset -1px 0 0 rgba(0, 0, 0, .25)"
                }} href="/">
                    <Icon name="cloud" color="blue" size="big"/>
                    <strong className="ml-3 h5">Meter Maid</strong>
                </a>

                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <a className="nav-link" href={href}>
                            <FormattedMessage id={`auth.${headnote}`}/>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

HeadAuthArea.propTypes = {
    headnote: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
}
