import React, {useEffect} from "react";
import {Menu} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import {pushForcibly} from "../../util/module/history";

const tags = [
    {name: 'red', color: 'red'},
    {name: 'orange', color: 'orange'},
    {name: 'yellow', color: 'yellow'},
    {name: 'green', color: 'green'},
    {name: 'blue', color: 'blue'},
    {name: 'purple', color: 'purple'},
    {name: 'grey', color: 'grey'},
    {name: 'all', color: 'black'},
]

function getTag() {
    const path = window.location.path
    if (/^\/tag\/([^/]+?)$/.test(path)) {
        return RegExp.$1
    }
    if (path === '/tags') {
        return 'all'
    }

    return null
}

function setTag(tag) {
    if (tag === 'all') {
        pushForcibly("/tags")
        return
    }
    pushForcibly(`/tag/${tag}`)
}

export default function SideTagMenu() {
    const tag = getTag();

    const onClick = (activeItem) => {
        if (activeItem === tag) return
        setTag(activeItem)
    }

    useEffect(() => {
        const menuItem = document.querySelector('[label=common_sidebar_tag_true]')
        if (!menuItem) return
        menuItem.scrollIntoView()
    }, [])

    return (
        <Menu vertical borderless fluid id='common_sidebar_tag_menu' className='mb-5'>
            {tags.map(({name, color}, i) => (
                <Menu.Item
                    onClick={() => onClick(name)} key={i}
                    label={`common_sidebar_tag_${tag === name}`}
                    name={name} active={tag === name}>
                    <div className='row'>
                        <div className='col-2 text-right'>
                            <i className='fa fa-circle' style={{color}}/>
                        </div>
                        <div className='col-10'>
                            <label style={tag === name ? {color: '#4aa9f8'} : {}}>
                                <FormattedMessage id={`common.sidebar.tag-${name}`}/>
                            </label>
                        </div>
                    </div>
                </Menu.Item>
            ))}
        </Menu>
    );
}
