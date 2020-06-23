import React, {Fragment} from "react";
import {storage} from "../../config";
import {pushForcibly, replace} from "../../util/module/history";
import LoadingPage from "../common/LoadingPage";
import HeadArea from "../common/HeadArea";
import SideArea from "../common/SideArea";
import ToolArea from "../tool/ToolArea";
import FileGridArea from "./FileGridArea";
import FileListArea from "./FileListArea";
import {getSearchValue} from "../../util";
import PropTypes from "prop-types";
import {fetchCategory, getCategory, sortFiles, visualizeFiles} from "../../actions";

export default class CategoryPage extends React.Component {

    static childContextTypes = {
        // always equal 0
        folder: PropTypes.string.isRequired,
        // grid, list
        vmode: PropTypes.string.isRequired,
        // name, size, mtime
        sort: PropTypes.string.isRequired,
        // asc, desc
        order: PropTypes.string.isRequired,
        updateSearch: PropTypes.func.isRequired,

        // files in current search
        files: PropTypes.array.isRequired,
        setFiles: PropTypes.func.isRequired,
        // last chosen
        lastChosenIndex: PropTypes.number.isRequired,
        setLastChosenIndex: PropTypes.func.isRequired,

        // chose a path to move/copy
        chosenFolder: PropTypes.number,
        setChosenFolder: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context)
        const vmode = getSearchValue('vmode', 'grid')
        const sort = getSearchValue('sort', 'name')
        const order = getSearchValue('order', 'asc')

        this.state = {
            last: undefined, size: 100, hasMore: true,
            folder: '0', vmode, sort, order,
            files: [], lastChosenIndex: -1, chosenFolder: undefined,
        }

        if (!window.location.search) {
            replace(`${window.location.pathname}?vmode=${vmode}&sort=${sort}&order=${order}`)
        }
    }

    getChildContext() {
        let {folder, vmode, sort, order, files, lastChosenIndex, chosenFolder} = this.state;
        return {
            folder, vmode, sort, order,
            updateSearch: this.updateSearch,
            files,
            setFiles: (files, callback = () => {
            }) => {
                this.setState({files}, callback)
            },
            lastChosenIndex,
            setLastChosenIndex: lastChosenIndex => {
                this.setState({lastChosenIndex})
            },
            chosenFolder,
            setChosenFolder: chosenFolder => {
                this.setState({chosenFolder})
            }
        }
    }

    componentDidMount() {
        if (!storage.hasToken()) {
            pushForcibly("/login")
            return
        }
        this.setState({loading: false})

        const category = getCategory()
        const {last, size} = this.state
        fetchCategory({category, last, size}).then(res => {
            let {items, last: nextlast, hasMore} = res.data.data
            this.setState({
                files: sortFiles(visualizeFiles(items)),
                last: nextlast,
                hasMore
            });
        })
    }


    updateSearch = ({vmode, sort, order}) => {
        vmode = vmode !== undefined ? vmode : this.state.vmode;
        sort = sort !== undefined ? sort : this.state.sort;
        order = order !== undefined ? order : this.state.order;
        this.setState({vmode, sort, order})
        replace(`${window.location.pathname}?vmode=${vmode}&sort=${sort}&order=${order}`);
    };

    render() {
        const {loading, vmode} = this.state;
        if (loading) return (<LoadingPage/>)

        return (
            <Fragment>
                <HeadArea/>
                <SideArea/>
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
                        <ToolArea tagged/>
                    </div>
                    <div className="mr-0" style={{
                        marginTop: "9rem",
                        marginLeft: "15rem"
                    }}>
                        {vmode === 'grid' && <FileGridArea/>}
                        {vmode === 'list' && <FileListArea/>}
                    </div>
                </div>
            </Fragment>
        )
    }

}
