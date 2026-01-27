<script lang="ts">
    import { arrangeCircle } from "./arrange";
    import { Graph } from "./graph.svelte";
    import GraphViewer from "./GraphViewer.svelte";

    let graph = new Graph();

    let a = graph.createVertex({ content: "a" });
    let b = graph.createVertex({ content: "b" });
    let c = graph.createVertex({ content: "c" });
    let d = graph.createVertex({ content: "d" });
    let e = graph.createVertex({ content: "e" });
    let f = graph.createVertex({ content: "f" });
    let g = graph.createVertex({ content: "g" });

    a.link(b);
    d.link(a);
    f.link(g);
    d.link(c);
    e.link(c);
    g.link(c);

    $effect(() => {
        arrangeCircle(graph, 50);
    });
</script>

<GraphViewer {graph} />

<button onclick={() => graph.createVertex()}>add a vertex</button>
