import * as React from "react";
import {ContextMenu, Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";


export class ContextMenuArea extends React.PureComponent {
    static propTypes = {
        index: PropTypes.number.isRequired,
    };

    static contextTypes = {
        files: PropTypes.array.isRequired,
        setFiles: PropTypes.func.isRequired,
    };

    state = {isContextMenuOpen: false};

    onClick = (name) => {
        const {files, setFiles} = this.context;
        const {index} = this.props;
        files.forEach((file, i) => {
            file.chosen = i === index
        })
        setFiles(files, () => {
            const tool = document.querySelector(`#home_tool_${name}`)
            if (tool == null) {
                console.error(`tool ${name} is not found`)
                return
            }
            tool.click();
        })


    }

    render() {
        return <div onContextMenu={this.showContextMenu}>
            {this.props.children}
        </div>;
    }

    showContextMenu = (e) => {
        // must prevent default to cancel parent's context menu
        e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <Menu>
                <MenuItem icon="share" text={<FormattedMessage id='home.view.share'/>}
                          onClick={() => this.onClick('share')}/>
                <MenuItem icon="download" text={<FormattedMessage id='home.view.download'/>}
                          onClick={() => this.onClick('download')}/>
                <MenuDivider/>
                <MenuItem icon="move" text={<FormattedMessage id='home.view.move'/>}
                          onClick={() => this.onClick('move')}/>
                <MenuItem icon="group-objects" text={<FormattedMessage id='home.view.copy'/>}
                          onClick={() => this.onClick('copy')}/>
                <MenuItem icon="delete" text={<FormattedMessage id='home.view.delete'/>}
                          onClick={() => this.onClick('delete')}/>
                <MenuItem icon="graph-remove" text={<FormattedMessage id='home.view.rename'/>}
                          onClick={() => this.onClick('rename')}/>
            </Menu>,
            {left: e.clientX, top: e.clientY},
            () => this.setState({isContextMenuOpen: false}),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({isContextMenuOpen: true});
    };

}
