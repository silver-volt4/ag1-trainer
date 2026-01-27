import { Graph, Vertex, type Edge, type VertexData } from "../graph/graph.svelte";

export class BinaryTree {
    public readonly graph: Graph;
    public root: BinaryTreeVertex | null = $state(null);

    constructor() {
        this.graph = new Graph();
    }

    public createVertex(data: VertexData = {}): BinaryTreeVertex {
        return new BinaryTreeVertex(this, this.graph.createVertex(data));
    }

    public arrange() {
        this.root?.arrange();
    }
}

export class BinaryTreeVertex {
    private binaryTree: BinaryTree;
    vertex: Vertex;
    left: BinaryTreeVertex | null = $state(null);
    right: BinaryTreeVertex | null = $state(null);

    constructor(binaryTree: BinaryTree, vertex: Vertex) {
        this.binaryTree = binaryTree;
        this.vertex = vertex;
    }

    public createVertexLeft(data: VertexData = {}): BinaryTreeVertex {
        let newVertex = this.binaryTree.createVertex(data);
        newVertex.vertex.link(this.vertex);
        return this.left = newVertex;
    }

    public createVertexRight(data: VertexData = {}): BinaryTreeVertex {
        let newVertex = this.binaryTree.createVertex(data);
        newVertex.vertex.link(this.vertex);
        return this.right = newVertex;
    }

    public arrange() {
        let bfsData = new Map<
            BinaryTreeVertex,
            { depth: number; fromLeft: number }
        >();

        let queue: Array<BinaryTreeVertex | null> = [];
        let queueRealVerticesCount = 1;

        const addVertex = (vertex: BinaryTreeVertex) => {
            let vertexBfsData = {
                depth: 0,
                fromLeft: 0,
            };
            bfsData.set(vertex, vertexBfsData);
            return vertexBfsData;
        };

        addVertex(this);
        queue.push(this);

        let depth = 0;
        let requiredVertices = 1;
        let seenVertices = 0;

        while (queueRealVerticesCount > 0) {
            let current = queue.shift()!;

            if (current) {
                queueRealVerticesCount -= 1;
                bfsData.get(current)!.depth = depth;
                bfsData.get(current)!.fromLeft = seenVertices;
            }

            let left = current?.left ?? null;
            let right = current?.right ?? null;

            queue.push(left);
            if (left) {
                queueRealVerticesCount += 1;
                addVertex(left);
            }
            queue.push(right);
            if (right) {
                queueRealVerticesCount += 1;
                addVertex(right);
            }

            seenVertices += 1;

            if (requiredVertices === seenVertices) {
                requiredVertices *= 2;
                depth++;
                seenVertices = 0;
            }
        }

        if (seenVertices === 0) {
            depth = Math.max(0, depth - 1);
        }

        let lastRow = 2 ** depth;
        let WIDTH = 20 * lastRow + 5 * (lastRow - 1);

        bfsData.forEach((data, binaryTreeVertex) => {
            let piece = WIDTH / 2 ** data.depth;
            binaryTreeVertex.vertex.x = WIDTH / -2 + piece / 2 + piece * data.fromLeft;
            binaryTreeVertex.vertex.y = data.depth * 30;
        });
    }
}