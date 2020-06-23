import React, {useState} from "react";
import {Button, Icon} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";
import ShareDialog from "./ShareDialog";
import {shareFile} from "../../actions";
import {Intent} from "@blueprintjs/core";
import ShareAfterDialog from "./ShareAfterDialog";
import {getSharedLink} from "../../config";


export default function ShareButton(props, {path, files, toaster}) {
    const [open, setOpen] = useState(false)
    const [ttl, setTtl] = useState(undefined)
    const [timeValue, setTimeValue] = useState(undefined)
    const [timeUnit, setTimeUnit] = useState(60 * 60 * 24)
    const [password, setPassword] = useState(undefined)
    const [filename, setFilename] = useState(undefined)

    const [openAfter, setOpenAfter] = useState(false)
    const [sharedLink, setSharedLink] = useState(undefined)

    const chosenFiles = files.filter(it => it.chosen)
    const onlyOneChosen = chosenFiles.length === 1
    const noChosen = chosenFiles.length === 0

    const onClick = () => {
        setOpen(true)
    }

    const handleConfirm = () => {
        setOpen(false)

        const chosenFiles = files.filter(it => it.chosen)
        const onlyOneChosen = chosenFiles.length === 1
        const noChosen = chosenFiles.length === 0
        if (!onlyOneChosen && !noChosen) return

        let id
        let name;
        if (onlyOneChosen) {
            id = chosenFiles[0].id
            name = chosenFiles[0].name
        } else if (noChosen) {
            id = path[path.length - 1].id
            name = path[path.length - 1].name
        }

        shareFile({id, password, ttl}).then(res => {
            if (res.data.success) {
                setSharedLink(getSharedLink(res.data.data))
                setOpenAfter(true)
                setFilename(name)
            } else {
                toaster.current.show({
                    message: <div>
                        <FormattedMessage id="home.tool.share_failed"/><strong>{name}</strong>
                    </div>,
                    timeout: 1_000,
                    intent: Intent.DANGER,
                });
            }
        })
    }

    return (<>
        <Button color="orange" disabled={!onlyOneChosen && !noChosen} className="mb-2"
                onClick={onClick} id='home_tool_share'>
            <Icon name="share alternate"/><FormattedMessage id="home.tool.share"/>
        </Button>
        <ShareDialog
            open={open}
            setOpen={setOpen}
            timeValue={timeValue}
            setTimeValue={v => {
                let n = Number(v)
                if (Number.isNaN(n) || !Number.isFinite(n)) {
                    setTimeValue(undefined)
                    setTtl(undefined)
                    return
                }

                setTimeValue(n)
                setTtl(n * timeUnit)
            }}
            setTimeUnit={setTimeUnit}
            password={password}
            setPassword={setPassword}
            handleConfirm={handleConfirm}/>
        <ShareAfterDialog
            open={openAfter}
            setOpen={setOpenAfter}
            sharedLink={sharedLink}
            timeUnit={timeUnit}
            filename={filename}
            password={password}
        />
    </>);
}

ShareButton.contextTypes = {
    path: PropTypes.array.isRequired,
    files: PropTypes.array.isRequired,
    toaster: PropTypes.object.isRequired,
};
