import React from 'react';
import { useQuery } from 'graphql-hooks';
import {AnimatedTree} from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'
import styles from './FamilyTree.module.css';

const QUERY = `
    query {
        getRootAncestor {
            name
            children {
                name
                children {
                    name
                }
            }
        }
    }`
    

export const FamilyTree = () => {

    const { loading, error, data } = useQuery(QUERY);

    if (loading) {
        return <span>Loading</span>;
    }
    if (error) {
        return <span>got error</span>;
    }


    return (
        <div className={styles.tree}>
            <AnimatedTree
                data={data.getRootAncestor}
                height={800}
                width={800}
            />
        </div>

    )
}