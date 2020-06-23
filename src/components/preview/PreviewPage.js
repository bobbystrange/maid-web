import React from "react";
import {anyMatch, getSearchValue} from "../../util";
import {pushForcibly} from "../../util/module/history";
import {loadOrFetchFiles, submitDownload, visualizeFile} from "../../actions";
import HeadArea from "../layout/HeadArea";
import {Grid, Image} from "semantic-ui-react";
import {addLineNumber, getRandomStyle, md2html} from "../../config";

export default class PreviewPage extends React.Component {
    constructor(props) {
        super(props);
        if (!window.location.search) {
            pushForcibly("/")
        }

        const path = getSearchValue('path', '/');
        this.state = {
            path, name: "", ctime: 0, mtime: 0, type: "", size: 0, kind: 'none'
        };
    }

    componentDidMount() {
        let {path} = this.state;
        path = decodeURI(path);
        let parantPath = path.substr(0, path.lastIndexOf('/'));
        if (parantPath === '') parantPath = '/';

        loadOrFetchFiles(parantPath).then(files => {
            let file = files.filter(file => file.path === path)[0];
            let {name, ctime, mtime, type, size, iconName} = visualizeFile(file);
            let kind = iconName === 'file' ? 'none' : iconName.split(" ")[1];

            submitDownload(path, false).then(res => {
                let source = res.data.data;
                this.setState({source})
                if (kind === 'code') {
                    fetch(source).then(res => {
                        // Promise<string>
                        return res.text()
                    }).then(content => {
                        if (type !== 'text/markdown') {
                            let ext = ""
                            if (anyMatch(type, "application/x-csh", "application/x-sh")) {
                                ext = "sh"
                            }

                            content = "```" + ext + "\n" + content + "\n```";
                        }

                        console.log(getRandomStyle())
                        this.setState({content, style: getRandomStyle()})
                    });
                }
            })
            this.setState({name, ctime, mtime, type, size, kind});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevState.content && this.state.content) {
            addLineNumber()
        }
    }

    render() {
        const {kind, source, content, style} = this.state;
        console.log(kind, style)
        return (
            <div>
                <HeadArea/>
                <Grid celled centered style={{
                    marginTop: "5rem",
                }}>
                    <Grid.Column width={2}>

                    </Grid.Column>
                    <Grid.Column width={12}>
                        {kind === 'image' && source &&
                        <Image src={source} className="mx-auto" style={{maxHeight: '40rem'}}/>
                        }
                        {kind === 'pdf' && source &&
                        <iframe src={source} className="mx-auto" width='100%' height='600px'/>
                        }
                        {/*Word and PowerPoint documents must be less than 10 megabytes;
                        Excel must be less than five megabytes.*!
                        {['word', 'excel', 'powerpoint'].indexOf(kind) !== -1 && source &&
                        <iframe src={`http://view.officeapps.live.com/op/view.aspx?src=${source}`} className="mx-auto" width='100%' height='600px'/>
                        }*/}
                        {kind === 'code' && content &&
                        <>
                            <div dangerouslySetInnerHTML={{__html: md2html(content)}}/>
                            <link rel="stylesheet" type="text/css"
                                  href={`/static/css/highlight/${style}.css`}/>
                        </>
                        }
                    </Grid.Column>
                    <Grid.Column width={2}>

                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
