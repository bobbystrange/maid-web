import React, {useEffect, useState} from "react";
import {useForm} from 'react-hook-form';

import {PATTERN_IMAGE_CODE, PATTERN_PASSWORD, PATTERN_USERNAME, storage} from "../../config";
import {obtainImageCode, removeFilesAndPathDB, submitLogin} from "../../actions";
import {getSearchValue} from "../../util";
import {pushForcibly} from "../../util/module/history";
import {FormattedMessage} from "react-intl";
import {Intent} from "@blueprintjs/core";
import PropTypes from "prop-types";

export default function LoginForm(props, {toaster}) {
    const [hiddenImage, setHiddenImage] = useState(true);
    const [imageCode, setImageCode] = useState({});
    const {register, watch, handleSubmit, errors} = useForm({
        mode: "onChange",
    });
    // {moreDetail && <div>put some stuff here</div>}
    // eslint-disable-next-line no-unused-vars
    const moreDetail = watch("moreDetail");

    // componentDidMount
    useEffect(() => {
        const username = getSearchValue("username", "");
        const input = document.querySelector("input[name=username]");
        if (input) {
            input.value = username;
        }
    }, []);

    const formOnSubmit = data => {
        if (!PATTERN_USERNAME.test(data.username)) return;
        if (!PATTERN_PASSWORD.test(data.password)) return;
        if (!PATTERN_IMAGE_CODE.test(data.imageCode)) return;

        submitLogin({
            ...data,
            timestamp: imageCode.timestamp,
            proof: imageCode.proof,
        }).then(res => {
            // if success to login, go to the main share
            if (res.data.code === 0) {
                storage.removeAllExceptToken()
                removeFilesAndPathDB().then(() => {
                    console.log('cleared old data in table maid-web.files')
                })
                pushForcibly(`/`);
            } else {
                toaster.current.show({
                    message: <FormattedMessage id="auth.wrong_image_code"/>,
                    timeout: 1_000,
                    intent: Intent.DANGER,
                });
                const input = document.querySelector('#auth_login_image_code');
                if (input && input.value) input.value = ""
            }
        }, err => {
            if (err && err.response) {
                console.error(err.response)
            }

            toaster.current.show({
                message: <FormattedMessage id="auth.login_failed"/>,
                timeout: 1_000,
                intent: Intent.DANGER,
            });
        })
    };

    const imageCodeOnObtain = () => {
        const input = document.querySelector("input[name=username]");
        if (!input) return;
        let value = input.value;
        if (!PATTERN_USERNAME.test(value)) return;

        obtainImageCode({proof: value, width: 100, height: 50}).then(res => {
            setHiddenImage(v => false);
            setImageCode(v => res.data.data);
        }, err => {
            if (err && err.response) {
                console.error(err.response)
            }

            toaster.current.show({
                message: <FormattedMessage id="auth.obtain_code_failed"/>,
                timeout: 1_000,
                intent: Intent.DANGER,
            });
        });
    };

    const imageCodeOnKeyUp = (e) => {
        if (e.key !== "Enter") return;
        handleSubmit(formOnSubmit);
    };

    return (
        <form className="needs-validation" noValidate>
            <div className="form-row mt-4">
                <div className="col-4 offset-4">
                    <label><FormattedMessage id='auth.username'/></label>

                    <input
                        type="text" name="username"
                        className={"form-control form-control-lg" + (errors.username ? " is-invalid" : "")}
                        ref={register({
                            // required: true,
                            pattern: PATTERN_USERNAME
                        })}
                        required/>
                    <div className="invalid-feedback">
                        {errors.username && <FormattedMessage id='auth.invalid_username'/>}
                    </div>
                </div>
            </div>

            <div className="form-row mt-4">
                <div className="col-4 offset-4">
                    <label><FormattedMessage id='auth.password'/></label>
                    <input type="text" name="password"
                           className={"form-control form-control-lg" + (errors.password ? " is-invalid" : "")}
                           ref={register({
                               pattern: PATTERN_PASSWORD
                           })}
                           required
                        // onKeyUp={e => this.passwordOnKeyUp(e)}
                    />
                    <div className="invalid-feedback">
                        {errors.password && <FormattedMessage id='auth.invalid_password'/>}
                    </div>
                </div>
            </div>

            <div className="form-row mt-4">
                <div className="col-4 offset-4">
                    <label><FormattedMessage id='auth.image_code'/></label>
                    <input type="text" name="imageCode"
                           className={"form-control form-control-lg" + (errors.imageCode ? " is-invalid" : "")}
                           ref={register({
                               pattern: PATTERN_IMAGE_CODE
                           })}
                           id='auth_login_image_code'
                           required
                           onFocus={imageCodeOnObtain}
                           onKeyUp={imageCodeOnKeyUp}/>
                    <div className="invalid-feedback">
                        {errors.imageCode && <FormattedMessage id='auth.invalid_image_code'/>}
                    </div>

                    <div className="form-row mt-4">
                        <button className="btn btn-primary btn-block" type="button"
                                onClick={handleSubmit(formOnSubmit)}
                        >
                            <FormattedMessage id='auth.submit'/>
                        </button>
                        <p className="mt-4 mb-3">
                            <a href="/password-reset" className="link-primary"><FormattedMessage
                                id='auth.reset_password'/></a>
                            &nbsp;<FormattedMessage id='auth.or_click_to'/>&nbsp;
                            <a href="/signup" className="link-info"><FormattedMessage id='auth.signup'/></a></p>
                    </div>
                </div>
                {!hiddenImage && (
                    <div className="col-3" style={{
                        display: "flex",
                    }}>
                        <img src={imageCode.source} className="mb-2 mx-2 w-100" style={{
                            maxHeight: "10rem"
                        }} alt='image code'/>
                    </div>
                )
                }
            </div>
            {/*<Toaster ref={ref => (toaster.current = ref)} position="top" maxToasts={7}/>*/}
        </form>
    );
}

LoginForm.contextTypes = {
    toaster: PropTypes.object.isRequired,
}
