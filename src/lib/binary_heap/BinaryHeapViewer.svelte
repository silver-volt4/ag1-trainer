<script lang="ts">
    import {
        BinaryTree,
        BinaryTreeVertex,
    } from "../binary_tree/binary_tree.svelte";
    import BinaryTreeViewer from "../binary_tree/BinaryTreeViewer.svelte";
    import { arrangeCircle } from "../graph/arrange";
    import GraphViewer from "../graph/GraphViewer.svelte";

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
                console.log("Will flip ", current, " and ", parent);

                let carry = heapData[currentIndex - 1].value;
                heapData[currentIndex - 1].value = heapData[parentIndex - 1].value;
                heapData[parentIndex - 1].value = carry;

                let vCarry = current.vertex.vertex;
                current.vertex.vertex = parent.vertex.vertex;
                parent.vertex.vertex = vCarry;

                currentIndex = parentIndex;
            } else {
                break;
            }
        }

        console.log(tree.root);
        console.log(heapData);
    }
</script>

<div class="dark:bg-slate-950 bg-slate-200 rounded-lg overflow-hidden p-2">
    <input
        type="number"
        bind:value={addValueInput}
        onkeyup={(e) => e.key === "Enter" && addValue()}
    />
    <div class="flex gap-2">
        {#each heapData as cell (cell.vertex)}
            {@const _ = console.log("rendering ", cell)}
            <div class="bg-slate-300">
                {cell.value}
            </div>
        {/each}
    </div>
</div>

<div class="dark:bg-slate-950 bg-slate-200 rounded-lg h-full overflow-hidden">
    <BinaryTreeViewer binaryTree={tree} />
</div>
