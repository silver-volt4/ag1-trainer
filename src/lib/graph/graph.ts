export interface Vertex {
    id?: number
    x: number;
    y: number;
}

export interface Edge {
    a: Vertex;
    b: Vertex;
    oriented?: boolean;
}