import type { Edge, Vertex } from "../graph/graph";

export class BinaryTreeVertex {
    left: BinaryTreeVertex | null = $state(null);
    right: BinaryTreeVertex | null = $state(null);

    plain: { vertices: Vertex[], edges: Edge[] } = $derived.by(() => {
        console.info("Rebuilding BinaryTreeVertex.plain");

        let vertices: Vertex[] = [];
        let edges: Edge[] = [];
        let bfsData = new Map<
            BinaryTreeVertex,
            { vertex: Vertex; depth: number; fromLeft: number }
        >();

        let queue: Array<BinaryTreeVertex | null> = [];
        let queueRealVerticesCount = 1;

        let id = 0;

        const addVertex = (vertex: BinaryTreeVertex) => {
            let vertexData: Vertex = { x: 0, y: 0, id: id };
            id++;
            vertices.push(vertexData);
            let vertexBfsData = {
                vertex: vertexData,
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
                let a = bfsData.get(current)!.vertex;
                let b = addVertex(left).vertex;
                edges.push({ a, b });
            }
            queue.push(right);
            if (right) {
                queueRealVerticesCount += 1;
                let a = bfsData.get(current)!.vertex;
                let b = addVertex(right).vertex;
                edges.push({ a, b });
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
        let WIDTH = 20 * lastRow + 5 * (lastRow-1);

        bfsData.forEach((data) => {
            let piece = WIDTH / 2 ** data.depth;
            data.vertex.x = WIDTH / -2 + piece / 2 + piece * data.fromLeft;
            data.vertex.y = data.depth * 30;
        });

        return { vertices, edges };
    })

    constructor(left: BinaryTreeVertex | null, right: BinaryTreeVertex | null) {
        this.left = left;
        this.right = right;
    }
}