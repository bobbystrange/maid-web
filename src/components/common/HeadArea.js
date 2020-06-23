import React from "react";
import {pushForcibly} from "../../util/module/history";
import {Icon, Menu, Tab} from 'semantic-ui-react'
import HeadUserButton from "./HeadUserButton";
import {FormattedMessage} from "react-intl";

function getActiveIndex() {
    const pathname = window.location.pathname
    switch (pathname) {
        case '/activity':
            return 1
        case '/share':
            return 2
        case '/search':
            return 2
        case '/discovery':
            return 2
        case '/':
        default:
            return 0
    }
}

function setActiveIndex(activeIndex) {
    switch (activeIndex) {
        case 1:
            pushForcibly("/activity")
            return
        case 2:
            pushForcibly("/share")
            return
        case 3:
            pushForcibly("/search")
            return
        case 4:
            pushForcibly("/discovery")
            return
        case 0:
        default:
            pushForcibly("/")
    }
}

export default function HeadArea() {
    const index = getActiveIndex();

    const onTabChange = (e, {activeIndex}) => {
        if (index === activeIndex) return
        setActiveIndex(activeIndex);
    }

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

                <Tab
                    menu={{secondary: true, pointing: true, color: 'black', inverted: true}}
                    panes={[
                        {
                            menuItem: <Menu.Item key="home" className="mx-3">
                                <FormattedMessage id="common.head.home"/>
                            </Menu.Item>,
                        },
                        {
                            menuItem: <Menu.Item key="activity" className="mx-3">
                                <FormattedMessage id="common.head.activity"/>
                            </Menu.Item>,
                        },
                        {
                            menuItem: <Menu.Item key="share" className="mx-3">
                                <FormattedMessage id="common.head.share"/>
                            </Menu.Item>,
                        },
                        {
                            menuItem: <Menu.Item key="search" className="mx-3">
                                <FormattedMessage id="common.head.search"/>
                            </Menu.Item>,
                        },
                        {
                            menuItem: <Menu.Item key="discovery" className="mx-3">
                                <FormattedMessage id="common.head.discovery"/>
                            </Menu.Item>,
                        },
                    ]}
                    activeIndex={index}
                    onTabChange={onTabChange}/>

                <div className="navbar-brand py-2 ml-auto" style={{
                    fontSize: "1rem",
                    boxShadow: "inset -1px 0 0 rgba(0, 0, 0, .25)"
                }}>
                    <HeadUserButton/>
                </div>
            </nav>
        </div>
    );
}
