import React from "react";
import {Grid, Icon} from 'semantic-ui-react'
import PropTypes from "prop-types";
import NavBreadcrumb from "./NavBreadcrumb";
import {FormattedMessage} from "react-intl";
import {removeFilesAndPath} from "../../actions";
import {refresh} from "../../util/module/history";

export default class NavArea extends React.Component {
    static contextTypes = {
        folder: PropTypes.string.isRequired,
        files: PropTypes.array.isRequired,
        setFiles: PropTypes.func.isRequired,
    };

    state = {
        selectAllChecked: false,
        selectedFileCount: 0,
    };

    selectAllOnCheck = () => {
        let selectAllChecked = !this.state.selectAllChecked;
        let {files, setFiles} = this.context;
        files.forEach(file => {
            file.chosen = selectAllChecked;
        });
        setFiles(files);

        this.setState({selectAllChecked});
    };

    reverseOnClick = () => {
        let {files, setFiles} = this.context;
        files.forEach(file => {
            file.chosen = !file.chosen;
        });
        setFiles(files);

        const selectedCount = files.reduce((c, file) => file.chosen ? c + 1 : c, 0);
        this.setState({selectAllChecked: selectedCount === files.length});
    };

    refreshOnClick = () => {
        let {folder} = this.context;
        removeFilesAndPath(folder).then(refresh);
    }

    render() {
        let {files} = this.context;
        const {selectAllChecked} = this.state;
        const selectedCount = files.reduce((c, file) => file.chosen ? c + 1 : c, 0);

        return (
            <div className="ml-4 mt-1 pb-3 mr-3" style={{
                borderBottom: "1px solid rgba(1,1,1,0.2)"
            }}>
                <Grid className="my-1">
                    <NavBreadcrumb/>
                </Grid>
                <Grid>
                    <Icon name={selectAllChecked ? "check square" : "square outline"}
                          color="blue" size="large"
                          onClick={this.selectAllOnCheck}/>
                    {selectedCount === 0 && <FormattedMessage id="home.nav.select_all" tagName="label"/>}
                    {selectedCount !== 0 && <label>
                        <FormattedMessage id="home.nav.selected"/>&nbsp;{selectedCount}
                    </label>}
                    <label className="ml-auto mr-3" style={{
                        border: "1px solid #397EFF",
                    }} onClick={this.reverseOnClick}><FormattedMessage id="home.nav.reverse"/></label>
                    <label className="mr-3" style={{
                        border: "1px solid #397EFF",
                    }} onClick={this.refreshOnClick}><FormattedMessage id="home.nav.refresh"/></label>
                </Grid>
            </div>
        );
    }


}

