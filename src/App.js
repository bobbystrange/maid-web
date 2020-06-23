import React, {createRef, Fragment} from 'react';
import {IntlProvider} from 'react-intl';
import zh_CN from "./locales/zh_CN"
import en_US from "./locales/en_US"
import AppRoute from "./util/component/AppRoute";
import {getSearchValue} from "./util";
import PropTypes from "prop-types";
import {routes} from "./config";
import {Toaster} from "@blueprintjs/core";

export default class App extends React.Component {
    static childContextTypes = {
        lang: PropTypes.string.isRequired,
        setLang: PropTypes.func.isRequired,
        messages: PropTypes.object.isRequired,
        toaster: PropTypes.object.isRequired,
    };

    constructor(props) {
        const lang = getSearchValue('lang', 'zh');
        super(props);
        this.state = {
            lang, messages: {
                en: en_US,
                zh: zh_CN,
            }
        }
        this.toaster = createRef()
    }

    getChildContext() {
        return {
            lang: this.state.lang,
            setLang: lang => this.setState({lang}),
            messages: this.state.messages[this.state.lang],
            toaster: this.toaster,
        }
    };

    render() {
        let {lang, messages} = this.state;
        return (
            <Fragment>
                <IntlProvider locale={lang} messages={messages[lang]}>
                    <AppRoute routes={routes}/>
                    <Toaster ref={this.toaster} position="top" maxToasts={7}/>
                </IntlProvider>
            </Fragment>

        );
    }
}
