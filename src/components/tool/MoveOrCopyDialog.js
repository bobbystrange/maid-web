import React from "react";
import PropTypes from "prop-types";
import {Alert, Intent} from "@blueprintjs/core";
import {TreeArea} from "./TreeArea";
import {Header, Icon} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";

export default function MoveOrCopyDialog({open, setOpen, type, handleConfirm}, {messages}) {

    return (
        <Alert
            cancelButtonText={messages["home.tool.cancel"]}
            onCancel={() => setOpen(false)}
            confirmButtonText={messages["home.tool.confirm"]}
            onConfirm={() => handleConfirm()}
            intent={Intent.PRIMARY}
            canEscapeKeyClose
            canOutsideClickClose
            autoFocus
            // style={{width: "33%"}}
            isOpen={open}>
            <Header><Icon name={type} color="blue"/>
                <FormattedMessage id={`home.tool.${type}_to`}/></Header>
            <TreeArea/>
        </Alert>
    )
}

MoveOrCopyDialog.contextTypes = {
    messages: PropTypes.object.isRequired,
}

MoveOrCopyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    handleConfirm: PropTypes.func.isRequired,
}
