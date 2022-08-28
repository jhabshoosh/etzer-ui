import React, { useCallback, useMemo, useState, MouseEvent as ReactMouseEvent } from 'react';
import styles from './FamilyTreeGraph.module.css';
import ReactFlow, { Controls, Node, Edge, applyNodeChanges, NodeChange, applyEdgeChanges, EdgeChange } from 'react-flow-renderer';
import dagre from 'dagre';
import { FamilyTreeNode } from '../FamilyTreeNode/FamilyTreeNode';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));


interface FamilyTreeGraphProps {
    initialNodes: Node[];
    initialEdges: Edge[];
}


export const FamilyTreeGraph = ({ initialNodes, initialEdges }: FamilyTreeGraphProps) => {


    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const [selectedNode, setSelectedNode] = useState('');

    
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onNodeClick = (event: ReactMouseEvent, node: Node) => {
        setSelectedNode(node.data.uuid)
    }

    const nodeTypes = useMemo(() => ({ familyTreeNode: FamilyTreeNode }), []);

    
    return (
        <div className={styles.tree} style={{ height: window.innerHeight, width: window.innerWidth}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
            >
                <Controls />
            </ReactFlow>
        </div>

    )
}