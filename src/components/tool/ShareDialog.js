import {Header, Icon, Input, Segment, Select} from "semantic-ui-react";
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";
import React from "react";
import {Alert, Intent} from "@blueprintjs/core";

export default function SharaDialog({open, setOpen, password, setPassword, timeValue, setTimeValue, setTimeUnit, handleConfirm}, {messages}) {

    return (
        <Alert
            cancelButtonText={messages["home.tool.cancel"]}
            onCancel={() => setOpen(false)}
            confirmButtonText={messages["home.tool.confirm"]}
            onConfirm={handleConfirm}
            intent={Intent.PRIMARY}
            canEscapeKeyClose
            canOutsideClickClose
            autoFocus
            isOpen={open}>
            <Header><Icon name='share' color="blue"/>
                <FormattedMessage id={`home.tool.share`}/>
            </Header>
            <Segment>
                <FormattedMessage id='home.tool.password_placeholder'>
                    {ph => (
                        <FormattedMessage id='home.tool.password'>{msg => (
                            <Input icon='eye slash' size='small' label={msg} placeholder={ph}
                                   value={password} onChange={e => {
                                let nv = e.target.value
                                if (nv.length > 12) {
                                    nv = nv.substr(0, 12)
                                }
                                setPassword(nv)
                            }}/>
                        )}</FormattedMessage>
                    )}
                </FormattedMessage>

                <FormattedMessage id='home.tool.ttl_placeholder'>
                    {ph => (
                        <FormattedMessage id='home.tool.ttl'>{msg => (
                            <Input icon='time' size='small' className='mt-3' label={msg} placeholder={ph}
                                   value={timeValue} onChange={e => setTimeValue(e.target.value)}/>
                        )}</FormattedMessage>
                    )}
                </FormattedMessage>

                <Select className='mt-3' defaultValue='day' options={[
                    {value: 'minute', text: <FormattedMessage id='home.tool.minute'/>},
                    {value: 'hour', text: <FormattedMessage id='home.tool.hour'/>},
                    {value: 'day', text: <FormattedMessage id='home.tool.day'/>},
                ]} id='home_tool_share_select_time' onChange={(e, {value}) => {
                    switch (value) {
                        case 'munite':
                            setTimeUnit(60)
                            break
                        case 'hour':
                            setTimeUnit(60 * 60)
                            break
                        case 'day':
                        default:
                            setTimeUnit(60 * 60 * 24)
                    }
                }}/>
            </Segment>
        </Alert>
    );
}

SharaDialog.contextTypes = {
    messages: PropTypes.object.isRequired,
}

SharaDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    timeValue: PropTypes.number,
    setTimeValue: PropTypes.func.isRequired,
    setTimeUnit: PropTypes.func.isRequired,
    password: PropTypes.string,
    setPassword: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
}
