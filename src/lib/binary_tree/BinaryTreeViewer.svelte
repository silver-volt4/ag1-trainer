<script lang="ts">
  import GraphViewer from "../graph/GraphViewer.svelte";
  import { BinaryTreeVertex } from "./binary_tree.svelte";

  let { tree }: { tree: BinaryTreeVertex | null} = $props();
</script>

<div class="root">
  <GraphViewer vertices={tree?.plain.vertices ?? []} edges={tree?.plain.edges ?? []} />
</div>

<style>
  div.root {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
</style>
