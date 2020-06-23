import React from "react";
import PropTypes from "prop-types";
import {Card, Icon} from 'semantic-ui-react'
import TextareaAutosize from "react-textarea-autosize";
import {mkdir, removeFilesAndPath} from "../../actions";
import {normalizeFilename} from "../../util";
import {refresh} from "../../util/module/history";
import {FormattedMessage} from "react-intl";
import {Intent} from "@blueprintjs/core";

const styles = {
    rootChosen: {
        background: "rgba(166, 167, 168, 0.5)",
        border: "1px solid #397EFF",
    },
};

export default function FileGridNewItem(props, {folder, files, newFolderName, setNewFolderName, toaster}) {

    const confirm = () => {
        // empty string
        if (!newFolderName || !newFolderName.trim()) {
            setNewFolderName(undefined);
            return;
        }
        newFolderName = newFolderName.trim();

        let name = normalizeFilename(newFolderName);
        if (!name) {
            setNewFolderName(undefined);
            return;
        }
        if (files.map(it => it.name).indexOf(name) !== -1) {
            toaster.current.show({
                message: <div>
                    <FormattedMessage id="home.tool.name_already_exists"/><strong>{name}</strong>
                </div>,
                timeout: 1_000,
                intent: Intent.WARNING,
            });
            setNewFolderName(undefined);
            return;
        }

        mkdir(folder, name).then(res => {
            if (res.data.code === 0) {
                removeFilesAndPath(folder).then(refresh)
            } else {
                console.error(res.data.message);
            }
        }, err => {
            console.error(err);
        });
        setNewFolderName(undefined);
    }

    return (
        <Card style={styles.rootChosen}>
            <Icon name="check circle" color="blue" size="large"/>
            <Icon
                name='folder open'
                size='huge' fitted
                style={{color: '#8ad0f7'}}/>
            <Card.Content>
                <TextareaAutosize
                    minRows={1} maxRows={2} style={{width: "100%"}}
                    value={newFolderName}
                    onChange={e => {
                        setNewFolderName(e.target.value)
                    }}
                    onFocus={e => {
                        e.target.select()
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') e.target.blur()
                    }}
                    onBlur={confirm}
                    autoFocus/>
            </Card.Content>
        </Card>
    )
}

FileGridNewItem.contextTypes = {
    folder: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
    newFolderName: PropTypes.string.isRequired,
    setNewFolderName: PropTypes.func.isRequired,
    toaster: PropTypes.object.isRequired,
}
