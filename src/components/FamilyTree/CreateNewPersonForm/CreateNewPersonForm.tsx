import { useMutation } from "graphql-hooks";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";


const CREATE_CHILD_MUTATION = `
    mutation CreateChild($childName: String!, $parentId: ID!, $parentType: String!) {
        createChild(input: {
            childName: $childName,
            parentId: $parentId,
            parentType: $parentType
        })
    }`

const CREATE_PARENT_MUTATION = `
    mutation CreateParent($parentName: String!, $childId: ID!, $parentType: String!) {
        createParent(input: {
            childId: $childId,
            parentName: $parentName,
            parentType: $parentType
        })
    }`



enum ParentTypeEnum {
    Mother = "MOTHER",
    Father = "maFATHERle"
  }
  
interface IFormInput {
    name: string;
    parentType: ParentTypeEnum;
}

interface Props {
    closeForm: () => void;
    newPersonType: string;
    existingPersonId: string;
}

export const CreateNewPersonForm = ({ closeForm, newPersonType, existingPersonId }: Props) => {
    
    const { register, handleSubmit } = useForm<IFormInput>();
    
    const [createChild] = useMutation(CREATE_CHILD_MUTATION);
    const [createParent] = useMutation(CREATE_PARENT_MUTATION);

    const onSubmit: SubmitHandler<IFormInput> = (data: any) => {

        console.log(`adding person type ${newPersonType}`);
        console.log(`related to ${existingPersonId}`);
        console.log(data);
        
        if (newPersonType == 'CHILD') {
            createChild({ variables: { childName: data.name, parentId: existingPersonId, parentType: data.parentType }});
        } else if (newPersonType == 'PARENT') {
            createParent({ variables: { parentName: data.name, childId: existingPersonId, parentType: data.parentType }})
        }

        closeForm();
    } 

 return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div>
        <input { ...register("name")} />
        <select { ...register("parentType")}>
            <option value="MOTHER">Mother</option>
            <option value="FATHER">Father</option>
        </select>
        <input type="submit" />
        </div>
   </form>
 );
}