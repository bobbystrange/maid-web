import {Header, Icon, Input, Segment} from "semantic-ui-react";
import {FormattedMessage, FormattedRelativeTime} from "react-intl";
import PropTypes from "prop-types";
import React from "react";
import {Alert, Intent} from "@blueprintjs/core";
import {getRelativeTime} from "../../util";

export default function SharaAfterDialog({open, setOpen, filename, sharedLink, ttl, timeUnit, password}, {messages}) {
    let etimeValue, etimeUnit
    if (ttl) {
        let {timeValue, timeUnit} = getRelativeTime(new Date().getTime() + ttl * 1000)
        etimeValue = timeValue
        etimeUnit = timeUnit
    }

    return (
        <Alert
            cancelButtonText={messages["home.tool.cancel"]}
            onCancel={() => setOpen(false)}
            confirmButtonText={messages["home.tool.confirm"]}
            onConfirm={() => setOpen(false)}
            intent={Intent.PRIMARY}
            canEscapeKeyClose
            canOutsideClickClose
            autoFocus
            isOpen={open}>
            <Header><Icon name='share' color="blue"/>
                <FormattedMessage id={`home.tool.share`}/>
            </Header>
            <Segment>
                <div className='d-flex text-muted'>
                    {filename}
                </div>

                <div className='d-flex mt-3'>
                    <Icon name="check circle" color="blue" size="large"/>
                    <label style={{color: '#159ae3'}} className='mr-3'>
                        <FormattedMessage id='home.tool.share_succeeded'/>
                    </label>

                    {ttl && <label>
                        <FormattedMessage id='home.tool.valid_for'/>
                        <FormattedRelativeTime value={etimeValue} unit={etimeUnit}/>
                    </label>}

                    {!ttl && <label>
                        <FormattedMessage id='home.tool.valid_forever'/>
                    </label>}
                </div>

                {!password &&
                <Input className='mt-3' value={sharedLink}
                       onFocus={e => {
                           e.target.select()
                       }}/>}

                {password && <FormattedMessage id='home.tool.password_to'>{
                    msg => (
                        <Input className='mt-3' value={sharedLink}
                               label={`${msg}${password}`} labelPosition='right'
                               onFocus={e => {
                                   e.target.select()
                               }}/>
                    )
                }</FormattedMessage>}
            </Segment>
        </Alert>
    );
}

SharaAfterDialog.contextTypes = {
    messages: PropTypes.object.isRequired,
}

SharaAfterDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    filename: PropTypes.string,
    sharedLink: PropTypes.string,
    ttl: PropTypes.number,
    timeUnit: PropTypes.number,
    password: PropTypes.string,
}
