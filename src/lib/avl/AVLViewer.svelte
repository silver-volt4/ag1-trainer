<script lang="ts">
    import BinaryTreeViewer from "../binary_tree/BinaryTreeViewer.svelte";
    import type { IVertex } from "../graph/graph.svelte";
    import { AVLTree } from "./avl_tree.svelte";

    let tree = new AVLTree();

    let addValueInput: number | null = $state(null);

    function addValue() {
        let value = addValueInput;
        addValueInput = 0;
        if (value !== null) tree.insert(value);
    }
</script>

<div class="foreground rounded-lg h-full overflow-hidden">
    <BinaryTreeViewer
        binaryTree={tree}
        contextMenu={(vertex: IVertex | null) => {
            return null;
            //return (vertex ? contextMenuVertex : contextMenuEmpty) as any;
        }}
    ></BinaryTreeViewer>
</div>

{#snippet contextMenuVertex(vertex: IVertex)}
    <button class="btn"> Rotate... </button>
{/snippet}

{#snippet contextMenuEmpty()}
    You right clicked in an empty space.
{/snippet}

<div class="foreground rounded-lg p-2 flex">
    <div>
        <input
            type="number"
            bind:value={addValueInput}
            onkeyup={(e) => {
                if (e.key === "Enter") addValue();
            }}
        />
    </div>
    <button onclick={() => addValue()}>Insert</button>
</div>
