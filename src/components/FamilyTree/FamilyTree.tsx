import React from 'react';
import { useQuery } from 'graphql-hooks';
import styles from './FamilyTree.module.css';
import ReactFlow, { Controls, Node, Edge } from 'react-flow-renderer';
import { GetRootAncestorResponse, Person } from '../../models/person';
import { Queue } from '@datastructures-js/queue';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const QUERY = `
    query {
        getRootAncestor {
            name
            uuid
            children {
                name
                uuid
                children {
                    name
                    uuid
                    children {
                        name
                        uuid
                    }
                }
            }
        }
    }`;

interface NodesAndEdges {
    nodes: Node[];
    edges: Edge[];
}

const createNodesAndEdges = (response: GetRootAncestorResponse): NodesAndEdges => {
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    // let positionX = 200;
    // let positionY = 200;
    // let generationCount = 1;

    if (response) {
        const queue = new Queue<Person>();

        const { getRootAncestor: rootAncestor } = response;
        queue.push(rootAncestor);

        while (!queue.isEmpty()) {
            const person = queue.pop();
            nodes.push({
                id: person?.uuid as string,
                // position: {
                //     x: (positionX * ((person.generationOrder as number) + 1)) ,
                //     y: positionY * (person.generation as number),
                // },
                position: {
                    x: 0,
                    y: 0,
                },
                data: {
                    label: person.name,
                },
                draggable: true,
            })

            // let generationOrder = person.generationOrder as number;
            person?.children?.forEach((child: Person, index) => {
                // let node = {
                //     ...child,
                //     generation: (person.generation as number) + 1,
                //     generationOrder: generationOrder + (person.generationOrder as number),
                // }
                // console.log(`queueing up ${JSON.stringify(node)}`)
                queue.push(child);
                edges.push({
                    id: `${person.uuid}-${index}`,
                    source: person.uuid,
                    target: child.uuid,
                });
                // generationOrder++;
            });
        }
    }

    return {
        nodes,
        edges,
    }
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

export const FamilyTree = () => {

    const { loading, error, data } = useQuery(QUERY);

    if (loading) {
        return <span>Loading</span>;
    }
    if (error) {
        return <span>got error</span>;
    }

    const { nodes, edges } = !loading ? createNodesAndEdges(data) : {nodes: null, edges: null};
    const { nodes: layoutedNodes, edges: layoutedEdges } = !loading ? getLayoutedElements(
        nodes,
        edges
    ) : {nodes: null, edges: null};
    return (
        <div className={styles.tree} style={{ height: window.innerHeight, width: window.innerWidth}}>
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