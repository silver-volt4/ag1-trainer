<script lang="ts">
    import {
        BinaryTree,
        BinaryTreeVertex,
    } from "../binary_tree/binary_tree.svelte";
    import BinaryTreeViewer from "../binary_tree/BinaryTreeViewer.svelte";

    let tree = new BinaryTree();
    let heapData: BinaryTreeVertex[] = $state([]);

    let addValueInput: number | null = $state(null);

    function addValue() {
        let value = addValueInput;
        addValueInput = null;

        if (value === null) return;

        let vertex: BinaryTreeVertex;
        if (heapData.length === 0) {
            vertex = tree.createVertex(value);
            tree.root = vertex;
        } else {
            let parentIndex = Math.floor((heapData.length + 1) / 2) - 1;
            let parent = heapData[parentIndex];
            if (heapData.length % 2 == 0) {
                vertex = parent.createRight(value);
            } else {
                vertex = parent.createLeft(value);
            }
        }

        BHInsert(vertex);
    }

    function BHInsert(cell: BinaryTreeVertex) {
        let currentIndex = heapData.push(cell);
        while (currentIndex > 1) {
            let parentIndex = Math.floor(currentIndex / 2);

            let current = heapData[currentIndex - 1];
            let parent = heapData[parentIndex - 1];

            if (current.vertex.value < parent.vertex.value) {
                let carry = current.vertex;
                current.vertex = parent.vertex;
                parent.vertex = carry;

                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }
</script>

<div>
    <div class="dark:bg-slate-950 bg-slate-200 inline-block p-2 rounded-t-lg">
        Array view
    </div>
    <div
        class="dark:bg-slate-950 bg-slate-200 rounded-lg rounded-tl-none p-2 grow"
    >
        <div
            class="grow flex-nowrap overflow-x-scroll overflow-y-hidden flex gap-0.5"
        >
            {#each heapData as cell, i (cell.vertex)}
                <div>
                    <div class="text-center text-sm">
                        {i + 1}
                    </div>
                    <div
                        class="bg-blue-500 rounded-full min-w-8 min-h-8 flex justify-center items-center"
                    >
                        {cell.vertex.value}
                    </div>
                </div>
            {/each}
            {#if heapData.length === 0}
                ¯\_(ツ)_/¯ Nothing to see here
            {/if}
        </div>
    </div>
</div>

<div class="h-full overflow-hidden">
    <div class="dark:bg-slate-950 bg-slate-200 inline-block p-2 rounded-t-lg">
        Graph view
    </div>
    <div
        class="dark:bg-slate-950 bg-slate-200 rounded-lg rounded-tl-none h-full overflow-hidden"
    >
        <BinaryTreeViewer binaryTree={tree} />
    </div>
</div>

<div class="dark:bg-slate-950 bg-slate-200 rounded-lg p-2">
    <input
        type="number"
        bind:value={addValueInput}
        onkeyup={(e) => e.key === "Enter" && addValue()}
    />
    <button onclick={() => addValue()}>Insert</button>
</div>
