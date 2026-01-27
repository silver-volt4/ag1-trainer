<script lang="ts">
    import { BinaryTree, BinaryTreeVertex } from "./binary_tree.svelte";
    import BinaryTreeViewer from "./BinaryTreeViewer.svelte";

    let binaryTree = new BinaryTree();

    let nodes: { [key: string]: BinaryTreeVertex } = {
        root: binaryTree.createVertex({ content: "root" }),
    };

    binaryTree.root = nodes["root"];

    let newNodeName = $state("");
    let addedUnderNodeName = $state("");

    function addChild(side: "left" | "right") {
        let current = nodes[addedUnderNodeName];

        if (side === "left") {
            nodes[newNodeName] = current.createVertexLeft({
                content: newNodeName,
            });
        }
        if (side === "right") {
            nodes[newNodeName] = current.createVertexRight({
                content: newNodeName,
            });
        }
    }
</script>

<BinaryTreeViewer {binaryTree} />
<div>
    Add node <input type="text" bind:value={newNodeName} /> under node
    <input type="text" bind:value={addedUnderNodeName} />
    <button onclick={() => addChild("left")}>as left child</button>
    <button onclick={() => addChild("right")}>as right child</button>
</div>
