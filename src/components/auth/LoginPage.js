import React, {useEffect} from 'react';
import LoginForm from "./LoginForm";
import {storage} from '../../config';
import {pushForcibly} from '../../util/module/history'
import HeadAuthArea from "./HeadAuthArea";
import {FormattedMessage} from "react-intl";
import FootAuthArea from "./FootAuthArea";

export default function LoginPage(props) {
    // componentDidMount
    useEffect(() => {
        // redirect if has a token in localStorage
        // check its validity in next share
        if (storage.hasToken()) {
            pushForcibly('/');
        } else {
            // clear old main cache
            storage.removeUser();
        }
    }, []);

    return (
        <div style={{
            background: "#f6f6f6",
        }}>
            <HeadAuthArea headnote="signup" href="/signup"/>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-8 offset-2" style={{
                        background: "#fff",
                        marginTop: 64,
                        marginBottom: 64,
                    }}>
                        <div className="row" style={{marginTop: 25}}>
                            <div className="col-4 offset-4">
                                <h3 style={{textAlign: "center"}}>
                                    <strong><FormattedMessage id='auth.login_to'/> Meter Maid</strong>
                                </h3>
                            </div>
                        </div>
                        <LoginForm/>
                    </div>
                </div>
            </div>

            <FootAuthArea/>
        </div>
    );
}
