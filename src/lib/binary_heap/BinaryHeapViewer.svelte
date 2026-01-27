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
                vertex = parent.vertex.createVertexRight(data);
            } else {
                vertex = parent.vertex.createVertexLeft(data);
            }
        }

        BHInsert(new HeapCell(value, vertex));
        addValueInput = 0;
    }

    function BHInsert(cell: HeapCell) {
        let index = heapData.push(cell);
        while (index > 1) {
            let newIndex = Math.floor(index / 2);
            if (heapData[newIndex - 1].value > heapData[index - 1].value) {
                let carryValue = heapData[newIndex - 1].value;
                let carryVertex = heapData[newIndex - 1].vertex.vertex;

                heapData[newIndex - 1].value = heapData[index - 1].value;
                heapData[newIndex - 1].vertex.vertex =
                    heapData[index - 1].vertex.vertex;
                heapData[index - 1].value = carryValue;
                heapData[index - 1].vertex.vertex = carryVertex;
                index = newIndex;
            } else {
                break;
            }
        }
    }
</script>

<div class="dark:bg-slate-950 bg-slate-200 rounded-lg overflow-hidden p-2">
    <input
        type="number"
        bind:value={addValueInput}
        onkeyup={(e) => e.key === "Enter" && addValue()}
    />
</div>

<div class="dark:bg-slate-950 bg-slate-200 rounded-lg h-full overflow-hidden">
    <BinaryTreeViewer binaryTree={tree} />
</div>
