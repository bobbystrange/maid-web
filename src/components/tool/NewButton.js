import React from "react";
import {Button} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";


export default function NewButton(props, {setNewFolderName, messages, files, setFiles}) {

    const onClick = () => {
        let untitled = messages['home.tool.untitled'];
        let seq = 1;
        files.forEach(it => {
                it.chosen = false
                let name = it.name;

                if (name.startsWith(untitled)) {
                    if (name === untitled) seq = seq === 1 ? 2 : seq

                    name = name.slice(untitled.length).trim();
                    if (/(\d+)/.test(name)) {
                        seq = Math.max(seq, Number(RegExp.$1) + 1)
                    }
                }
            }
        );
        if (seq > 1) {
            untitled = `${untitled} ${seq}`
        }
        setFiles(files);
        setNewFolderName(untitled);
    }

    return (
        <Button icon="add" color="facebook" className="mb-2"
                content={<FormattedMessage id="home.tool.new"/>}
                onClick={onClick}/>
    );
}

NewButton.contextTypes = {
    messages: PropTypes.object.isRequired,
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
    setNewFolderName: PropTypes.func.isRequired,
};
