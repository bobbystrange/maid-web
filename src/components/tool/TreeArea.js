import React, {Component} from "react";
import {Position, Tooltip, Tree} from "@blueprintjs/core";
import {loadOrFetchFiles} from "../../actions";
import PropTypes from "prop-types";

export class TreeArea extends Component {
    static contextTypes = {
        setChosenFolder: PropTypes.func.isRequired,
    };

    state = {nodes: []};

    handleNodeClick = (nodeData, _nodePath, e) => {
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, n => (n.isSelected = false));
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;
        this.setState(this.state);

        let {setChosenFolder} = this.context;
        setChosenFolder(nodeData.id);
    };

    handleNodeCollapse = (nodeData) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    handleNodeExpand = (nodeData) => {
        nodeData.isExpanded = true;
        this.setState(this.state);

        if (nodeData.childNodes) return

        loadOrFetchFiles(nodeData.id).then(files => {
            buildTree(nodeData, files);
            this.setState(this.state);
        });
    };

    componentDidMount() {
        loadOrFetchFiles(0).then(files => {
            const rootNode = {
                id: 0,
                path: '/',
                hasCaret: true,
                isExpanded: true,
                icon: 'folder-open',
                label: (
                    <Tooltip content={'/'} position={Position.RIGHT}>{'/'}</Tooltip>
                )
            }
            buildTree(rootNode, files);
            this.setState({nodes: [rootNode]});
        })
    }

    render() {
        return (
            <div style={{maxHeight: '20rem'}}>
                <Tree
                    contents={this.state.nodes}
                    onNodeClick={this.handleNodeClick}
                    onNodeCollapse={this.handleNodeCollapse}
                    onNodeExpand={this.handleNodeExpand}
                />
            </div>
        );
    }

    forEachNode(nodes, callback) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            this.forEachNode(node.childNodes, callback);
        }
    }

}

// [ {id, pid, name, ctime, mtime, type, size}, ]
function buildTree(node, files) {
    node.childNodes = []
    if (!files) return;

    let basePath = node.path
    let count = files.length
    for (let i = 0; i < count; i++) {
        let {id, name, type} = files[i];
        if (type) continue;

        const path = basePath === '/' ? basePath + name : basePath + '/' + name
        const childNode = {
            id,
            path,
            hasCaret: true,
            isExpanded: false,
            icon: 'folder-open',
            label: (
                <Tooltip content={path} position={Position.RIGHT}>{name}</Tooltip>
            )
        }

        node.childNodes.push(childNode)
    }

    node.icon = 'folder-close'
}
