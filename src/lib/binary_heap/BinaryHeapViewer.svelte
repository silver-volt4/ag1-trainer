<script lang="ts">
    import { BinaryTreeVertex } from "../binary_tree/binary_tree.svelte";
    import BinaryTreeViewer from "../binary_tree/BinaryTreeViewer.svelte";

    class HeapCell {
        private static idCount = 0;

        id: number;
        value: number;

        constructor(value: number) {
            this.id = HeapCell.idCount++;
            this.value = value;
        }
    }

    let heapData: HeapCell[] = $state([]);

    class BinaryHeapTreeVertex extends BinaryTreeVertex {
        index: number;

        constructor(
            index: number,
            cell: HeapCell,
            left: BinaryTreeVertex | null,
            right: BinaryTreeVertex | null,
        ) {
            super(left, right);
            this.index = index;
            this.id = cell.id;
            this.data.content = cell.value.toString();
        }
    }

    let heapAsBinaryTree = $derived.by(() => {
        if (heapData.length === 0) {
            return null;
        }

        let root = new BinaryHeapTreeVertex(1, heapData[0], null, null);
        let q = [root];
        while (q.length > 0) {
            let current = q.shift()!;

            let leftIndex = 2 * current.index;
            let rightIndex = 2 * current.index + 1;

            if (leftIndex <= heapData.length) {
                let v = new BinaryHeapTreeVertex(
                    leftIndex,
                    heapData[leftIndex - 1],
                    null,
                    null,
                );
                current.left = v;
                q.push(v);
            }
            if (rightIndex <= heapData.length) {
                let v = new BinaryHeapTreeVertex(
                    rightIndex,
                    heapData[rightIndex - 1],
                    null,
                    null,
                );
                current.right = v;
                q.push(v);
            }
        }

        return root;
    });

    let addValueInput = $state(0);

    function addValue() {
        BHInsert(new HeapCell(addValueInput));
        addValueInput = 0;
    }

    function BHInsert(cell: HeapCell) {
        let index = heapData.push(cell);
        while (index > 1) {
            let newIndex = Math.floor(index / 2);
            if (heapData[newIndex - 1].value > cell.value) {
                heapData[index - 1] = heapData[newIndex - 1];
                heapData[newIndex - 1] = cell;
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
    <BinaryTreeViewer tree={heapAsBinaryTree} />
</div>
