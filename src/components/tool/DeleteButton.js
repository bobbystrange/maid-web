import React from "react";
import {Button, Icon} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";
import {Intent} from "@blueprintjs/core";
import {batchDelete, deleteFile, removeFilesAndPath} from "../../actions";
import {refresh} from "../../util/module/history";

export default function DeteleButton(props, {folder, files, toaster}) {

    const onClick = () => {
        const chosenFiles = files.filter(it => it.chosen);
        let size = chosenFiles.length;
        if (size === 0) return;

        if (size === 1) {
            let {id, name} = chosenFiles[0];
            deleteFile(id).then(res => {
                toaster.current.show({
                    message: <div>
                        <FormattedMessage id="home.tool.deleted"/><strong>{name}</strong>
                    </div>,
                    timeout: 1_000,
                    intent: Intent.PRIMARY,
                });

                removeFilesAndPath(folder).then(refresh)
            }, err => {
                console.error(err);
                toaster.current.show({
                    message: <div>
                        <FormattedMessage id="home.tool.delete_failed"/><strong>{name}</strong>
                    </div>,
                    timeout: 1_000,
                    intent: Intent.WARNING,
                });
            });
        } else {
            let ids = chosenFiles.map(it => it.id)
            batchDelete(ids).finally(() => {
                removeFilesAndPath(folder).then(refresh)
            });
        }
    };

    return (<>
        <Button color="red" className="mb-2" onClick={onClick} id='home_tool_delete'>
            <Icon name="trash alternate"/><FormattedMessage id="home.tool.delete"/>
        </Button>
    </>);
}

DeteleButton.contextTypes = {
    folder: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    toaster: PropTypes.object.isRequired,
};
