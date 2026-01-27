import type { Graph } from "./graph.svelte";

export function arrangeCircle(graph: Graph, radius: number) {
    let i = 0;
    for (let vertex of graph.vertices) {
        let angle = (i / graph.vertices.length) * 2*Math.PI
        i++;
        vertex.x = Math.sin(angle) * radius;
        vertex.y = Math.cos(angle) * radius;
    }
}