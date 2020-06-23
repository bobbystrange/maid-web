import React, {useState} from "react";
import {Button} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";
import MoveOrCopyDialog from "./MoveOrCopyDialog";
import {batchCopy, removeFilesAndPath} from "../../actions";
import {refresh} from "../../util/module/history";
import {Intent} from "@blueprintjs/core";


export default function MoveOrCopyButton({type, color}, {folder, files, chosenFolder, setChosenFolder}) {
    const [open, setOpen] = useState(false)

    const onClick = () => {
        setOpen(true)
    }

    const handleConfirm = () => {
        setOpen(false)
        if (chosenFolder === undefined) return
        setChosenFolder(undefined)
        if (folder === chosenFolder) return;

        let fromIds = files.filter(file => file.chosen)
            .map(file => file.id);
        // if no chosen files, then use current folder
        if (fromIds.length === 0) {
            fromIds.push(folder)
        }

        batchCopy(fromIds, chosenFolder).then(res => {
        }, err => {
            console.error(err);
            this.toaster.show({
                message: <FormattedMessage id={`home.tool.${type}_failed`}/>,
                timeout: 1_000,
                intent: Intent.WARNING,
            });
        }).finally(() => {
            removeFilesAndPath(folder, chosenFolder).then(refresh)
        })
    }

    return (
        <>
            <Button color={color} className="mb-2" onClick={onClick} id={`home_tool_${type}`}>
                <FormattedMessage id={`home.tool.${type}_to`}/>
            </Button>
            <MoveOrCopyDialog
                open={open}
                setOpen={setOpen}
                type={type}
                handleConfirm={handleConfirm}/>
        </>
    );
}

MoveOrCopyButton.contextTypes = {
    folder: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
    chosenFolder: PropTypes.number,
    setChosenFolder: PropTypes.func.isRequired,
}

MoveOrCopyButton.propTypes = {
    type: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
}
