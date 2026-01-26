export interface Vertex {
    id: number
    x: number;
    y: number;
    data?: VertexData 
}

export interface VertexData {
    class?: string;
    content?: string;
}

export interface Edge {
    a: Vertex;
    b: Vertex;
    oriented?: boolean;
}