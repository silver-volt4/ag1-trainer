<script lang="ts">
    import { onMount } from "svelte";
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
            nodes[newNodeName] = current.createLeft({
                content: newNodeName,
            });
        }
        if (side === "right") {
            nodes[newNodeName] = current.createRight({
                content: newNodeName,
            });
        }
    }

    function swap() {
        let a = nodes[newNodeName];
        let b = nodes[addedUnderNodeName];
        [a.vertex, b.vertex] = [b.vertex, a.vertex];
    }

    onMount(() => {
        newNodeName = "x";
        addedUnderNodeName = "root";
        addChild("left");
        newNodeName = "y";
        addedUnderNodeName = "root";
        addChild("right");
        newNodeName = "1";
        addedUnderNodeName = "x";
        addChild("left");
        newNodeName = "2";
        addedUnderNodeName = "y";
        addChild("right");
    });
</script>

<BinaryTreeViewer {binaryTree} />
<div>
    Add node <input type="text" bind:value={newNodeName} /> under node
    <input type="text" bind:value={addedUnderNodeName} />
    <button onclick={() => addChild("left")}>as left child</button>
    <button onclick={() => addChild("right")}>as right child</button>
    <button onclick={() => swap()}
        >actually no, they both exist and i want to swap them</button
    >
</div>
