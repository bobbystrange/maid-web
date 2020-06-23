import React from "react";
import {Icon, Segment, Table} from "semantic-ui-react";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import {pushForcibly} from "../../util/module/history";
import FileListNewItem from "./FileListNewItem";

export default class FileListArea extends React.Component {
    static contextTypes = {
        updateSearch: PropTypes.func.isRequired,
        files: PropTypes.array.isRequired,
        setFiles: PropTypes.func.isRequired,
        lastChosenIndex: PropTypes.number.isRequired,
        setLastChosenIndex: PropTypes.func.isRequired,
        newFolderName: PropTypes.string,
    };

    state = {};

    rowOnDoubleClick = (e, {index}) => {
        e.stopPropagation();
        const {files, updateSearch} = this.context;
        let file = files[index];
        // if file is a directory, then enter it
        if (file.isFolder) {
            updateSearch({fid: file.fid})
        } else {
            pushForcibly(`/preview?fid=${file.fid}`);
        }
        console.log(file)
    };

    rowOnClick = (e, {index}) => {
        e.stopPropagation();
        // e.altKey
        const {files, setFiles, lastChosenIndex, setLastChosenIndex} = this.context;
        if (lastChosenIndex !== -1 && index !== lastChosenIndex &&
            (!e.altKey || !e.shiftKey)) {
            if (e.shiftKey) {
                let from = Math.min(index, lastChosenIndex);
                let to = Math.max(index, lastChosenIndex);
                files.forEach((file, i) => {
                    file.chosen = i >= from && i <= to;
                });
                setFiles(files);
                setLastChosenIndex(index);
                return;
            }

            if (e.altKey) {
                files[index].chosen = true;
                setFiles(files);
                setLastChosenIndex(index);
                return;
            }
        }

        if (index === lastChosenIndex) {
            files.forEach((file, i) => {
                file.chosen = false;
            });
            setFiles(files);
            setLastChosenIndex(-1);
        } else {
            files.forEach((file, i) => {
                file.chosen = i === index;
            });
            setFiles(files);
            setLastChosenIndex(index);
        }
    };

    render() {
        const {files, newFolderName} = this.context;

        return (
            <Segment basic>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                <Icon name="file" color="grey" size="large"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell><FormattedMessage id="home.view.filename"/></Table.HeaderCell>
                            <Table.HeaderCell><FormattedMessage id="home.view.size"/></Table.HeaderCell>
                            <Table.HeaderCell><FormattedMessage id="home.view.mtime"/></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {/*Whitespace text nodes cannot appear as a child of <tbody>*/}
                        {newFolderName !== undefined && <FileListNewItem/>}
                        {files.map((file, i) => (
                            <Table.Row key={i} className={file.chosen ? "file-list-row-chosen" : "file-list-row"}
                                       onClick={e => this.rowOnClick(e, {index: i})}
                                       onDoubleClick={e => this.rowOnDoubleClick(e, {index: i})}>
                                <Table.Cell>
                                    {file.iconColor[0] === "#" ?
                                        <Icon name={file.iconName} style={{color: file.iconColor}} size="large"/> :
                                        <Icon name={file.iconName} color={file.iconColor} size="large"/>
                                    }
                                </Table.Cell>
                                <Table.Cell width={10}>
                                    <label className="file-list-name">{file.name}</label>
                                </Table.Cell>
                                <Table.Cell width={2}>
                                    {file.sizeStr}
                                </Table.Cell>
                                <Table.Cell width={4}>
                                    {file.mtimeStr}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Segment>

        );
    }
}
