import {Icon, Segment, Table} from "semantic-ui-react";
import {FormattedMessage, FormattedRelativeTime} from "react-intl";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {getSharedLink} from "../../config";


export default function ShareListArea({files, setFiles}) {
    const [sharedLink, setSharedLink] = useState(undefined)
    const [password, setPassword] = useState(undefined)

    const OnClick = (e, index) => {
        const {sid, password, chosen} = files[index]
        if (chosen) {
            files[index].chosen = false
            setFiles(files)
            setPassword(undefined)
            return
        }
        files[index].chosen = true
        setFiles(files)
        setPassword(password)

        const url = getSharedLink(sid)
        setSharedLink(url)
    }

    return <Segment basic>
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        <Icon name="file" color="grey" size="large"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="share.filename"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="share.size"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="share.ctime"/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <FormattedMessage id="share.etime"/>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {files.map((file, i) =>
                    <Table.Row key={i} className={file.chosen ? "file-list-row-chosen" : "file-list-row"}
                               onClick={e => OnClick(e, i)}>
                        <Table.Cell>
                            {file.iconColor[0] === "#" ?
                                <Icon name={file.iconName} style={{color: file.iconColor}} size="large"/> :
                                <Icon name={file.iconName} color={file.iconColor} size="large"/>
                            }
                        </Table.Cell>
                        <Table.Cell width={9}>
                            {file.chosen && !password &&
                            <label className="file-list-name">{sharedLink}</label>}

                            {file.chosen && password && <FormattedMessage id='home.tool.password_to'>{
                                msg => <label className="file-list-name">{sharedLink} {msg} {password}</label>
                            }</FormattedMessage>}

                            {!file.chosen &&
                            <label className="file-list-name">{file.name}</label>}
                        </Table.Cell>
                        <Table.Cell width={2}>
                            {file.sizeStr}
                        </Table.Cell>
                        <Table.Cell width={3}>
                            {file.ctimeStr}
                        </Table.Cell>
                        <Table.Cell width={2}>
                            {file.etimeUnit ?
                                <FormattedRelativeTime value={file.etimeValue} unit={file.etimeUnit}/> :
                                <FormattedMessage id='share.expired'/>}
                        </Table.Cell>
                    </Table.Row>)}
            </Table.Body>
        </Table>

    </Segment>
}

ShareListArea.propTypes = {
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
}
