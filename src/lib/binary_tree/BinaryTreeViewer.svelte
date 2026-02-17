<script lang="ts">
    import type { Snippet } from "svelte";
  import GraphViewer from "../graph/GraphViewer.svelte";
  import { BinaryTree } from "./binary_tree.svelte";
    import type { IVertex } from "../graph/graph.svelte";

  let {
    binaryTree,
    contextMenu,
  }: {
    binaryTree: BinaryTree;
    contextMenu?: Snippet<[IVertex]>;
  } = $props();

  $effect(() => {
    binaryTree.arrange();
  });
</script>

<GraphViewer graph={binaryTree} {contextMenu} />
