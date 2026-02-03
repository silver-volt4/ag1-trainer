<script lang="ts">
    import {
        BinaryTree,
        BinaryTreeVertex,
    } from "../binary_tree/binary_tree.svelte";
    import BinaryTreeViewer from "../binary_tree/BinaryTreeViewer.svelte";

    let tree = new BinaryTree();

    let addValueInput = $state(0);

    function BVSInsert(value: number) {
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

<div class="dark:bg-slate-950 bg-slate-200 rounded-lg p-2 flex">
    <div>
        <input
            type="number"
            bind:value={addValueInput}
            onkeyup={(e) => {
                if (e.key === "Enter") {
                    let value = addValueInput;
                    addValueInput = 0;
                    BVSInsert(value);
                }
            }}
        />
    </div>
</div>

<div class="dark:bg-slate-950 bg-slate-200 rounded-lg h-full overflow-hidden">
    <BinaryTreeViewer binaryTree={tree} />
</div>
