import React from "react";
import PropTypes from "prop-types";
import {Card, Icon} from 'semantic-ui-react'
import TextareaAutosize from "react-textarea-autosize";
import {normalizeFilename} from "../../util";
import {moveFile, removeFilesAndPath, submitRename} from "../../actions";
import {refresh} from "../../util/module/history";
import {ContextMenuArea} from "../tool/ContextMenuArea";

const styles = {
    rootChosen: {
        background: "rgba(166, 167, 168, 0.5)",
        border: "1px solid #397EFF",
    },
    rootHover: {
        background: "rgba(166, 167, 168, 0.1)",
    },
    // icon: {
    //     color: "#f8d76f"
    // },
    uncheckedIcon: {
        opacity: 0,
    },
    hoverIcon: {
        opacity: 0.25,
    },
};

export default class FileItem extends React.Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
    };

    static contextTypes = {
        folder: PropTypes.string.isRequired,
        files: PropTypes.array.isRequired,
        setFiles: PropTypes.func.isRequired,
        updateSearch: PropTypes.func.isRequired,
    };

    state = {
        hover: false,
        editing: false,
    };

    onDoubleClick = () => {
        const {files, updateSearch} = this.context;
        const {index} = this.props;

        let {id, isFolder} = files[index];
        if (isFolder) {
            updateSearch({folder: id});
            return
        }
        // todo preview
        console.log('todo preview on FileItem')
    };

    toggleHover = (hover) => {
        this.setState({hover})
    };

    onClick = () => {
        let {files, setFiles} = this.context;
        let {index} = this.props;
        files[index].chosen = !files[index].chosen;
        setFiles(files);
    };

    nameOnChange = e => {
        let {files, setFiles} = this.context;
        let {index} = this.props;

        let newName = e.target.value;
        newName = newName.replace(/\n/g, "");

        files[index].name = newName
        setFiles(files);
    };

    nameOnClick = e => {
        e.stopPropagation();
        let {files, setFiles} = this.context;
        let {index} = this.props;

        if (files[index].editing) return;

        if (!files[index].chosen) {
            files[index].chosen = true;
            setFiles(files);
            return;
        }

        files[index].editing = true;
        files.forEach((file, i) => {
            file.chosen = i === index;
        })
        setFiles(files);
    };

    nameOnDoubleClick = e => {
        e.stopPropagation();
        let {files, setFiles} = this.context;
        let {index} = this.props;

        if (files[index].editing) return;

        files[index].editing = true;
        files.forEach((file, i) => {
            file.chosen = i === index;
        })
        setFiles(files);
    };

    editOnBlur = () => {
        let {folder, files, setFiles} = this.context;
        let {index} = this.props;

        files[index].editing = false;

        let name = files[index].name;
        let originalName = files[index].originalName;
        name = normalizeFilename(name);
        if (name && name !== originalName) {
            submitRename(files[index].path, name).then(res => {
                if (res.data.code === 0) {
                    removeFilesAndPath(folder).then(refresh);
                } else {
                    files[index].name = originalName;
                    files[index].chosen = false;
                    setFiles(files);
                }
            }, err => {
                console.error(err)
                files[index].name = originalName;
                files[index].chosen = false;
                setFiles(files);
            })
        } else {
            files[index].name = originalName;
        }
        files[index].chosen = false;
        setFiles(files);
    };

    onDragStart = e => {
        const {index} = this.props;
        // copy, move, link
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/plain", index);
    };

    onDragOver = e => {
        e.preventDefault();
        this.toggleHover(true);
    };

    onDragEnd = e => {
        e.preventDefault();
        this.toggleHover(false);
    };

    onDrop = e => {
        const {files} = this.context;
        e.preventDefault();
        const index = e.dataTransfer.getData("text/plain");

        let fromFile = files[index];
        let fromId = fromFile.fid;
        let toFile = files[this.props.index];
        let [toId, toIsFolder] = [toFile.fid, toFile.isFolder]

        if (toIsFolder) {
            moveFile(fromId, toId).then((res) => {
                if (res.data.code === 0) {
                    removeFilesAndPath(fromId, toId).then(refresh)
                }
            })
        }
    };

    render() {
        const {files} = this.context;
        const {index} = this.props;
        const {iconName, iconColor, name, chosen, editing} = files[index];
        const {hover} = this.state;
        let rootStyle = chosen ? styles.rootChosen : (hover ? styles.rootHover : {});
        let checkedIconStyle = chosen ? {} : (hover ? styles.hoverIcon : styles.uncheckedIcon);

        return (
            <ContextMenuArea index={index}>
                <Card
                    style={rootStyle} onClick={this.onClick} onDoubleClick={this.onDoubleClick}
                    draggable={true} onDragStart={this.onDragStart} onDrop={this.onDrop}
                    onDragOver={this.onDragOver} onDragEnd={this.onDragEnd}
                    onMouseEnter={() => this.toggleHover(true)}
                    onMouseLeave={() => this.toggleHover(false)}>
                    <Icon name="check circle" color="blue" size="large" style={checkedIconStyle}/>
                    {iconColor[0] === '#' ?
                        <Icon
                            name={iconName}
                            size='huge' fitted
                            style={{color: iconColor}}/> :
                        <Icon
                            name={iconName}
                            size='huge' fitted
                            color={iconColor}/>
                    }

                    <Card.Content>
                        {editing ?
                            <TextareaAutosize
                                minRows={1} maxRows={2} style={{width: "100%"}}
                                value={name} onChange={this.nameOnChange}
                                onFocus={e => {
                                    e.target.select()
                                }}
                                onKeyUp={e => {
                                    if (e.key === 'Enter') e.target.blur();
                                }}
                                autoFocus onBlur={this.editOnBlur}/> :
                            <Card.Description
                                className="line-clamp-2" onClick={this.nameOnClick}
                                onDoubleClick={this.nameOnDoubleClick}>
                                {name}
                            </Card.Description>
                        }
                    </Card.Content>
                </Card>
            </ContextMenuArea>
        )
    }
}
