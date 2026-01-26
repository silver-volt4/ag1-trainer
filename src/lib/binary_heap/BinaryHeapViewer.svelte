<script lang="ts">
    import { BinaryTreeVertex } from "../binary_tree/binary_tree.svelte";
    import BinaryTreeViewer from "../binary_tree/BinaryTreeViewer.svelte";

    let heapData: any[] = $state([]);

    class BinaryHeapTreeVertex extends BinaryTreeVertex {
        constructor(
            index: number,
            left: BinaryTreeVertex | null,
            right: BinaryTreeVertex | null,
        ) {
            super(left, right);
            this.id = index;
            this.data.content = index.toString();
        }
    }

    let heapAsBinaryTree = $derived.by(() => {
        if (heapData.length === 0) {
            return null;
        }

        let root = new BinaryHeapTreeVertex(1, null, null);
        let q = [root];
        while (q.length > 0) {
            let current = q.shift()!;

            let leftIndex = 2 * current.id;
            let rightIndex = 2 * current.id + 1;

            if (leftIndex <= heapData.length) {
                let v = new BinaryHeapTreeVertex(leftIndex, null, null);
                current.left = v;
                q.push(v);
            }
            if (rightIndex <= heapData.length) {
                let v = new BinaryHeapTreeVertex(rightIndex, null, null);
                current.right = v;
                q.push(v);
            }
        }

        return root;
    });
</script>

<button onclick={() => heapData.push(1)}>add something</button> 

<BinaryTreeViewer tree={heapAsBinaryTree} />
