import React, {useEffect, useState} from "react";
import {fileShare, submitDownload, visualizeFile} from "../../actions";
import HeadAuthArea from "../auth/HeadAuthArea";
import {Button, Card, Header, Icon} from "semantic-ui-react";
import './ShareViewPage.css'
import {dateFormat, openLink} from "../../util";
import {FormattedMessage} from "react-intl";
import {Intent} from "@blueprintjs/core";
import PropTypes from "prop-types";
import ShareViewFileArea from "./ShareViewFileArea";
import LoadingPage from "../common/LoadingPage";

const toShareViewFile = (shareFile) => {
    const file = visualizeFile(shareFile)
    file.chosen = true
    file.isFile = !file.isFolder
    const {stime, ttl} = shareFile

    file.stime = stime
    file.stimeStr = dateFormat(stime, "yyyy/MM/dd hh:mm")

    file.ttl = ttl
    if (ttl) {

        const etime = stime + ttl * 1000
        file.etime = etime
        file.etimeStr = dateFormat(etime, "yyyy/MM/dd hh:mm")
    }
    return file
}

export default function ShareViewPage(props, {toaster}) {
    const [loading, setLoading] = useState(true)
    const [file, setFile] = useState({})

    const {sid} = props.match.params
    useEffect(() => {
        fileShare(sid).then(res => {
            const code = res.data.code
            // require password
            if (code === 2) {

            } else if (code === 0) {
                const shareFile = res.data.data
                setFile(toShareViewFile(shareFile))
            }

            setLoading(false)
        })
    }, [sid])

    const onClick = () => {
        const {id} = file
        if (!id) return

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
    }

    if (loading) return (<LoadingPage/>)

    if (file.isFolder) {
        return <ShareViewFileArea file={file} setFile={setFile} sid={sid}/>
    }

    return <div style={{marginTop: '5rem'}}>
        <HeadAuthArea headnote="login" href="/login"/>
        <Card className="mt-5 mx-auto share-view-card">
            <Card.Header className='mx-auto'>
                {file.iconColor && file.iconColor[0] === "#" ?
                    <Icon name={file.iconName} style={{color: file.iconColor}} className='mx-auto my-4'
                          size="massive"/> :
                    <Icon name={file.iconName} color={file.iconColor} className='mx-auto my-4' size="massive"/>
                }
            </Card.Header>
            <Card.Content>
                <Card.Description
                    className="line-clamp-2 text-center">
                    <Header>{file.name}</Header>
                    {file.isFile &&
                    <div className='mb-2'>{file.sizeStr}</div>}

                    {file.etime ?
                        <div><FormattedMessage id='share.etime'/>&emsp;{file.etimeStr}</div> :
                        <div><FormattedMessage id='share.never_expired'/></div>}

                    {file.isFile &&
                    <Button color="vk" className="mt-3 mb-2" onClick={onClick}>
                        <Icon name="download"/><FormattedMessage id="home.tool.download"/>
                    </Button>}
                </Card.Description>
            </Card.Content>
        </Card>
    </div>
}

ShareViewPage.contextTypes = {
    toaster: PropTypes.object.isRequired,
}
