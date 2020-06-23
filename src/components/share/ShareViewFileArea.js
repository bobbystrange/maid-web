import * as React from "react";
import {Fragment} from "react";
import HeadAuthArea from "../auth/HeadAuthArea";
import PropTypes from "prop-types";
import NavArea from "../home/NavArea";
import {getSearchValue} from "../../util";
import {replace} from "../../util/module/history";
import {Grid, Segment} from "semantic-ui-react";
import FileItem from "../home/FileItem";
import {listPathShare, listShare, visualizeFiles} from "../../actions";

export default class ShareViewFileArea extends React.Component {

    static childContextTypes = {
        folder: PropTypes.string,
        updateSearch: PropTypes.func.isRequired,

        // files in current folder, [{}]
        files: PropTypes.array.isRequired,
        setFiles: PropTypes.func.isRequired,
        // Note [{id: 0, name: "/}, ...], make sure path[path.size -1].id === folder
        path: PropTypes.array.isRequired,
    };

    static propTypes = {
        sid: PropTypes.string.isRequired,
        password: PropTypes.string,
        file: PropTypes.object.isRequired,
        setFile: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context)
        const folder = getSearchValue('folder', undefined)

        this.state = {
            folder, path: [{id: '0', name: "/"}], files: []
        }

        if (!window.location.search) {
            replace(`${window.location.pathname}?folder=${folder}`)
        }
    }

    getChildContext() {
        let {folder, path, files} = this.state;
        return {
            folder, updateSearch: this.updateSearch,
            path, files, setFiles: (files, callback = () => {
            }) => {
                this.setState({files}, callback)
            },
        }
    }

    componentDidMount() {
        let {folder} = this.state
        if (folder === '0') folder = undefined

        let {sid, password} = this.props
        listShare(sid, password, folder).then(res => {
            if (res.data.success) {
                const files = res.data.data
                this.setState({files: visualizeFiles(files)})
            }
        })

        listPathShare(sid, password, folder).then(res => {
            if (res.data.success) {
                const path = res.data.data
                this.setState({path})
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let {folder} = this.state
        let {sid, password} = this.props

        if (prevState.folder !== folder) {
            if (folder === '0') folder = undefined

            listShare(sid, password, folder).then(res => {
                if (res.data.success) {
                    const files = res.data.data
                    this.setState({files: visualizeFiles(files)})
                }
            })

            listPathShare(sid, password, folder).then(res => {
                if (res.data.success) {
                    const path = res.data.data
                    this.setState({path})
                }
            })
        }
    }

    updateSearch = ({folder}) => {
        folder = folder !== undefined ? folder : this.state.folder
        this.setState({folder})
        replace(`${window.location.pathname}?folder=${folder}`)
    }

    render() {
        const {files} = this.state;

        return (<Fragment>
            <HeadAuthArea headnote="login" href="/login"/>

            <div>
                <div className="py-3" style={{
                    position: "fixed",
                    top: "3rem",
                    left: "15rem",
                    right: 0,
                    zIndex: 1,
                    boxShadow: "inset -1px 0 0 rgba(0, 0, 0, .25)",
                    backgroundColor: 'white',
                }}>
                    <NavArea/>
                </div>
                <div className="mr-0" style={{
                    marginTop: "13.5rem",
                    marginLeft: "15rem"
                }}>
                    <Segment basic>
                        <Grid columns={8} doubling>
                            {files.map((item, index) => (
                                <Grid.Column key={index}>
                                    <FileItem index={index}/>
                                </Grid.Column>
                            ))}
                        </Grid>
                    </Segment>
                </div>
            </div>
        </Fragment>)
    }
}
