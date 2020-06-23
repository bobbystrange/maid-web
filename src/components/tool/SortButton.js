import React from "react";
import PropTypes from "prop-types";
import {Button, Icon, Menu, Popup} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";

export default class SortButton extends React.Component {
    static contextTypes = {
        sort: PropTypes.string.isRequired,
        order: PropTypes.string.isRequired,
        updateSearch: PropTypes.func.isRequired,
    };

    state = {
        open: false,
        activeItem: null,
        chosenItem: null,
    };

    onMouseEnter = () => {
        this.setState({open: true})
    };

    onMouseLeave = () => {
        setTimeout(() => {
            if (this.state.activeItem) return;
            this.setState({open: false});
        }, 250);
    };

    toggleItemHover = (activeItem) => {
        this.setState({activeItem});
        this.onMouseLeave();
    };

    onClick = e => {
        let {order, updateSearch} = this.context;
        updateSearch({order: order === 'asc' ? 'desc' : 'asc'})
    };

    itemOnClick = (sort) => {
        let {updateSearch} = this.context;
        updateSearch({sort});
    };

    render() {
        let {sort, order} = this.context;
        const {open, activeItem} = this.state;

        return (
            <Popup
                content={
                    <Menu vertical>
                        <Menu.Item
                            name='name' active={activeItem === 'name'}
                            onClick={() => this.itemOnClick("name")}
                            onMouseEnter={() => this.toggleItemHover("name")}
                            onMouseLeave={() => this.toggleItemHover(null)}>
                            <FormattedMessage id="home.tool.filename"/>{sort === 'name' && <Icon name="check"/>}
                        </Menu.Item>
                        <Menu.Item
                            name='size' active={activeItem === 'size'}
                            onClick={() => this.itemOnClick("size")}
                            onMouseEnter={() => this.toggleItemHover("size")}
                            onMouseLeave={() => this.toggleItemHover(null)}>
                            <FormattedMessage id="home.tool.size"/>{sort === 'size' && <Icon name="check"/>}
                        </Menu.Item>
                        <Menu.Item
                            name='mtime' active={activeItem === 'mtime'}
                            onClick={() => this.itemOnClick("mtime")}
                            onMouseEnter={() => this.toggleItemHover("mtime")}
                            onMouseLeave={() => this.toggleItemHover(null)}>
                            <FormattedMessage id="home.tool.mtime"/>{sort === 'mtime' && <Icon name="check"/>}
                        </Menu.Item>
                    </Menu>
                }
                trigger={
                    <Button
                        className="mr-1 mb-2" color="vk"
                        icon={<Icon name={`sort amount ${order === 'asc' ? "up" : "down"}`} size="large"/>}
                        onClick={this.onClick}
                        onMouseLeave={this.onMouseLeave}
                        onMouseEnter={this.onMouseEnter}
                    />
                } open={open} openOnTriggerFocus/>
        );
    }
}
