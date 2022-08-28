import React, { useMemo } from 'react';
import { useQuery } from 'graphql-hooks';
import styles from './FamilyTree.module.css';
import ReactFlow, { Controls, Node, Edge } from 'react-flow-renderer';
import { GetFamilyResponse, Person, Relationship } from '../../models/person';
import dagre from 'dagre';
import { FamilyTreeGraph } from './FamilyTreeGraph/FamilyTreeGraph';
import { FamilyTreeNode } from './FamilyTreeNode/FamilyTreeNode';

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
            value: p
        },
        type: 'familyTreeNode'
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

const getLayoutedElements = (nodesAndEdges: NodesAndEdges, direction = 'TB') => {
    const { nodes, edges } = nodesAndEdges;
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

export const FamilyTree = () => {

    const { loading, error, data } = useQuery(GET_FAMILY_QUERY);    

    if (loading) {
        return <span>Loading</span>;
    }
    if (error) {
        return <span>Error</span>;
    }

    const { nodes, edges } = !loading && !error ? getLayoutedElements(mapResponseToNodesAndEdges(data)) : {nodes: [], edges: []};

    return (
        <div className={styles.tree} style={{ height: window.innerHeight, width: window.innerWidth}}>
            <span className={styles.headerText}>משפחת חבשוש</span>
            {/* <CreateNewPerson /> */}
            <FamilyTreeGraph initialNodes={nodes} initialEdges={edges} />
        </div>
    )
}