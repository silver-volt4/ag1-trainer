<script lang="ts">
    import BinaryHeapViewer from "./lib/binary_heap/BinaryHeapViewer.svelte";
    import BinaryTreeViewer from "./lib/binary_tree/BinaryTreeViewer.svelte";
    import NodeViewer from "./lib/graph/GraphViewer.svelte";

    let vertices = $state([
        { x: 10, y: 10 },
        { x: 34, y: 43 },
    ]);

    let edges = $state([{ a: vertices[0], b: vertices[1] }]);
</script>

<div>
    Testing UI above NV
    <BinaryHeapViewer />
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
