import { useCallback, useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { CreateNewPersonForm } from '../CreateNewPersonForm/CreateNewPersonForm';
import styles from './FamilyTreeNode.module.css';

const handleStyle = { left: 10 };

export const FamilyTreeNode = ({ data }: any) => {
    const [ formType, setFormType ] = useState("");

    const handleButtonClick = (clickType: string) => {
        console.log(`clicked ${clickType}`)
        setFormType(clickType);
    }


  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={styles.familyTreeNode}>
        <div>
            <label>{data.label}</label>
        </div>
        { !formType && <div>
            <button onClick={() => handleButtonClick("PARENT")}>Add Parent</button>
            <button onClick={() => handleButtonClick("CHILD")}>Add Child</button>
        </div> }
        {
            !!formType && <CreateNewPersonForm newPersonType={formType} closeForm={() => setFormType("")} existingPersonId={data.value.uuid}/>
        }
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </>
  );
}