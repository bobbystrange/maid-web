import * as React from "react";
import {Breadcrumb, Icon} from "semantic-ui-react";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";

export default class NavBreadcrumb extends React.Component {
    static contextTypes = {
        folder: PropTypes.string.isRequired,
        path: PropTypes.array.isRequired,
        updateSearch: PropTypes.func,
    };

    sectionOnclick = folder => {
        const {updateSearch} = this.context;
        updateSearch({folder})
    };

    render() {
        let {path} = this.context;

        // [{id: 0, name: "/}]
        if (!path || path.length <= 1) {
            return (
                <Breadcrumb style={{background: "inherit"}} size="small">
                    <Breadcrumb.Section active>
                        <FormattedMessage id="home.nav.root_directory"/>
                    </Breadcrumb.Section>
                </Breadcrumb>
            );
        }

        const size = path.length;
        return (
            <Breadcrumb style={{background: "inherit"}} size="small">
                <Breadcrumb.Section
                    active
                    onClick={() => this.sectionOnclick(path[size - 2].id)}>
                    <Icon name="caret up"/>
                    <FormattedMessage id="home.nav.parent_directory"/>
                </Breadcrumb.Section>
                <Breadcrumb.Divider content="&nbsp;|&nbsp;"/>

                {path.map(({name, id}, i) => {
                    if (i === size - 1) {
                        return (
                            <span key={i}>
                                <Breadcrumb.Section active>
                                    {name}
                                </Breadcrumb.Section>
                            </span>
                        );
                    }

                    return (
                        <span key={i}>
                            <Breadcrumb.Section
                                link
                                onClick={() => this.sectionOnclick(id)}>
                                {name === '/' ?
                                    <FormattedMessage id="home.nav.root_directory"/>
                                    : name}
                            </Breadcrumb.Section>
                            <Breadcrumb.Divider/>
                        </span>
                    );
                })}
            </Breadcrumb>
        );
    }

}
