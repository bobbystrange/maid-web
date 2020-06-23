import React, {useEffect} from "react";
import {Menu} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import {categories, getCategory, setCategory} from "../../actions";


export default function SideCategoryMenu() {
    const category = getCategory();

    const onClick = (activeItem) => {
        if (activeItem === category) return
        setCategory(activeItem)
    }

    useEffect(() => {
        if (category === 'all') return

        const menuItem = document.querySelector('[label=common_sidebar_category_true]')
        if (!menuItem) return
        menuItem.scrollIntoView()
    }, [category])

    return (
        <Menu vertical borderless fluid>
            {categories.map(({name, icon}, i) => (
                <Menu.Item
                    onClick={() => onClick(name)} key={i}
                    label={`common_sidebar_category_${category === name}`}
                    name={name} active={category === name}>
                    <div className='row'>
                        <div className='col-2 text-right'>
                            <i className={`fa fa-${icon}`} style={category === name ? {color: '#4aa9f8'} : {}}/>
                        </div>
                        <div className='col-10'>
                            <label style={category === name ? {color: '#4aa9f8'} : {}}>
                                <FormattedMessage id={`common.sidebar.${name}`}/>
                            </label>
                        </div>
                    </div>
                </Menu.Item>
            ))}
        </Menu>
    );
}
