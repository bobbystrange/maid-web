import React from "react";
import {FormattedMessage} from "react-intl";

export default function FootAuthArea() {

    return (
        <div className="row col-4 offset-4">
            <a href="/site/terms" className="mr-auto mb-3">
                <small style={{color: "#71767d"}}><FormattedMessage id='auth.terms'/></small>
            </a>
            <a href="/site/privacy" className="mr-auto mb-3">
                <small style={{color: "#71767d"}}><FormattedMessage id='auth.privacy'/></small>
            </a>
            <a href="/site/security" className="mr-auto mb-3">
                <small style={{color: "#71767d"}}><FormattedMessage id='auth.security'/></small>
            </a>
            <a href="/site/contact" className="mr-0 mb-3">
                <small><FormattedMessage id='auth.contact'/></small>
            </a>
        </div>
    );
}
