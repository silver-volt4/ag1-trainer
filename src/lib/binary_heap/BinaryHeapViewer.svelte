<script lang="ts">
    import {
        BinaryTree,
        BinaryTreeVertex,
    } from "../binary_tree/binary_tree.svelte";
    import BinaryTreeViewer from "../binary_tree/BinaryTreeViewer.svelte";

    class HeapCell {
        value: number;
        vertex: BinaryTreeVertex;

        constructor(value: number, vertex: BinaryTreeVertex) {
            this.value = value;
            this.vertex = vertex;
        }
    }

    let tree = new BinaryTree();
    let heapData: HeapCell[] = $state([]);

    let addValueInput = $state(0);

    function addValue() {
        let value = addValueInput;
        addValueInput = 0;

        let vertex: BinaryTreeVertex;
        let data = { content: value.toString() };
        if (heapData.length === 0) {
            vertex = tree.createVertex(data);
            tree.root = vertex;
        } else {
            let parentIndex = Math.floor((heapData.length + 1) / 2) - 1;
            let parent = heapData[parentIndex];
            if (heapData.length % 2 == 0) {
                vertex = parent.vertex.createRight(data);
            } else {
                vertex = parent.vertex.createLeft(data);
            }
        }

        BHInsert(new HeapCell(value, vertex));
        addValueInput = 0;
    }

    function BHInsert(cell: HeapCell) {
        let currentIndex = heapData.push(cell);
        while (currentIndex > 1) {
            let parentIndex = Math.floor(currentIndex / 2);

            let current = heapData[currentIndex - 1];
            let parent = heapData[parentIndex - 1];

            if (current.value < parent.value) {
                let carry = heapData[currentIndex - 1].value;
                heapData[currentIndex - 1].value =
                    heapData[parentIndex - 1].value;
                heapData[parentIndex - 1].value = carry;

                let vCarry = current.vertex.vertex;
                current.vertex.vertex = parent.vertex.vertex;
                parent.vertex.vertex = vCarry;

                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }
</script>

<div class="dark:bg-slate-950 bg-slate-200 rounded-lg p-2 flex">
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
                    {cell.value}
                </div>
            </div>
        {/each}
    </div>
    <div>
        <input
            type="number"
            bind:value={addValueInput}
            onkeyup={(e) => e.key === "Enter" && addValue()}
        />
    </div>
</div>

<div class="dark:bg-slate-950 bg-slate-200 rounded-lg h-full overflow-hidden">
    <BinaryTreeViewer binaryTree={tree} />
</div>
