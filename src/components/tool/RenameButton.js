import React from "react";
import {Button} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";


export default function RenameButton(props, {files, setFiles}) {

    const onClick = () => {
        files.forEach((file, i) => {
            if (file.chosen) file.editing = true;
        })
        setFiles(files);
    }

    const chosenFiles = files.filter(it => it.chosen);
    const onlyOneChosen = chosenFiles.length === 1;
    return (
        <Button color="green" disabled={!onlyOneChosen} className="mb-2" onClick={onClick} id='home_tool_rename'>
            <FormattedMessage id="home.tool.rename"/>
        </Button>
    );
}

RenameButton.contextTypes = {
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
}
