import { untrack } from "svelte";
import { BaseGraph, Graph, Vertex, type IEdge, type IVertex, type VertexData } from "../graph/graph.svelte";

export class BinaryTree extends BaseGraph<BTWrappedVertex, IEdge> {
    public root: BinaryTreeVertex | null = $state(null);

    public getVertices(): Iterable<BTWrappedVertex> {
        let queue: BinaryTreeVertex[] = [];
        let result: BTWrappedVertex[] = [];

        this.root && queue.push(this.root);

        while (queue.length > 0) {
            let current = queue.shift()!;
            result.push(current.vertex);
            let left = current?.left ?? null;
            let right = current?.right ?? null;

            if (left) {
                queue.push(left);
            }
            if (right) {
                queue.push(right);
            }
        }

        return result;
    }

    public getEdges(): Iterable<IEdge> {
        let queue: BinaryTreeVertex[] = [];
        let result: IEdge[] = [];

        this.root && queue.push(this.root);

        while (queue.length > 0) {
            let current = queue.shift()!;
            let left = current?.left ?? null;
            let right = current?.right ?? null;

            if (left) {
                queue.push(left);
                result.push({ from: current.vertex, to: left.vertex })
            }
            if (right) {
                queue.push(right);
                result.push({ from: current.vertex, to: right.vertex })
            }
        }

        return result;
    }

    public arrange() {
        if (!this.root) {
            return;
        }

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

        addVertex(this.root);
        queue.push(this.root);

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

    public createVertex(value: number): BinaryTreeVertex {
        let vertex = new BinaryTreeVertex(this);
        vertex.vertex.value = value;
        return vertex;
    }
}

export class BTWrappedVertex implements IVertex {
    x: number = $state(0);
    y: number = $state(0);
    value: number = $state(0);
    content = $derived(this.value.toString());
}

export class BinaryTreeVertex {
    vertex: BTWrappedVertex = $state(new BTWrappedVertex());

    protected tree: BinaryTree;
    parent: BinaryTreeVertex | null = $state(null);
    left: BinaryTreeVertex | null = $state(null);
    right: BinaryTreeVertex | null = $state(null);

    constructor(binaryTree: BinaryTree) {
        this.tree = binaryTree;
    }

    public createLeft(value: number) {
        let vertex = this.tree.createVertex(value)
        vertex.parent = this;
        if (this.left) {
            this.left.parent = null;
        }
        this.left = vertex;
        return vertex;
    }

    public createRight(value: number) {
        let vertex = this.tree.createVertex(value)
        vertex.parent = this;
        if (this.right) {
            this.right.parent = null;
        }
        this.right = vertex;
        return vertex;
    }
}