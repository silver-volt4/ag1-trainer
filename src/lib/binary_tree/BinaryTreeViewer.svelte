<script lang="ts">
  import GraphViewer from "../graph/GraphViewer.svelte";
  import { BinaryTree } from "./binary_tree.svelte";
  import type { VertexContextMenuFactory } from "../graph/graph.svelte";

  let {
    binaryTree,
    contextMenu,
  }: {
    binaryTree: BinaryTree;
    contextMenu?: VertexContextMenuFactory | undefined;
  } = $props();

  $effect(() => {
    binaryTree.arrange();
  });
</script>

<GraphViewer graph={binaryTree} {contextMenu} />
