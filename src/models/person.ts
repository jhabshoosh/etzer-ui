export interface Person {
    uuid: string;
    name: string;
    parents?: Person[];
    children?: Person[];
}

export interface Relationship {
    parent: string;
    child: string;
}

type GetFamily = {
    persons: Person[];
    relationships: Relationship[];
}

export type GetFamilyResponse = {
    getFamily: GetFamily;
}
