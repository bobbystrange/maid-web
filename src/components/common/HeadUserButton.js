import React, {useEffect, useState} from "react";
import {storage} from "../../config";
import {pushForcibly} from "../../util/module/history";
import {fetchAvatar, fetchUser} from "../../actions";
import {Popover, PopoverInteractionKind, Position} from "@blueprintjs/core";
import {FormattedMessage} from "react-intl";
import {Menu, Segment} from "semantic-ui-react";

function signOut(name) {
    storage.removeToken();
    pushForcibly("/login?username=" + name)
}

export default function HeadUserButton() {
    const [fullName, setFullName] = useState("")
    const [name, setName] = useState("")
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        if (!storage.hasUser()) {
            fetchUser().then(res => {
                const user = res.data.data;
                storage.setUser(user);
                setFullName(user.firstName + " " + user.lastName)
                setName(user.name);
            });
        } else {
            const user = storage.getUser();
            setFullName(user.firstName + " " + user.lastName)
            setName(user.name);
        }

        if (!storage.hasAvatar()) {
            fetchAvatar().then(res => {
                const value = res.data;
                storage.setAvatar(value);
                setAvatar(v => value);
            });
        } else {
            setAvatar(v => storage.getAvatar());
        }
    }, [])

    return (
        <Popover
            position={Position.BOTTOM_LEFT}
            interactionKind={PopoverInteractionKind.HOVER}
            transitionDuration={30}
            content={
                <Segment>
                    <div>
                        {avatar &&
                        <img src={`${avatar}`} alt="avatar" style={{height: "4rem",}}/>}
                        <strong className="ml-2">{fullName}</strong>
                    </div>

                    <Menu vertical borderless>
                        <Menu.Item as='a' href="/information">
                            <FormattedMessage id="common.head.personal_information"/>
                        </Menu.Item>
                        <Menu.Item as='a' href="/notification">
                            <FormattedMessage id="common.head.notification"/>
                        </Menu.Item>
                        <Menu.Item onClick={() => signOut(name)}>
                            <FormattedMessage id="common.head.exit"/>
                        </Menu.Item>
                    </Menu>
                </Segment>
            }
        >
            <div>
                {avatar &&
                <img src={`${avatar}`} alt="avatar" style={{height: "2rem",}}/>}
                <strong className="ml-1">{name}</strong>
            </div>
        </Popover>
    )

}
