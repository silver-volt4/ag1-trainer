<script lang="ts">
  import GraphViewer from "../graph/GraphViewer.svelte";
  import { BinaryTree } from "./binary_tree.svelte";

  let {
    binaryTree,
  }: {
    binaryTree: BinaryTree;
  } = $props();

  $effect(() => {
    binaryTree.arrange();
  })
</script>

<GraphViewer graph={binaryTree} />
