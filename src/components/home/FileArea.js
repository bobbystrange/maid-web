import React from "react";
import PropTypes from "prop-types";
import ToolArea from "../tool/ToolArea";
import NavArea from "./NavArea";
import FileGridArea from "./FileGridArea";
import FileListArea from "./FileListArea";
import {getSearchValue} from "../../util";
import {replace} from "../../util/module/history";
import {loadOrFetchFiles, loadOrFetchPath, sortFiles, visualizeFiles} from "../../actions";

export default class FileArea extends React.Component {

    static childContextTypes = {
        folder: PropTypes.string.isRequired,
        // grid, list
        vmode: PropTypes.string.isRequired,
        // name, size, mtime
        sort: PropTypes.string.isRequired,
        // asc, desc
        order: PropTypes.string.isRequired,
        updateSearch: PropTypes.func.isRequired,

        // files in current folder, [{}]
        files: PropTypes.array.isRequired,
        setFiles: PropTypes.func.isRequired,
        // Note [{id: 0, name: "/}, ...], make sure path[path.size -1].id === folder
        path: PropTypes.array.isRequired,

        // last chosen
        lastChosenIndex: PropTypes.number.isRequired,
        setLastChosenIndex: PropTypes.func.isRequired,

        // create a new folder
        newFolderName: PropTypes.string,
        setNewFolderName: PropTypes.func.isRequired,

        // chose a path to move/copy
        chosenFolder: PropTypes.number,
        setChosenFolder: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context)
        const folder = getSearchValue('folder', '0')
        const vmode = getSearchValue('vmode', 'grid')
        const sort = getSearchValue('sort', 'name')
        const order = getSearchValue('order', 'asc')

        this.state = {
            folder, vmode, sort, order,
            path: [{id: 0, name: "/"}], files: [], lastChosenIndex: -1,
            newFolderName: undefined, chosenFolder: undefined,
        }

        if (!window.location.search) {
            replace(`${window.location.pathname}?folder=${folder}&vmode=${vmode}&sort=${sort}&order=${order}`)
        }
    }

    getChildContext() {
        let {folder, vmode, sort, order, path, files, lastChosenIndex, newFolderName, chosenFolder} = this.state;
        return {
            folder, vmode, sort, order,
            updateSearch: this.updateSearch,
            path, files, setFiles: (files, callback = () => {
            }) => {
                this.setState({files}, callback)
            },
            lastChosenIndex, setLastChosenIndex: lastChosenIndex => {
                this.setState({lastChosenIndex})
            },
            newFolderName, setNewFolderName: newFolderName => {
                this.setState({newFolderName})
            },
            chosenFolder,
            setChosenFolder: chosenFolder => {
                this.setState({chosenFolder})
            }
        }
    }

    componentDidMount() {
        let {folder} = this.state;
        loadOrFetchFiles(folder).then(files => {
            this.setState({files: visualizeFiles(files)});
        });
        loadOrFetchPath(folder).then(path => {
            this.setState({path})
        })
    }

    // update files & path by search value
    componentDidUpdate(prevProps, prevState, snapshot) {
        let {folder, sort, order, files} = this.state;
        if (prevState.folder !== folder) {
            loadOrFetchFiles(folder).then(files => {
                this.setState({files: sortFiles(visualizeFiles(files)),});
            });
            loadOrFetchPath(folder).then(path => {
                this.setState({path})
            })
        }
        if (prevState.sort !== sort || prevState.order !== order) {
            files = sortFiles(files);
            this.setState({files});
        }
    }

    updateSearch = ({folder, vmode, sort, order}) => {
        folder = folder !== undefined ? folder : this.state.folder;
        vmode = vmode !== undefined ? vmode : this.state.vmode;
        sort = sort !== undefined ? sort : this.state.sort;
        order = order !== undefined ? order : this.state.order;
        this.setState({folder, vmode, sort, order})
        replace(`${window.location.pathname}?folder=${folder}&vmode=${vmode}&sort=${sort}&order=${order}`);
    }

    render() {
        const {vmode} = this.state;
        return (
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
                    <ToolArea/>
                    <NavArea/>
                </div>
                <div className="mr-0" style={{
                    marginTop: "13.5rem",
                    marginLeft: "15rem"
                }}>
                    {vmode === 'grid' && <FileGridArea/>}
                    {vmode === 'list' && <FileListArea/>}
                </div>
            </div>

        );
    }
}
