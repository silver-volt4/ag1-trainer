<script lang="ts">
    import { BinaryTree } from "../binary_tree/binary_tree.svelte";
    import BinaryTreeViewer from "../binary_tree/BinaryTreeViewer.svelte";
    import type { IVertex } from "../graph/graph.svelte";

    let tree = new BinaryTree();

    let addValueInput: number | null = $state(null);

    function addValue() {
        let value = addValueInput;
        addValueInput = 0;
        if (value !== null) BSTInsert(value);
    }

    function BSTInsert(value: number) {
        let current = tree.root;
        let insert = () => {}; // this simulates "pointer" access

        if (!current) {
            tree.root = tree.createVertex(value);
            return;
        }

        while (current !== null) {
            if (current.vertex.value === value) {
                return;
            }

            if (value < current.vertex.value) {
                let v = current;
                insert = () => (v.left = tree.createVertex(value));
                current = current.left;
            } else {
                let v = current;
                insert = () => (v.right = tree.createVertex(value));
                current = current.right;
            }
        }

        insert();
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
    <button class="btn">
        Rotate...
    </button>
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
