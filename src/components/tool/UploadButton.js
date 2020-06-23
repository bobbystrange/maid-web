import React from "react";
import {Button, Icon, Menu, Popup} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import {mkdir, uploadFile} from "../../actions";
import PropTypes from "prop-types";
import {normalizeFilename} from "../../util";


export default class UploadButton extends React.Component {
    static contextTypes = {
        folder: PropTypes.string.isRequired,
    };

    state = {
        activeItem: null,
        hoverButton: false,
        open: false,
    };

    onMouseEnter = () => {
        this.setState({hoverButton: true, open: true})
    };

    onMouseLeave = () => {
        setTimeout(() => {
            if (this.state.activeItem || this.state.hoverButton) return;
            this.setState({open: false})
        }, 250);

        this.setState({hoverButton: false})
    };

    toggleItemHover = (activeItem) => {
        this.setState({activeItem});
        if (activeItem) {
            this.setState({open: true})
        } else {
            this.onMouseLeave();
        }
    };

    clickUploadFile = (e) => {
        if (e.target.tagName !== "BUTTON" && e.target.tagName !== "I") return;
        const input = document.querySelector("#upload-file");
        if (input && input.click) {
            input.click();
        }
    };

    onUploadFiles = e => {
        // file.webkitRelativePath: chosen_folder/path/to/file or empty string if choose a file
        let {folder} = this.context;
        let files = e.target.files;
        let len = files.length;

        (async () => {
            for (let i = 0; i < len; i++) {
                let file = files[i]
                if (!file.webkitRelativePath) {
                    let filename = file.name
                    await uploadFile({
                        id: folder, file, filename, onUploadProgress: progress => {
                            // todo show upload progress bar
                            // eslint-disable-next-line no-unused-vars
                            let percent = Math.round(progress.loaded / progress.total * 100);
                        }
                    })
                    continue
                }

                let path = file.webkitRelativePath
                let filename = path.substr(path.lastIndexOf("/") + 1)
                path = path.substr(0, path.lastIndexOf("/"))
                path = normalizeFilename(path)
                let res = await mkdir(folder, path)
                if (res.data.code === 0 || res.data.code === 1) {
                    let newFolder = res.data.data
                    await uploadFile({
                        id: newFolder, file, filename, onUploadProgress: progress => {
                            // todo show upload progress bar
                            // eslint-disable-next-line no-unused-vars
                            let percent = Math.round(progress.loaded / progress.total * 100);
                        }
                    })
                }
            }
        })().finally(() => {
            //removeFiles(folder).then(refresh)
        })
    };

    render() {
        const {activeItem, open} = this.state;
        return (
            <Popup
                content={
                    <Menu vertical>
                        <Menu.Item
                            name='File' active={activeItem === 'File'}
                            as="label" htmlFor="upload-file"
                            onMouseEnter={() => this.toggleItemHover("File")}
                            onMouseLeave={() => this.toggleItemHover(null)}>
                            <FormattedMessage id="home.tool.file"/>
                        </Menu.Item>
                        <Menu.Item
                            name='Folder' active={activeItem === 'Folder'}
                            as="label" htmlFor="upload-folder"
                            onMouseEnter={() => this.toggleItemHover("Folder")}
                            onMouseLeave={() => this.toggleItemHover(null)}>
                            <FormattedMessage id="home.tool.folder"/>
                        </Menu.Item>
                    </Menu>
                }
                trigger={<>
                    <Button className="mb-2 mr-1" color="linkedin"
                            onClick={this.clickUploadFile}
                            onMouseLeave={this.onMouseLeave}
                            onMouseEnter={this.onMouseEnter}>
                        <Icon name="upload"/>
                        <FormattedMessage id="home.tool.upload"/>
                        <input type="file" multiple id="upload-file" name="file" style={{display: "none"}}
                               onChange={this.onUploadFiles}/>
                        <input type="file" multiple id="upload-folder" style={{display: "none"}}
                               webkitdirectory="" accept="*/*" onChange={this.onUploadFiles}/>
                    </Button>
                </>} open={open} openOnTriggerFocus/>
        );
    }
}
