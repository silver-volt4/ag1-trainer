<script lang="ts">
    import NodeViewer from "./lib/NodeViewer.svelte";

    let nodes = $state([
        { x: 10, y: 10 },
        { x: 34, y: 43 },
    ]);

    let edges = $state([
        {a: nodes[0], b: nodes[1]}
    ])
</script>

<div>
    Testing UI above NV
    <NodeViewer {nodes} {edges}></NodeViewer>
    Testing UI below NV
</div>

<style>
    div {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
