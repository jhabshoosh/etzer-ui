import React, { useMemo } from 'react';
import { useQuery } from 'graphql-hooks';
import styles from './FamilyTree.module.css';
import ReactFlow, { Controls, Node, Edge } from 'react-flow-renderer';
import { GetFamilyResponse, Person, Relationship } from '../../models/person';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const GET_FAMILY_QUERY = `
    query {
        getFamily {
            persons {
                name
                uuid
            }
            relationships {
                parent
                child
            }
        }
    }`

interface NodesAndEdges {
    nodes: Node[];
    edges: Edge[];
}

const getLayoutedElements = (nodes: any, edges: any, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });
  
    nodes.forEach((node: any) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
  
    edges.forEach((edge: any) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
  
    dagre.layout(dagreGraph);
  
    nodes.forEach((node: any) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? 'left' : 'top';
      node.sourcePosition = isHorizontal ? 'right' : 'bottom';
  
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
  
      return node;
    });
  
    return { nodes, edges };
};    

const mapResponseToNodesAndEdges = (response: GetFamilyResponse): NodesAndEdges => {
    let nodes: Node[] = [];
    let edges: Edge[] = [];

    const { getFamily: { persons, relationships } } = response;
    nodes = persons.map((p: Person) => ({
        id: p.uuid,
        position: {
            x: 0,
            y: 0
        },
        data: {
            label: p.name,
            value: p.name
        },
        type: "familyTreeNode",
    }));

    edges = relationships.map((r: Relationship) => ({
        id: `${r.parent}-${r.child}`,
        source: r.parent,
        target: r.child,
    }));


    return {
        nodes,
        edges,
    }
}

export const FamilyTree = () => {

    const { loading, error, data } = useQuery(GET_FAMILY_QUERY);    

    if (loading) {
        return <span>Loading</span>;
    }
    if (error) {
        return <span>Error</span>;
    }

    const { nodes, edges } = !loading && !error ? mapResponseToNodesAndEdges(data) : {nodes: null, edges: null};
    const { nodes: layoutedNodes, edges: layoutedEdges } = !loading && !error ? getLayoutedElements(
        nodes,
        edges
    ) : {nodes: null, edges: null};

    return (
        <div className={styles.tree} style={{ height: window.innerHeight, width: window.innerWidth}}>
            <span className={styles.headerText}>משפחת חבשוש</span>
            <ReactFlow
                nodes={layoutedNodes || nodes}
                edges={layoutedEdges || edges}
                // onNodesChange={onNodesChange}
                // onEdgesChange={onEdgesChange}
                // onConnect={onConnect}
                fitView
            >
                <Controls />
            </ReactFlow>
        </div>

    )
}