import React from "react";
import {Grid, Segment} from "semantic-ui-react";
import FileItem from "./FileItem";
import PropTypes from "prop-types";
import FileGridNewItem from "./FileGridNewItem";

export default class FileGridArea extends React.Component {
    static contextTypes = {
        files: PropTypes.array.isRequired,
        newFolderName: PropTypes.string,
    };

    render() {
        const {files, newFolderName} = this.context;

        return (
            <Segment basic>
                <Grid columns={8} doubling>
                    {newFolderName !== undefined && <>
                        <Grid.Column>
                            <FileGridNewItem/>
                        </Grid.Column>
                    </>}

                    {files.map((item, index) => (
                        <Grid.Column key={index}>
                            <FileItem index={index}/>
                        </Grid.Column>
                    ))}
                </Grid>
            </Segment>

        );
    }
}
