export interface Person {
    uuid: string;
    name: string;
    parents?: Person[];
    children?: Person[];
}

export type GetRootAncestorResponse = {
    getRootAncestor: Person
}
