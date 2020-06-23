import React from "react";
import {Button, Icon, Input} from "semantic-ui-react";
import PropTypes from "prop-types";
import UploadButton from "./UploadButton";
import SortButton from "./SortButton";
import {FormattedMessage} from "react-intl";
import DownloadButton from "./DownloadButton";
import ShareButton from "./ShareButton";
import NewButton from "./NewButton";
import DeleteButton from "./DeleteButton";
import RenameButton from "./RenameButton";
import MoveOrCopyButton from "./MoveOrCopyButton";

export default function ToolArea({tagged}, {vmode, updateSearch}) {

    const vmodeOnClick = () => {
        if (vmode === 'grid') {
            vmode = 'list';
        } else vmode = 'grid';
        updateSearch({vmode});
    };

    return (
        <div className="ml-4 mt-2 row">
            {!tagged && <UploadButton/>}
            {!tagged && <NewButton/>}
            {!tagged && <ShareButton/>}
            <DownloadButton/>
            <MoveOrCopyButton type='move' color='teal'/>
            <MoveOrCopyButton type='copy' color='olive'/>
            <RenameButton/>
            <DeleteButton/>
            <FormattedMessage id="home.tool.search">
                {msg => <Input icon='search' placeholder={msg} className="ml-auto mr-2 mb-2"/>}
            </FormattedMessage>
            <SortButton/>
            <Button className="mr-5 mb-2" color={vmode === 'grid' ? "purple" : "olive"} icon={
                <Icon name={`${vmode === 'grid' ? 'block' : 'list'} layout`} size="large"/>}
                    onClick={vmodeOnClick}/>
        </div>
    );
}

ToolArea.propTypes = {
    tagged: PropTypes.bool,
}

ToolArea.contextTypes = {
    files: PropTypes.array.isRequired,
    vmode: PropTypes.string.isRequired,
    updateSearch: PropTypes.func.isRequired,
};
