import React from "react";
import {Button, Icon} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";
import {submitDownload} from "../../actions";
import {openLink} from "../../util";
import {Intent} from "@blueprintjs/core";

export default function DownloadButton(props, {files, toaster}) {

    const onClick = () => {

        let {id} = files.filter(it => it.chosen)[0];
        submitDownload(id, true).then((res) => {
            let url = res.data.data;
            openLink(url);
        }, err => {
            console.error(err);
            toaster.current.show({
                message: <FormattedMessage id="home.tool.download_failed"/>,
                timeout: 1_000,
                intent: Intent.WARNING,
            });
        });
    };

    const chosenFiles = files.filter(it => it.chosen);
    const onlyOneChosen = chosenFiles.length === 1;
    const onlyOneFileChosen = onlyOneChosen && !chosenFiles[0].isFolder;
    return (
        <Button color="vk" disabled={!onlyOneFileChosen} className="mb-2" onClick={onClick} id='home_tool_download'>
            <Icon name="download"/><FormattedMessage id="home.tool.download"/>
        </Button>
    );
}

DownloadButton.contextTypes = {
    files: PropTypes.array.isRequired,
    toaster: PropTypes.object.isRequired,
};
