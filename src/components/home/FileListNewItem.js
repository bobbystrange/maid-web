import React from "react";
import PropTypes from "prop-types";
import {Icon, Table} from 'semantic-ui-react'
import {mkdir, removeFilesAndPath} from "../../actions";
import {normalizeFilename, yyyyMMddhhmm} from "../../util";
import {refresh} from "../../util/module/history";
import {FormattedMessage} from "react-intl";
import {Intent} from "@blueprintjs/core";
import TextareaAutosize from "react-textarea-autosize";


export default function FileListNewItem(props, {folder, files, newFolderName, setNewFolderName, toaster}) {

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
        <Table.Row className="file-list-row-chosen">
            <Table.Cell>
                <Icon name="folder open" size="large" style={{color: "#8ad0f7"}}/>
            </Table.Cell>
            <Table.Cell width={10}>
                <TextareaAutosize
                    minRows={1} maxRows={1}
                    value={newFolderName}
                    onChange={e => {
                        setNewFolderName(e.target.value)
                    }}
                    onFocus={e => {
                        e.target.select()
                    }}
                    onKeyUp={e => {
                        if (e.key === 'Enter') e.target.blur();
                    }}
                    onBlur={confirm} autoFocus/>
            </Table.Cell>
            <Table.Cell width={2}>0</Table.Cell>
            <Table.Cell width={4}>{yyyyMMddhhmm(new Date().getTime())}</Table.Cell>
        </Table.Row>
    )
}

FileListNewItem.contextTypes = {
    folder: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
    newFolderName: PropTypes.string,
    setNewFolderName: PropTypes.func.isRequired,
    toaster: PropTypes.object.isRequired,
}
